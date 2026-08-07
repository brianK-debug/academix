'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { courses, getCourseById } from '@/lib/courses-data'
import { useParams } from 'next/navigation'
import { Star, Clock, Users, BarChart, Heart, ShoppingCart, ChevronDown, Play, Lock } from 'lucide-react'
import { useCart } from '@/lib/cart-context'

export default function CoursePage() {
  const params = useParams()
  const courseId = params.courseId as string
  const course = getCourseById(courseId)
  const [expandedChapter, setExpandedChapter] = useState<string>('ch1')
  const { addToCart, isInWishlist, addToWishlist, removeFromWishlist } = useCart()

  if (!course) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Course not found</h1>
          <Link href="/courses">
            <Button>Back to Courses</Button>
          </Link>
        </div>
      </div>
    )
  }

  const handleAddToCart = () => {
    addToCart({
      courseId: course.id,
      title: course.title,
      price: course.price,
      instructor: course.instructor,
      institution: course.institution
    })
    window.location.href = '/student/checkout'
  }

  const handleWishlist = () => {
    if (isInWishlist(course.id)) {
      removeFromWishlist(course.id)
    } else {
      addToWishlist(course.id, course.title, course.price, course.instructor, course.institution)
    }
  }

  const totalLessons = course.chapters.reduce((acc, ch) => acc + ch.lessons.length, 0)
  const totalFree = course.chapters.reduce((acc, ch) => acc + ch.lessons.filter(l => l.free).length, 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-indigo-50">
      {/* Navigation */}
      <nav className="sticky top-0 z-40 bg-white border-b border-indigo-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <Link href="/courses" className="flex items-center space-x-2 hover:opacity-70 transition">
            <div className="w-8 h-8 rounded-lg bg-indigo-600" />
            <span className="font-bold text-slate-900 text-lg">Academix</span>
          </Link>
          <Link href="/courses" className="text-slate-600 hover:text-slate-900 transition font-medium">
            ← Back to Courses
          </Link>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            {/* Header Section */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 bg-indigo-100 text-indigo-700 text-sm font-semibold rounded-full">
                  {course.level}
                </span>
                <span className="px-3 py-1 bg-amber-100 text-amber-700 text-sm font-semibold rounded-full">
                  {course.category}
                </span>
              </div>
              <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4 leading-tight">
                {course.title}
              </h1>
              <p className="text-xl text-slate-600 mb-6 leading-relaxed">
                {course.description}
              </p>

              {/* Rating and Stats */}
              <div className="flex flex-wrap items-center gap-6 mb-8 pb-8 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < Math.floor(course.rating)
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-slate-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="font-bold text-slate-900">{course.rating}</span>
                  <span className="text-slate-600">({course.reviewCount.toLocaleString()} reviews)</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <Users className="w-5 h-5" />
                  <span>{course.students.toLocaleString()} students</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <Clock className="w-5 h-5" />
                  <span>{course.duration} hours</span>
                </div>
              </div>

              {/* Instructor Info */}
              <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl p-6 border border-indigo-100">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                    {course.instructor.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 mb-1">{course.instructor}</h3>
                    <p className="text-slate-600">{course.institution}</p>
                    <p className="text-sm text-slate-500 mt-2">Expert instructor with years of industry experience</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Curriculum Section */}
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-6">Curriculum</h2>
              <div className="space-y-4">
                {course.chapters.map((chapter, idx) => (
                  <div
                    key={chapter.id}
                    className="border border-indigo-100 rounded-xl overflow-hidden hover:border-indigo-300 transition"
                  >
                    <button
                      onClick={() => setExpandedChapter(expandedChapter === chapter.id ? '' : chapter.id)}
                      className="w-full px-6 py-4 bg-gradient-to-r from-white to-blue-50 hover:from-blue-50 hover:to-indigo-50 transition flex items-center justify-between"
                    >
                      <div className="text-left flex-1">
                        <h3 className="font-bold text-lg text-slate-900">
                          {idx + 1}. {chapter.title}
                        </h3>
                        <p className="text-sm text-slate-600 mt-1">{chapter.description}</p>
                      </div>
                      <div className="flex items-center gap-3 ml-4">
                        <span className="text-sm font-semibold text-slate-600 bg-white px-3 py-1 rounded-full">
                          {chapter.lessons.length} lessons
                        </span>
                        <ChevronDown
                          className={`w-5 h-5 text-slate-600 transition-transform ${
                            expandedChapter === chapter.id ? 'rotate-180' : ''
                          }`}
                        />
                      </div>
                    </button>

                    {expandedChapter === chapter.id && (
                      <div className="bg-white border-t border-indigo-100 divide-y divide-indigo-100">
                        {chapter.lessons.map((lesson, lessonIdx) => (
                          <div key={lesson.id} className="px-6 py-4 hover:bg-indigo-50 transition">
                            <Link href={`/courses/${course.id}/lessons/${lesson.id}`}>
                              <div className="flex items-center gap-4 cursor-pointer">
                                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-indigo-100 flex-shrink-0">
                                  {lesson.free ? (
                                    <Play className="w-5 h-5 text-indigo-600" />
                                  ) : (
                                    <Lock className="w-5 h-5 text-slate-400" />
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="font-semibold text-slate-900">{lesson.title}</p>
                                  <p className="text-sm text-slate-600">{lesson.description}</p>
                                </div>
                                <div className="flex items-center gap-3 ml-4 flex-shrink-0">
                                  {lesson.free && (
                                    <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">
                                      FREE
                                    </span>
                                  )}
                                  <span className="text-sm text-slate-600 font-medium">{lesson.duration}m</span>
                                </div>
                              </div>
                            </Link>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* What You'll Learn */}
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-6">This Course Includes</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-4 bg-white border border-indigo-100 rounded-lg">
                  <BarChart className="w-6 h-6 text-indigo-600 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-slate-900">{course.chapters.length}</p>
                    <p className="text-sm text-slate-600">Chapters</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-white border border-indigo-100 rounded-lg">
                  <Play className="w-6 h-6 text-indigo-600 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-slate-900">{totalLessons}</p>
                    <p className="text-sm text-slate-600">Lessons</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-white border border-indigo-100 rounded-lg">
                  <Clock className="w-6 h-6 text-indigo-600 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-slate-900">{course.duration}h</p>
                    <p className="text-sm text-slate-600">Content</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-white border border-indigo-100 rounded-lg">
                  <Lock className="w-6 h-6 text-indigo-600 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-slate-900">{totalFree}</p>
                    <p className="text-sm text-slate-600">Free Lessons</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar - Enrollment Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-4">
              {/* Price Card */}
              <div className="bg-white rounded-xl border border-indigo-100 p-6 shadow-lg">
                <p className="text-4xl font-bold text-indigo-600 mb-2">${course.price}</p>
                <p className="text-sm text-slate-600 mb-6">One-time payment • Lifetime access</p>

                <div className="space-y-3 mb-6">
                  <Button
                    onClick={handleAddToCart}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    Enroll Now
                  </Button>
                  <button
                    onClick={handleWishlist}
                    className={`w-full py-3 rounded-lg font-bold transition-all flex items-center justify-center gap-2 ${
                      isInWishlist(course.id)
                        ? 'bg-red-100 text-red-600 border border-red-200'
                        : 'bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200'
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${isInWishlist(course.id) ? 'fill-current' : ''}`} />
                    {isInWishlist(course.id) ? 'Saved' : 'Save for Later'}
                  </button>
                </div>

                <div className="space-y-3 text-sm text-slate-600 border-t border-slate-200 pt-6">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <span>Lifetime access to course materials</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <span>Access on desktop and mobile</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <span>Learn at your own pace</span>
                  </div>
                </div>
              </div>

              {/* Free Preview */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200 p-6">
                <p className="font-bold text-green-900 mb-2">Preview This Course</p>
                <p className="text-sm text-green-700 mb-4">Start with {totalFree} free lessons to see if it's right for you</p>
                <Link href={`/courses/${course.id}/lessons/${course.chapters[0].lessons.find(l => l.free)?.id || ''}`}>
                  <Button className="w-full bg-green-600 hover:bg-green-700 text-white font-bold">
                    Start Free Preview
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
