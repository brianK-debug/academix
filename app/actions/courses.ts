'use server'

import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { course, courseModule, lesson, enrollment, userProgress } from '@/lib/db/schema'
import { and, eq, desc, asc } from 'drizzle-orm'
import { headers } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { v4 as uuid } from 'uuid'

async function getUserId() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) throw new Error('Unauthorized')
  return session.user.id
}

// Get all published courses with pagination
export async function getPublishedCourses(page = 1, limit = 12) {
  const offset = (page - 1) * limit
  const courses = await db
    .select()
    .from(course)
    .where(eq(course.published, true))
    .orderBy(desc(course.publishedAt))
    .limit(limit)
    .offset(offset)
  
  return courses
}

// Get courses by category
export async function getCoursesByCategory(category: string) {
  return await db
    .select()
    .from(course)
    .where(and(eq(course.published, true), eq(course.category, category)))
    .orderBy(desc(course.publishedAt))
}

// Get course by slug
export async function getCourseBySlug(slug: string) {
  const [courseData] = await db
    .select()
    .from(course)
    .where(eq(course.slug, slug))
  
  return courseData
}

// Get course details with modules and lessons
export async function getCourseDetails(courseId: string) {
  const courseData = await db.select().from(course).where(eq(course.id, courseId))
  const modules = await db.select().from(courseModule).where(eq(courseModule.courseId, courseId)).orderBy(asc(courseModule.order))
  
  const modulesWithLessons = await Promise.all(
    modules.map(async (mod) => {
      const lessons = await db.select().from(lesson).where(eq(lesson.moduleId, mod.id)).orderBy(asc(lesson.order))
      return { ...mod, lessons }
    })
  )

  return { course: courseData[0], modules: modulesWithLessons }
}

// Get instructor's courses
export async function getInstructorCourses() {
  const userId = await getUserId()
  return await db
    .select()
    .from(course)
    .where(eq(course.instructorId, userId))
    .orderBy(desc(course.createdAt))
}

// Create a new course
export async function createCourse(data: {
  title: string
  description: string
  category: string
  level: string
  price: number
}) {
  const userId = await getUserId()
  const courseId = uuid()
  
  await db.insert(course).values({
    id: courseId,
    title: data.title,
    description: data.description,
    slug: data.title.toLowerCase().replace(/\s+/g, '-') + '-' + uuid().slice(0, 8),
    category: data.category,
    level: data.level,
    price: data.price,
    instructorId: userId,
    status: 'draft',
  })
  
  revalidatePath('/instructor/courses')
  return courseId
}

// Update course
export async function updateCourse(courseId: string, data: Partial<typeof course.$inferInsert>) {
  const userId = await getUserId()
  
  // Verify ownership
  const [courseData] = await db.select().from(course).where(eq(course.id, courseId))
  if (courseData?.instructorId !== userId) throw new Error('Unauthorized')
  
  await db.update(course).set({
    ...data,
    updatedAt: new Date(),
  }).where(eq(course.id, courseId))
  
  revalidatePath('/instructor/courses')
  return courseData
}

// Publish course
export async function publishCourse(courseId: string) {
  const userId = await getUserId()
  
  const [courseData] = await db.select().from(course).where(eq(course.id, courseId))
  if (courseData?.instructorId !== userId) throw new Error('Unauthorized')
  
  await db.update(course).set({
    published: true,
    publishedAt: new Date(),
    status: 'published',
  }).where(eq(course.id, courseId))
  
  revalidatePath('/instructor/courses')
  return courseData
}

// Add module to course
export async function addModule(courseId: string, data: { title: string; description?: string; order: number }) {
  const userId = await getUserId()
  const moduleId = uuid()
  
  // Verify ownership
  const [courseData] = await db.select().from(course).where(eq(course.id, courseId))
  if (courseData?.instructorId !== userId) throw new Error('Unauthorized')
  
  await db.insert(courseModule).values({
    id: moduleId,
    courseId,
    title: data.title,
    description: data.description,
    order: data.order,
  })
  
  revalidatePath(`/instructor/courses/${courseId}`)
  return moduleId
}

