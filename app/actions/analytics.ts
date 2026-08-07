'use server'

import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { 
  instructorAnalytics, 
  adminAnalytics, 
  course, 
  enrollment, 
  payment,
  userProfile,
  user
} from '@/lib/db/schema'
import { and, eq, sum } from 'drizzle-orm'
import { headers } from 'next/headers'
import { v4 as uuid } from 'uuid'

async function getUserId() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) throw new Error('Unauthorized')
  return session.user.id
}

// Get instructor analytics
export async function getInstructorAnalytics(courseId?: string) {
  const userId = await getUserId()
  
  if (courseId) {
    // Get analytics for specific course
    const courseData = await db
      .select()
      .from(course)
      .where(eq(course.id, courseId))
    
    if (!courseData || courseData.length === 0 || courseData[0].instructorId !== userId) {
      throw new Error('Unauthorized')
    }
    
    const enrollments = await db
      .select()
      .from(enrollment)
      .where(eq(enrollment.courseId, courseId))
    
    const payments = await db
      .select()
      .from(payment)
      .where(and(eq(payment.courseId, courseId), eq(payment.status, 'completed')))
    
    const totalRevenue = payments.reduce((sum, p) => sum + (Number(p.amount) || 0), 0)
    
    return {
      courseId,
      totalStudents: enrollments.length,
      totalEnrollments: enrollments.length,
      totalRevenue,
      avgRating: courseData[0].rating || 0,
    }
  } else {
    // Get analytics for all instructor courses
    const instructorCourses = await db
      .select()
      .from(course)
      .where(eq(course.instructorId, userId))
    
    let totalStudents = 0
    let totalEnrollments = 0
    let totalRevenue = 0
    
    for (const c of instructorCourses) {
      const enrollments = await db
        .select()
        .from(enrollment)
        .where(eq(enrollment.courseId, c.id))
      
      const payments = await db
        .select()
        .from(payment)
        .where(and(eq(payment.courseId, c.id), eq(payment.status, 'completed')))
      
      totalStudents += enrollments.length
      totalEnrollments += enrollments.length
      totalRevenue += payments.reduce((sum, p) => sum + (Number(p.amount) || 0), 0)
    }
    
    // Update or create analytics record
    const existing = await db
      .select()
      .from(instructorAnalytics)
      .where(and(eq(instructorAnalytics.instructorId, userId), eq(instructorAnalytics.courseId, null)))
    
    if (existing.length > 0) {
      await db.update(instructorAnalytics).set({
        totalStudents,
        totalEnrollments,
        totalRevenue,
        totalCourses: instructorCourses.length,
        updatedAt: new Date(),
      }).where(eq(instructorAnalytics.id, existing[0].id))
    } else {
      await db.insert(instructorAnalytics).values({
        id: uuid(),
        instructorId: userId,
        totalStudents,
        totalEnrollments,
        totalRevenue,
        totalCourses: instructorCourses.length,
      })
    }
    
    return {
      totalStudents,
      totalEnrollments,
      totalRevenue,
      totalCourses: instructorCourses.length,
    }
  }
}

// Get admin analytics
export async function getAdminAnalytics() {
  const userId = await getUserId()
  
  // Verify admin role
  const profile = await db
    .select()
    .from(userProfile)
    .where(eq(userProfile.userId, userId))
  
  if (!profile || profile.length === 0 || profile[0].role !== 'admin') {
    throw new Error('Admin access required')
  }
  
  // Get platform statistics
  const totalUsers = await db.select().from(user)
  const totalProfiles = await db.select().from(userProfile)
  const totalCourses = await db.select().from(course)
  const totalEnrollments = await db.select().from(enrollment)
  const completedPayments = await db
    .select()
    .from(payment)
    .where(eq(payment.status, 'completed'))
  
  const totalStudents = totalProfiles.filter(p => p.role === 'student').length
  const totalInstructors = totalProfiles.filter(p => p.role === 'instructor').length
  const totalRevenue = completedPayments.reduce((sum, p) => sum + (Number(p.amount) || 0), 0)
  
  // Update or create analytics record
  const existing = await db.select().from(adminAnalytics)
  
  if (existing.length > 0) {
    await db.update(adminAnalytics).set({
      totalUsers: totalUsers.length,
      totalStudents,
      totalInstructors,
      totalCourses: totalCourses.length,
      totalEnrollments: totalEnrollments.length,
      totalRevenue,
      updatedAt: new Date(),
    }).where(eq(adminAnalytics.id, existing[0].id))
  } else {
    await db.insert(adminAnalytics).values({
      id: uuid(),
      totalUsers: totalUsers.length,
      totalStudents,
      totalInstructors,
      totalCourses: totalCourses.length,
      totalEnrollments: totalEnrollments.length,
      totalRevenue,
    })
  }
  
  return {
    totalUsers: totalUsers.length,
    totalStudents,
    totalInstructors,
    totalCourses: totalCourses.length,
    totalEnrollments: totalEnrollments.length,
    totalRevenue,
  }
}

// Get revenue metrics
export async function getRevenueMetrics() {
  const userId = await getUserId()
  
  // Verify admin role
  const profile = await db
    .select()
    .from(userProfile)
    .where(eq(userProfile.userId, userId))
  
  if (!profile || profile.length === 0 || profile[0].role !== 'admin') {
    throw new Error('Admin access required')
  }
  
  const payments = await db
    .select()
    .from(payment)
    .where(eq(payment.status, 'completed'))
  
  // Group by month
  const monthlyRevenue: Record<string, number> = {}
  
  payments.forEach(p => {
    if (p.completedAt) {
      const month = new Date(p.completedAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
      monthlyRevenue[month] = (monthlyRevenue[month] || 0) + (Number(p.amount) || 0)
    }
  })
  
  return Object.entries(monthlyRevenue).map(([month, revenue]) => ({
    month,
    revenue,
  }))
}
