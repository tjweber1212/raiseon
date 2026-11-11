"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
const [successMessage, setSuccessMessage] = useState("");

async function handleSignup(
  e: React.FormEvent<HTMLFormElement>
) {
  e.preventDefault();

  setErrorMessage("");
  setSuccessMessage("");

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo:
        "https://raiseon-alpha.vercel.app/associations/new",

      data: {
        full_name: name,
      },
    },
  });

if (error) {
  if (error.message.includes("rate limit")) {
    setErrorMessage(
      "Too many verification emails have been sent. Please wait a few minutes and try again."
    );
  } else {
    setErrorMessage(error.message);
  }

  return;
}

  if (
    data.user &&
    data.user.identities &&
    data.user.identities.length === 0
  ) {
    setErrorMessage(
      "An account with this email already exists. Please log in instead."
    );
    return;
  }

  setSuccessMessage(
    "Account created! Check your email and click the verification link to continue."
  );

  setName("");
  setEmail("");
  setPassword("");
}


  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md rounded-xl border bg-white p-8 shadow-sm">
        <h1 className="mb-2 text-3xl font-bold">
          Create Your Account
        </h1>

        <p className="mb-6 text-gray-500">
          Create your RaiseOn account to get started.
        </p>
{errorMessage && (
  <div className="mb-4 rounded-lg bg-red-50 p-3 text-red-700">
    {errorMessage}
  </div>
)}

{successMessage && (
  <div className="mb-4 rounded-lg bg-green-50 p-3 text-green-700">
    {successMessage}
  </div>
)}
        <form onSubmit={handleSignup} className="space-y-4">


          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            type="text"
            placeholder="Your Name"
            className="w-full rounded-lg border p-3"
          />

          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="Email"
            className="w-full rounded-lg border p-3"
          />

          <input
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            type="password"
            placeholder="Password"
            className="w-full rounded-lg border p-3"
          />

          <button
            type="submit"
            className="w-full rounded-lg bg-black p-3 text-white"
          >
            Create Account
          </button>
        </form>
      </div>
    </main>
  );
}