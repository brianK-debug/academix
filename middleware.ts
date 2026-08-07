import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  const protectedRoutes = ['/student/dashboard', '/student/payment-success', '/student/payment-cancel', '/student/checkout']
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))

  if (isProtectedRoute) {
    const session = await auth.api.getSession({ headers: request.headers })

    if (!session?.user) {
      return NextResponse.redirect(new URL('/sign-in', request.url))
    }

    const userRole = session.user.role || 'student'

    if (pathname.startsWith('/admin') && userRole !== 'admin') {
      return NextResponse.redirect(new URL('/student/dashboard', request.url))
    }

    if (pathname.startsWith('/instructor') && !['instructor', 'admin'].includes(userRole)) {
      return NextResponse.redirect(new URL('/student/dashboard', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/student/dashboard', '/student/payment-success', '/student/payment-cancel', '/student/checkout/:path*']
}

export const runtime = 'nodejs'
