import { NextRequest, NextResponse } from "next/server";
import { askClaude } from "@/lib/ai/client";
import { getCharacter } from "@/lib/characters";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { characterId, message, history } = body;

  if (!characterId || !message) {
    return NextResponse.json(
      { error: "characterId and message are required" },
      { status: 400 }
    );
  }

  const character = getCharacter(characterId);
  if (!character) {
    return NextResponse.json(
      { error: "Character not found" },
      { status: 404 }
    );
  }

  // Build conversation history for Claude
  const messages = [
    ...(history || []).map((msg: { role: string; content: string }) => ({
      role: msg.role as "user" | "assistant",
      content: msg.content,
    })),
    { role: "user" as const, content: message },
  ];

  try {
    const response = await askClaude(
      character.systemPrompt,
      messages.length === 1
        ? message
        : messages.map((m) => `${m.role === "user" ? "Human" : character.name}: ${m.content}`).join("\n\n") + `\n\n${character.name}:`,
      {
        model: "claude-sonnet-4-20250514",
        maxTokens: 300,
        temperature: 0.8,
      }
    );

    return NextResponse.json({
      message: response.content.trim(),
      character: character.name,
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
