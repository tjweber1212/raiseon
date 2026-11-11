export default function CheckEmailPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="max-w-md rounded-xl border bg-white p-8 text-center">
        <h1 className="text-3xl font-bold">
          Check Your Email
        </h1>

        <p className="mt-4 text-gray-600">
          We've sent you a verification email.
        </p>

        <p className="mt-2 text-gray-600">
          Click the verification link to activate your
          account and create your organization.
        </p>
      </div>
    </main>
  );
}