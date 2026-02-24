"use client";

import { useState } from "react";
import Link from "next/link";
import { Gamepad2, Mail, ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";
import { SITE_NAME } from "@/lib/constants";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<"login" | "signup" | "magic">("login");
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const supabase = createClient();

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    setMessage(null);

    if (mode === "magic") {
      // Magic link (no password needed)
      const { error } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        setMessage({ type: "error", text: error.message });
      } else {
        setMessage({
          type: "success",
          text: "Check your email for a magic link to sign in!",
        });
      }
    } else if (mode === "signup") {
      // Sign up with email + password
      const { error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        setMessage({ type: "error", text: error.message });
      } else {
        setMessage({
          type: "success",
          text: "Check your email to confirm your account!",
        });
      }
    } else {
      // Sign in with email + password
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        setMessage({ type: "error", text: error.message });
      } else {
        window.location.href = "/";
      }
    }

    setLoading(false);
  };

  const handleOAuthLogin = async (provider: "google" | "github") => {
    setLoading(true);
    setMessage(null);
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) {
      setMessage({ type: "error", text: error.message });
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <Link
            href="/"
            className="flex items-center justify-center gap-2 mb-4"
          >
            <Gamepad2 className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold">{SITE_NAME}</span>
          </Link>
          <CardTitle className="text-2xl">
            {mode === "signup" ? "Create Account" : "Welcome Back"}
          </CardTitle>
          <CardDescription>
            {mode === "signup"
              ? "Sign up to leave comments and join the community"
              : "Sign in to leave comments and join the community"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Email form */}
          <form onSubmit={handleEmailLogin} className="space-y-3">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {mode !== "magic" && (
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                />
              </div>
            )}

            {message && (
              <p
                className={`text-sm ${
                  message.type === "error"
                    ? "text-destructive"
                    : "text-green-500"
                }`}
              >
                {message.text}
              </p>
            )}

            <Button
              type="submit"
              className="w-full h-11"
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Mail className="h-4 w-4 mr-2" />
              )}
              {mode === "magic"
                ? "Send Magic Link"
                : mode === "signup"
                ? "Create Account"
                : "Sign In"}
            </Button>
          </form>

          {/* Mode toggles */}
          <div className="flex flex-col items-center gap-1 text-sm">
            {mode === "login" && (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setMode("signup");
                    setMessage(null);
                  }}
                  className="text-primary hover:underline"
                >
                  Don&apos;t have an account? Sign up
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMode("magic");
                    setMessage(null);
                  }}
                  className="text-muted-foreground hover:underline text-xs"
                >
                  Sign in with magic link instead
                </button>
              </>
            )}
            {mode === "signup" && (
              <button
                type="button"
                onClick={() => {
                  setMode("login");
                  setMessage(null);
                }}
                className="text-primary hover:underline"
              >
                Already have an account? Sign in
              </button>
            )}
            {mode === "magic" && (
              <button
                type="button"
                onClick={() => {
                  setMode("login");
                  setMessage(null);
                }}
                className="text-primary hover:underline flex items-center gap-1"
              >
                <ArrowLeft className="h-3 w-3" />
                Back to password sign in
              </button>
            )}
          </div>

          <Separator />

          {/* OAuth buttons (optional - work if providers are enabled in Supabase) */}
          <p className="text-center text-xs text-muted-foreground">
            Or continue with
          </p>

          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              className="h-10"
              onClick={() => handleOAuthLogin("github")}
              disabled={loading}
            >
              <svg
                className="mr-2 h-4 w-4"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              GitHub
            </Button>
            <Button
              variant="outline"
              className="h-10"
              onClick={() => handleOAuthLogin("google")}
              disabled={loading}
            >
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Google
            </Button>
          </div>

          <p className="text-center text-xs text-muted-foreground">
            By signing in, you agree to our community guidelines.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
