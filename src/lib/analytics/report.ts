import { FUNNEL } from "./events";
import { localDay, localHour, percent } from "./format";
import type { StoredEvent } from "./types";

/* Збірка звіту з сирих подій. Один прохід по масиву будує візити,
   з візитів — усе інше: воронку, сторінки, джерела, людей.

   Навмисно без бази даних: лендінг дає десятки тисяч подій на місяць,
   це секунди роботи в пам'яті, зате нуль інфраструктури.            */

const INTENT_EVENTS = new Set(["cta", "modal_open", "builder_pick", "demo_play"]);
const FORM_EVENTS = new Set(["form_start", "form_error", "form_submit"]);
/** Візит вважається змістовним, якщо людина справді читала. */
const ENGAGED_SECONDS = 30;

export interface SessionSummary {
  id: string;
  visitor: string;
  visit: number;
  start: number;
  end: number;
  seconds: number;
  pageviews: number;
  events: number;
  pages: string[];
  entry: string;
  exit: string;
  source: string;
  ref?: string;
  campaign?: string;
  device: string;
  browser?: string;
  os?: string;
  country?: string;
  city?: string;
  lang?: string;
  depth: number;
  blocks: number;
  engaged: boolean;
  intent: boolean;
  form: boolean;
  lead: boolean;
}

export interface VisitorSummary {
  id: string;
  /** Візитів у вибраному періоді. */
  visits: number;
  /** Котрий візит за весь час — лічильник живе в браузері людини. */
  allTimeVisits: number;
  first: number;
  last: number;
  pageviews: number;
  events: number;
  seconds: number;
  leads: number;
  sources: string[];
  devices: string[];
  country?: string;
  city?: string;
}

export interface Row {
  name: string;
  count: number;
  extra?: number;
}

export interface Report {
  from: number;
  to: number;
  totals: {
    visitors: number;
    newVisitors: number;
    returning: number;
    sessions: number;
    pageviews: number;
    events: number;
    leads: number;
    avgSeconds: number;
    bounceRate: number;
    conversion: number;
    perVisitor: number;
  };
  byDay: Array<{ day: string; visitors: number; sessions: number; pageviews: number; leads: number }>;
  byHour: Array<{ hour: number; sessions: number }>;
  pages: Array<{ path: string; views: number; visitors: number; avgSeconds: number; exits: number }>;
  sources: Row[];
  refs: Row[];
  campaigns: Row[];
  devices: Row[];
  browsers: Row[];
  os: Row[];
  countries: Row[];
  blocks: Row[];
  clicks: Row[];
  eventCounts: Row[];
  funnel: Array<{ id: string; label: string; hint: string; sessions: number; share: number; drop: number }>;
  sessions: SessionSummary[];
  visitors: VisitorSummary[];
}

function bump(map: Map<string, number>, key: string | undefined, by = 1) {
  if (!key) return;
  map.set(key, (map.get(key) ?? 0) + by);
}

