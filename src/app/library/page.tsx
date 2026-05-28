import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function LibraryPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: sessions } = await supabase
    .from("sessions")
    .select("id, topic, created_at")
    .order("created_at", { ascending: false });

  return (
    <div className="min-h-screen bg-zinc-50 px-6 py-12">
      <div className="mx-auto max-w-2xl space-y-8">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
            Your library
          </h1>
          <p className="text-sm text-zinc-500">Saved learning sessions</p>
        </div>

        {!sessions || sessions.length === 0 ? (
          <div className="rounded-xl border border-zinc-200 bg-white px-6 py-12 text-center">
            <p className="text-sm text-zinc-500">No sessions saved yet.</p>
            <Link
              href="/learn"
              className="mt-4 inline-block text-sm font-medium text-zinc-900 underline underline-offset-2"
            >
              Start a session →
            </Link>
          </div>
        ) : (
          <ul className="space-y-3">
            {sessions.map((session) => (
              <li key={session.id}>
                <Link
                  href={`/learn/${session.id}`}
                  className="flex items-center justify-between rounded-xl border border-zinc-200 bg-white px-5 py-4 transition-colors hover:border-zinc-300 hover:bg-zinc-50"
                >
                  <span className="font-medium text-zinc-900">
                    {session.topic}
                  </span>
                  <span className="text-xs text-zinc-400">
                    {new Date(session.created_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}

        <div className="pt-2">
          <Link
            href="/learn"
            className="text-sm text-zinc-500 underline underline-offset-2 hover:text-zinc-900"
          >
            ← Start a new session
          </Link>
        </div>
      </div>
    </div>
  );
}
