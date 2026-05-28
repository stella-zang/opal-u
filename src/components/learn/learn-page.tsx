"use client";

import { useChat } from "@ai-sdk/react";
import { type UIMessage, type TextUIPart, DefaultChatTransport } from "ai";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";

const MAX_USER_TURNS = 5;

function getMessageText(message: UIMessage): string {
  return message.parts
    .filter((p): p is TextUIPart => p.type === "text")
    .map((p) => p.text)
    .join("");
}

export function LearnPage() {
  const [topic, setTopic] = useState("");
  const [started, setStarted] = useState(false);
  const [reply, setReply] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({ api: "/api/learn" }),
  });

  const userMessages = messages.filter((m) => m.role === "user");
  const turnCount = userMessages.length;
  const sessionComplete = turnCount >= MAX_USER_TURNS;
  const isStreaming = status === "submitted" || status === "streaming";

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isStreaming]);

  const handleTopicSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim() || isStreaming) return;
    sendMessage({ parts: [{ type: "text", text: topic.trim() }] });
    setStarted(true);
  };

  const handleReplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reply.trim() || isStreaming || sessionComplete) return;
    sendMessage({ parts: [{ type: "text", text: reply.trim() }] });
    setReply("");
  };

  if (!started) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 px-4">
        <div className="w-full max-w-lg space-y-8">
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-semibold tracking-tight text-zinc-900">
              What do you want to explore?
            </h1>
            <p className="text-sm text-zinc-500">
              Enter a topic. A Socratic tutor will guide you to insight through
              questions.
            </p>
          </div>
          <form onSubmit={handleTopicSubmit} className="flex gap-2">
            <input
              autoFocus
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. quantum entanglement, compound interest, natural selection"
              className="flex-1 rounded-lg border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none focus:ring-2 focus:ring-zinc-900"
            />
            <Button type="submit" disabled={!topic.trim()} size="lg">
              Start →
            </Button>
          </form>
          <p className="text-center text-xs text-zinc-400">
            5 guided questions · no lectures · just thinking
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-zinc-50">
      {/* Header */}
      <div className="border-b border-zinc-200 bg-white px-6 py-4">
        <div className="mx-auto flex max-w-2xl items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-wide text-zinc-400">
              Exploring
            </p>
            <h1 className="text-sm font-medium text-zinc-900">{topic}</h1>
          </div>
          {sessionComplete ? (
            <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs text-zinc-500">
              Session complete
            </span>
          ) : (
            <span className="text-xs text-zinc-400">
              Turn {Math.min(turnCount + 1, MAX_USER_TURNS)} of {MAX_USER_TURNS}
            </span>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div className="mx-auto max-w-2xl space-y-4">
          {messages.map((message) => {
            const text = getMessageText(message);
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

          {isStreaming && (
            <div className="flex justify-start">
              <div className="rounded-2xl border border-zinc-200 bg-white px-4 py-3 shadow-sm">
                <div className="flex space-x-1">
                  <div className="h-2 w-2 animate-bounce rounded-full bg-zinc-300" />
                  <div className="h-2 w-2 animate-bounce rounded-full bg-zinc-300 [animation-delay:0.1s]" />
                  <div className="h-2 w-2 animate-bounce rounded-full bg-zinc-300 [animation-delay:0.2s]" />
                </div>
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>
      </div>

      {/* Input bar */}
      <div className="border-t border-zinc-200 bg-white px-6 py-4">
        <div className="mx-auto max-w-2xl space-y-3">
          {sessionComplete ? (
            <p className="text-center text-sm text-zinc-500">
              Session complete.{" "}
              <button
                className="text-zinc-900 underline underline-offset-2"
                onClick={() => window.location.reload()}
              >
                Start a new one
              </button>
            </p>
          ) : (
            <form onSubmit={handleReplySubmit} className="flex gap-2">
              <input
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                disabled={isStreaming || sessionComplete}
                placeholder="Your response..."
                className="flex-1 rounded-lg border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none focus:ring-2 focus:ring-zinc-900 disabled:bg-zinc-50 disabled:text-zinc-400"
              />
              <Button
                type="submit"
                disabled={isStreaming || !reply.trim() || sessionComplete}
                size="lg"
              >
                →
              </Button>
            </form>
          )}

          <div className="flex justify-center">
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                alert("Session saving coming in the next release (OPA-5)")
              }
            >
              Save this session
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
