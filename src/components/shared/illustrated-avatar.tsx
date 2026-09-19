"use client";

import { useId } from "react";

export type AvatarLook = {
  skin: string;
  hair: string;
  shirt: string;
  bg: string;
  style: "short" | "long" | "curly";
};

export const AVATAR_LOOKS: AvatarLook[] = [
  { skin: "#f1c9a5", hair: "#3b2a1a", shirt: "#007aff", bg: "#dbeafe", style: "short" },
  { skin: "#e8b48f", hair: "#5a2d0c", shirt: "#f05b8b", bg: "#fde2ea", style: "long" },
  { skin: "#d9a066", hair: "#1f1f1f", shirt: "#12a150", bg: "#dcfce7", style: "curly" },
  { skin: "#f3d3b7", hair: "#8a5a2b", shirt: "#8b5bf0", bg: "#ede9fe", style: "short" },
  { skin: "#c68642", hair: "#2a1a0e", shirt: "#f59e0b", bg: "#fef3c7", style: "curly" },
  { skin: "#f6dcc4", hair: "#d9a441", shirt: "#0ea5e9", bg: "#e0f2fe", style: "long" },
  { skin: "#a3683f", hair: "#111111", shirt: "#ef4444", bg: "#fee2e2", style: "short" },
  { skin: "#ecc19c", hair: "#8c8c8c", shirt: "#14b8a6", bg: "#ccfbf1", style: "short" },
];

/* A small flat-illustration avatar: head, hair, shoulders — no photos needed. */
export default function IllustratedAvatar({ look, size = 48, className }: { look: AvatarLook; size?: number; className?: string }) {
  const id = useId();
  const clip = `av-${id.replace(/[:]/g, "")}`;
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden className={className}>
      <defs>
        <clipPath id={clip}>
          <circle cx="50" cy="50" r="50" />
        </clipPath>
      </defs>
      <circle cx="50" cy="50" r="50" fill={look.bg} />
      <g clipPath={`url(#${clip})`}>
        {look.style === "long" && (
          <path d="M30 44 C30 22 40 17 50 17 C60 17 70 22 70 44 L73 78 L62 72 L60 42 C56 34 44 34 40 42 L38 72 L27 78 Z" fill={look.hair} />
        )}
        <path d="M14 104 C14 76 30 66 50 66 C70 66 86 76 86 104 Z" fill={look.shirt} />
        <rect x="42" y="50" width="16" height="18" rx="6" fill={look.skin} />
        <circle cx="50" cy="40" r="18" fill={look.skin} />
        {look.style === "short" && (
          <path d="M32 40 C32 25 40 20 50 20 C60 20 68 25 68 40 C64 31 58 28 50 28 C42 28 36 31 32 40 Z" fill={look.hair} />
        )}
        {look.style === "long" && (
          <path d="M31 42 C31 24 40 19 50 19 C60 19 69 24 69 42 C65 32 58 29 50 29 C42 29 35 32 31 42 Z" fill={look.hair} />
        )}
        {look.style === "curly" && (
          <>
            <path d="M30 41 C28 22 40 16 50 17 C60 16 72 22 70 41 C68 32 61 27 50 27 C39 27 32 32 30 41 Z" fill={look.hair} />
            <circle cx="32" cy="34" r="5" fill={look.hair} />
            <circle cx="68" cy="34" r="5" fill={look.hair} />
            <circle cx="40" cy="24" r="5" fill={look.hair} />
            <circle cx="60" cy="24" r="5" fill={look.hair} />
          </>
        )}
        <circle cx="44" cy="40" r="1.8" fill="#2b2118" />
        <circle cx="56" cy="40" r="1.8" fill="#2b2118" />
        <path d="M45 47 Q50 51 55 47" stroke="#2b2118" strokeWidth="1.6" strokeLinecap="round" fill="none" />
      </g>
    </svg>
  );
}
