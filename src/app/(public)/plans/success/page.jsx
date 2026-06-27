import { stripe } from '@/lib/stripe';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { CircleCheck, Envelope, ArrowRight, ShieldCheck } from '@gravity-ui/icons';
import { createSubscription } from '@/lib/actions/subscriptions';

export default async function Success({ searchParams }) {
  const { session_id } = await searchParams;

  if (!session_id) {
    throw new Error('Please provide a valid session_id (`cs_test_...`)');
  }

  const {
    status,
    customer_details: { email: customerEmail },
  } = await stripe.checkout.sessions.retrieve(session_id, {
    expand: ['line_items', 'payment_intent']
  });

  if (status === 'open') {
    return redirect('/');
  }

  if (status === 'complete') {
    let subscriptionError = null;

    try {
      await createSubscription({
        sessionId: session_id
      });
    } catch (error) {
      subscriptionError = error;
    }

    return (
      <div className="min-h-screen bg-[#09090b] text-white flex flex-col items-center justify-center p-6">
        {/* Decorative ambient background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-72 h-72 bg-[#c084fc]/10 rounded-full blur-[120px] pointer-events-none" />

        <section
          id="success"
          className="max-w-md w-full bg-[#121214] border border-[#1d1d20] rounded-2xl p-8 text-center shadow-2xl relative z-10"
        >
          {/* Animated/Glowing Success Icon Badge */}
          <div className="p-4 rounded-full bg-[#16241c] border border-[#1e4527] text-emerald-400 mb-6 inline-block shadow-lg relative animate-pulse">
            <CircleCheck size={40} />
            <span className="absolute -bottom-1 -right-1 bg-[#c084fc] p-1 rounded-full border-2 border-[#121214] text-white">
              <ShieldCheck size={12} />
            </span>
          </div>

          {/* Heading Matrix */}
          <h1 className="text-2xl font-black tracking-tight text-zinc-100 mb-2">
            Payment Successful!
          </h1>
          <p className="text-[#c084fc] text-xs font-semibold uppercase tracking-wider mb-6">
            Workspace Access Activated
          </p>

          {/* Core Status Block Box */}
          <div className="bg-[#18181b] border border-[#27272a] rounded-xl p-4 text-left space-y-3 mb-8">
            <div className="flex items-start gap-3">
              <Envelope size={16} className="text-zinc-500 shrink-0 mt-0.5" />
              <p className="text-zinc-400 text-xs leading-relaxed">
                We appreciate your business! A confirmation and invoice summary has been transmitted securely to{" "}
                <span className="text-zinc-200 font-semibold break-all">{customerEmail}</span>.
              </p>
            </div>
            {subscriptionError ? (
              <p className="text-amber-400 text-xs leading-relaxed">
                Your payment was successful, and your subscription is being verified in the background. If access does not appear shortly, please contact support.
              </p>
            ) : null}
          </div>

          {/* Contextual Action Redirect and Support Interface */}
          <div className="space-y-4">
            <Link
              href="/prompts"
              className="inline-flex w-full items-center justify-center gap-2 bg-white hover:bg-zinc-200 text-black font-bold py-3 px-4 rounded-xl transition-all shadow-md text-xs"
            >
              Go to Dashboard
              <ArrowRight size={14} />
            </Link>

            <p className="text-zinc-500 text-[11px] leading-relaxed">
              Encountering provisioning delays? Contact support at{" "}
              <a
                href="mailto:support@example.com"
                className="text-zinc-400 hover:text-[#c084fc] transition-colors underline decoration-zinc-700 underline-offset-2"
              >
                support@example.com
              </a>
            </p>
          </div>
        </section>
      </div>
    );
  }
}