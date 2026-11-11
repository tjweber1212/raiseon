import Link from "next/link";
export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <nav className="flex items-center justify-between border-b px-8 py-4">
        <h1 className="text-2xl font-bold">RaiseOn</h1>

<div className="flex gap-4">
  <Link
    href="/login"
    className="rounded-lg px-4 py-2 hover:bg-gray-100"
  >
    Login
  </Link>

<Link
  href="/signup"
  className="rounded-lg bg-black px-4 py-2 text-white"
>
  Get Started
</Link>
        </div>
      </nav>

      <section className="mx-auto max-w-6xl px-6 py-24 text-center">
        <h1 className="text-6xl font-bold tracking-tight">
          Raise More. Do Less.
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-xl text-gray-600">
          A modern fundraising platform that helps organizations raise more money with
          personalized text message campaigns, online ordering, and
          real-time sales tracking.
        </p>

        <div className="mt-10 flex justify-center gap-4">
<Link
  href="/signup"
  className="rounded-lg bg-black px-8 py-4 text-white"
>
  Start Fundraising
</Link>

<Link
  href="/login"
  className="rounded-lg border px-8 py-4"
>
  Login
</Link>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-xl border p-6">
            <div className="mb-3 text-3xl">📱</div>
            <h3 className="text-xl font-semibold">
              Launch Campaigns
            </h3>
            <p className="mt-2 text-gray-600">
              Create and manage fundraisers from one centralized platform.
            </p>
          </div>

          <div className="rounded-xl border p-6">
            <div className="mb-3 text-3xl">🍕</div>
            <h3 className="text-xl font-semibold">
              Activate Supporters
            </h3>
            <p className="mt-2 text-gray-600">
              Import rosters, invite supporters, and get everyone engaged quickly.
            </p>
          </div>

          <div className="rounded-xl border p-6">
            <div className="mb-3 text-3xl">🏆</div>
            <h3 className="text-xl font-semibold">
              Track Results
            </h3>
            <p className="mt-2 text-gray-600">
              Monitor participation, fundraising progress, and results in real time.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
