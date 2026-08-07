'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

export interface CartItem {
  courseId: string
  title: string
  price: number
  instructor: string
  institution: string
}

interface CartContextType {
  cart: CartItem[]
  wishlist: string[]
  addToCart: (item: CartItem) => void
  removeFromCart: (courseId: string) => void
  clearCart: () => void
  addToWishlist: (courseId: string, title: string, price: number, instructor: string, institution: string) => void
  removeFromWishlist: (courseId: string) => void
  isInWishlist: (courseId: string) => boolean
  cartTotal: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([])
  const [wishlist, setWishlist] = useState<string[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const savedCart = localStorage.getItem('academix-cart')
    const savedWishlist = localStorage.getItem('academix-wishlist')
    
    if (savedCart) setCart(JSON.parse(savedCart))
    if (savedWishlist) setWishlist(JSON.parse(savedWishlist))
  }, [])

  useEffect(() => {
    if (mounted) {
      localStorage.setItem('academix-cart', JSON.stringify(cart))
    }
  }, [cart, mounted])

  useEffect(() => {
    if (mounted) {
      localStorage.setItem('academix-wishlist', JSON.stringify(wishlist))
    }
  }, [wishlist, mounted])

  const addToCart = (item: CartItem) => {
    setCart(prev => {
      const exists = prev.find(i => i.courseId === item.courseId)
      if (exists) return prev
      return [...prev, item]
    })
  }

  const removeFromCart = (courseId: string) => {
    setCart(prev => prev.filter(i => i.courseId !== courseId))
  }

  const clearCart = () => {
    setCart([])
  }

  const addToWishlist = (courseId: string, title: string, price: number, instructor: string, institution: string) => {
    if (!wishlist.includes(courseId)) {
      setWishlist(prev => [...prev, courseId])
    }
  }

  const removeFromWishlist = (courseId: string) => {
    setWishlist(prev => prev.filter(id => id !== courseId))
  }

  const isInWishlist = (courseId: string) => {
    return wishlist.includes(courseId)
  }

  const cartTotal = cart.reduce((total, item) => total + item.price, 0)

  return (
    <CartContext.Provider value={{ cart, wishlist, addToCart, removeFromCart, clearCart, addToWishlist, removeFromWishlist, isInWishlist, cartTotal }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within CartProvider')
  }
  return context
}
