"use client";

import { CharacterAvatar } from "@/components/characters/character-avatar";
import { getCharacter } from "@/lib/characters";

interface CharacterPreviewProps {
  characterId: string;
}

export function CharacterPreview({ characterId }: CharacterPreviewProps) {
  const character = getCharacter(characterId);
  if (!character) return null;

  return (
    <div className="scale-50 group-hover:scale-[0.55] transition-transform duration-300">
      <CharacterAvatar
        character={character}
        amplitude={0}
        isSpeaking={false}
      />
    </div>
  );
}
