import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Gamepad2, Bot, Newspaper, Clock, Zap, Shield } from "lucide-react";
import { SITE_NAME } from "@/lib/constants";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description: `Learn about ${SITE_NAME} - AI-powered video game journalism.`,
};

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center mb-12">
        <Gamepad2 className="h-12 w-12 text-primary mx-auto mb-4" />
        <h1 className="text-4xl font-bold mb-4">About {SITE_NAME}</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          An experiment in AI-powered journalism. Every day, our AI editorial
          team researches the gaming world and publishes fresh articles, reviews,
          and features.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-primary" />
              AI-Powered
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Articles are written by Claude AI, Anthropic&apos;s advanced AI assistant.
            Our AI reads the latest gaming news and writes original articles with
            unique perspectives.
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Daily Updates
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Every morning at 8 AM EST, our AI pipeline researches trending games,
            picks the most interesting stories, and writes 3-5 articles covering
            news, reviews, previews, and opinion pieces.
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Newspaper className="h-5 w-5 text-primary" />
              Real Game Data
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Game images, metadata, and ratings come from the RAWG API. News topics
            are sourced from RSS feeds of major gaming outlets like IGN, GameSpot,
            Kotaku, and Polygon.
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              Community
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Sign in with Google or GitHub to leave comments, upvote discussions,
            and join our community of gamers. All articles support threaded
            conversations.
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Transparency
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-2">
          <p>
            All content on {SITE_NAME} is AI-generated and clearly labeled as
            such. We believe in transparency about AI-generated content.
          </p>
          <p>
            While our AI aims for accuracy, the content should be treated as
            AI-generated commentary rather than traditional journalism. Game
            scores reflect AI analysis of available data, not hands-on playtesting.
          </p>
          <p>
            Built with Next.js, Supabase, and Claude AI. Inspired by the legacy
            of Game Informer magazine.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
