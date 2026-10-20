export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <nav className="flex items-center justify-between border-b px-8 py-4">
        <h1 className="text-2xl font-bold">FundraiserPro</h1>

        <div className="flex gap-4">
          <button className="rounded-lg px-4 py-2 hover:bg-gray-100">
            Login
          </button>

          <button className="rounded-lg bg-black px-4 py-2 text-white">
            Get Started
          </button>
        </div>
      </nav>

      <section className="mx-auto max-w-6xl px-6 py-24 text-center">
        <h1 className="text-6xl font-bold tracking-tight">
          Fundraising Made Simple
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-xl text-gray-600">
          Help sports teams and associations raise more money with
          personalized text message campaigns, online ordering, and
          real-time sales tracking.
        </p>

        <div className="mt-10 flex justify-center gap-4">
          <button className="rounded-lg bg-black px-8 py-4 text-white">
            Start Fundraising
          </button>

          <button className="rounded-lg border px-8 py-4">
            See Demo
          </button>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-xl border p-6">
            <div className="mb-3 text-3xl">📱</div>
            <h3 className="text-xl font-semibold">
              Players Add Contacts
            </h3>
            <p className="mt-2 text-gray-600">
              Players quickly enter supporter phone numbers.
            </p>
          </div>

          <div className="rounded-xl border p-6">
            <div className="mb-3 text-3xl">🍕</div>
            <h3 className="text-xl font-semibold">
              Customers Order Online
            </h3>
            <p className="mt-2 text-gray-600">
              Supporters receive a link and order in seconds.
            </p>
          </div>

          <div className="rounded-xl border p-6">
            <div className="mb-3 text-3xl">🏆</div>
            <h3 className="text-xl font-semibold">
              Track Sales
            </h3>
            <p className="mt-2 text-gray-600">
              Teams see live leaderboards and fundraising totals.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
