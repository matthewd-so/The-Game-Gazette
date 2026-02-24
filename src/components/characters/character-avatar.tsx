"use client";

import { useEffect, useState, useMemo } from "react";
import type { GameCharacter } from "@/lib/characters";
import { cn } from "@/lib/utils";

interface CharacterAvatarProps {
  character: GameCharacter;
  amplitude: number; // 0-1
  isSpeaking: boolean;
}

// Mouth shapes keyed by openness
function getMouthOpen(amplitude: number): number {
  if (amplitude < 0.05) return 0;
  if (amplitude < 0.15) return 1;
  if (amplitude < 0.3) return 2;
  if (amplitude < 0.5) return 3;
  return 4;
}

/* ──────────────────────────────────────────────
   MARIO – Detailed portrait
   ────────────────────────────────────────────── */
function MarioAvatar({ amplitude, eyesClosed }: { amplitude: number; eyesClosed: boolean }) {
  const mouthOpen = getMouthOpen(amplitude);
  const jawDrop = mouthOpen * 1.2; // subtle jaw movement

  return (
    <g>
      {/* Neck */}
      <rect x="40" y="78" width="20" height="12" rx="4" fill="#F5C27A" />
      {/* Blue overalls collar */}
      <path d="M 32,86 Q 40,82 50,84 Q 60,82 68,86 L 72,100 L 28,100 Z" fill="#2B5EA7" />
      {/* Yellow overall buttons */}
      <circle cx="38" cy="93" r="2.5" fill="#F5C518" />
      <circle cx="62" cy="93" r="2.5" fill="#F5C518" />
      {/* Red shirt collar visible */}
      <path d="M 38,84 Q 44,80 50,82 Q 56,80 62,84 L 60,88 Q 55,85 50,86 Q 45,85 40,88 Z" fill="#E52521" />

      {/* Face / Head shape - rounder, chubbier Mario face */}
      <ellipse cx="50" cy={52 + jawDrop * 0.3} rx="26" ry={28 + jawDrop * 0.2} fill="#F5C27A" />
      {/* Cheek highlights */}
      <ellipse cx="34" cy="58" rx="5" ry="3.5" fill="#FFAD85" opacity="0.5" />
      <ellipse cx="66" cy="58" rx="5" ry="3.5" fill="#FFAD85" opacity="0.5" />

      {/* Ears */}
      <ellipse cx="24" cy="50" rx="5" ry="6" fill="#F5C27A" />
      <ellipse cx="24" cy="50" rx="3" ry="4" fill="#EDAA5E" />
      <ellipse cx="76" cy="50" rx="5" ry="6" fill="#F5C27A" />
      <ellipse cx="76" cy="50" rx="3" ry="4" fill="#EDAA5E" />

      {/* Hair / Sideburns - brown hair visible under cap */}
      <path d="M 25,40 Q 25,34 28,30 L 28,46 Q 25,44 25,40Z" fill="#4A2800" />
      <path d="M 75,40 Q 75,34 72,30 L 72,46 Q 75,44 75,40Z" fill="#4A2800" />
      {/* Hair curls at temples */}
      <ellipse cx="26" cy="38" rx="4" ry="5" fill="#4A2800" />
      <ellipse cx="74" cy="38" rx="4" ry="5" fill="#4A2800" />

      {/* Cap - proper shape with dome and brim */}
      <path
        d="M 22,36 Q 22,14 50,10 Q 78,14 78,36 L 22,36 Z"
        fill="#E52521"
      />
      {/* Cap stitching line */}
      <path d="M 30,30 Q 50,26 70,30" fill="none" stroke="#C41E1A" strokeWidth="0.5" />
      {/* Cap brim - thick, extends forward */}
      <path
        d="M 18,36 Q 18,32 30,30 L 70,30 Q 82,32 82,36 Q 82,40 70,38 L 30,38 Q 18,40 18,36 Z"
        fill="#E52521"
      />
      {/* Brim underside shadow */}
      <path
        d="M 22,37 Q 50,40 78,37 Q 50,42 22,37 Z"
        fill="#B81C1A"
        opacity="0.5"
      />
      {/* Cap white circle with M */}
      <circle cx="50" cy="22" r="9" fill="white" />
      <text x="50" y="26.5" textAnchor="middle" fontSize="14" fontWeight="900" fill="#E52521" fontFamily="Arial, sans-serif">
        M
      </text>

      {/* Eyes - large, expressive Mario eyes */}
      {/* Left eye */}
      <ellipse cx="39" cy="46" rx="8" ry={eyesClosed ? 0.8 : 8} fill="white" stroke="#333" strokeWidth="0.5" />
      {!eyesClosed && (
        <>
          <ellipse cx="41" cy="46" rx="4.5" ry="5" fill="#2B5EA7" />
          <circle cx="41" cy="45" r="2.5" fill="#1a3a6a" />
          <circle cx="43" cy="44" r="1.5" fill="white" />
        </>
      )}
      {/* Right eye */}
      <ellipse cx="61" cy="46" rx="8" ry={eyesClosed ? 0.8 : 8} fill="white" stroke="#333" strokeWidth="0.5" />
      {!eyesClosed && (
        <>
          <ellipse cx="59" cy="46" rx="4.5" ry="5" fill="#2B5EA7" />
          <circle cx="59" cy="45" r="2.5" fill="#1a3a6a" />
          <circle cx="61" cy="44" r="1.5" fill="white" />
        </>
      )}
      {/* Eyebrows - thick, expressive */}
      <path d="M 30,37 Q 35,33 46,36" stroke="#4A2800" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M 70,37 Q 65,33 54,36" stroke="#4A2800" strokeWidth="2.5" fill="none" strokeLinecap="round" />

      {/* BIG round nose - Mario's signature */}
      <ellipse cx="50" cy="56" rx="7" ry="6" fill="#E8A87C" />
      <ellipse cx="50" cy="55" rx="5" ry="4" fill="#F0BC9C" opacity="0.4" />
      {/* Nose highlight */}
      <ellipse cx="48" cy="54" rx="2" ry="1.5" fill="#FFCCA8" opacity="0.5" />

      {/* MUSTACHE - Thick, iconic handlebar */}
      <path
        d="M 32,60 Q 34,57 38,58 Q 42,56 46,59 Q 48,57 50,59 Q 52,57 54,59 Q 58,56 62,58 Q 66,57 68,60
           Q 66,64 62,63 Q 58,65 54,62 Q 52,64 50,62 Q 48,64 46,62 Q 42,65 38,63 Q 34,64 32,60 Z"
        fill="#4A2800"
      />

      {/* Mouth - under mustache */}
      {mouthOpen === 0 ? (
        <path d="M 42,65 Q 50,67 58,65" fill="none" stroke="#3D2200" strokeWidth="1" />
      ) : (
        <ellipse
          cx="50"
          cy={66 + mouthOpen * 0.5}
          rx={4 + mouthOpen * 1.5}
          ry={1 + mouthOpen * 1.8}
          fill="#3a1010"
          stroke="#3D2200"
          strokeWidth="0.5"
        />
      )}
      {mouthOpen >= 3 && (
        <>
          {/* Tongue */}
          <ellipse cx="50" cy={69 + mouthOpen * 0.3} rx="3" ry="1.5" fill="#D44" opacity="0.7" />
        </>
      )}
    </g>
  );
}

