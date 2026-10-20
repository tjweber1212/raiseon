"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function UpdatePasswordPage() {
  const router = useRouter();
  const supabase = createClient();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  async function handleUpdatePassword(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    if (!password || !confirmPassword) {
      alert("Enter your new password twice.");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    setIsUpdating(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password,
      });

      if (error) {
        alert(error.message);
        return;
      }

      alert("Password updated successfully!");

      router.push("/login");
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Unable to update password.");
    } finally {
      setIsUpdating(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-md rounded-xl border bg-white p-8 shadow-sm">
        <h1 className="mb-2 text-3xl font-bold">
          Choose New Password
        </h1>

        <p className="mb-6 text-gray-500">
          Enter your new password below.
        </p>

        <form
          onSubmit={handleUpdatePassword}
          className="space-y-4"
        >
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="New Password"
            className="w-full rounded-lg border p-3"
          />

          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm New Password"
            className="w-full rounded-lg border p-3"
          />

          <button
            type="submit"
            disabled={isUpdating}
            className="w-full rounded-lg bg-black p-3 text-white disabled:bg-gray-400"
          >
            {isUpdating ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>
    </main>
  );
}
