"use client";

import { useState, use } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";

export function LoginForm({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; message?: string }>;
}) {
  const params = use(searchParams);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "sent" | "error">(
    "idle",
  );
  const [errorMsg, setErrorMsg] = useState(params.error ?? "");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setErrorMsg(error.message);
      setStatus("error");
    } else {
      setStatus("sent");
    }
  }

  if (status === "sent") {
    return (
      <div className="rounded-lg border border-zinc-200 bg-white p-6 text-center shadow-sm">
        <p className="text-sm font-medium text-zinc-900">Check your inbox</p>
        <p className="mt-1 text-sm text-zinc-500">
          We sent a magic link to <span className="font-medium">{email}</span>.
          Click it to sign in.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm space-y-4"
    >
      <div className="space-y-1">
        <label
          htmlFor="email"
          className="block text-sm font-medium text-zinc-700"
        >
          Email address
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
        />
      </div>

      {errorMsg && (
        <p className="text-sm text-red-600">
          {errorMsg === "auth_callback_failed"
            ? "Sign-in link expired or invalid. Try again."
            : errorMsg}
        </p>
      )}

      <Button
        type="submit"
        disabled={status === "loading"}
        className="w-full"
      >
        {status === "loading" ? "Sending…" : "Send magic link"}
      </Button>
    </form>
  );
}