/* ──────────────────────────────────────────────
   BATMAN – Dark Knight detailed portrait
   ────────────────────────────────────────────── */
function BatmanAvatar({ amplitude, eyesClosed }: { amplitude: number; eyesClosed: boolean }) {
  const mouthOpen = getMouthOpen(amplitude);
  const jawDrop = mouthOpen * 0.8;

  return (
    <g>
      {/* Neck */}
      <rect x="38" y="80" width="24" height="12" rx="3" fill="#D4A574" />

      {/* Cape collar */}
      <path d="M 26,88 Q 35,82 50,84 Q 65,82 74,88 L 80,100 L 20,100 Z" fill="#1a1a2e" />
      {/* Cape clasp / armor collar */}
      <path d="M 34,86 Q 42,82 50,83 Q 58,82 66,86 L 64,92 Q 57,88 50,89 Q 43,88 36,92 Z" fill="#2a2a4a" />
      {/* Bat symbol on chest */}
      <path
        d="M 44,94 L 42,92 L 38,94 L 41,91 L 40,89 Q 45,91 50,89 Q 55,91 60,89 L 59,91 L 62,94 L 58,92 L 56,94 Q 53,91 50,92 Q 47,91 44,94 Z"
        fill="#F5C518"
      />

      {/* Face / Jaw - strong, square jaw visible under cowl */}
      <path
        d={`M 28,50 Q 28,35 50,32 Q 72,35 72,50 L 72,${60 + jawDrop} Q 72,${76 + jawDrop} 50,${80 + jawDrop} Q 28,${76 + jawDrop} 28,${60 + jawDrop} Z`}
        fill="#D4A574"
      />
      {/* Jaw shadow / definition */}
      <path
        d={`M 30,65 Q 30,${74 + jawDrop} 50,${78 + jawDrop} Q 70,${74 + jawDrop} 70,65`}
        fill="none"
        stroke="#BA8E5E"
        strokeWidth="0.5"
        opacity="0.6"
      />
      {/* Chin cleft */}
      <line x1="50" y1={72 + jawDrop} x2="50" y2={75 + jawDrop} stroke="#BA8E5E" strokeWidth="0.8" opacity="0.4" />

      {/* Cowl - full head coverage */}
      <path
        d="M 20,55 Q 18,20 50,10 Q 82,20 80,55 L 72,50 Q 72,30 50,22 Q 28,30 28,50 Z"
        fill="#1a1a2e"
      />
      {/* Cowl side panels */}
      <path d="M 20,55 L 28,50 L 28,60 Q 24,60 20,58 Z" fill="#1a1a2e" />
      <path d="M 80,55 L 72,50 L 72,60 Q 76,60 80,58 Z" fill="#1a1a2e" />
      {/* Cowl nose bridge */}
      <path d="M 42,50 L 44,42 Q 50,38 56,42 L 58,50" fill="#1a1a2e" />

      {/* Bat ears - tall and angular */}
      <path d="M 30,28 L 20,4 L 38,22 Z" fill="#1a1a2e" />
      <path d="M 30,28 L 24,8 L 36,22 Z" fill="#252545" opacity="0.5" />
      <path d="M 70,28 L 80,4 L 62,22 Z" fill="#1a1a2e" />
      <path d="M 70,28 L 76,8 L 64,22 Z" fill="#252545" opacity="0.5" />

      {/* Eye mask area - angular, intimidating */}
      <path
        d="M 28,47 Q 35,42 42,44 L 44,42 Q 50,38 56,42 L 58,44 Q 65,42 72,47 L 70,53 Q 63,48 58,50 L 56,48 Q 50,46 44,48 L 42,50 Q 37,48 30,53 Z"
        fill="#1a1a2e"
      />

      {/* White eyes - angry Batman slits */}
      <path
        d={eyesClosed
          ? "M 32,47 L 43,47"
          : "M 32,48 L 34,44 L 42,44 L 44,47 L 42,50 L 34,50 Z"}
        fill="white"
      />
      <path
        d={eyesClosed
          ? "M 57,47 L 68,47"
          : "M 56,47 L 58,44 L 66,44 L 68,48 L 66,50 L 58,50 Z"}
        fill="white"
      />
      {/* Eye glow effect when speaking */}
      {!eyesClosed && (
        <>
          <path d="M 32,48 L 34,44 L 42,44 L 44,47 L 42,50 L 34,50 Z" fill="white" opacity="0.3" />
          <path d="M 56,47 L 58,44 L 66,44 L 68,48 L 66,50 L 58,50 Z" fill="white" opacity="0.3" />
        </>
      )}

      {/* Nose - subtle, under cowl */}
      <path d="M 48,54 L 50,60 L 52,54" fill="none" stroke="#BA8E5E" strokeWidth="1" opacity="0.4" />

      {/* 5 o'clock shadow / stubble */}
      <rect x="34" y="62" width="32" height={10 + jawDrop} rx="6" fill="#C49A6C" opacity="0.3" />

      {/* Mouth */}
      {mouthOpen === 0 ? (
        <path d="M 40,68 Q 50,70 60,68" fill="none" stroke="#8B5E3C" strokeWidth="1.2" />
      ) : (
        <>
          <ellipse
            cx="50"
            cy={69 + jawDrop * 0.3}
            rx={3 + mouthOpen * 1.5}
            ry={0.5 + mouthOpen * 1.5}
            fill="#2a1010"
            stroke="#8B5E3C"
            strokeWidth="0.5"
          />
        </>
      )}

      {/* Frown lines */}
      <path d="M 36,64 Q 38,63 40,64" fill="none" stroke="#BA8E5E" strokeWidth="0.5" opacity="0.4" />
      <path d="M 60,64 Q 62,63 64,64" fill="none" stroke="#BA8E5E" strokeWidth="0.5" opacity="0.4" />
    </g>
  );
}

