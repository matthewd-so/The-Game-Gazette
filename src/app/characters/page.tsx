import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Mic } from "lucide-react";
import { CHARACTERS } from "@/lib/characters";
import { CharacterPreview } from "@/components/characters/character-preview";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Talk to Characters",
  description: "Chat with your favorite video game characters using voice. Powered by AI.",
};

export default function CharactersPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold mb-3">Talk to Game Characters</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Have a real conversation with iconic video game characters.
          They talk back with their own voice and personality.
        </p>
        <div className="flex items-center justify-center gap-4 mt-4">
          <Badge variant="outline" className="gap-1">
            <Mic className="h-3 w-3" /> Voice Input
          </Badge>
          <Badge variant="outline" className="gap-1">
            <MessageSquare className="h-3 w-3" /> AI Powered
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
        {CHARACTERS.map((char) => (
          <Link key={char.id} href={`/characters/${char.id}`}>
            <Card className="group overflow-hidden hover:border-primary/50 transition-all duration-300 h-full cursor-pointer">
              <CardContent className="p-0">
                {/* Character avatar header with SVG preview */}
                <div
                  className={`h-44 bg-gradient-to-br ${char.bgColor} flex items-center justify-center relative overflow-hidden`}
                >
                  <CharacterPreview characterId={char.id} />
                  {/* Hover glow */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-15 transition-opacity"
                    style={{ backgroundColor: char.color }}
                  />
                </div>

                <div className="p-4">
                  <h3 className="font-bold text-lg" style={{ color: char.color }}>
                    {char.name}
                  </h3>
                  <p className="text-xs text-muted-foreground mb-2">
                    {char.game}
                  </p>
                  <p className="text-sm italic text-muted-foreground mb-2">
                    &ldquo;{char.tagline}&rdquo;
                  </p>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {char.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
