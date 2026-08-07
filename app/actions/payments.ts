'use server'

import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { payment, enrollment } from '@/lib/db/schema'
import { and, eq } from 'drizzle-orm'
import { headers } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { v4 as uuid } from 'uuid'

async function getUserId() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) throw new Error('Unauthorized')
  return session.user.id
}

async function getPayPalAccessToken() {
  const auth = Buffer.from(
    `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`
  ).toString('base64')

  const response = await fetch('https://api-m.paypal.com/v1/oauth2/token', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  })

  if (!response.ok) throw new Error('Failed to get PayPal access token')
  const data = await response.json()
  return data.access_token
}

// Create PayPal order
export async function createPayPalOrder(courseId: string, amount: number, courseName: string) {
  const userId = await getUserId()
  const token = await getPayPalAccessToken()

  const orderData = {
    intent: 'CAPTURE',
    purchase_units: [
      {
        amount: {
          currency_code: 'USD',
          value: amount.toString(),
        },
        description: courseName,
      },
    ],
    application_context: {
      brand_name: 'Premium Learning Platform',
      user_action: 'PAY_NOW',
      return_url: `${process.env.BETTER_AUTH_URL || 'http://localhost:3000'}/student/payment-success?courseId=${courseId}`,
      cancel_url: `${process.env.BETTER_AUTH_URL || 'http://localhost:3000'}/student/payment-cancel`,
    },
  }

  const response = await fetch('https://api-m.paypal.com/v2/checkout/orders', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(orderData),
  })

  if (!response.ok) throw new Error('Failed to create PayPal order')
  const order = await response.json()

  // Store payment record
  const paymentId = uuid()
  await db.insert(payment).values({
    id: paymentId,
    studentId: userId,
    courseId,
    paypalOrderId: order.id,
    amount,
    status: 'pending',
  })

  return order
}

// Capture PayPal payment
export async function capturePayPalPayment(orderId: string) {
  const userId = await getUserId()
  const token = await getPayPalAccessToken()

  const response = await fetch(`https://api-m.paypal.com/v2/checkout/orders/${orderId}/capture`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) throw new Error('Failed to capture PayPal payment')
  const order = await response.json()

  // Get payment record
  const paymentRecord = await db
    .select()
    .from(payment)
    .where(and(eq(payment.paypalOrderId, orderId), eq(payment.studentId, userId)))

  if (paymentRecord.length === 0) throw new Error('Payment record not found')

  const paymentData = paymentRecord[0]

  // Update payment status
  await db.update(payment).set({
    status: 'completed',
    paypalTransactionId: order.purchase_units[0].payments.captures[0].id,
    payerEmail: order.payer.email_address,
    payerName: `${order.payer.name.given_name} ${order.payer.name.surname}`,
    completedAt: new Date(),
    updatedAt: new Date(),
  }).where(eq(payment.id, paymentData.id))

  // Create enrollment if payment successful
  const existingEnrollment = await db
    .select()
    .from(enrollment)
    .where(and(eq(enrollment.studentId, userId), eq(enrollment.courseId, paymentData.courseId)))

  if (existingEnrollment.length === 0) {
    await db.insert(enrollment).values({
      id: uuid(),
      studentId: userId,
      courseId: paymentData.courseId,
      status: 'active',
    })
  }

  revalidatePath('/student/dashboard')
  return order
}

// Get payment history
export async function getPaymentHistory() {
  const userId = await getUserId()
  return await db
    .select()
    .from(payment)
    .where(and(eq(payment.studentId, userId), eq(payment.status, 'completed')))
    .orderBy((() => payment.completedAt)())
}

// PayPal webhook handler (for manual webhook setup)
export async function handlePayPalWebhook(event: any) {
  if (event.event_type === 'CHECKOUT.ORDER.COMPLETED') {
    const orderId = event.resource.id
    
    // Update payment status
    const paymentRecords = await db
      .select()
      .from(payment)
      .where(eq(payment.paypalOrderId, orderId))
    
    if (paymentRecords.length > 0) {
      const paymentData = paymentRecords[0]
      
      await db.update(payment).set({
        status: 'completed',
        paypalTransactionId: event.resource.purchase_units[0].payments.captures[0]?.id,
        completedAt: new Date(),
        updatedAt: new Date(),
      }).where(eq(payment.id, paymentData.id))
      
      // Create enrollment
      const existingEnrollment = await db
        .select()
        .from(enrollment)
        .where(and(eq(enrollment.studentId, paymentData.studentId), eq(enrollment.courseId, paymentData.courseId)))
      
      if (existingEnrollment.length === 0) {
        await db.insert(enrollment).values({
          id: uuid(),
          studentId: paymentData.studentId,
          courseId: paymentData.courseId,
          status: 'active',
        })
      }
    }
  }
}
