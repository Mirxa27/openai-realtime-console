import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import paypal from '@paypal/paypal-server-sdk'
import { redirect } from 'next/navigation'

const client = new paypal.Client({
  clientId: process.env.PAYPAL_CLIENT_ID!,
  clientSecret: process.env.PAYPAL_CLIENT_SECRET!,
  environment: process.env.PAYPAL_MODE === 'live' 
    ? paypal.Environment.Production 
    : paypal.Environment.Sandbox,
})

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const subscriptionId = searchParams.get('subscription_id')
  const baToken = searchParams.get('ba_token')
  const token = searchParams.get('token')

  if (!subscriptionId) {
    return redirect('/pricing?error=invalid_subscription')
  }

  const supabase = await createServiceClient()

  try {
    // Get subscription details from PayPal
    const subscriptionsController = new paypal.SubscriptionsController(client)
    const response = await subscriptionsController.subscriptionsGet({
      subscriptionId,
    })

    if (response.result && response.result.status === 'ACTIVE') {
      const subscription = response.result

      // Update subscription in database
      const { data: dbSubscription } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('paypal_subscription_id', subscriptionId)
        .single()

      if (dbSubscription) {
        // Update subscription status
        await supabase
          .from('subscriptions')
          .update({
            status: 'active',
            current_period_start: subscription.startTime,
            current_period_end: subscription.billingInfo?.nextBillingTime,
          })
          .eq('id', dbSubscription.id)

        // Update user's subscription tier and minutes
        const minutesMap = {
          growth: 100,
          transformation: 1000,
        }

        await supabase
          .from('users')
          .update({
            subscription_tier: dbSubscription.tier,
            subscription_expires_at: subscription.billingInfo?.nextBillingTime,
            minutes_remaining: minutesMap[dbSubscription.tier],
          })
          .eq('id', dbSubscription.user_id)

        // Award crystals for subscription
        const crystalRewards = {
          growth: 100,
          transformation: 500,
        }

        await supabase.from('crystal_transactions').insert({
          user_id: dbSubscription.user_id,
          amount: crystalRewards[dbSubscription.tier],
          type: 'bonus',
          description: `${dbSubscription.tier} subscription bonus`,
          reference_id: dbSubscription.id,
          reference_type: 'subscription',
        })

        // Update user crystals
        const { data: user } = await supabase
          .from('users')
          .select('crystals')
          .eq('id', dbSubscription.user_id)
          .single()

        if (user) {
          await supabase
            .from('users')
            .update({
              crystals: user.crystals + crystalRewards[dbSubscription.tier],
            })
            .eq('id', dbSubscription.user_id)
        }
      }

      return redirect('/chat?subscription=success')
    } else {
      return redirect('/pricing?error=subscription_not_active')
    }
  } catch (error) {
    console.error('PayPal success handler error:', error)
    return redirect('/pricing?error=processing_failed')
  }
}