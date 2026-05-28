import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { SignOutButton } from "@/components/auth/sign-out-button";

export default async function AppPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 px-4">
      <div className="w-full max-w-sm space-y-6 text-center">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
            Welcome to Opal U
          </h1>
          <p className="text-sm text-zinc-500">{user.email}</p>
        </div>
        <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm space-y-3 text-left">
          <p className="text-xs font-medium uppercase tracking-wide text-zinc-400">
            Session
          </p>
          <p className="text-sm text-zinc-700">
            <span className="font-medium">User ID:</span>{" "}
            <span className="font-mono text-xs">{user.id}</span>
          </p>
          <p className="text-sm text-zinc-700">
            <span className="font-medium">Last sign-in:</span>{" "}
            {user.last_sign_in_at
              ? new Date(user.last_sign_in_at).toLocaleString()
              : "—"}
          </p>
        </div>
        <SignOutButton />
      </div>
    </div>
  );
}
