'use server'

import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { certificate, userProgress, course, user } from '@/lib/db/schema'
import { and, eq } from 'drizzle-orm'
import { headers } from 'next/headers'
import { v4 as uuid } from 'uuid'
import crypto from 'crypto'

async function getUserId() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) throw new Error('Unauthorized')
  return session.user.id
}

// Generate certificate number
function generateCertificateNumber(): string {
  return 'CERT-' + Date.now() + '-' + crypto.randomBytes(4).toString('hex').toUpperCase()
}

// Generate verification code
function generateVerificationCode(): string {
  return crypto.randomBytes(8).toString('hex').toUpperCase()
}

// Issue certificate for completed course
export async function issueCertificate(courseId: string) {
  const userId = await getUserId()
  
  // Check if course is completed
  const courseData = await db.select().from(course).where(eq(course.id, courseId))
  if (!courseData || courseData.length === 0) throw new Error('Course not found')
  
  // Get all lessons in course
  const courseLessons = await db
    .select()
    .from((() => userProgress)())
    .where(and(eq(userProgress.courseId, courseId)))
  
  const completedLessons = await db
    .select()
    .from(userProgress)
    .where(and(
      eq(userProgress.userId, userId),
      eq(userProgress.courseId, courseId),
      eq(userProgress.completed, true)
    ))
  
  // Check if 80% of lessons are completed
  if (courseLessons.length === 0 || completedLessons.length < Math.ceil(courseLessons.length * 0.8)) {
    throw new Error('Course completion requirement not met')
  }
  
  // Check if certificate already exists
  const existing = await db
    .select()
    .from(certificate)
    .where(and(eq(certificate.studentId, userId), eq(certificate.courseId, courseId)))
  
  if (existing.length > 0) return existing[0]
  
  // Issue certificate
  const certificateId = uuid()
  const certificateNumber = generateCertificateNumber()
  const verificationCode = generateVerificationCode()
  
  await db.insert(certificate).values({
    id: certificateId,
    studentId: userId,
    courseId,
    certificateNumber,
    verificationCode,
  })
  
  return {
    id: certificateId,
    certificateNumber,
    verificationCode,
  }
}

// Get student certificates
export async function getStudentCertificates() {
  const userId = await getUserId()
  return await db
    .select()
    .from(certificate)
    .where(eq(certificate.studentId, userId))
}

// Verify certificate
export async function verifyCertificate(verificationCode: string) {
  const cert = await db
    .select()
    .from(certificate)
    .where(eq(certificate.verificationCode, verificationCode))
  
  if (cert.length === 0) return null
  
  return cert[0]
}

// Generate PDF certificate (placeholder - would use pdfkit in real implementation)
export async function generateCertificatePDF(certificateId: string) {
  const userId = await getUserId()
  
  const cert = await db
    .select()
    .from(certificate)
    .where(and(eq(certificate.id, certificateId), eq(certificate.studentId, userId)))
  
  if (cert.length === 0) throw new Error('Certificate not found')
  
  const certificateData = cert[0]
  
  // Get course details
  const courseData = await db
    .select()
    .from(course)
    .where(eq(course.id, certificateData.courseId))
  
  // Get user details
  const userData = await db
    .select()
    .from(user)
    .where(eq(user.id, userId))
  
  // In a real implementation, this would generate a PDF file
  // For now, return the data needed to generate a certificate
  return {
    certificateNumber: certificateData.certificateNumber,
    studentName: userData[0]?.name || 'Student',
    courseName: courseData[0]?.title || 'Course',
    issueDate: certificateData.issueDate,
    verificationCode: certificateData.verificationCode,
  }
}
