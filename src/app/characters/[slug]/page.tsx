import { notFound } from "next/navigation";
import { getCharacter, CHARACTERS } from "@/lib/characters";
import { CharacterChat } from "@/components/characters/character-chat";
import type { Metadata } from "next";

interface CharacterChatPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: CharacterChatPageProps): Promise<Metadata> {
  const { slug } = await params;
  const character = getCharacter(slug);
  if (!character) return { title: "Character Not Found" };

  return {
    title: `Talk to ${character.name}`,
    description: `Chat with ${character.name} from ${character.game}. ${character.description}`,
  };
}

export default async function CharacterChatPage({
  params,
}: CharacterChatPageProps) {
  const { slug } = await params;
  const character = getCharacter(slug);

  if (!character) notFound();

  return (
    <div className="container mx-auto px-4 py-4">
      <CharacterChat character={character} />
    </div>
  );
}