/* ──────────────────────────────────────────────
   KRATOS – Ghost of Sparta detailed portrait
   ────────────────────────────────────────────── */
function KratosAvatar({ amplitude, eyesClosed }: { amplitude: number; eyesClosed: boolean }) {
  const mouthOpen = getMouthOpen(amplitude);
  const jawDrop = mouthOpen * 0.8;

  return (
    <g>
      {/* Neck - thick, muscular */}
      <rect x="34" y="78" width="32" height="14" rx="4" fill="#D4B09A" />
      {/* Neck muscles */}
      <line x1="42" y1="80" x2="42" y2="90" stroke="#C49A7E" strokeWidth="0.5" opacity="0.4" />
      <line x1="58" y1="80" x2="58" y2="90" stroke="#C49A7E" strokeWidth="0.5" opacity="0.4" />

      {/* Shoulder armor / leather */}
      <path d="M 18,92 Q 30,84 42,88 L 42,100 L 18,100 Z" fill="#8B7355" />
      <path d="M 82,92 Q 70,84 58,88 L 58,100 L 82,100 Z" fill="#8B7355" />
      {/* Armor detail */}
      <path d="M 20,94 Q 30,88 38,90" fill="none" stroke="#6B5535" strokeWidth="1" />
      <path d="M 80,94 Q 70,88 62,90" fill="none" stroke="#6B5535" strokeWidth="1" />
      {/* Leather chest strap */}
      <path d="M 42,88 Q 50,86 58,88 L 58,100 L 42,100 Z" fill="#A08060" />
      <line x1="50" y1="88" x2="50" y2="100" stroke="#6B5535" strokeWidth="0.5" />

      {/* Head shape - wider, more angular/rugged */}
      <path
        d={`M 24,45 Q 22,25 50,16 Q 78,25 76,45 L 76,${58 + jawDrop} Q 76,${76 + jawDrop} 50,${82 + jawDrop} Q 24,${76 + jawDrop} 24,${58 + jawDrop} Z`}
        fill="#D4B09A"
      />
      {/* Bald head sheen */}
      <ellipse cx="50" cy="24" rx="16" ry="8" fill="#E0C0A6" opacity="0.3" />
      <ellipse cx="44" cy="20" rx="6" ry="3" fill="#E8CCBA" opacity="0.2" />

      {/* Ears */}
      <ellipse cx="22" cy="48" rx="5" ry="7" fill="#D4B09A" />
      <ellipse cx="22" cy="48" rx="3" ry="5" fill="#C49A7E" />
      <ellipse cx="78" cy="48" rx="5" ry="7" fill="#D4B09A" />
      <ellipse cx="78" cy="48" rx="3" ry="5" fill="#C49A7E" />

      {/* RED WAR PAINT / TATTOO - Left side, goes from forehead over eye down to chest */}
      {/* Main stripe */}
      <path
        d="M 38,16 L 36,18 L 34,28 L 33,36 L 32,44 L 32,52 L 33,60 L 34,68 L 35,78 L 36,88"
        stroke="#CC0000"
        strokeWidth="4"
        fill="none"
        strokeLinecap="round"
        opacity="0.9"
      />
      {/* Eye swirl / branch of the tattoo */}
      <path
        d="M 34,38 Q 30,40 28,44 Q 27,48 30,50"
        stroke="#CC0000"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
        opacity="0.85"
      />
      {/* Thinner secondary lines */}
      <path
        d="M 36,22 L 40,20"
        stroke="#CC0000"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        opacity="0.7"
      />

      {/* Eyebrows - heavy, angry, furrowed */}
      <path d="M 28,36 Q 34,30 44,34" stroke="#B8976A" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M 72,36 Q 66,30 56,34" stroke="#B8976A" strokeWidth="3" fill="none" strokeLinecap="round" />

      {/* Eyes - intense, golden amber */}
      {/* Left eye - partially covered by war paint */}
      <ellipse cx="38" cy="42" rx="6" ry={eyesClosed ? 0.5 : 5} fill="white" />
      {!eyesClosed && (
        <>
          <circle cx="39" cy="42" r="3.5" fill="#C8960C" />
          <circle cx="39" cy="42" r="2" fill="#8B6508" />
          <circle cx="40" cy="41" r="1" fill="#FFD700" opacity="0.6" />
        </>
      )}
      {/* Right eye */}
      <ellipse cx="62" cy="42" rx="6" ry={eyesClosed ? 0.5 : 5} fill="white" />
      {!eyesClosed && (
        <>
          <circle cx="61" cy="42" r="3.5" fill="#C8960C" />
          <circle cx="61" cy="42" r="2" fill="#8B6508" />
          <circle cx="62" cy="41" r="1" fill="#FFD700" opacity="0.6" />
        </>
      )}

      {/* Nose - strong, angular */}
      <path d="M 48,44 L 46,54 L 50,56 L 54,54 L 52,44" fill="#C49A7E" opacity="0.5" />
      <path d="M 46,54 L 50,56 L 54,54" fill="none" stroke="#B08A6E" strokeWidth="1" />

      {/* Scar across right eye area */}
      <path d="M 56,36 Q 58,40 60,48" stroke="#E8C4A8" strokeWidth="1.5" opacity="0.6" />

      {/* BEARD - full, reddish-brown */}
      <path
        d={`M 28,58 Q 28,62 30,66 Q 30,${76 + jawDrop} 50,${82 + jawDrop} Q 70,${76 + jawDrop} 70,66 Q 72,62 72,58
            Q 68,56 62,58 Q 56,60 50,60 Q 44,60 38,58 Q 32,56 28,58 Z`}
        fill="#8B5E3C"
      />
      {/* Beard texture lines */}
      <path d={`M 36,64 Q 38,${72 + jawDrop} 42,${76 + jawDrop}`} fill="none" stroke="#6B4420" strokeWidth="0.5" opacity="0.4" />
      <path d={`M 50,62 L 50,${78 + jawDrop}`} fill="none" stroke="#6B4420" strokeWidth="0.5" opacity="0.4" />
      <path d={`M 64,64 Q 62,${72 + jawDrop} 58,${76 + jawDrop}`} fill="none" stroke="#6B4420" strokeWidth="0.5" opacity="0.4" />
      {/* Mustache portion */}
      <path
        d="M 38,58 Q 44,55 50,58 Q 56,55 62,58 Q 58,62 50,60 Q 42,62 38,58 Z"
        fill="#7B4E2C"
      />

      {/* Mouth - in the beard */}
      {mouthOpen === 0 ? (
        <path d="M 42,64 Q 50,66 58,64" fill="none" stroke="#5A3A1E" strokeWidth="1" />
      ) : (
        <>
          <ellipse
            cx="50"
            cy={65 + jawDrop * 0.3}
            rx={3 + mouthOpen * 1.5}
            ry={0.5 + mouthOpen * 1.5}
            fill="#2a0a0a"
            stroke="#5A3A1E"
            strokeWidth="0.5"
          />
        </>
      )}

      {/* Goatee bead ties at bottom */}
      <circle cx={46} cy={80 + jawDrop} r="1.5" fill="#8B7355" />
      <circle cx={54} cy={80 + jawDrop} r="1.5" fill="#8B7355" />
    </g>
  );
}

