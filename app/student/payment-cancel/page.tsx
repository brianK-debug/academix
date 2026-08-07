'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function PaymentCancelPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      {/* Navigation */}
      <nav className="border-b border-slate-700 bg-slate-900/50 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/student/dashboard" className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500" />
              <span className="font-bold text-white text-lg">PrimeLearn</span>
            </Link>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center">
          <div className="mb-6 text-6xl">✕</div>
          <h1 className="text-4xl font-bold text-white mb-4">Payment Cancelled</h1>
          <p className="text-xl text-slate-300 mb-8">
            Your payment was not completed. No charges have been made to your account.
          </p>

          <div className="bg-slate-800 rounded-lg border border-slate-700 p-8 mb-8">
            <h2 className="text-lg font-semibold text-white mb-4">What Happened?</h2>
            <p className="text-slate-300 text-left">
              You cancelled the payment during the PayPal checkout process. If you&apos;d like to continue, you can try again or choose a different course.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/student/dashboard">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                Back to Dashboard
              </Button>
            </Link>
            <Link href="/student/courses">
              <Button size="lg" variant="outline" className="text-white border-slate-600 hover:bg-slate-800">
                Browse Courses
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
