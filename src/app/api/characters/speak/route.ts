import { NextRequest, NextResponse } from "next/server";
import { generateSpeech, isElevenLabsConfigured } from "@/lib/elevenlabs";
import { getCharacter } from "@/lib/characters";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { characterId, text } = body;

  if (!characterId || !text) {
    return NextResponse.json(
      { error: "characterId and text are required" },
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

  if (!isElevenLabsConfigured()) {
    // Return a flag telling the client to use Web Speech API fallback
    return NextResponse.json({ useFallback: true });
  }

  try {
    const result = await generateSpeech(text, character.voiceId, {
      stability: character.voiceSettings.stability,
      similarity_boost: character.voiceSettings.similarity_boost,
      speed: character.voiceSettings.speed,
    });

    return NextResponse.json({
      audioBase64: result.audioBase64,
      contentType: result.contentType,
    });
  } catch (error) {
    console.error("TTS error:", error);
    // Fall back to Web Speech API on client
    return NextResponse.json({ useFallback: true });
  }
}
