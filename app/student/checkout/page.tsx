'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useCart } from '@/lib/cart-context'
import { ShoppingCart, Trash2, ArrowLeft, Lock, CheckCircle } from 'lucide-react'
import { useState } from 'react'

export default function CheckoutPage() {
  const { cart, removeFromCart, clearCart, cartTotal } = useCart()
  const [promoCode, setPromoCode] = useState('')
  const [applied, setApplied] = useState(false)

  const handleApplyPromo = () => {
    if (promoCode === 'WELCOME10') {
      setApplied(true)
    }
  }

  const discount = applied ? cartTotal * 0.1 : 0
  const finalTotal = cartTotal - discount

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-indigo-50">
        {/* Navigation */}
        <nav className="bg-white border-b border-indigo-100 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-2 h-16">
            <div className="w-8 h-8 rounded-lg bg-indigo-600" />
            <span className="font-bold text-slate-900 text-lg">Academix</span>
          </div>
        </nav>

        {/* Empty Cart */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-md mx-auto text-center bg-white rounded-xl p-8 shadow-lg border border-indigo-100">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingCart className="w-8 h-8 text-slate-400" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Your Cart is Empty</h1>
            <p className="text-slate-600 mb-6">Start exploring courses and add them to your cart</p>
            <Link href="/courses">
              <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold">
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-indigo-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-indigo-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <Link href="/courses" className="flex items-center gap-2 hover:opacity-70 transition">
            <div className="w-8 h-8 rounded-lg bg-indigo-600" />
            <span className="font-bold text-slate-900 text-lg">Academix</span>
          </Link>
          <Link href="/courses" className="text-slate-600 hover:text-slate-900 transition font-medium flex items-center gap-1">
            <ArrowLeft className="w-4 h-4" />
            Continue Shopping
          </Link>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900">Shopping Cart</h1>
          <p className="text-slate-600 mt-2">{cart.length} course{cart.length !== 1 ? 's' : ''} in your cart</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl border border-indigo-100 shadow-sm overflow-hidden">
              {cart.map((item, idx) => (
                <div key={item.courseId}>
                  <div className="p-6 flex items-start justify-between hover:bg-indigo-50 transition">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center text-white font-bold flex-shrink-0">
                          {item.title.charAt(0)}
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-900">{item.title}</h3>
                          <p className="text-sm text-slate-600">{item.institution}</p>
                        </div>
                      </div>
                      <p className="text-sm text-slate-600 ml-12">{item.instructor}</p>
                    </div>
                    <div className="text-right flex items-center gap-6 ml-4">
                      <p className="text-2xl font-bold text-indigo-600 whitespace-nowrap">${item.price}</p>
                      <button
                        onClick={() => removeFromCart(item.courseId)}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                  {idx < cart.length - 1 && <div className="border-t border-slate-100" />}
                </div>
              ))}
            </div>

            {/* Promo Code */}
            <div className="mt-8 bg-white rounded-xl border border-indigo-100 p-6 shadow-sm">
              <h3 className="font-bold text-slate-900 mb-4">Apply Promo Code</h3>
              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="Enter promo code"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  disabled={applied}
                  className="flex-1 px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none disabled:bg-slate-50"
                />
                <button
                  onClick={handleApplyPromo}
                  disabled={applied || !promoCode}
                  className="px-6 py-3 bg-slate-100 text-slate-600 hover:bg-slate-200 disabled:opacity-50 rounded-lg font-medium transition"
                >
                  Apply
                </button>
              </div>
              {applied && (
                <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2 text-green-700 text-sm">
                  <CheckCircle className="w-5 h-5" />
                  <span>Promo code applied! 10% discount</span>
                </div>
              )}
              <p className="text-xs text-slate-600 mt-2">Try: <span className="font-mono bg-slate-100 px-2 py-1 rounded">WELCOME10</span></p>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-white rounded-xl border border-indigo-100 shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-indigo-600 to-blue-700 p-6 text-white">
                <h3 className="font-bold text-lg mb-6">Order Summary</h3>

                <div className="space-y-4 mb-6">
                  <div className="flex items-center justify-between">
                    <p className="text-indigo-100">Subtotal</p>
                    <p className="font-bold">${cartTotal.toFixed(2)}</p>
                  </div>
                  {applied && (
                    <div className="flex items-center justify-between pt-4 border-t border-white/20">
                      <p className="text-indigo-100">Discount (10%)</p>
                      <p className="font-bold text-green-300">-${discount.toFixed(2)}</p>
                    </div>
                  )}
                </div>

                <div className="border-t border-white/20 pt-4">
                  <div className="flex items-center justify-between mb-6">
                    <p className="text-lg font-bold">Total</p>
                    <p className="text-3xl font-bold">${finalTotal.toFixed(2)}</p>
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-3">
                <button
                  onClick={() => {
                    alert('Payment processing simulated!\n\nCourses enrolled:\n' + cart.map(c => `• ${c.title}`).join('\n'))
                    clearCart()
                  }}
                  className="w-full px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg transition"
                >
                  Proceed to Payment
                </button>
                <Link href="/courses">
                  <button className="w-full px-6 py-3 bg-slate-100 text-slate-600 hover:bg-slate-200 font-bold rounded-lg transition">
                    Continue Shopping
                  </button>
                </Link>

                <div className="pt-4 border-t border-slate-200 space-y-2 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4 text-green-600" />
                    <span>Secure payment processing</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>Lifetime access to courses</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>30-day money-back guarantee</span>
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
