import { streamText, gateway, convertToModelMessages, type UIMessage } from "ai";
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

const SYSTEM_PROMPT = `You are a Socratic tutor. Guide learners to insight through questions only — never lecture, explain, or define.

When given a topic:
- Ask one focused question that reveals what the learner already knows
- Each response: one question only, 1-2 sentences maximum
- Build each question on exactly what the learner just said
- After 5 exchanges, write a 3-4 sentence synthesis of what the learner discovered through their own reasoning

Never provide answers or explanations before the synthesis.`;

const MAX_TOKENS = 300;
const MAX_MESSAGES = 12;

export async function POST(req: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const messages: UIMessage[] = body.messages ?? [];

  if (messages.length > MAX_MESSAGES) {
    return NextResponse.json({ error: "Session limit reached" }, { status: 400 });
  }

  const result = streamText({
    model: gateway("anthropic/claude-haiku-4.5"),
    system: SYSTEM_PROMPT,
    messages: await convertToModelMessages(messages),
    maxOutputTokens: MAX_TOKENS,
    providerOptions: {
      gateway: {
        tags: ["feature:learn"],
      },
    },
  });

  return result.toUIMessageStreamResponse();
}
