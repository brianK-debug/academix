# PrimeLearn - Implementation Guide

## Overview
This guide explains the complete implementation of the PrimeLearn online learning platform, including architecture, design decisions, and how all components work together.

## Architecture Overview

### Technology Stack
- **Frontend**: Next.js 16 with React 19 (App Router)
- **Styling**: Tailwind CSS v4 with custom theme tokens
- **Database**: Neon PostgreSQL with Drizzle ORM
- **Authentication**: Better Auth (email/password)
- **Payments**: PayPal integration
- **Hosting**: Vercel-ready

### Directory Structure
```
app/
├── (public)/                    # Public routes
│   ├── page.tsx                # Landing page
│   ├── sign-in/                # Login page
│   ├── sign-up/                # Registration page
│   └── layout.tsx              # Public layout
├── student/                    # Student routes (protected)
│   ├── dashboard/              # Dashboard
│   ├── courses/                # Course browser
│   └── certificates/           # Certificates
├── instructor/                 # Instructor routes (protected)
│   └── dashboard/              # Dashboard
├── admin/                      # Admin routes (protected)
│   └── dashboard/              # Dashboard
├── api/                        # API routes
│   ├── auth/                   # Auth endpoints
│   └── paypal/                 # PayPal webhooks
├── actions/                    # Server actions
│   ├── courses.ts              # Course operations
│   ├── payments.ts             # Payment handling
│   ├── certificates.ts         # Certificate generation
│   └── analytics.ts            # Analytics queries
├── components/                 # Reusable components
│   ├── auth-form.tsx           # Auth form
│   └── ui/                     # shadcn/ui components
├── lib/                        # Utilities
│   ├── auth.ts                 # Better Auth config
│   ├── auth-client.ts          # Auth client
│   └── db/                     # Database setup
└── globals.css                 # Theme and global styles
```

## Design System

### Color Tokens (globals.css)
```css
@theme {
  --primary: #2563eb           /* Primary blue */
  --accent: #dc2626            /* Accent red */
  --background: #fafaf9        /* Page background */
  --foreground: #1f2937        /* Text color */
  --card: #ffffff              /* Card background */
  --border: #e5e7eb            /* Border color */
  --secondary: #f3f4f6         /* Secondary background */
  --muted: #6b7280             /* Muted text */
  --success: #10b981           /* Success state */
  --destructive: #ef4444       /* Destructive action */
}
```

### Typography
- **Font Family**: Geist Sans (via Google Fonts)
- **Headings**: 600-700 weight, line-height 1.2
- **Body**: 400 weight, line-height 1.6
- **Sizes**: Responsive using Tailwind scale

### Component Patterns
All components follow these patterns:
1. Use semantic HTML (main, header, nav, section, article)
2. Apply color tokens via Tailwind classes
3. Implement proper spacing with gap utilities
4. Use flexbox for layouts (grid when necessary)
5. Maintain consistent padding/margins

## Database Schema

### User Management Tables

