"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function SignupPage() {
  const [associationName, setAssociationName] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSignup(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      alert(error.message);
      return;
    }

    alert("Account created! Check your email.");

    console.log(data);
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md rounded-xl border bg-white p-8 shadow-sm">
        <h1 className="mb-2 text-3xl font-bold">
          Create Your Account
        </h1>

        <p className="mb-6 text-gray-500">
          Start your association's fundraiser today.
        </p>

        <form onSubmit={handleSignup} className="space-y-4">
          <input
            value={associationName}
            onChange={(e) =>
              setAssociationName(e.target.value)
            }
            type="text"
            placeholder="Association Name"
            className="w-full rounded-lg border p-3"
          />

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