// Add lesson to module
export async function addLesson(moduleId: string, data: {
  title: string
  description?: string
  contentType: string
  videoUrl?: string
  videoDuration?: number
  content?: string
  order: number
}) {
  const lessonId = uuid()
  
  await db.insert(lesson).values({
    id: lessonId,
    moduleId,
    courseId: '', // Will be populated via join
    title: data.title,
    description: data.description,
    contentType: data.contentType,
    videoUrl: data.videoUrl,
    videoDuration: data.videoDuration,
    content: data.content,
    order: data.order,
  })
  
  return lessonId
}

// Enroll in course
export async function enrollCourse(courseId: string) {
  const userId = await getUserId()
  const enrollmentId = uuid()
  
  // Check if already enrolled
  const existing = await db
    .select()
    .from(enrollment)
    .where(and(eq(enrollment.studentId, userId), eq(enrollment.courseId, courseId)))
  
  if (existing.length > 0) {
    return existing[0]
  }
  
  await db.insert(enrollment).values({
    id: enrollmentId,
    studentId: userId,
    courseId,
    status: 'active',
  })
  
  revalidatePath('/student/dashboard')
  return enrollmentId
}

// Get student enrollments
export async function getStudentEnrollments() {
  const userId = await getUserId()
  return await db
    .select()
    .from(enrollment)
    .where(eq(enrollment.studentId, userId))
    .orderBy(desc(enrollment.enrolledAt))
}

// Update lesson progress
export async function updateLessonProgress(lessonId: string, courseId: string, watchedDuration: number) {
  const userId = await getUserId()
  
  const existing = await db
    .select()
    .from(userProgress)
    .where(and(eq(userProgress.userId, userId), eq(userProgress.lessonId, lessonId)))
  
  if (existing.length > 0) {
    await db.update(userProgress).set({
      watchedDuration,
      updatedAt: new Date(),
    }).where(and(eq(userProgress.userId, userId), eq(userProgress.lessonId, lessonId)))
  } else {
    await db.insert(userProgress).values({
      id: uuid(),
      userId,
      lessonId,
      courseId,
      watchedDuration,
    })
  }
  
  revalidatePath(`/student/courses/${courseId}`)
}

// Mark lesson as complete
export async function completeLessonProgress(lessonId: string, courseId: string) {
  const userId = await getUserId()
  
  const existing = await db
    .select()
    .from(userProgress)
    .where(and(eq(userProgress.userId, userId), eq(userProgress.lessonId, lessonId)))
  
  if (existing.length > 0) {
    await db.update(userProgress).set({
      completed: true,
      completedAt: new Date(),
      updatedAt: new Date(),
    }).where(and(eq(userProgress.userId, userId), eq(userProgress.lessonId, lessonId)))
  } else {
    await db.insert(userProgress).values({
      id: uuid(),
      userId,
      lessonId,
      courseId,
      completed: true,
      completedAt: new Date(),
    })
  }
  
  revalidatePath(`/student/courses/${courseId}`)
}

// Get course progress for student
export async function getCourseProgress(courseId: string) {
  const userId = await getUserId()
  
  // Get all lessons in course
  const courseLessons = await db
    .select()
    .from(lesson)
    .where(eq(lesson.courseId, courseId))
  
  // Get completed lessons
  const completed = await db
    .select()
    .from(userProgress)
    .where(and(
      eq(userProgress.userId, userId),
      eq(userProgress.courseId, courseId),
      eq(userProgress.completed, true)
    ))
  
  const totalLessons = courseLessons.length
  const completedLessons = completed.length
  const progress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0
  
  return {
    totalLessons,
    completedLessons,
    progress,
  }
}
