"use client";

import { useEffect, useState, type CSSProperties, type RefObject } from "react";
import RotatingWords from "@/components/shared/rotating-words";
import { prefersReducedMotion } from "@/components/shared/fade-in";
import { cn } from "@/lib/utils";

/** Пауза між словами, що приземляються одне за одним. */
export const WORD_STEP = 95; // ms

/**
 * Годинник заголовка: 1 — слова починають приземлятися, 2 — під ними
 * проявляється текст, 3 — хвіст починає перебирати слова.
 *
 * `watch` — елемент, поява якого на екрані запускає анімацію. Для хедера
 * сторінки його не передають: там усе стартує одразу після монтування, бо
 * заголовок і так на першому екрані.
 */
export function useHeadlineStage(words: number, watch?: RefObject<HTMLElement | null>) {
  const [start, setStart] = useState(!watch);
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const el = watch?.current;
    if (!el || start) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStart(true);
          io.disconnect();
        }
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [watch, start]);

  useEffect(() => {
    if (!start) return;
    if (prefersReducedMotion()) {
      const skip = setTimeout(() => setStage(3), 0);
      return () => clearTimeout(skip);
    }
    const d = (words + 1) * WORD_STEP + 500;
    const ids = [
      setTimeout(() => setStage(1), 80),
      setTimeout(() => setStage(2), d * 0.5),
      setTimeout(() => setStage(3), d * 0.75),
    ];
    return () => ids.forEach(clearTimeout);
  }, [start, words]);

  return stage;
}

/** Проявлення блока під заголовком — у тому ж такті, що й слова. */
export function softIn(visible: boolean, shift = 14): CSSProperties {
  return {
    opacity: visible ? 1 : 0,
    transform: visible ? "translateY(0)" : `translateY(${shift}px)`,
    transition: "opacity 0.7s ease, transform 0.7s cubic-bezier(0.16,0.84,0.44,1)",
  };
}

/** Скільки слів у заголовку — стільки триває його поява. */
export function countWords(lines: string[][], accent?: string, rotate?: string[]) {
  return lines.reduce((a, l) => a + l.length, 0) + (accent ? accent.split(" ").length : 0) + (rotate ? 1 : 0);
}

interface Props {
  /** Рядки заголовка, слово за словом. */
  lines: string[][];
  /** Хвіст фірмовим градієнтом — коли він не змінюється. */
  accent?: string;
  /** Хвіст, що перебирає слова — коли змінюється. */
  rotate?: string[];
  rotateShort?: string[];
  /** Колір на кожне слово ротатора, у тому ж порядку. */
  colors?: (string | undefined)[];
  as?: "h1" | "h2";
  className?: string;
  /** Такт із `useHeadlineStage`. */
  stage: number;
}

/**
 * Заголовок, що приземляється слово за словом, а хвостом або носить фірмовий
 * градієнт, або перебирає слова. Одна механіка на хедер сторінки і на розділ
 * усередині неї — різниця лише в тому, коли починається такт.
 */
export default function AnimatedHeadline({
  lines,
  accent,
  rotate,
  rotateShort,
  colors,
  as: Tag = "h1",
  className,
  stage,
}: Props) {
  const body = lines.reduce((a, l) => a + l.length, 0);

  return (
    <Tag className={cn(className, stage >= 1 && "hero-lit")}>
      {lines.map((line, li) => {
        const before = lines.slice(0, li).reduce((a, l) => a + l.length, 0);
        return (
          <span key={li} className="hero-line block">
            {line.map((word, wi) => (
              <span key={`${word}-${wi}`} className="hero-word">
                <span style={{ animationDelay: `${(before + wi) * WORD_STEP}ms` }}>{word}</span>
                {wi < line.length - 1 ? " " : ""}
              </span>
            ))}
          </span>
        );
      })}

      {accent && (
        <span className="hero-line block">
          {accent.split(" ").map((word, wi, all) => (
            <span key={`${word}-${wi}`} className="hero-word">
              <span
                className="text-brand"
                style={{ animationDelay: `${(body + wi) * WORD_STEP}ms` }}
              >
                {word}
              </span>
              {wi < all.length - 1 ? " " : ""}
            </span>
          ))}
        </span>
      )}

      {rotate && (
        /* Рядок, що змінюється: кого саме це стосується. */
        <span className="hero-line block">
          <span className="hero-word">
            <span style={{ animationDelay: `${body * WORD_STEP}ms` }}>
              <RotatingWords
                words={rotate}
                shortWords={rotateShort}
                className="text-brand"
                colors={colors}
                active={stage >= 3}
              />
            </span>
          </span>
        </span>
      )}
    </Tag>
  );
}
