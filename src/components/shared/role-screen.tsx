"use client";

import { ROLE_ICONS, ROLE_ACCENTS } from "@/components/shared/role-icons";
import {
  PastorScreen, LeaderScreen, DeaconScreen, VolunteerScreen, VisitorScreen, MemberScreen, HrScreen, AccountantScreen, ReceptionScreen,
} from "@/components/shared/role-screens";
import { useT } from "@/lib/lang";

type Role = ReturnType<typeof useT>["audience"]["roles"][number];

/* A phone-like "screen" for a role. Every role has its own layout and its own
   small interaction — re-mount it (key) to replay the entrance. */
export default function RoleScreen({ role, large = false }: { role: Role; large?: boolean }) {
  const t = useT().audience;
  const Icon = ROLE_ICONS[role.id];
  const accent = ROLE_ACCENTS[role.id];
  const sc = t.screens;

  const body = (() => {
    switch (role.id) {
      case "pastor": return <PastorScreen s={sc.pastor} accent={accent} />;
      case "leader": return <LeaderScreen s={sc.leader} accent={accent} />;
      case "deacon": return <DeaconScreen s={sc.deacon} accent={accent} />;
      case "volunteer": return <VolunteerScreen s={sc.volunteer} accent={accent} />;
      case "visitor": return <VisitorScreen s={sc.visitor} accent={accent} />;
      case "member": return <MemberScreen s={sc.member} accent={accent} />;
      case "hr": return <HrScreen s={sc.hr} accent={accent} />;
      case "accountant": return <AccountantScreen s={sc.accountant} accent={accent} />;
      case "reception": return <ReceptionScreen s={sc.reception} accent={accent} />;
      default: return null;
    }
  })();

  return (
    <div className={["mock-on relative w-full rounded-[24px] bg-surface border border-hairline shadow-[0_30px_60px_-30px_rgba(0,50,120,0.4)] overflow-hidden", large ? "max-w-[560px]" : "max-w-[520px]"].join(" ")}>
      <div className="flex items-center gap-3 px-4 md:px-5 py-3.5 border-b border-hairline" style={{ background: `linear-gradient(120deg, color-mix(in oklab, ${accent} 14%, var(--surface)), var(--surface-2))` }}>
        <span className="mock-pop w-9 h-9 rounded-xl flex items-center justify-center bg-surface border border-hairline" style={{ color: accent, animationDelay: "40ms" }}>
          <Icon className="w-[18px] h-[18px]" strokeWidth={2} />
        </span>
        <div className="flex flex-col min-w-0">
          <span className="text-[10.5px] font-semibold uppercase tracking-[0.1em] text-ink-3 leading-none">{t.screenLabel}</span>
          <span className="text-[14.5px] md:text-[15.5px] font-semibold text-ink leading-[1.25] truncate mt-1">{role.screen.title}</span>
        </div>
        <span className="ml-auto flex items-center gap-1.5 rounded-full bg-surface border border-hairline px-2.5 py-1 text-[11px] font-medium text-ink-2 whitespace-nowrap">
          <span className="w-1.5 h-1.5 rounded-full bg-[#12a150]" /> {role.name}
        </span>
      </div>
      <div className="p-4 md:p-5">{body}</div>
    </div>
  );
}