/* ──────────────────────────────────────────────
   GLaDOS – Aperture Science AI detailed portrait
   ────────────────────────────────────────────── */
function GLaDOSAvatar({ amplitude, isSpeaking }: { amplitude: number; isSpeaking: boolean }) {
  const mouthOpen = getMouthOpen(amplitude);

  return (
    <g>
      {/* Hanging cable from top */}
      <path d="M 50,0 Q 48,6 50,10" stroke="#666" strokeWidth="3" fill="none" />
      <path d="M 48,0 Q 52,4 50,10" stroke="#555" strokeWidth="1" fill="none" />

      {/* Secondary cables */}
      <path d="M 38,5 Q 40,12 42,18" stroke="#555" strokeWidth="2" fill="none" />
      <path d="M 62,5 Q 60,12 58,18" stroke="#555" strokeWidth="2" fill="none" />

      {/* Upper chassis / mount */}
      <ellipse cx="50" cy="14" rx="12" ry="5" fill="#4a4a4a" />
      <rect x="44" y="12" width="12" height="8" rx="2" fill="#3a3a3a" />

      {/* Main "spine" / neck arm */}
      <path d="M 50,20 Q 48,28 50,36" stroke="#5a5a5a" strokeWidth="5" fill="none" strokeLinecap="round" />
      {/* Joint rings */}
      <ellipse cx="50" cy="24" rx="4" ry="2" fill="#666" stroke="#777" strokeWidth="0.5" />
      <ellipse cx="49" cy="30" rx="4" ry="2" fill="#666" stroke="#777" strokeWidth="0.5" />

      {/* HEAD UNIT - main face plate */}
      <path
        d="M 26,36 Q 22,38 20,46 Q 20,56 26,60 L 34,62 Q 42,64 50,64 Q 58,64 66,62 L 74,60 Q 80,56 80,46 Q 78,38 74,36 Z"
        fill="#505050"
        stroke="#666"
        strokeWidth="1"
      />
      {/* Face plate inner */}
      <path
        d="M 30,38 Q 28,42 28,48 Q 28,56 32,58 L 38,60 Q 44,62 50,62 Q 56,62 62,60 L 68,58 Q 72,56 72,48 Q 72,42 70,38 Z"
        fill="#3a3a3a"
      />
      {/* Face plate surface details */}
      <path d="M 32,40 L 32,56" stroke="#444" strokeWidth="0.5" opacity="0.5" />
      <path d="M 68,40 L 68,56" stroke="#444" strokeWidth="0.5" opacity="0.5" />
      <path d="M 30,48 L 70,48" stroke="#444" strokeWidth="0.3" opacity="0.3" />

      {/* EYE - The iconic single orange/amber eye */}
      <circle cx="50" cy="46" r="12" fill="#222" stroke="#FF6600" strokeWidth="1.5" />
      <circle cx="50" cy="46" r="10" fill="#1a1a1a" />
      {/* Outer ring glow */}
      <circle cx="50" cy="46" r="11" fill="none" stroke="#FF6600" strokeWidth="0.5" opacity={isSpeaking ? 0.8 : 0.3} />
      {/* Iris */}
      <circle cx="50" cy="46" r={isSpeaking ? 5 + amplitude * 2 : 5} fill="#FF6600" opacity={isSpeaking ? 0.9 : 0.6}>
        {isSpeaking && (
          <animate attributeName="opacity" values="0.6;0.95;0.6" dur="1.5s" repeatCount="indefinite" />
        )}
      </circle>
      {/* Pupil */}
      <circle cx="50" cy="46" r={isSpeaking ? 2 + amplitude : 2} fill="#FF3300" />
      {/* Eye highlight */}
      <circle cx="47" cy="43" r="2" fill="white" opacity="0.3" />
      <circle cx="53" cy="44" r="1" fill="white" opacity="0.2" />
      {/* Scanning lines across eye */}
      {isSpeaking && (
        <>
          <line x1="40" y1="46" x2="60" y2="46" stroke="#FF6600" strokeWidth="0.3" opacity="0.4">
            <animate attributeName="y1" values="40;52;40" dur="2s" repeatCount="indefinite" />
            <animate attributeName="y2" values="40;52;40" dur="2s" repeatCount="indefinite" />
          </line>
        </>
      )}

      {/* Speaker grille / mouth area */}
      <rect x="38" y="56" width="24" height="6" rx="2" fill="#2a2a2a" stroke="#444" strokeWidth="0.5" />
      {/* Speaker bars */}
      {[0, 1, 2, 3, 4].map((i) => (
        <rect
          key={i}
          x={40 + i * 4}
          y="57"
          width={2}
          height={2 + (mouthOpen > 0 ? amplitude * 3 : 0)}
          rx="0.5"
          fill="#FF6600"
          opacity={0.3 + (mouthOpen > 0 ? amplitude * 0.7 : 0)}
        />
      ))}

      {/* Side panels / wings */}
      <path d="M 20,46 L 10,42 L 8,48 L 18,50 Z" fill="#4a4a4a" stroke="#555" strokeWidth="0.5" />
      <path d="M 80,46 L 90,42 L 92,48 L 82,50 Z" fill="#4a4a4a" stroke="#555" strokeWidth="0.5" />

      {/* Lower body / torso hanging down */}
      <path d="M 42,64 Q 44,70 46,76" stroke="#5a5a5a" strokeWidth="4" fill="none" strokeLinecap="round" />
      <path d="M 58,64 Q 56,70 54,76" stroke="#5a5a5a" strokeWidth="4" fill="none" strokeLinecap="round" />
      {/* Lower body shell */}
      <ellipse cx="50" cy="78" rx="10" ry="6" fill="#444" stroke="#555" strokeWidth="0.5" />
      {/* Joint */}
      <ellipse cx="50" cy="72" rx="6" ry="3" fill="#555" />

      {/* Bottom cable */}
      <path d="M 50,84 Q 48,90 50,96 Q 52,98 50,100" stroke="#555" strokeWidth="2" fill="none" />

      {/* Aperture Science logo hint */}
      <circle cx="50" cy="78" r="3" fill="none" stroke="#666" strokeWidth="0.5" />
      <path d="M 48,78 Q 50,76 52,78 Q 50,80 48,78" fill="#666" opacity="0.5" />

      {/* Small status lights */}
      <circle cx="30" cy="42" r="1.5" fill={isSpeaking ? "#FF6600" : "#333"} />
      <circle cx="70" cy="42" r="1.5" fill={isSpeaking ? "#FF6600" : "#333"} />
      <circle cx="26" cy="52" r="1" fill="#FF6600" opacity="0.3" />
      <circle cx="74" cy="52" r="1" fill="#FF6600" opacity="0.3" />
    </g>
  );
}

