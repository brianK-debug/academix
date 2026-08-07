import {
  pgTable,
  text,
  timestamp,
  integer,
  varchar,
  boolean,
  decimal,
  jsonb,
  index,
} from 'drizzle-orm/pg-core'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'

// ============================================================================
// BETTER AUTH TABLES (required - do not modify)
// ============================================================================

export const user = pgTable(
  'user',
  {
    id: text('id').primaryKey(),
    name: text('name'),
    email: text('email').unique(),
    emailVerified: boolean('emailVerified'),
    image: text('image'),
    createdAt: timestamp('createdAt'),
    updatedAt: timestamp('updatedAt'),
  },
  (table) => [
    index('idx_user_email').on(table.email),
  ]
)

export const session = pgTable(
  'session',
  {
    id: text('id').primaryKey(),
    expiresAt: timestamp('expiresAt'),
    token: text('token').unique(),
    createdAt: timestamp('createdAt'),
    updatedAt: timestamp('updatedAt'),
    ipAddress: text('ipAddress'),
    userAgent: text('userAgent'),
    userId: text('userId').notNull().references(() => user.id, { onDelete: 'cascade' }),
  },
  (table) => [
    index('idx_session_userId').on(table.userId),
    index('idx_session_token').on(table.token),
  ]
)

export const account = pgTable(
  'account',
  {
    id: text('id').primaryKey(),
    accountId: text('accountId'),
    providerId: text('providerId'),
    userId: text('userId').notNull().references(() => user.id, { onDelete: 'cascade' }),
    accessToken: text('accessToken'),
    refreshToken: text('refreshToken'),
    idToken: text('idToken'),
    accessTokenExpiresAt: timestamp('accessTokenExpiresAt'),
    refreshTokenExpiresAt: timestamp('refreshTokenExpiresAt'),
    scope: text('scope'),
    password: text('password'),
    createdAt: timestamp('createdAt'),
    updatedAt: timestamp('updatedAt'),
  },
  (table) => [
    index('idx_account_userId').on(table.userId),
  ]
)

export const verification = pgTable(
  'verification',
  {
    id: text('id').primaryKey(),
    identifier: text('identifier'),
    value: text('value'),
    expiresAt: timestamp('expiresAt'),
    createdAt: timestamp('createdAt'),
    updatedAt: timestamp('updatedAt'),
  }
)

// ============================================================================
// APP-SPECIFIC TABLES
// ============================================================================

// User Profiles (extended info for students and instructors)
export const userProfile = pgTable(
  'userProfile',
  {
    id: text('id').primaryKey(),
    userId: text('userId').notNull().unique(),
    role: varchar('role', { length: 50 }).default('student').notNull(), // student, instructor, admin
    bio: text('bio'),
    avatar: text('avatar'),
    headline: text('headline'), // e.g., "AI Expert | Python Developer"
    experience: integer('experience').default(0), // years of experience
    verified: boolean('verified').default(false), // instructor verification
    createdAt: timestamp('createdAt', { withTimezone: true }).defaultNow(),
    updatedAt: timestamp('updatedAt', { withTimezone: true }).defaultNow(),
  },
  (table) => [
    index('idx_userProfile_userId').on(table.userId),
    index('idx_userProfile_role').on(table.role),
  ]
)

// Courses
export const course = pgTable(
  'course',
  {
    id: text('id').primaryKey(),
    title: varchar('title', { length: 255 }).notNull(),
    description: text('description'),
    slug: varchar('slug', { length: 255 }).unique().notNull(),
    category: varchar('category', { length: 100 }),
    level: varchar('level', { length: 50 }).default('beginner'), // beginner, intermediate, advanced
    price: decimal('price', { precision: 10, scale: 2 }).notNull(),
    currency: varchar('currency', { length: 10 }).default('USD'),
    thumbnail: text('thumbnail'),
    preview: text('preview'), // preview video URL
    instructorId: text('instructorId').notNull(),
    status: varchar('status', { length: 50 }).default('draft'), // draft, published, archived
    totalLessons: integer('totalLessons').default(0),
    totalStudents: integer('totalStudents').default(0),
    rating: decimal('rating', { precision: 3, scale: 1 }).default('0'),
    reviews: integer('reviews').default(0),
    published: boolean('published').default(false),
    publishedAt: timestamp('publishedAt'),
    createdAt: timestamp('createdAt', { withTimezone: true }).defaultNow(),
    updatedAt: timestamp('updatedAt', { withTimezone: true }).defaultNow(),
  },
  (table) => [
    index('idx_course_instructorId').on(table.instructorId),
    index('idx_course_status').on(table.status),
    index('idx_course_category').on(table.category),
    index('idx_course_slug').on(table.slug),
  ]
)

