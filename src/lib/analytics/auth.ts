/* Вхід у кабінет аналітики: один пароль і підписана кука.

   Жодних користувачів і бази — кабінет потрібен двом людям. Кука
   містить лише час протермінування і підпис HMAC, тож підробити її
   без ANALYTICS_SECRET неможливо, а красти нема чого.

   ENV:
     ANALYTICS_PASSWORD — пароль до /admin (без нього кабінет закритий)
     ANALYTICS_SECRET   — ключ для підпису куки (типово — сам пароль)
     ANALYTICS_SESSION_EPOCH — версія сесій; зміна вивільняє всі видані куки  */

export const ADMIN_COOKIE = "mychurch-admin";
export const SESSION_DAYS = 30;

function secretKey() {
  return process.env.ANALYTICS_SECRET || process.env.ANALYTICS_PASSWORD || "";
}

/** Кабінет вмикається лише коли заданий пароль. */
export function isConfigured() {
  return Boolean(process.env.ANALYTICS_PASSWORD);
}

function base64url(bytes: ArrayBuffer) {
  let binary = "";
  for (const byte of new Uint8Array(bytes)) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function sign(payload: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secretKey()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  return base64url(await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payload)));
}

/* Версія сесій. Бази сесій тут немає, тож «вийти на всіх пристроях» —
   це зміна ANALYTICS_SESSION_EPOCH: версія входить у підпис, і всі раніше
   видані куки одразу перестають підходити. Знадобиться, якщо ноутбук із
   відкритим кабінетом загубився, а міняти пароль не на часі. Вихід кнопкою
   лише прибирає куку з браузера — вкрадену він не відкликає. */
function epoch() {
  return process.env.ANALYTICS_SESSION_EPOCH || "1";
}

export async function createToken() {
  const exp = Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000;
  return `${exp}.${await sign(`${exp}:${epoch()}`)}`;
}

export async function verifyToken(token: string | undefined | null) {
  if (!token || !isConfigured()) return false;
  const [exp, signature] = token.split(".");
  if (!exp || !signature) return false;
  /* NaN у порівняннях завжди false, тож нечислову дату відсікаємо окремо. */
  const until = Number(exp);
  if (!Number.isFinite(until) || until < Date.now()) return false;
  return (await sign(`${exp}:${epoch()}`)) === signature;
}

/** Порівняння паролів через підписи — щоб час відповіді не підказував префікс. */
export async function checkPassword(input: string) {
  const expected = process.env.ANALYTICS_PASSWORD;
  if (!expected || !input) return false;
  return (await sign(`pwd:${input}`)) === (await sign(`pwd:${expected}`));
}