export function CharacterAvatar({
  character,
  amplitude,
  isSpeaking,
}: CharacterAvatarProps) {
  const [eyesClosed, setEyesClosed] = useState(false);

  // Blinking animation
  useEffect(() => {
    const blink = () => {
      setEyesClosed(true);
      setTimeout(() => setEyesClosed(false), 150);
    };

    const interval = setInterval(blink, 3000 + Math.random() * 2000);
    return () => clearInterval(interval);
  }, []);

  // Subtle scale pulse when speaking
  const speakingScale = isSpeaking ? 1 + amplitude * 0.02 : 1;

  // Memoize the waveform bars to avoid random re-renders
  const waveformBars = useMemo(() => {
    return Array.from({ length: 32 }).map((_, i) => ({
      angle: (i * 11.25 * Math.PI) / 180,
      randomFactor: 0.5 + Math.random() * 0.5,
    }));
  }, []);

  return (
    <div className="relative">
      {/* Glow effect */}
      <div
        className={cn(
          "absolute inset-0 rounded-full blur-3xl transition-opacity duration-500",
          isSpeaking ? "opacity-40" : "opacity-0"
        )}
        style={{ backgroundColor: character.color }}
      />

      {/* Audio waveform ring */}
      {isSpeaking && (
        <div className="absolute inset-[-16px]">
          <svg viewBox="0 0 132 132" className="w-full h-full animate-spin" style={{ animationDuration: "12s" }}>
            {waveformBars.map((bar, i) => {
              const barHeight = 2 + amplitude * 10 * bar.randomFactor;
              const x = 66 + Math.cos(bar.angle) * 58;
              const y = 66 + Math.sin(bar.angle) * 58;
              return (
                <line
                  key={i}
                  x1={x}
                  y1={y}
                  x2={x + Math.cos(bar.angle) * barHeight}
                  y2={y + Math.sin(bar.angle) * barHeight}
                  stroke={character.color}
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  opacity={0.4 + amplitude * 0.6}
                />
              );
            })}
          </svg>
        </div>
      )}

      {/* Main avatar SVG */}
      <svg
        viewBox="0 0 100 100"
        className="w-48 h-48 lg:w-64 lg:h-64 relative z-10 transition-transform duration-100"
        style={{ transform: `scale(${speakingScale})` }}
      >
        {/* Background circle with subtle gradient */}
        <defs>
          <radialGradient id={`bg-${character.id}`} cx="50%" cy="40%" r="50%">
            <stop offset="0%" stopColor={character.svgColors.accent1} stopOpacity="0.15" />
            <stop offset="100%" stopColor={character.svgColors.accent1} stopOpacity="0.05" />
          </radialGradient>
        </defs>
        <circle cx="50" cy="50" r="48" fill={`url(#bg-${character.id})`} />
        <circle
          cx="50"
          cy="50"
          r="47"
          fill="none"
          stroke={character.svgColors.accent1}
          strokeWidth="1.5"
          opacity={isSpeaking ? 0.5 : 0.2}
          className="transition-opacity duration-300"
        />

        {/* Character-specific rendering */}
        {character.id === "mario" && <MarioAvatar amplitude={amplitude} eyesClosed={eyesClosed} />}
        {character.id === "batman" && <BatmanAvatar amplitude={amplitude} eyesClosed={eyesClosed} />}
        {character.id === "kratos" && <KratosAvatar amplitude={amplitude} eyesClosed={eyesClosed} />}
        {character.id === "glados" && <GLaDOSAvatar amplitude={amplitude} isSpeaking={isSpeaking} />}
      </svg>
    </div>
  );
}