// Course Modules
export const courseModule = pgTable(
  'courseModule',
  {
    id: text('id').primaryKey(),
    courseId: text('courseId').notNull(),
    title: varchar('title', { length: 255 }).notNull(),
    description: text('description'),
    order: integer('order').notNull(), // module order within course
    createdAt: timestamp('createdAt', { withTimezone: true }).defaultNow(),
    updatedAt: timestamp('updatedAt', { withTimezone: true }).defaultNow(),
  },
  (table) => [
    index('idx_courseModule_courseId').on(table.courseId),
  ]
)

// Lessons
export const lesson = pgTable(
  'lesson',
  {
    id: text('id').primaryKey(),
    courseId: text('courseId').notNull(),
    moduleId: text('moduleId').notNull(),
    title: varchar('title', { length: 255 }).notNull(),
    description: text('description'),
    order: integer('order').notNull(), // lesson order within module
    contentType: varchar('contentType', { length: 50 }).default('video'), // video, text, quiz, assignment
    videoUrl: text('videoUrl'),
    videoDuration: integer('videoDuration'), // in seconds
    content: text('content'), // HTML content for text lessons
    resources: jsonb('resources'), // array of resource objects {name, url}
    quiz: jsonb('quiz'), // quiz questions
    createdAt: timestamp('createdAt', { withTimezone: true }).defaultNow(),
    updatedAt: timestamp('updatedAt', { withTimezone: true }).defaultNow(),
  },
  (table) => [
    index('idx_lesson_courseId').on(table.courseId),
    index('idx_lesson_moduleId').on(table.moduleId),
  ]
)

// Course Enrollments
export const enrollment = pgTable(
  'enrollment',
  {
    id: text('id').primaryKey(),
    studentId: text('studentId').notNull(),
    courseId: text('courseId').notNull(),
    status: varchar('status', { length: 50 }).default('active'), // active, completed, dropped
    progress: integer('progress').default(0), // percentage
    completedAt: timestamp('completedAt'),
    enrolledAt: timestamp('enrolledAt', { withTimezone: true }).defaultNow(),
    updatedAt: timestamp('updatedAt', { withTimezone: true }).defaultNow(),
  },
  (table) => [
    index('idx_enrollment_studentId').on(table.studentId),
    index('idx_enrollment_courseId').on(table.courseId),
    index('idx_enrollment_status').on(table.status),
  ]
)

// User Progress (tracks lesson completion)
export const userProgress = pgTable(
  'userProgress',
  {
    id: text('id').primaryKey(),
    userId: text('userId').notNull(),
    lessonId: text('lessonId').notNull(),
    courseId: text('courseId').notNull(),
    completed: boolean('completed').default(false),
    completedAt: timestamp('completedAt'),
    watchedDuration: integer('watchedDuration').default(0), // seconds
    createdAt: timestamp('createdAt', { withTimezone: true }).defaultNow(),
    updatedAt: timestamp('updatedAt', { withTimezone: true }).defaultNow(),
  },
  (table) => [
    index('idx_userProgress_userId').on(table.userId),
    index('idx_userProgress_lessonId').on(table.lessonId),
    index('idx_userProgress_courseId').on(table.courseId),
  ]
)

