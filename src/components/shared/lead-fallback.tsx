"use client";

import { Mail, Phone, Send } from "lucide-react";
import { useT } from "@/lib/lang";
import { cn } from "@/lib/utils";
import { SITE_EMAIL, SITE_PHONE, SITE_TELEGRAM } from "@/lib/seo";
import { track } from "@/lib/analytics/client";

/* Заявка не доїхала. Раніше тут був рядок дрібних підкреслених посилань —
   на телефоні в такий телефонний номер треба ще влучити пальцем. Тепер
   найгучніша дія — дзвінок: велика кнопка на всю ширину, один дотик.
   Поруч телеграм, а поштою лист іде вже з іменем і номером усередині —
   відвідувачу не доводиться передруковувати те, що він щойно ввів. */

interface Props {
  /** «Не вдалося надіслати» — своє в кожної форми. */
  title: string;
  text: string;
  /** Те, що людина вже ввела: підставляємо в лист, щоб не набирати двічі. */
  name: string;
  phone: string;
  /** Звідки саме не доїхало — для аналітики. */
  source: "demo" | "brief";
  className?: string;
}

export default function LeadFallback({ title, text, name, phone, source, className }: Props) {
  const t = useT();

  const body = [
    `${t.modal.namePlaceholder}: ${name}`,
    `${t.modal.phonePlaceholder}: ${phone}`,
  ].join("\n");
  const mailto = `mailto:${SITE_EMAIL}?subject=${encodeURIComponent(t.common.leadMailSubject)}&body=${encodeURIComponent(body)}`;

  const rescue = (channel: string) => () => track("lead_rescue", { source, channel });

  return (
    <div role="alert" className={cn("flex flex-col gap-4", className)}>
      <div className="flex flex-col gap-1 text-center">
        <span className="text-[14px] font-semibold text-[#c76a00]">{title}</span>
        <span className="text-[13.5px] text-ink-2 leading-[1.5]">{text}</span>
      </div>

      <div className="flex flex-col gap-2.5">
        {/* Дзвінок — на телефоні це найкоротший шлях до нас */}
        <a
          href={`tel:${SITE_PHONE}`}
          onClick={rescue("телефон")}
          className="btn-primary btn-brand flex items-center justify-center gap-2.5 h-14 sm:h-12 w-full rounded-full"
        >
          <Phone className="w-[18px] h-[18px] text-white" strokeWidth={2.2} />
          <span className="text-white font-semibold text-[17px] sm:text-base tracking-[-0.34px] leading-[1.4]">
            {t.common.call}
          </span>
        </a>

        <a
          href={SITE_TELEGRAM}
          target="_blank"
          rel="noopener noreferrer"
          onClick={rescue("телеграм")}
          className="btn-secondary relative flex items-center justify-center gap-2 h-12 w-full rounded-full overflow-hidden border border-hairline-strong"
        >
          <span className="btn-secondary-bg absolute inset-0 bg-surface rounded-full transition-colors duration-150" />
          <Send className="relative w-4 h-4 text-ink-2" />
          <span className="relative text-ink font-medium text-[15px] tracking-[-0.3px] leading-[1.4]">
            {t.common.telegram}
          </span>
        </a>

        {/* Пошта лишається тихим посиланням — третій канал, не третя кнопка */}
        <a
          href={mailto}
          onClick={rescue("пошта")}
          className="inline-flex items-center justify-center gap-1.5 text-[13px] text-ink-2 hover:text-ink transition-colors"
        >
          <Mail className="w-3.5 h-3.5" />
          <span className="font-medium underline underline-offset-2">{SITE_EMAIL}</span>
        </a>
      </div>
    </div>
  );
}
