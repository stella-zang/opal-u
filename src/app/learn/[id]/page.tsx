import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

interface Message {
  id: string;
  role: "user" | "assistant";
  parts: { type: string; text: string }[];
}

export default async function SessionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: session } = await supabase
    .from("sessions")
    .select("id, topic, transcript, created_at")
    .eq("id", id)
    .single();

  if (!session) notFound();

  const messages: Message[] = Array.isArray(session.transcript)
    ? (session.transcript as Message[])
    : [];

  return (
    <div className="flex min-h-screen flex-col bg-zinc-50">
      {/* Header */}
      <div className="border-b border-zinc-200 bg-white px-6 py-4">
        <div className="mx-auto flex max-w-2xl items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-wide text-zinc-400">
              Saved session
            </p>
            <h1 className="text-sm font-medium text-zinc-900">
              {session.topic}
            </h1>
          </div>
          <span className="text-xs text-zinc-400">
            {new Date(session.created_at).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
        </div>
      </div>

      {/* Transcript */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div className="mx-auto max-w-2xl space-y-4">
          {messages.map((message) => {
            const text = message.parts
              .filter((p) => p.type === "text")
              .map((p) => p.text)
              .join("");
            if (!text) return null;
            const isUser = message.role === "user";
            return (
              <div
                key={message.id}
                className={`flex ${isUser ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    isUser
                      ? "bg-zinc-900 text-white"
                      : "border border-zinc-200 bg-white text-zinc-800 shadow-sm"
                  }`}
                >
                  {text}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-zinc-200 bg-white px-6 py-4">
        <div className="mx-auto flex max-w-2xl items-center justify-between">
          <Link
            href="/library"
            className="text-sm text-zinc-500 underline underline-offset-2 hover:text-zinc-900"
          >
            ← Back to library
          </Link>
          <Link
            href="/learn"
            className="text-sm font-medium text-zinc-900 underline underline-offset-2"
          >
            Start a new session →
          </Link>
        </div>
      </div>
    </div>
  );
}
