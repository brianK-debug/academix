'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { courses } from '@/lib/courses-data'

export default function StudentDashboard() {
  // Mock enrollments - showing first 2 courses as example enrollments
  const enrolledCourses = courses.slice(0, 2)

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border bg-card sticky top-0 z-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-primary" />
              <span className="font-bold text-foreground text-lg">Academix</span>
            </Link>
            <div className="flex items-center space-x-2">
              <Link href="/student/courses">
                <Button variant="ghost">Browse Courses</Button>
              </Link>
              <Link href="/sign-in">
                <Button variant="outline">Sign Out</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Header */}
      <section className="px-4 sm:px-6 lg:px-8 py-12 border-b border-border">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-4xl font-bold text-foreground mb-2">My Learning Dashboard</h1>
          <p className="text-foreground/70">Continue learning and track your progress</p>
        </div>
      </section>

      {/* Stats */}
      <section className="px-4 sm:px-6 lg:px-8 py-8 border-b border-border">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-card border border-border rounded-lg p-6">
              <p className="text-foreground/60 text-sm mb-2">Enrolled Courses</p>
              <p className="text-3xl font-bold text-primary">{enrolledCourses.length}</p>
            </div>
            <div className="bg-card border border-border rounded-lg p-6">
              <p className="text-foreground/60 text-sm mb-2">Hours Learned</p>
              <p className="text-3xl font-bold text-primary">24</p>
            </div>
            <div className="bg-card border border-border rounded-lg p-6">
              <p className="text-foreground/60 text-sm mb-2">In Progress</p>
              <p className="text-3xl font-bold text-primary">{enrolledCourses.length}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Enrolled Courses */}
      <section className="px-4 sm:px-6 lg:px-8 py-16">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-foreground">Your Courses</h2>
            <Link href="/student/courses">
              <Button variant="outline">Browse More Courses</Button>
            </Link>
          </div>

          {enrolledCourses.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-foreground/70 text-lg mb-6">You haven&apos;t enrolled in any courses yet.</p>
              <Link href="/student/courses">
                <Button className="bg-primary hover:bg-primary/90">Browse Courses</Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {enrolledCourses.map((course) => (
                <div key={course.id} className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg transition">
                  {/* Course Image */}
                  <div className="relative h-40 bg-secondary">
                    <Image
                      src={course.thumbnail}
                      alt={course.title}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Course Info */}
                  <div className="p-6">
                    <h3 className="font-semibold text-foreground mb-2">{course.title}</h3>
                    <p className="text-sm text-foreground/60 mb-4">{course.institution}</p>

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-foreground/60">Progress</span>
                        <span className="text-sm font-semibold text-primary">45%</span>
                      </div>
                      <div className="w-full bg-secondary rounded-full h-2">
                        <div className="bg-primary rounded-full h-2" style={{ width: '45%' }} />
                      </div>
                    </div>

                    {/* Course Stats */}
                    <div className="flex justify-between text-xs text-foreground/60 mb-4 pb-4 border-b border-border">
                      <span>{course.chapters.length} chapters</span>
                      <span>★ {course.rating}</span>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                      <Link href={`/courses/${course.id}`} className="flex-grow">
                        <Button className="w-full bg-primary hover:bg-primary/90" size="sm">
                          Continue Learning
                        </Button>
                      </Link>
                      <Button variant="outline" size="sm">
                        Details
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Recommended Courses */}
      <section className="px-4 sm:px-6 lg:px-8 py-16 bg-secondary/30">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-3xl font-bold text-foreground mb-8">Recommended For You</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.slice(0, 3).map((course) => (
              <Link key={course.id} href={`/courses/${course.id}`}>
                <div className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg hover:border-primary/50 transition cursor-pointer">
                  <div className="relative h-40 bg-secondary">
                    <Image
                      src={course.thumbnail}
                      alt={course.title}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="p-4">
                    <span className="text-xs font-medium bg-primary/10 text-primary px-2 py-1 rounded">
                      {course.level}
                    </span>
                    <h3 className="font-semibold text-foreground mt-2 mb-1 line-clamp-2">{course.title}</h3>
                    <p className="text-xs text-foreground/60 mb-3">{course.institution}</p>

                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-primary">
                        {course.price === 0 ? 'Free' : `$${course.price}`}
                      </span>
                      <Button size="sm" className="bg-primary hover:bg-primary/90">
                        Explore
                      </Button>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
