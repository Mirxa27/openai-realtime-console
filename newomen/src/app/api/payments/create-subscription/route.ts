import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import paypal from '@paypal/paypal-server-sdk'

// Initialize PayPal client
const client = new paypal.Client({
  clientId: process.env.PAYPAL_CLIENT_ID!,
  clientSecret: process.env.PAYPAL_CLIENT_SECRET!,
  environment: process.env.PAYPAL_MODE === 'live' 
    ? paypal.Environment.Production 
    : paypal.Environment.Sandbox,
})

const PLAN_IDS = {
  growth: process.env.PAYPAL_GROWTH_PLAN_ID || 'P-GROWTH',
  transformation: process.env.PAYPAL_TRANSFORMATION_PLAN_ID || 'P-TRANSFORM',
}

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  
  // Check if user is authenticated
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { tier } = await request.json()

  if (!['growth', 'transformation'].includes(tier)) {
    return NextResponse.json({ error: 'Invalid tier' }, { status: 400 })
  }

  try {
    // Create subscription request
    const subscriptionRequest = {
      planId: PLAN_IDS[tier],
      subscriberRequest: {
        emailAddress: user.email,
      },
      applicationContext: {
        brandName: 'Newomen',
        locale: 'en-US',
        shippingPreference: 'NO_SHIPPING',
        userAction: 'SUBSCRIBE_NOW',
        paymentMethod: {
          payerSelected: 'PAYPAL',
          payeePreferred: 'IMMEDIATE_PAYMENT_REQUIRED',
        },
        returnUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/api/payments/success`,
        cancelUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/pricing`,
      },
    }

    // Create subscription
    const subscriptionsController = new paypal.SubscriptionsController(client)
    const response = await subscriptionsController.subscriptionsCreate({
      body: subscriptionRequest,
    })

    if (response.result) {
      // Save subscription info to database
      await supabase.from('subscriptions').insert({
        user_id: user.id,
        tier,
        paypal_subscription_id: response.result.id,
        paypal_plan_id: PLAN_IDS[tier],
        status: 'pending',
      })

      // Find approval link
      const approvalLink = response.result.links?.find(
        (link) => link.rel === 'approve'
      )

      return NextResponse.json({
        subscriptionId: response.result.id,
        approvalUrl: approvalLink?.href,
      })
    } else {
      throw new Error('Failed to create subscription')
    }
  } catch (error) {
    console.error('PayPal subscription error:', error)
    return NextResponse.json(
      { error: 'Failed to create subscription' },
      { status: 500 }
    )
  }
}