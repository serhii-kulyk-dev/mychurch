import FadeIn from "@/components/shared/fade-in";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  eyebrow?: string;
  title: React.ReactNode;
  text?: React.ReactNode;
  align?: "center" | "left";
  className?: string;
}

export default function SectionHeading({
  eyebrow,
  title,
  text,
  align = "center",
  className,
}: SectionHeadingProps) {
  const centered = align === "center";
  return (
    <FadeIn
      className={cn(
        "flex flex-col gap-4",
        centered ? "items-center text-center" : "items-start text-left",
        className
      )}
    >
      {eyebrow && (
        <span className="text-[12.5px] font-semibold uppercase tracking-[0.14em] text-brand">
          {eyebrow}
        </span>
      )}
      <h2 className="font-semibold text-ink text-[30px] md:text-[44px] leading-[1.12] tracking-[-1px] md:tracking-[-1.6px] max-w-[760px]">
        {title}
      </h2>
      {text && (
        <p
          className={cn(
            "text-[16.5px] md:text-[18px] font-normal text-ink-2 leading-[1.55] max-w-[620px]",
            centered && "mx-auto"
          )}
        >
          {text}
        </p>
      )}
    </FadeIn>
  );
}
