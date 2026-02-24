"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { Mic, MicOff, Send, Volume2, VolumeX, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CharacterAvatar } from "@/components/characters/character-avatar";
import type { GameCharacter } from "@/lib/characters";
import { cn } from "@/lib/utils";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface CharacterChatProps {
  character: GameCharacter;
}

export function CharacterChat({ character }: CharacterChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "assistant", content: character.greeting },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [muted, setMuted] = useState(false);
  const [amplitude, setAmplitude] = useState(0);

  const recognitionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animFrameRef = useRef<number>(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Speak the greeting on mount
  useEffect(() => {
    if (!muted) {
      speakText(character.greeting);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      if (currentAudioRef.current) {
        currentAudioRef.current.pause();
        currentAudioRef.current = null;
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  const startAmplitudeTracking = useCallback(
    (source: MediaElementAudioSourceNode, analyser: AnalyserNode) => {
      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      const tick = () => {
        analyser.getByteFrequencyData(dataArray);
        // Compute average amplitude from voice frequency range (85-4000 Hz)
        // With fftSize 256 and 44100 sample rate, each bin ≈ 172Hz
        // So bins 0-23 cover roughly 0-4000Hz
        const voiceBins = dataArray.slice(0, 24);
        let sum = 0;
        for (let i = 0; i < voiceBins.length; i++) {
          sum += voiceBins[i];
        }
        const avg = sum / voiceBins.length / 255; // Normalize to 0-1
        setAmplitude(avg);
        animFrameRef.current = requestAnimationFrame(tick);
      };

      tick();
    },
    []
  );

  const speakText = useCallback(
    async (text: string) => {
      if (muted) return;

      setIsSpeaking(true);

      try {
        // Try ElevenLabs first
        const response = await fetch("/api/characters/speak", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            characterId: character.id,
            text,
          }),
        });

        const data = await response.json();

        if (data.audioBase64 && !data.useFallback) {
          // Play ElevenLabs audio through Web Audio API for amplitude analysis
          const audioData = atob(data.audioBase64);
          const arrayBuffer = new ArrayBuffer(audioData.length);
          const view = new Uint8Array(arrayBuffer);
          for (let i = 0; i < audioData.length; i++) {
            view[i] = audioData.charCodeAt(i);
          }

          // Create audio element from blob
          const blob = new Blob([arrayBuffer], {
            type: data.contentType || "audio/mpeg",
          });
          const audioUrl = URL.createObjectURL(blob);
          const audio = new Audio(audioUrl);
          currentAudioRef.current = audio;

          // Set up Web Audio API for amplitude analysis
          if (!audioContextRef.current) {
            audioContextRef.current = new AudioContext();
          }
          const ctx = audioContextRef.current;
          const source = ctx.createMediaElementSource(audio);
          const analyser = ctx.createAnalyser();
          analyser.fftSize = 256;
          analyser.smoothingTimeConstant = 0.8;
          analyserRef.current = analyser;

          source.connect(analyser);
          analyser.connect(ctx.destination);

          startAmplitudeTracking(source, analyser);

          audio.onended = () => {
            setIsSpeaking(false);
            setAmplitude(0);
            if (animFrameRef.current) {
              cancelAnimationFrame(animFrameRef.current);
            }
            URL.revokeObjectURL(audioUrl);
            currentAudioRef.current = null;
          };

          await audio.play();
          return;
        }
      } catch (e) {
        console.warn("ElevenLabs failed, using Web Speech fallback:", e);
      }

      // Web Speech API fallback
      if ("speechSynthesis" in window) {
        const utterance = new SpeechSynthesisUtterance(text);

        // Try to find a good voice
        const voices = speechSynthesis.getVoices();
        const preferredVoice = voices.find(
          (v) =>
            v.lang.startsWith("en") &&
            (character.voiceSettings.pitch && character.voiceSettings.pitch > 1
              ? v.name.includes("Male")
              : v.name.includes("Male"))
        );
        if (preferredVoice) utterance.voice = preferredVoice;

        utterance.pitch = character.voiceSettings.pitch || 1;
        utterance.rate = character.voiceSettings.rate || 1;

        // Simulate amplitude from boundary events
        let speakingInterval: NodeJS.Timeout;
        utterance.onstart = () => {
          speakingInterval = setInterval(() => {
            // Simulate amplitude with slight randomness
            setAmplitude(0.3 + Math.random() * 0.5);
          }, 80);
        };

        utterance.onend = () => {
          clearInterval(speakingInterval);
          setIsSpeaking(false);
          setAmplitude(0);
        };

        speechSynthesis.speak(utterance);
      } else {
        setIsSpeaking(false);
      }
    },
    [character, muted, startAmplitudeTracking]
  );

  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || isLoading) return;

      const userMessage: ChatMessage = { role: "user", content: text.trim() };
      setMessages((prev) => [...prev, userMessage]);
      setInput("");
      setIsLoading(true);

      try {
        const response = await fetch("/api/characters/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            characterId: character.id,
            message: text.trim(),
            history: messages.slice(-10), // Last 10 messages for context
          }),
        });

        const data = await response.json();

        if (data.message) {
          const assistantMessage: ChatMessage = {
            role: "assistant",
            content: data.message,
          };
          setMessages((prev) => [...prev, assistantMessage]);

          // Speak the response
          speakText(data.message);
        }
      } catch (error) {
        console.error("Chat error:", error);
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: "...*static*... Something went wrong. Try again.",
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    },
    [character.id, isLoading, messages, speakText]
  );

  const toggleListening = useCallback(() => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in your browser. Try Chrome.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event: any) => {
      let finalTranscript = "";
      let interimTranscript = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }

      if (finalTranscript) {
        setInput(finalTranscript);
        sendMessage(finalTranscript);
        setIsListening(false);
      } else {
        setInput(interimTranscript);
      }
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  }, [isListening, sendMessage]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const stopSpeaking = () => {
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current = null;
    }
    speechSynthesis?.cancel();
    setIsSpeaking(false);
    setAmplitude(0);
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-8rem)]">
      {/* Character Avatar Side */}
      <div className="flex flex-col items-center justify-center lg:w-1/3 py-8">
        <CharacterAvatar
          character={character}
          amplitude={amplitude}
          isSpeaking={isSpeaking}
        />
        <h2
          className="text-2xl font-bold mt-4"
          style={{ color: character.color }}
        >
          {character.name}
        </h2>
        <p className="text-sm text-muted-foreground">{character.game}</p>

        {/* Mute/unmute */}
        <Button
          variant="ghost"
          size="sm"
          className="mt-2"
          onClick={() => {
            if (isSpeaking) stopSpeaking();
            setMuted(!muted);
          }}
        >
          {muted ? (
            <VolumeX className="h-4 w-4 mr-1" />
          ) : (
            <Volume2 className="h-4 w-4 mr-1" />
          )}
          {muted ? "Unmute" : "Mute"}
        </Button>
      </div>

      {/* Chat Side */}
      <div className="flex-1 flex flex-col bg-card/50 rounded-xl border border-border overflow-hidden">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={cn(
                "flex gap-3 max-w-[85%]",
                msg.role === "user" ? "ml-auto flex-row-reverse" : ""
              )}
            >
              {msg.role === "assistant" && (
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-lg flex-shrink-0"
                  style={{ backgroundColor: character.color + "30" }}
                >
                  {character.avatarEmoji}
                </div>
              )}
              <div
                className={cn(
                  "rounded-2xl px-4 py-2.5 text-sm",
                  msg.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                )}
              >
                {msg.content}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-lg flex-shrink-0"
                style={{ backgroundColor: character.color + "30" }}
              >
                {character.avatarEmoji}
              </div>
              <div className="bg-muted rounded-2xl px-4 py-3">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" />
                  <span
                    className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  />
                  <span
                    className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input area */}
        <div className="border-t border-border p-4">
          {isListening && (
            <div className="flex items-center gap-2 mb-3 text-sm">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500" />
              </span>
              <span className="text-muted-foreground">
                Listening... speak now
              </span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex gap-2">
            {/* Mic button */}
            <Button
              type="button"
              variant={isListening ? "destructive" : "outline"}
              size="icon"
              onClick={toggleListening}
              disabled={isLoading}
              className="flex-shrink-0"
            >
              {isListening ? (
                <MicOff className="h-4 w-4" />
              ) : (
                <Mic className="h-4 w-4" />
              )}
            </Button>

            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={`Talk to ${character.name}...`}
              disabled={isLoading || isListening}
              className="flex-1"
            />

            <Button
              type="submit"
              size="icon"
              disabled={!input.trim() || isLoading}
              className="flex-shrink-0"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
