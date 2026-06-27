import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { stripe } from '@/lib/stripe';
import { getUserSession } from '@/lib/core/session';




export async function POST() {
  try {
    const headersList = await headers()
    const origin = headersList.get('origin')
    const DOMAIN = process.env.BETTER_AUTH_URL;

    const user = await getUserSession();


    // Create Checkout Sessions from body params.
    const session = await stripe.checkout.sessions.create({
      customer_email: user?.email,
      line_items: [
        {
          // Provide the exact Price ID (for example, price_1234) of the product you want to sell
          price: process.env.STRIPE_PREMIUM_PRICE_ID,
          quantity: 1,
        },  
      ],
      mode: 'payment',
      success_url: `${origin}/plans/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${DOMAIN}/plans`,

      metadata: {
        userId: user.id,
        plan: "premium",
      },
    });
    return NextResponse.redirect(session.url, 303)
  } catch (err) {
    return NextResponse.json(
      { error: err.message },
      { status: err.statusCode || 500 }
    )
  }
}