function rows(map: Map<string, number>, limit = 20): Row[] {
  return [...map.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

/** Візити з подій. Використовується і звітом, і сторінкою одного візиту. */
export function buildSessions(events: StoredEvent[]): Map<string, SessionSummary> {
  const sessions = new Map<string, SessionSummary>();
  /* Час на сторінці приходить окремою подією page_exit — збираємо
     його тут, щоб не рахувати «останню сторінку» двічі. */
  for (const e of events) {
    let s = sessions.get(e.session);
    if (!s) {
      s = {
        id: e.session,
        visitor: e.visitor,
        visit: e.visit,
        start: e.ts,
        end: e.ts,
        seconds: 0,
        pageviews: 0,
        events: 0,
        pages: [],
        entry: e.path,
        exit: e.path,
        source: e.source,
        ref: e.ref,
        campaign: e.campaign,
        device: e.device || "desktop",
        browser: e.browser,
        os: e.os,
        country: e.country,
        city: e.city,
        lang: e.lang,
        depth: 0,
        blocks: 0,
        engaged: false,
        intent: false,
        form: false,
        lead: false,
      };
      sessions.set(e.session, s);
    }

    s.events += 1;
    s.end = Math.max(s.end, e.ts);
    s.exit = e.path;
    if (e.visit > s.visit) s.visit = e.visit;

    if (e.name === "pageview") {
      s.pageviews += 1;
      if (!s.pages.includes(e.path)) s.pages.push(e.path);
    }
    if (e.name === "scroll") s.depth = Math.max(s.depth, Number(e.props?.depth ?? 0));
    if (e.name === "section_view") s.blocks += 1;
    if (e.name === "page_exit") {
      s.depth = Math.max(s.depth, Number(e.props?.depth ?? 0));
    }
    if (INTENT_EVENTS.has(e.name)) s.intent = true;
    if (FORM_EVENTS.has(e.name)) s.form = true;
    if (e.name === "lead") s.lead = true;
  }

  for (const s of sessions.values()) {
    s.seconds = Math.round((s.end - s.start) / 1000);
    s.engaged = s.depth >= 50 || s.pageviews >= 2 || s.seconds >= ENGAGED_SECONDS;
    /* Крок воронки не можна «перестрибнути»: хто залишив заявку,
       той за визначенням і читав, і тиснув кнопку. */
    if (s.lead) s.form = true;
    if (s.form) s.intent = true;
    if (s.intent) s.engaged = true;
  }

  return sessions;
}

export function buildReport(events: StoredEvent[], from: number, to: number): Report {
  const sessionMap = buildSessions(events);
  const sessions = [...sessionMap.values()].sort((a, b) => b.start - a.start);

  const visitorMap = new Map<string, VisitorSummary>();
  const days = new Map<string, { visitors: Set<string>; sessions: Set<string>; pageviews: number; leads: number }>();
  const hours = new Array(24).fill(0) as number[];
  const pageViews = new Map<string, number>();
  const pageVisitors = new Map<string, Set<string>>();
  const pageSeconds = new Map<string, { total: number; n: number }>();
  const pageExits = new Map<string, number>();
  const sources = new Map<string, number>();
  const refs = new Map<string, number>();
  const campaigns = new Map<string, number>();
  const devices = new Map<string, number>();
  const browsers = new Map<string, number>();
  const oses = new Map<string, number>();
  const countries = new Map<string, number>();
  const blocks = new Map<string, number>();
  const clicks = new Map<string, number>();
  const eventCounts = new Map<string, number>();

  for (const e of events) {
    bump(eventCounts, e.name);

    let v = visitorMap.get(e.visitor);
    if (!v) {
      v = {
        id: e.visitor,
        visits: 0,
        allTimeVisits: e.visit,
        first: e.ts,
        last: e.ts,
        pageviews: 0,
        events: 0,
        seconds: 0,
        leads: 0,
        sources: [],
        devices: [],
        country: e.country,
        city: e.city,
      };
      visitorMap.set(e.visitor, v);
    }
    v.events += 1;
    v.first = Math.min(v.first, e.ts);
    v.last = Math.max(v.last, e.ts);
    v.allTimeVisits = Math.max(v.allTimeVisits, e.visit);
    if (!v.sources.includes(e.source)) v.sources.push(e.source);
    if (e.device && !v.devices.includes(e.device)) v.devices.push(e.device);
    if (e.name === "pageview") v.pageviews += 1;
    if (e.name === "lead") v.leads += 1;

    const day = localDay(e.ts);
    let bucket = days.get(day);
    if (!bucket) {
      bucket = { visitors: new Set(), sessions: new Set(), pageviews: 0, leads: 0 };
      days.set(day, bucket);
    }
    bucket.visitors.add(e.visitor);
    bucket.sessions.add(e.session);
    if (e.name === "pageview") {
      bucket.pageviews += 1;
      bump(pageViews, e.path);
      const set = pageVisitors.get(e.path) ?? new Set<string>();
      set.add(e.visitor);
      pageVisitors.set(e.path, set);
    }
    if (e.name === "lead") bucket.leads += 1;

    if (e.name === "page_exit") {
      const seconds = Number(e.props?.seconds ?? 0);
      if (seconds > 0 && seconds < 3600) {
        const acc = pageSeconds.get(e.path) ?? { total: 0, n: 0 };
        acc.total += seconds;
        acc.n += 1;
        pageSeconds.set(e.path, acc);
      }
    }
    if (e.name === "section_view") bump(blocks, String(e.props?.block ?? ""));
    if (e.name === "click" || e.name === "link_click" || e.name === "outbound" || e.name === "cta") {
      const text = String(e.props?.label ?? e.props?.href ?? "").trim();
      if (text) bump(clicks, text);
    }
  }

  for (const s of sessions) {
    hours[localHour(s.start)] += 1;
    bump(sources, s.source);
    bump(refs, s.ref);
    bump(campaigns, s.campaign);
    bump(devices, s.device);
    bump(browsers, s.browser);
    bump(oses, s.os);
    bump(countries, s.country);
    bump(pageExits, s.exit);

    const v = visitorMap.get(s.visitor);
    if (v) {
      v.visits += 1;
      v.seconds += s.seconds;
    }
  }

  const visitors = [...visitorMap.values()].sort((a, b) => b.visits - a.visits || b.last - a.last);
  const leads = sessions.filter((s) => s.lead).length;
  const pageviews = sessions.reduce((sum, s) => sum + s.pageviews, 0);
  const bounced = sessions.filter((s) => s.pageviews <= 1 && !s.engaged).length;
  const newVisitors = visitors.filter((v) => v.allTimeVisits <= 1).length;

  const funnelCounts = [
    sessions.length,
    sessions.filter((s) => s.engaged).length,
    sessions.filter((s) => s.intent).length,
    sessions.filter((s) => s.form).length,
    leads,
  ];

  return {
    from,
    to,
    totals: {
      visitors: visitors.length,
      newVisitors,
      returning: visitors.length - newVisitors,
      sessions: sessions.length,
      pageviews,
      events: events.length,
      leads,
      avgSeconds: sessions.length ? Math.round(sessions.reduce((sum, s) => sum + s.seconds, 0) / sessions.length) : 0,
      bounceRate: percent(bounced, sessions.length),
      conversion: percent(leads, sessions.length),
      perVisitor: visitors.length ? Math.round((sessions.length / visitors.length) * 10) / 10 : 0,
    },
    byDay: [...days.entries()]
      .sort((a, b) => (a[0] < b[0] ? -1 : 1))
      .map(([day, b]) => ({ day, visitors: b.visitors.size, sessions: b.sessions.size, pageviews: b.pageviews, leads: b.leads })),
    byHour: hours.map((sessionsCount, hour) => ({ hour, sessions: sessionsCount })),
    pages: [...pageViews.entries()]
      .map(([path, views]) => {
        const seconds = pageSeconds.get(path);
        return {
          path,
          views,
          visitors: pageVisitors.get(path)?.size ?? 0,
          avgSeconds: seconds?.n ? Math.round(seconds.total / seconds.n) : 0,
          exits: pageExits.get(path) ?? 0,
        };
      })
      .sort((a, b) => b.views - a.views)
      .slice(0, 30),
    sources: rows(sources),
    refs: rows(refs, 12),
    campaigns: rows(campaigns, 12),
    devices: rows(devices, 6),
    browsers: rows(browsers, 8),
    os: rows(oses, 8),
    countries: rows(countries, 12),
    blocks: rows(blocks, 25),
    clicks: rows(clicks, 25),
    eventCounts: rows(eventCounts, 30),
    funnel: FUNNEL.map((step, i) => ({
      ...step,
      sessions: funnelCounts[i],
      share: percent(funnelCounts[i], funnelCounts[0]),
      drop: i === 0 ? 0 : percent(funnelCounts[i - 1] - funnelCounts[i], funnelCounts[i - 1] || 1),
    })),
    sessions,
    visitors,
  };
}
