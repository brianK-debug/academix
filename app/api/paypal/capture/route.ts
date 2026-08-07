import { NextRequest, NextResponse } from 'next/server'
import { capturePayPalPayment } from '@/app/actions/payments'

export async function POST(request: NextRequest) {
  try {
    const { orderId } = await request.json()

    if (!orderId) {
      return NextResponse.json(
        { error: 'Order ID is required' },
        { status: 400 }
      )
    }

    const result = await capturePayPalPayment(orderId)

    return NextResponse.json({
      success: true,
      order: result,
    })
  } catch (error) {
    console.error('PayPal capture error:', error)
    return NextResponse.json(
      { error: 'Failed to process payment' },
      { status: 500 }
    )
  }
}
