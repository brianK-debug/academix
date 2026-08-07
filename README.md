# PrimeLearn - Premium Online Learning Platform

A modern, professional learning platform built with Next.js 16, TypeScript, Tailwind CSS, and Neon PostgreSQL. The platform supports multiple user roles (students, instructors, and admins) with comprehensive course management, payments, certificates, and analytics.

## Features

### Core Features
- **Multi-role Authentication**: Student, Instructor, and Admin accounts with role-based access control
- **Professional UI Design**: Clean, modern interface with professional color palette and real imagery
- **Responsive Design**: Mobile-first approach that works seamlessly on all devices

### Student Features
- Browse and search courses by category and difficulty
- Enroll in courses with PayPal checkout
- Track learning progress with visual indicators
- Complete lessons and earn certificates
- Access lifetime course materials
- View earned certificates and credentials

### Instructor Features
- Create and manage courses
- Publish/draft course management
- Track student enrollments and progress
- View revenue analytics and earnings
- Manage course content and lessons
- Monitor student engagement metrics

### Admin Features
- Platform-wide analytics dashboard
- User management (students, instructors, admins)
- Course moderation and management
- Payment and transaction monitoring
- Platform settings and configuration
- Revenue tracking and financial metrics

### Technical Features
- **Database**: Neon PostgreSQL with comprehensive schema
- **ORM**: Drizzle ORM for type-safe database queries
- **Authentication**: Better Auth with email/password authentication
- **Payments**: Full PayPal integration with webhooks
- **Certificates**: Automated certificate generation with verification
- **API**: Complete server-side API with role-based middleware
- **Server Actions**: Next.js server actions for data mutations

## Database Schema

### Core Tables
- **users**: Authentication and user accounts
- **userProfile**: User roles, bios, and metadata
- **course**: Course information, pricing, and metadata
- **courseModule**: Course structure and organization
- **lesson**: Individual lessons with video and content
- **enrollment**: Student course enrollments
- **userProgress**: Lesson completion and progress tracking
- **certificate**: Issued certificates with verification
- **payment**: Payment records with PayPal integration
- **instructorAnalytics**: Instructor performance metrics
- **adminAnalytics**: Platform-wide analytics

## Color Palette

- **Primary**: #2563eb (Blue)
- **Accent**: #dc2626 (Red)
- **Background**: #fafaf9 (Off-white)
- **Foreground**: #1f2937 (Dark grey)
- **Cards**: #ffffff (White)
- **Border**: #e5e7eb (Light grey)

## Project Structure

```
app/
├── page.tsx                 # Landing page
├── layout.tsx               # Root layout
├── globals.css              # Global styles and theme
├── sign-in/page.tsx         # Authentication
├── sign-up/page.tsx         # Registration
├── student/
│   ├── dashboard/           # Student dashboard
│   ├── courses/             # Course browser and player
│   ├── certificates/        # Certificate management
│   └── checkout/            # PayPal checkout
├── instructor/
│   └── dashboard/           # Instructor dashboard
├── admin/
│   └── dashboard/           # Admin dashboard
└── api/
    ├── auth/                # Authentication endpoints
    └── paypal/              # PayPal webhook handler

lib/
├── auth.ts                  # Better Auth configuration
├── auth-client.ts           # Frontend auth client
└── db/
    ├── index.ts             # Drizzle setup
    └── schema.ts            # Database schema

app/actions/
├── courses.ts               # Course management
├── payments.ts              # Payment handling
├── certificates.ts          # Certificate generation
└── analytics.ts             # Analytics queries

components/
├── auth-form.tsx            # Shared authentication form
└── ui/                      # shadcn/ui components
```

## Environment Variables

Required environment variables:
```
DATABASE_URL=postgresql://...         # Neon database URL
BETTER_AUTH_SECRET=<random_32_chars>  # Auth secret (generate with: openssl rand -base64 32)
PAYPAL_CLIENT_ID=<your_client_id>     # PayPal Client ID
PAYPAL_CLIENT_SECRET=<your_secret>    # PayPal Client Secret
```

## Getting Started

### Installation

1. Clone the repository
2. Install dependencies:
```bash
pnpm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
# Edit .env.local with your configuration
```

4. Run the development server:
```bash
pnpm dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

### Creating Accounts

- **Students**: Sign up at `/sign-up` and select Student role
- **Instructors**: Sign up at `/sign-up` and select Instructor role  
- **Admins**: Created through database or admin panel

## Key Pages

- `/` - Landing page with hero, features, and CTAs
- `/sign-in` - Student/instructor login
- `/sign-up` - Account registration
- `/student/dashboard` - Enrolled courses and progress
- `/student/courses` - Course catalog and enrollment
- `/student/certificates` - Earned certificates
- `/instructor/dashboard` - Course management and analytics
- `/admin/dashboard` - Platform analytics and management

## Payment Integration

The platform uses PayPal for course payments:
1. Student initiates checkout at `/student/checkout/[courseId]`
2. PayPal button triggers order creation
3. After approval, payment is captured
4. Student is automatically enrolled in course
5. Certificate eligibility tracked at 80% completion

## Security Features

- Role-based access control via middleware
- Protected API routes with user ID scoping
- Password hashing via Better Auth
- Secure session management
- CSRF protection
- Input validation and sanitization

## Performance Optimizations

- Next.js 16 with Turbopack bundler
- Image optimization with Next.js Image component
- Database query optimization with indexes
- Lazy loading of course content
- Responsive images and assets

## Support

For issues or questions, please refer to:
- Documentation: `/docs`
- Email: support@primelearn.com
- Help Center: `/help`

## License

Proprietary - All rights reserved

---

Built with ❤️ using Next.js 16, TypeScript, Tailwind CSS, and Neon PostgreSQL
