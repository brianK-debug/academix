'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { courses } from '@/lib/courses-data'
import { Button } from '@/components/ui/button'
import { Star, Heart, ShoppingCart, Filter, Search } from 'lucide-react'
import { useCart } from '@/lib/cart-context'

const categories = [
  'All',
  'Computer Science',
  'Web Development',
  'Data Science',
  'Machine Learning',
  'Business',
  'Marketing',
  'Cloud Computing',
  'Mobile Development',
  'Design'
]

export default function CoursesPage() {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const { addToCart, isInWishlist, addToWishlist, removeFromWishlist } = useCart()

  const filteredCourses = useMemo(() => {
    return courses.filter(course => {
      const matchCategory = selectedCategory === 'All' || course.category === selectedCategory
      const matchSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.instructor.toLowerCase().includes(searchQuery.toLowerCase())
      return matchCategory && matchSearch
    })
  }, [selectedCategory, searchQuery])

  const handleWishlist = (courseId: string, title: string, price: number, instructor: string, institution: string) => {
    if (isInWishlist(courseId)) {
      removeFromWishlist(courseId)
    } else {
      addToWishlist(courseId, title, price, instructor, institution)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white border-b border-indigo-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-2">Explore Courses</h1>
              <p className="text-slate-600">Discover thousands of courses from world-class instructors</p>
            </div>
            
            {/* Search Bar */}
            <div className="flex items-center gap-2 bg-white border border-indigo-200 rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-indigo-500">
              <Search className="w-5 h-5 text-slate-400" />
              <input
                type="search"
                placeholder="Search courses, instructors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent outline-none text-slate-900 placeholder:text-slate-500"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <div className="lg:col-span-1">
            <div className="sticky top-32 space-y-6">
              <div className="bg-white rounded-xl border border-indigo-100 p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <Filter className="w-5 h-5 text-indigo-600" />
                  <h3 className="font-bold text-slate-900">Categories</h3>
                </div>
                <div className="space-y-2">
                  {categories.map(category => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`w-full text-left px-4 py-2.5 rounded-lg transition-all duration-200 ${
                        selectedCategory === category
                          ? 'bg-indigo-600 text-white font-semibold'
                          : 'text-slate-700 hover:bg-indigo-50'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              {/* Cart Summary */}
              <Link href="/student/checkout">
                <div className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
                  <ShoppingCart className="w-6 h-6 mb-2" />
                  <p className="text-sm text-indigo-100 mb-1">Shopping Cart</p>
                  <p className="text-2xl font-bold">View Cart</p>
                </div>
              </Link>
            </div>
          </div>

          {/* Courses Grid */}
          <div className="lg:col-span-3">
            {filteredCourses.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-xl text-slate-600">No courses found. Try adjusting your filters.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredCourses.map(course => (
                  <div
                    key={course.id}
                    className="group bg-white rounded-xl border border-indigo-100 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col"
                  >
                    {/* Course Image */}
                    <div className="relative h-48 bg-gradient-to-br from-indigo-500 to-blue-600 overflow-hidden">
                      <div className="absolute inset-0 bg-black/5 group-hover:bg-black/10 transition-colors" />
                      <div className="absolute top-3 right-3">
                        <button
                          onClick={() => handleWishlist(course.id, course.title, course.price, course.instructor, course.institution)}
                          className={`p-2 rounded-full transition-all duration-200 ${
                            isInWishlist(course.id)
                              ? 'bg-red-500 text-white'
                              : 'bg-white/90 text-slate-600 hover:bg-red-500 hover:text-white'
                          }`}
                        >
                          <Heart className="w-5 h-5 fill-current" />
                        </button>
                      </div>
                      <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur px-3 py-1.5 rounded-full">
                        <p className="text-xs font-semibold text-indigo-600">{course.category}</p>
                      </div>
                    </div>

                    {/* Course Content */}
                    <div className="p-5 flex-1 flex flex-col">
                      <Link href={`/courses/${course.id}`}>
                        <h3 className="font-bold text-lg text-slate-900 mb-2 line-clamp-2 hover:text-indigo-600 transition-colors">
                          {course.title}
                        </h3>
                      </Link>

                      <div className="space-y-2 mb-4 flex-1">
                        <p className="text-sm text-slate-600">{course.institution}</p>
                        <p className="text-sm font-medium text-slate-700">{course.instructor}</p>

                        {/* Rating */}
                        <div className="flex items-center gap-1 pt-1">
                          <div className="flex items-center gap-0.5">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < Math.floor(course.rating)
                                    ? 'fill-amber-400 text-amber-400'
                                    : 'text-slate-300'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm font-semibold text-slate-900">{course.rating}</span>
                          <span className="text-xs text-slate-500">({course.reviewCount.toLocaleString()})</span>
                        </div>
                      </div>

                      {/* Footer */}
                      <div className="flex items-end justify-between pt-4 border-t border-slate-100">
                        <div>
                          <p className="text-2xl font-bold text-indigo-600">${course.price}</p>
                          <p className="text-xs text-slate-500">{course.duration}h of content</p>
                        </div>
                        <Link href={`/courses/${course.id}`}>
                          <Button className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold">
                            Explore
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
