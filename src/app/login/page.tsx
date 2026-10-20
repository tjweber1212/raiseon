"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
const router = useRouter();
const supabase = createClient();

const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [isSigningIn, setIsSigningIn] = useState(false);
async function handleSignIn(
  e: React.FormEvent<HTMLFormElement>
) {
  e.preventDefault();

  if (!email || !password) {
    alert("Email and password are required.");
    return;
  }

  setIsSigningIn(true);

  try {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert(error.message);
      return;
    }

    router.push("/dashboard/campaigns");
    router.refresh();
  } catch (error) {
    console.error(error);
    alert("Unable to sign in.");
  } finally {
    setIsSigningIn(false);
  }
}
async function handleForgotPassword() {
  if (!email) {
    alert("Enter your email address first.");
    return;
  }

  const { error } = await supabase.auth.resetPasswordForEmail(
    email,
    {
      redirectTo: `${window.location.origin}/update-password`,
    }
  );

  if (error) {
    alert(error.message);
    return;
  }

  alert("Password reset email sent! Check your inbox.");
}
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md rounded-xl border bg-white p-8 shadow-sm">
        <h1 className="mb-2 text-3xl font-bold">
          Welcome Back
        </h1>

        <p className="mb-6 text-gray-500">
          Sign in to manage your fundraiser.
        </p>

        <form onSubmit={handleSignIn} className="space-y-4">
<input
  type="email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  placeholder="Email"
  className="w-full rounded-lg border p-3"
/>

<input
  type="password"
  value={password}
  onChange={(e) => setPassword(e.target.value)}
  placeholder="Password"
  className="w-full rounded-lg border p-3"
/>
<button
  type="button"
  onClick={handleForgotPassword}
  className="text-sm font-medium text-blue-600 hover:underline"
>
  Forgot password?
</button>

<button
  type="submit"
  disabled={isSigningIn}
  className="w-full rounded-lg bg-black p-3 text-white disabled:bg-gray-400"
>
  {isSigningIn ? "Signing In..." : "Sign In"}
</button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Don't have an account? Sign up
        </p>
      </div>
    </main>
  );
}