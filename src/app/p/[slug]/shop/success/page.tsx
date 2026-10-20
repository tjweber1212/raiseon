
import { stripe } from "@/lib/stripe";

export default async function SuccessPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { slug } = await params;
  const { session_id } = await searchParams;
  const session = session_id
  ? await stripe.checkout.sessions.retrieve(session_id)
  : null;
  const totalPaid = session?.amount_total
  ? session.amount_total / 100
  : null;
  const lineItems = session_id
  ? await stripe.checkout.sessions.listLineItems(session_id)
  : null;
  return (
    <main className="mx-auto max-w-xl px-6 py-16">
      <div className="rounded-2xl border bg-white p-8 text-center shadow-sm">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-3xl text-green-700">
          ✓
        </div>

        <h1 className="mt-6 text-3xl font-bold">
          Thank You!
        </h1>

        <p className="mt-3 text-lg text-gray-700">
          Your payment was successful.
        </p>

        <p className="mt-2 text-gray-600">
          Thank you for supporting this fundraiser!
        </p>
       {lineItems && (
  <div className="mt-6 border-t pt-6 text-left">
    <h2 className="mb-3 font-semibold">Your Order</h2>

    {lineItems.data.map((item) => (
      <div
        key={item.id}
        className="flex justify-between py-2 text-gray-700"
      >
        <span>
          {item.description} × {item.quantity}
        </span>

        <span>
          ${(item.amount_total / 100).toFixed(2)}
        </span>
      </div>
    ))}
  </div>
)} 
        {totalPaid !== null && (
  <p className="mt-6 text-xl font-semibold">
    Total Paid: ${totalPaid.toFixed(2)}
  </p>
)}
        <div className="mt-8 rounded-xl bg-gray-50 p-4 text-sm text-gray-600">
          Your order has been received and your payment has been confirmed.
        </div>

      </div>
    </main>
  );
}