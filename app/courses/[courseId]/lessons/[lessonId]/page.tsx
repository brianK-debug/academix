'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { courses, getCourseById } from '@/lib/courses-data'
import { useParams } from 'next/navigation'
import { ArrowLeft, Lock, Download, Share2, ThumbsUp, MessageCircle } from 'lucide-react'

export default function LessonPage() {
  const params = useParams()
  const courseId = params.courseId as string
  const lessonId = params.lessonId as string
  const course = getCourseById(courseId)
  const [liked, setLiked] = useState(false)

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

  // Find the lesson
  let lesson = null
  let chapter = null
  for (const ch of course.chapters) {
    const l = ch.lessons.find(les => les.id === lessonId)
    if (l) {
      lesson = l
      chapter = ch
      break
    }
  }

  if (!lesson) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Lesson not found</h1>
          <Link href={`/courses/${courseId}`}>
            <Button>Back to Course</Button>
          </Link>
        </div>
      </div>
    )
  }

  if (!lesson.free) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white to-indigo-50 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center bg-white rounded-xl p-8 shadow-lg border border-indigo-100">
          <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-indigo-600" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">This lesson is locked</h1>
          <p className="text-slate-600 mb-6">Enroll in the course to access this lesson</p>
          <Link href={`/courses/${courseId}`}>
            <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold">
              Go Back to Course
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-indigo-50">
      {/* Navigation */}
      <nav className="sticky top-0 z-40 bg-white border-b border-indigo-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <Link href={`/courses/${courseId}`} className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 transition font-medium">
            <ArrowLeft className="w-5 h-5" />
            Back to Course
          </Link>
          <div className="text-right">
            <p className="text-sm text-slate-600">{course.title}</p>
            <p className="text-xs text-slate-500">{chapter?.title}</p>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Video Section */}
        <div className="bg-slate-900 rounded-xl overflow-hidden shadow-2xl mb-8">
          <div className="aspect-video bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center relative">
            {/* Video Placeholder */}
            <div className="text-center">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 hover:bg-white/30 transition cursor-pointer">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                </svg>
              </div>
              <p className="text-white text-lg font-semibold">Click to Play Video</p>
              <p className="text-slate-400 text-sm mt-2">Lesson Video: {lesson.title}</p>
            </div>

            {/* FREE Badge */}
            <div className="absolute top-4 right-4 px-4 py-2 bg-green-500 text-white text-sm font-bold rounded-lg">
              FREE
            </div>

            {/* Duration Badge */}
            <div className="absolute bottom-4 right-4 px-4 py-2 bg-black/50 text-white text-sm font-medium rounded-lg">
              {lesson.duration}m
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Lesson Header */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-bold rounded-full">
                  FREE LESSON
                </span>
              </div>
              <h1 className="text-4xl font-bold text-slate-900 mb-3">{lesson.title}</h1>
              <p className="text-lg text-slate-600 mb-6">{lesson.description}</p>

              {/* Actions */}
              <div className="flex flex-wrap gap-3 pb-8 border-b border-slate-200">
                <button
                  onClick={() => setLiked(!liked)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                    liked
                      ? 'bg-red-100 text-red-600'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <ThumbsUp className={`w-5 h-5 ${liked ? 'fill-current' : ''}`} />
                  <span className="font-medium">Helpful</span>
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition">
                  <Share2 className="w-5 h-5" />
                  <span className="font-medium">Share</span>
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition">
                  <Download className="w-5 h-5" />
                  <span className="font-medium">Download</span>
                </button>
              </div>
            </div>

            {/* Lesson Content */}
            <div className="bg-white rounded-xl border border-indigo-100 p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Lesson Content</h2>
              
              <div className="space-y-6 text-slate-700 leading-relaxed">
                <p className="text-lg">
                  Welcome to this comprehensive lesson on <strong>{lesson.title}</strong>. This lesson is designed to 
                  help you understand the core concepts and practical applications.
                </p>

                <div className="bg-indigo-50 border-l-4 border-indigo-600 p-6 rounded">
                  <h3 className="font-bold text-slate-900 mb-2">Key Concepts Covered:</h3>
                  <ul className="space-y-2 text-slate-700">
                    <li>• {lesson.description}</li>
                    <li>• Practical examples and use cases</li>
                    <li>• Best practices and common pitfalls</li>
                    <li>• Step-by-step implementation guide</li>
                  </ul>
                </div>

                <p>
                  {lesson.content || `This lesson covers ${lesson.description.toLowerCase()}. Through this lesson, 
                  you'll gain a deep understanding of the topic and be able to apply it in real-world scenarios.`}
                </p>

                <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 p-6 rounded-lg">
                  <h3 className="font-bold text-slate-900 mb-2">💡 Pro Tips:</h3>
                  <ul className="space-y-2 text-slate-700">
                    <li>✓ Take notes while watching the lesson</li>
                    <li>✓ Pause and practice the examples yourself</li>
                    <li>✓ Try to apply concepts to your own projects</li>
                    <li>✓ Revisit this lesson if needed</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-bold text-slate-900 mb-3">Practice Exercises:</h3>
                  <div className="space-y-3">
                    <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                      <p className="font-semibold text-slate-900">Exercise 1: Beginner Level</p>
                      <p className="text-slate-600 text-sm mt-1">Apply the concepts learned in this lesson to solve a simple problem.</p>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                      <p className="font-semibold text-slate-900">Exercise 2: Intermediate Level</p>
                      <p className="text-slate-600 text-sm mt-1">Build a small project using the techniques demonstrated in the lesson.</p>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg">
                  <h3 className="font-bold text-slate-900 mb-2">📚 Resources:</h3>
                  <ul className="space-y-2 text-slate-700">
                    <li>• <a href="#" className="text-blue-600 hover:underline">Download Lesson Notes (PDF)</a></li>
                    <li>• <a href="#" className="text-blue-600 hover:underline">Code Repository with Examples</a></li>
                    <li>• <a href="#" className="text-blue-600 hover:underline">External References and Documentation</a></li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Comments Section */}
            <div className="bg-white rounded-xl border border-indigo-100 p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Discussion</h2>
              <div className="bg-slate-50 p-6 rounded-lg text-center text-slate-600">
                <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-40" />
                <p>Join the discussion about this lesson</p>
                <Button className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white">
                  View Comments
                </Button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Course Progress */}
              <div className="bg-white rounded-xl border border-indigo-100 p-6 shadow-sm">
                <h3 className="font-bold text-slate-900 mb-4">Your Progress</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium text-slate-600">Current Lesson</p>
                      <p className="text-sm font-bold text-indigo-600">In Progress</p>
                    </div>
                    <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div className="h-full w-1/3 bg-indigo-600 rounded-full"></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium text-slate-600">Course Progress</p>
                      <p className="text-sm font-bold text-indigo-600">15%</p>
                    </div>
                    <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div className="h-full w-1/6 bg-green-500 rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Next Lesson */}
              <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl border border-indigo-100 p-6 shadow-sm">
                <h3 className="font-bold text-slate-900 mb-4">Next Up</h3>
                <p className="text-sm text-slate-600 mb-4">Your next lesson in this chapter</p>
                <Link href={`/courses/${courseId}`}>
                  <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold">
                    Continue Course
                  </Button>
                </Link>
              </div>

              {/* Course Info */}
              <div className="bg-white rounded-xl border border-indigo-100 p-6 shadow-sm">
                <h3 className="font-bold text-slate-900 mb-4">About This Course</h3>
                <div className="space-y-3 text-sm text-slate-600">
                  <div>
                    <p className="font-medium text-slate-900">{course.title}</p>
                    <p className="text-xs text-slate-500">{course.instructor}</p>
                  </div>
                  <div className="pt-3 border-t border-slate-200">
                    <p className="text-xs font-medium text-slate-500">Price: <span className="text-slate-900 font-bold">${course.price}</span></p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
