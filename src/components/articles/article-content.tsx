"use client";

import Image from "next/image";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";

interface ArticleContentProps {
  content: string;
}

export function ArticleContent({ content }: ArticleContentProps) {
  return (
    <div className="prose-gaming max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={{
          img: ({ src, alt }) => {
            if (!src || typeof src !== "string") return null;
            // Use Next.js Image for RAWG and other known hosts for optimization
            const isOptimizable =
              src.includes("media.rawg.io") ||
              src.includes("images.unsplash.com");

            if (isOptimizable) {
              return (
                <span className="block my-6">
                  <Image
                    src={src}
                    alt={alt || "Game screenshot"}
                    width={800}
                    height={450}
                    className="rounded-lg w-full h-auto"
                    unoptimized={false}
                  />
                </span>
              );
            }

            // Fallback for other image sources
            return (
              <span className="block my-6">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={src}
                  alt={alt || "Game screenshot"}
                  className="rounded-lg w-full h-auto"
                  loading="lazy"
                />
              </span>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