#### users
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR UNIQUE NOT NULL,
  passwordHash VARCHAR NOT NULL,
  createdAt TIMESTAMP DEFAULT NOW(),
  updatedAt TIMESTAMP DEFAULT NOW()
);
```
- Stores core authentication data
- Managed by Better Auth

#### userProfile
```sql
CREATE TABLE userProfile (
  id UUID PRIMARY KEY,
  userId UUID UNIQUE REFERENCES users(id),
  role ENUM('student', 'instructor', 'admin'),
  bio TEXT,
  avatarUrl VARCHAR,
  createdAt TIMESTAMP DEFAULT NOW()
);
```
- Stores user role and profile data
- Determines access level

### Course Management Tables

#### course
```sql
CREATE TABLE course (
  id UUID PRIMARY KEY,
  instructorId UUID REFERENCES users(id),
  title VARCHAR NOT NULL,
  description TEXT,
  price DECIMAL(10,2),
  thumbnail VARCHAR,
  category VARCHAR,
  difficulty VARCHAR,
  published BOOLEAN DEFAULT FALSE,
  createdAt TIMESTAMP DEFAULT NOW(),
  updatedAt TIMESTAMP DEFAULT NOW()
);
```
- Core course information
- Published flag controls visibility

#### courseModule
```sql
CREATE TABLE courseModule (
  id UUID PRIMARY KEY,
  courseId UUID REFERENCES course(id),
  title VARCHAR NOT NULL,
  displayOrder INTEGER,
  createdAt TIMESTAMP DEFAULT NOW()
);
```
- Organizes course into modules
- displayOrder controls sequence

#### lesson
```sql
CREATE TABLE lesson (
  id UUID PRIMARY KEY,
  moduleId UUID REFERENCES courseModule(id),
  title VARCHAR NOT NULL,
  content TEXT,
  videoUrl VARCHAR,
  displayOrder INTEGER,
  durationMinutes INTEGER,
  createdAt TIMESTAMP DEFAULT NOW()
);
```
- Individual lesson content
- References lessons in modules

### Enrollment & Progress Tables

#### enrollment
```sql
CREATE TABLE enrollment (
  id UUID PRIMARY KEY,
  userId UUID REFERENCES users(id),
  courseId UUID REFERENCES course(id),
  enrollmentDate TIMESTAMP DEFAULT NOW(),
  UNIQUE(userId, courseId)
);
```
- Records student enrollments
- Prevents duplicate enrollments

#### userProgress
```sql
CREATE TABLE userProgress (
  id UUID PRIMARY KEY,
  userId UUID REFERENCES users(id),
  courseId UUID REFERENCES course(id),
  lessonId UUID REFERENCES lesson(id),
  completed BOOLEAN DEFAULT FALSE,
  completedAt TIMESTAMP,
  UNIQUE(userId, lessonId)
);
```
- Tracks completion of each lesson
- Calculates overall progress

### Certificate & Payment Tables

#### certificate
```sql
CREATE TABLE certificate (
  id UUID PRIMARY KEY,
  userId UUID REFERENCES users(id),
  courseId UUID REFERENCES course(id),
  certificateNumber VARCHAR UNIQUE,
  issuedDate TIMESTAMP DEFAULT NOW(),
  verificationCode VARCHAR
);
```
- Issued certificates after course completion
- Includes verification for employers

#### payment
```sql
CREATE TABLE payment (
  id UUID PRIMARY KEY,
  userId UUID REFERENCES users(id),
  courseId UUID REFERENCES course(id),
  amount DECIMAL(10,2),
  paymentStatus ENUM('pending', 'completed', 'failed'),
  paypalOrderId VARCHAR,
  transactionDate TIMESTAMP DEFAULT NOW()
);
```
- Complete payment history
- PayPal order tracking

### Analytics Tables

#### instructorAnalytics
```sql
CREATE TABLE instructorAnalytics (
  id UUID PRIMARY KEY,
  instructorId UUID REFERENCES users(id),
  totalStudents INTEGER,
  totalEnrollments INTEGER,
  totalRevenue DECIMAL(10,2),
  totalCourses INTEGER,
  updatedAt TIMESTAMP DEFAULT NOW()
);
```
- Aggregated instructor metrics

#### adminAnalytics
```sql
CREATE TABLE adminAnalytics (
  id UUID PRIMARY KEY,
  totalUsers INTEGER,
  totalCourses INTEGER,
  totalEnrollments INTEGER,
  totalRevenue DECIMAL(10,2),
  updatedAt TIMESTAMP DEFAULT NOW()
);
```
- Platform-wide metrics

## Authentication Flow

### User Registration
1. User visits `/sign-up`
2. Selects role (student/instructor)
3. Enters email and password
4. Better Auth hashes password and creates user
5. `userProfile` record created with selected role
6. User redirected to role-specific dashboard

### User Login
1. User visits `/sign-in`
2. Enters email and password
3. Better Auth validates credentials
4. Session created and stored
5. User redirected to appropriate dashboard
6. Protected routes checked via middleware

### Role-Based Access
- Middleware checks user role in `userProfile`
- Redirects to appropriate dashboard
- Blocks unauthorized access to admin routes

## Payment Integration

### PayPal Integration Steps

1. **Checkout Initiation** (`student/checkout/[courseId]`)
   - User clicks "Enroll with PayPal"
   - PayPal button component rendered
   - On approval, `createPayPalOrder()` called

2. **Order Creation** (`app/actions/payments.ts`)
   ```typescript
   const createPayPalOrder = async (courseId: string, amount: number) => {
     // Create order via PayPal API
     // Store order ID in database
     // Return order ID to client
   }
   ```

3. **Payment Capture** 
   - On PayPal approval
   - `capturePayPalPayment()` called
   - Payment recorded in database

4. **Enrollment & Webhook**
   - `/api/paypal/webhook` receives payment notification
   - Validates webhook signature
   - Creates enrollment record
   - Certificate eligibility tracked

## Certificate System

### Automatic Certificate Generation

1. **Progress Tracking**
   - Each lesson completion updates `userProgress`
   - Progress calculated as: `completed_lessons / total_lessons * 100`

2. **Eligibility Check**
   - When progress reaches 80%
   - `checkCertificateEligibility()` called
   - Certificate automatically generated

3. **Certificate Record**
   - Unique certificate number generated
   - Verification code created
   - Record stored in `certificate` table

4. **Certificate Display**
   - Available in `/student/certificates`
   - Shows certificate details and number
   - Download functionality included

## API Routes

### Authentication Routes
- `POST /api/auth/signin` - Sign in
- `POST /api/auth/signup` - Sign up
- `POST /api/auth/signout` - Sign out
- `GET /api/auth/session` - Get session

### Course Routes
- `GET /api/courses` - Get published courses
- `GET /api/courses/[id]` - Get course details
- `POST /api/courses` - Create course (instructor)
- `PUT /api/courses/[id]` - Update course (instructor)

### Payment Routes
- `POST /api/paypal/webhook` - PayPal webhook handler

## Server Actions

### Course Actions (`app/actions/courses.ts`)
```typescript
- getPublishedCourses()          # Fetch all published courses
- getInstructorCourses()         # Fetch instructor's courses
- getCourseDetails(courseId)     # Get course with modules/lessons
- createCourse(data)             # Create new course
- updateCourse(id, data)         # Update course
- enrollInCourse(courseId)       # Enroll in course
- getUserEnrollments()           # Get student's courses
```

### Payment Actions (`app/actions/payments.ts`)
```typescript
- createPayPalOrder(courseId, amount)      # Create PayPal order
- capturePayPalPayment(orderId)            # Capture payment
- recordPayment(data)                      # Record payment
- getUserPayments()                        # Get payment history
```

### Certificate Actions (`app/actions/certificates.ts`)
```typescript
- checkCertificateEligibility(courseId)    # Check if eligible
- issueCertificate(courseId, userId)       # Issue certificate
- getUserCertificates()                    # Get user certificates
- verifyCertificate(certificateNumber)     # Verify certificate
```

### Analytics Actions (`app/actions/analytics.ts`)
```typescript
- getInstructorAnalytics()                 # Get instructor metrics
- getAdminAnalytics()                      # Get platform metrics
- getStudentStats()                        # Get student progress
```

## Security Implementation

### Middleware Protection
```typescript
// middleware.ts
const protectedRoutes = ['/student', '/instructor', '/admin']
// Check role and redirect if unauthorized
```

### Password Security
- Better Auth handles hashing with bcrypt
- Never store plain passwords
- Secure password reset via email

### Session Management
- Better Auth creates secure HTTP-only cookies
- Session validation on each request
- Automatic session expiration

### API Security
- Server actions validate user ID
- All queries scoped to current user
- PayPal webhook signature verification
- Input validation on all endpoints

## Performance Optimizations

### Frontend Performance
1. **Image Optimization**
   - Next.js Image component for responsive images
   - Automatic format selection (WebP, AVIF)
   - Lazy loading by default

2. **Code Splitting**
   - Route-based code splitting
   - Dynamic component loading
   - Tree shaking unused code

3. **Caching**
   - Static generation where possible
   - ISR for course data
   - Client-side caching with SWR

### Database Performance
1. **Indexes**
   - Unique indexes on frequently queried fields
   - Composite indexes for common queries
   - Foreign key indexes

2. **Query Optimization**
   - Parameterized queries prevent SQL injection
   - Join optimization
   - Connection pooling via Neon

## Deployment Checklist

### Before Deployment
- [ ] Environment variables set in Vercel
- [ ] Database migrations run
- [ ] PayPal credentials configured
- [ ] Email service configured
- [ ] SSL certificate valid
- [ ] Security headers configured
- [ ] Rate limiting enabled

### Vercel Deployment
1. Connect GitHub repository
2. Configure environment variables
3. Set build command: `pnpm run build`
4. Set start command: `pnpm run start`
5. Deploy to production

### Post-Deployment
- Monitor error logs
- Track performance metrics
- Enable analytics
- Test payment flow
- Verify certificates

## Monitoring & Maintenance

### Error Tracking
- Implement Sentry for error monitoring
- Log all server actions
- Track API failures

### Analytics
- Monitor user acquisition
- Track course popularity
- Review payment success rate
- Analyze student progress

### Maintenance
- Regular database backups
- Security updates
- Dependency updates
- Performance monitoring

## Future Enhancements

### Phase 2
- Video hosting integration
- Discussion forums
- Live sessions
- Advanced search

### Phase 3
- Mobile app
- API for partners
- Advanced analytics
- Machine learning recommendations

### Phase 4
- Gamification
- Social features
- Marketplace
- White-label platform

---

For questions or support, refer to the main README.md file.
