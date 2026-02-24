const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
const ELEVENLABS_BASE_URL = "https://api.elevenlabs.io/v1";

export interface TTSResponse {
  audioBase64: string;
  contentType: string;
}

export async function generateSpeech(
  text: string,
  voiceId: string,
  voiceSettings: {
    stability: number;
    similarity_boost: number;
    speed: number;
  }
): Promise<TTSResponse> {
  if (!ELEVENLABS_API_KEY) {
    throw new Error("ELEVENLABS_API_KEY not configured");
  }

  const response = await fetch(
    `${ELEVENLABS_BASE_URL}/text-to-speech/${voiceId}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "xi-api-key": ELEVENLABS_API_KEY,
      },
      body: JSON.stringify({
        text,
        model_id: "eleven_turbo_v2_5",
        voice_settings: {
          stability: voiceSettings.stability,
          similarity_boost: voiceSettings.similarity_boost,
          speed: voiceSettings.speed,
        },
      }),
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`ElevenLabs API error: ${response.status} - ${error}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  const base64 = Buffer.from(arrayBuffer).toString("base64");

  return {
    audioBase64: base64,
    contentType: response.headers.get("content-type") || "audio/mpeg",
  };
}

export function isElevenLabsConfigured(): boolean {
  return !!ELEVENLABS_API_KEY;
}
