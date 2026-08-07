'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { courses } from '@/lib/courses-data'

export default function StudentCourses() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  
  const categories = ['All', 'Computer Science', 'Web Development', 'Data Science', 'Business']
  
  const filteredCourses = selectedCategory === 'All' 
    ? courses 
    : courses.filter(c => c.category === selectedCategory)

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
              <Link href="/student/dashboard">
                <Button variant="ghost">Dashboard</Button>
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
          <h1 className="text-4xl font-bold text-foreground mb-2">All Courses</h1>
          <p className="text-foreground/70">Explore our complete course library and start learning</p>
        </div>
      </section>

      {/* Category Filter */}
      <section className="px-4 sm:px-6 lg:px-8 py-8 border-b border-border">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  selectedCategory === category
                    ? 'bg-primary text-white'
                    : 'bg-secondary text-foreground hover:bg-border'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Courses Grid */}
      <section className="px-4 sm:px-6 lg:px-8 py-16">
        <div className="mx-auto max-w-7xl">
          {filteredCourses.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-foreground/70 text-lg">No courses found in this category</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map((course) => (
                <Link key={course.id} href={`/courses/${course.id}`}>
                  <div className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg hover:border-primary/50 transition cursor-pointer h-full flex flex-col">
                    {/* Thumbnail */}
                    <div className="relative h-40 bg-secondary">
                      <Image
                        src={course.thumbnail}
                        alt={course.title}
                        fill
                        className="object-cover"
                      />
                    </div>

                    {/* Content */}
                    <div className="p-4 flex flex-col flex-grow">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <span className="text-xs font-medium bg-primary/10 text-primary px-2 py-1 rounded">
                          {course.level}
                        </span>
                        <div className="flex items-center gap-1">
                          <span className="text-sm font-semibold text-foreground">★ {course.rating}</span>
                        </div>
                      </div>

                      <h3 className="font-semibold text-foreground mb-1 line-clamp-2">{course.title}</h3>
                      <p className="text-xs text-foreground/60 mb-3">{course.institution}</p>

                      <p className="text-xs text-foreground/70 mb-4 flex-grow line-clamp-2">
                        {course.instructor}
                      </p>

                      {/* Stats */}
                      <div className="flex justify-between text-xs text-foreground/60 mb-4 py-3 border-t border-border">
                        <span>{course.students.toLocaleString()} students</span>
                        <span>{course.duration}h course</span>
                      </div>

                      {/* Price */}
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-primary">
                          {course.price === 0 ? 'Free' : `$${course.price}`}
                        </span>
                        <Button className="bg-primary hover:bg-primary/90 text-sm h-9">
                          Explore
                        </Button>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