// Certificates
export const certificate = pgTable(
  'certificate',
  {
    id: text('id').primaryKey(),
    studentId: text('studentId').notNull(),
    courseId: text('courseId').notNull(),
    certificateNumber: varchar('certificateNumber', { length: 100 }).unique(),
    issueDate: timestamp('issueDate', { withTimezone: true }).defaultNow(),
    verificationCode: varchar('verificationCode', { length: 100 }).unique(),
    createdAt: timestamp('createdAt', { withTimezone: true }).defaultNow(),
  },
  (table) => [
    index('idx_certificate_studentId').on(table.studentId),
    index('idx_certificate_courseId').on(table.courseId),
    index('idx_certificate_verificationCode').on(table.verificationCode),
  ]
)

// Payments (PayPal transactions)
export const payment = pgTable(
  'payment',
  {
    id: text('id').primaryKey(),
    studentId: text('studentId').notNull(),
    courseId: text('courseId').notNull(),
    paypalOrderId: varchar('paypalOrderId', { length: 100 }).unique(),
    paypalTransactionId: varchar('paypalTransactionId', { length: 100 }).unique(),
    amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
    currency: varchar('currency', { length: 10 }).default('USD'),
    status: varchar('status', { length: 50 }).default('pending'), // pending, completed, failed, refunded
    payerEmail: varchar('payerEmail', { length: 255 }),
    payerName: varchar('payerName', { length: 255 }),
    metadata: jsonb('metadata'), // additional PayPal data
    createdAt: timestamp('createdAt', { withTimezone: true }).defaultNow(),
    updatedAt: timestamp('updatedAt', { withTimezone: true }).defaultNow(),
    completedAt: timestamp('completedAt'),
  },
  (table) => [
    index('idx_payment_studentId').on(table.studentId),
    index('idx_payment_courseId').on(table.courseId),
    index('idx_payment_status').on(table.status),
    index('idx_payment_paypalOrderId').on(table.paypalOrderId),
  ]
)

// Instructor Analytics
export const instructorAnalytics = pgTable(
  'instructorAnalytics',
  {
    id: text('id').primaryKey(),
    instructorId: text('instructorId').notNull(),
    courseId: text('courseId'),
    totalStudents: integer('totalStudents').default(0),
    totalEnrollments: integer('totalEnrollments').default(0),
    totalRevenue: decimal('totalRevenue', { precision: 15, scale: 2 }).default('0'),
    avgRating: decimal('avgRating', { precision: 3, scale: 1 }).default('0'),
    totalCourses: integer('totalCourses').default(0),
    createdAt: timestamp('createdAt', { withTimezone: true }).defaultNow(),
    updatedAt: timestamp('updatedAt', { withTimezone: true }).defaultNow(),
  },
  (table) => [
    index('idx_instructorAnalytics_instructorId').on(table.instructorId),
    index('idx_instructorAnalytics_courseId').on(table.courseId),
  ]
)

// Admin Analytics
export const adminAnalytics = pgTable(
  'adminAnalytics',
  {
    id: text('id').primaryKey(),
    totalUsers: integer('totalUsers').default(0),
    totalStudents: integer('totalStudents').default(0),
    totalInstructors: integer('totalInstructors').default(0),
    totalCourses: integer('totalCourses').default(0),
    totalEnrollments: integer('totalEnrollments').default(0),
    totalRevenue: decimal('totalRevenue', { precision: 15, scale: 2 }).default('0'),
    platformFeePercentage: decimal('platformFeePercentage', { precision: 5, scale: 2 }).default('10'),
    createdAt: timestamp('createdAt', { withTimezone: true }).defaultNow(),
    updatedAt: timestamp('updatedAt', { withTimezone: true }).defaultNow(),
  }
)

// ============================================================================
// EXPORT SCHEMAS FOR ZION VALIDATION
// ============================================================================

export const createUserProfileSchema = createInsertSchema(userProfile)
export const selectUserProfileSchema = createSelectSchema(userProfile)

export const createCourseSchema = createInsertSchema(course)
export const selectCourseSchema = createSelectSchema(course)

export const createEnrollmentSchema = createInsertSchema(enrollment)
export const selectEnrollmentSchema = createSelectSchema(enrollment)

export const createPaymentSchema = createInsertSchema(payment)
export const selectPaymentSchema = createSelectSchema(payment)

export const createCertificateSchema = createInsertSchema(certificate)
export const selectCertificateSchema = createSelectSchema(certificate)
