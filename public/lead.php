<?php
/* Приймач заявок із форми демо і брифу на /modules.

   Сайт збирається в статику (output: export у next.config.ts) — ані свого
   сервера, ані роуту /api/lead у нього немає, а токен бота в браузер класти
   не можна. Тому форма шле JSON сюди: цей файл лежить у корені сайту на
   тому ж хостингу, тримає токен і сам пише в Telegram.

   Адреса цього файла задається фронту через NEXT_PUBLIC_LEAD_ENDPOINT
   (див. .env.example). Той самий домен — тож CORS у звичайному випадку
   не потрібен, але www-дзеркало нижче все одно передбачене.

   ── Куди покласти токен ────────────────────────────────────────────────
   Шукаємо в такому порядку:
     1. ../lead-secret.php — на рівень вище кореня сайту, найкраще місце:
        навіть якщо PHP колись зламається, віддати вихідник нікуди;
     2. ./lead-secret.php  — поруч, якщо вище класти нікуди (shared-хостинг);
     3. змінні оточення TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID.

   Сам lead-secret.php:

     <?php return [
       'telegram_token' => '1234567890:AA...',
       'telegram_chat'  => '-1001234567890',
       'email_to'       => '',  // необов'язковий другий канал
       'email_from'     => '',

       // CRM My Community: лід лягає карткою у воронку.
       // Ключ авторизує тільки створення ліда (роути /api-lead/*),
       // але на сайт його класти все одно не можна — лише сюди.
       'crm_key'        => '',  // X-API-KEY з налаштувань CRM
       'crm_business'   => '',  // businessId
       'crm_funnel'     => '',  // funnelId — воронка, куди падають ліди
       'crm_url'        => '',  // порожньо = https://api.my-community.pp.ua/api/api-lead/create

       // Пошта: з ключем Resend лист іде через їхній API, без нього — mail().
       'resend_key'     => '',
     ];

   У репозиторій він не потрапляє — .gitignore ловить lead-secret.php.

   Код навмисне тримається синтаксису PHP 7.4: на спільному хостингу
   версія буває стара, а лід важливіший за сучасні фічі мови. */

declare(strict_types=1);

/* Відповідь — це JSON, і більше нічого. На спільному хостингу
   display_errors часто ввімкнений, і будь-який warning чи «deprecated»
   надрукувався б просто в тіло: форма не розібрала б відповідь і показала
   б помилку на успішно доставленому ліді. Тому вивід помилок — у журнал
   хостингу, а не відвідувачу. */
ini_set('display_errors', '0');
ini_set('log_errors', '1');

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');

/* ── Відповідь ─────────────────────────────────────────────────────────── */

function respond(int $code, array $body): void
{
    http_response_code($code);
    echo json_encode($body, JSON_UNESCAPED_UNICODE);
    exit;
}

/* ── Налаштування ──────────────────────────────────────────────────────── */

function config(): array
{
    static $cfg = null;
    if ($cfg !== null) {
        return $cfg;
    }
    $cfg = [];
    foreach ([__DIR__ . '/../lead-secret.php', __DIR__ . '/lead-secret.php'] as $path) {
        if (is_file($path)) {
            $loaded = require $path;
            if (is_array($loaded)) {
                $cfg = $loaded;
                break;
            }
        }
    }
    /* Оточення — запасний варіант: на хостингу зі змінними файл не потрібен. */
    $fromEnv = [
        'telegram_token' => 'TELEGRAM_BOT_TOKEN',
        'telegram_chat' => 'TELEGRAM_CHAT_ID',
        'email_to' => 'LEAD_EMAIL_TO',
        'email_from' => 'LEAD_EMAIL_FROM',
        'crm_key' => 'CRM_API_KEY',
        'crm_business' => 'CRM_BUSINESS_ID',
        'crm_funnel' => 'CRM_FUNNEL_ID',
        'crm_url' => 'CRM_LEAD_URL',
        'resend_key' => 'RESEND_API_KEY',
    ];
    foreach ($fromEnv as $key => $env) {
        if (empty($cfg[$key])) {
            $value = getenv($env);
            if (is_string($value) && $value !== '') {
                $cfg[$key] = $value;
            }
        }
    }
    return $cfg;
}

function setting(string $key): string
{
    $cfg = config();
    return isset($cfg[$key]) && is_string($cfg[$key]) ? trim($cfg[$key]) : '';
}

/* ── CORS для www-дзеркала ─────────────────────────────────────────────── */

$ALLOWED_ORIGINS = ['https://mychurch.com.ua', 'https://www.mychurch.com.ua'];
$origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '';
if ($origin !== '' && in_array($origin, $ALLOWED_ORIGINS, true)) {
    header('Access-Control-Allow-Origin: ' . $origin);
    header('Vary: Origin');
    header('Access-Control-Allow-Headers: Content-Type');
    header('Access-Control-Max-Age: 86400');
}

if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') {
    http_response_code(204);
    exit;
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    header('Allow: POST');
    respond(405, ['ok' => false, 'error' => 'method_not_allowed']);
}

/* ── Чистка того, що надрукував відвідувач ─────────────────────────────── */

/* Керівні символи викидаємо (крім переносу рядка — він потрібен у
   «Побажаннях»), CRLF зводимо до \n, довжину ріжемо по символах, а не
   по байтах: українські літери в UTF-8 займають по два. */
function clean($value, int $max): string
{
    if (!is_string($value)) {
        return '';
    }
    $value = preg_replace('/\r\n?/u', "\n", $value);
    $value = preg_replace('/[\x{0000}-\x{0008}\x{000B}\x{000C}\x{000E}-\x{001F}\x{007F}]/u', '', (string) $value);
    $value = trim((string) $value);
    return function_exists('mb_substr') ? mb_substr($value, 0, $max, 'UTF-8') : substr($value, 0, $max);
}

/* Поля, які в інтерфейсі займають один рядок: ім'я, телефон, розмір,
   сторінка. Перенос усередині такого значення — або випадковість, або
   спроба дописати щось у тему листа, тож будь-який пробільний набір
   зводимо до одного пробілу. */
function line_value($value, int $max): string
{
    return trim((string) preg_replace('/\s+/u', ' ', clean($value, $max)));
}

/* Telegram розбирає повідомлення як HTML, тож усе, що надрукував
   відвідувач, треба екранувати. Ім'я на кшталт ТОВ "Ромашка" & партнери
   інакше валить відправку (400 can't parse entities), а <a href> із поля
   став би живим посиланням у робочому чаті. */
function escape_html(string $value): string
{
    return htmlspecialchars($value, ENT_NOQUOTES, 'UTF-8');
}

/* Цілі приходять ідентифікаторами, а в лід потрапляють наші ж підписи:
   чужий текст у повідомлення не заходить, невідомий id просто відкидаємо.
   Дзеркало ua.builder.goals із src/lib/i18n.ts — якщо там з'явиться нова
   ціль, лід усе одно дійде, просто без цього рядка. */
const GOAL_LABELS = [
    'newcomers' => 'Не губити новеньких',
    'attendance' => 'Бачити, хто перестав приходити',
    'requests' => 'Не губити прохання людей',
    'comms' => 'Писати громаді в один клік',
    'ministries' => 'Навести лад у служіннях і графіках',
    'groups' => 'Тримати малі групи в полі зору',
    'kids' => 'Дитяче служіння без хаосу',
    'events' => 'Спокійно проводити події й табори',
    'org' => 'Зрозуміти, хто за що відповідає',
    'learning' => 'Навчати лідерів і команду',
    'money' => 'Порядок у пожертвах і витратах',
    'rooms' => 'Зали та обладнання без накладок',
    'gather' => 'Зібрати все з файлів і чатів докупи',
    'forms' => 'Прибрати реєстрації з чатів і таблиць',
    'routine' => 'Щоб нагадування йшли самі',
    'numbers' => 'Бачити церкву в цифрах',
    'campuses' => 'Вести кілька локацій разом',
];

function goal_labels($value): array
{
    if (!is_array($value)) {
        return [];
    }
    $out = [];
    foreach (array_slice($value, 0, 16) as $id) {
        if (is_string($id) && array_key_exists($id, GOAL_LABELS)) {
            $out[] = GOAL_LABELS[$id];
        }
    }
    return $out;
}

/* ── Заслінки від спаму й дублів ───────────────────────────────────────── */

/* Три різні заслінки, бо спам буває трьох видів.

   1. Одна адреса — не більше 5 лідів за 10 хвилин. Ловить того, хто
      довбить кнопку або крутить скрипт з одного місця.
   2. Увесь сайт — не більше 40 лідів за 10 хвилин. Ботнет міняє адреси,
      і перша заслінка його не бачить; ця не дає залити чат. Звичайний
      день лендінга — одиниці лідів, тож поріг із запасом.
   3. Той самий телефон із тієї самої форми — один лід на 15 хвилин.
      Це головне проти дублів: подвійний клік, повтор після обриву мережі
      чи перезаслана форма більше не перетворюються на N повідомлень. */
const WINDOW = 600;
const LIMIT_IP = 5;
const LIMIT_ALL = 40;
const DEDUPE_TTL = 900;

/* Стан заслінок і журнал недоставлених лідів кладемо вище кореня сайту:
   у корені їх віддавав би сам хостинг. Якщо туди не пишеться (буває на
   спільних хостингах) — системний тимчасовий каталог. */
function state_dir(): string
{
    static $dir = null;
    if ($dir !== null) {
        return $dir;
    }
    $preferred = __DIR__ . '/../.lead-state';
    if (!is_dir($preferred)) {
        @mkdir($preferred, 0700, true);
    }
    $dir = (is_dir($preferred) && is_writable($preferred)) ? $preferred : sys_get_temp_dir();
    return $dir;
}

/* Один файл під замком: читаємо, підчищаємо прострочене, вирішуємо і
   одразу записуємо. Не змогли відкрити файл — пропускаємо заявку далі:
   зламані заслінки не привід губити лід. */
function gate(string $ip, string $dedupeKey): string
{
    $path = state_dir() . '/lead-gate.json';
    $fh = @fopen($path, 'c+');
    if (!$fh) {
        return '';
    }
    $verdict = '';
    if (flock($fh, LOCK_EX)) {
        $raw = stream_get_contents($fh);
        $state = json_decode(is_string($raw) ? $raw : '', true);
        if (!is_array($state)) {
            $state = [];
        }
        $now = time();
        $fresh = function ($stamps) use ($now) {
            return array_values(array_filter(
                is_array($stamps) ? $stamps : [],
                function ($t) use ($now) {
                    return is_int($t) && $t > $now - WINDOW;
                }
            ));
        };

        $byIp = isset($state['ip']) && is_array($state['ip']) ? $state['ip'] : [];
        foreach ($byIp as $key => $stamps) {
            $kept = $fresh($stamps);
            if ($kept) {
                $byIp[$key] = $kept;
            } else {
                unset($byIp[$key]);
            }
        }
        $all = $fresh(isset($state['all']) ? $state['all'] : []);

        $dup = isset($state['dup']) && is_array($state['dup']) ? $state['dup'] : [];
        foreach ($dup as $key => $t) {
            if (!is_int($t) || $t <= $now - DEDUPE_TTL) {
                unset($dup[$key]);
            }
        }

        $mine = isset($byIp[$ip]) ? $byIp[$ip] : [];
        if (count($mine) >= LIMIT_IP) {
            $verdict = 'rate_limited';
        } elseif (count($all) >= LIMIT_ALL) {
            $verdict = 'rate_limited_all';
        } elseif (isset($dup[$dedupeKey])) {
            $verdict = 'duplicate';
        } else {
            $mine[] = $now;
            $byIp[$ip] = $mine;
            $all[] = $now;
            $dup[$dedupeKey] = $now;
        }

        $state = ['ip' => $byIp, 'all' => $all, 'dup' => $dup];
        ftruncate($fh, 0);
        rewind($fh);
        fwrite($fh, (string) json_encode($state));
        fflush($fh);
        flock($fh, LOCK_UN);
    }
    fclose($fh);
    return $verdict;
}

/* Жоден канал не відпрацював — знімаємо позначку дубля, щоб повтор
   одразу пішов у роботу, а не впав у «вже приймали». */
function forget(string $dedupeKey): void
{
    $path = state_dir() . '/lead-gate.json';
    $fh = @fopen($path, 'c+');
    if (!$fh) {
        return;
    }
    if (flock($fh, LOCK_EX)) {
        $raw = stream_get_contents($fh);
        $state = json_decode(is_string($raw) ? $raw : '', true);
        if (is_array($state) && isset($state['dup'][$dedupeKey])) {
            unset($state['dup'][$dedupeKey]);
            ftruncate($fh, 0);
            rewind($fh);
            fwrite($fh, (string) json_encode($state));
            fflush($fh);
        }
        flock($fh, LOCK_UN);
    }
    fclose($fh);
}

/* Cloudflare підставляє реальну адресу відвідувача сам і чужий такий
   заголовок відкидає. Без нього беремо REMOTE_ADDR: X-Forwarded-For
   підробляється з боку клієнта, а спільна і загальна заслінки тримають
   оборону й без точної адреси. */
function client_ip(): string
{
    if (!empty($_SERVER['HTTP_CF_CONNECTING_IP'])) {
        return (string) $_SERVER['HTTP_CF_CONNECTING_IP'];
    }
    return !empty($_SERVER['REMOTE_ADDR']) ? (string) $_SERVER['REMOTE_ADDR'] : 'unknown';
}

/* ── Канали ────────────────────────────────────────────────────────────── */

/** Тіло відповіді каже «не вийшло»: {"ok":false} у Telegram, {"status":4xx} у CRM. */
function answer_failed($answer): bool
{
    if (!is_array($answer)) {
        return false;
    }
    if (isset($answer['ok']) && $answer['ok'] !== true) {
        return true;
    }
    return isset($answer['status']) && (int) $answer['status'] >= 400;
}

function post_json(string $url, array $payload, array $headers = []): bool
{
    $body = json_encode($payload, JSON_UNESCAPED_UNICODE);
    $headers = array_merge(['Content-Type: application/json'], $headers);
    if (function_exists('curl_init')) {
        $ch = curl_init($url);
        curl_setopt_array($ch, [
            CURLOPT_POST => true,
            CURLOPT_POSTFIELDS => $body,
            CURLOPT_HTTPHEADER => $headers,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_TIMEOUT => 8,
            CURLOPT_CONNECTTIMEOUT => 5,
        ]);
        $res = curl_exec($ch);
        $code = (int) curl_getinfo($ch, CURLINFO_RESPONSE_CODE);
        /* З PHP 8.0 ручка закривається сама, а з 8.5 виклик уже й лається
           в журнал. Лишаємо його тільки для старих версій на хостингу. */
        if (PHP_VERSION_ID < 80000) {
            curl_close($ch);
        }
        if ($code < 200 || $code >= 300 || !is_string($res)) {
            return false;
        }
        return !answer_failed(json_decode($res, true));
    }
    /* Хостинг без cURL — ідемо потоками. Замість рядка стану дивимось у
       тіло: Telegram і на помилку відповідає JSON із "ok":false, а
       $http_response_header у свіжих PHP уже застарілий. */
    $context = stream_context_create(['http' => [
        'method' => 'POST',
        'header' => implode("\r\n", $headers) . "\r\n",
        'content' => $body,
        'timeout' => 8,
        'ignore_errors' => true,
    ]]);
    $res = @file_get_contents($url, false, $context);
    if (!is_string($res)) {
        return false;
    }
    return !answer_failed(json_decode($res, true));
}

function send_telegram(string $html): bool
{
    $token = setting('telegram_token');
    $chat = setting('telegram_chat');
    if ($token === '' || $chat === '') {
        return false;
    }
    /* Адреса API виноситься в налаштування рівно заради одного: прогнати
       відправку на локальному макеті, не турбуючи справжній чат. */
    $api = setting('telegram_api');
    if ($api === '') {
        $api = 'https://api.telegram.org';
    }
    return post_json(rtrim($api, '/') . '/bot' . $token . '/sendMessage', [
        'chat_id' => $chat,
        'text' => $html,
        'parse_mode' => 'HTML',
        'disable_web_page_preview' => true,
    ]);
}

/* ── CRM My Community ───────────────────────────────────────────────────
   Лід лягає карткою у воронку: назва, телефон, джерело і «Коментар» з усім,
   що людина заповнила. Ключ авторизує лише створення ліда (роути
   /api-lead/*), і все одно живе тут, на сервері, а не в бандлі сайту.

   Ідентифікатори нижче — це не поля ліда, а поля ФОРМИ бізнесу (instruction):
   вони спільні для всіх лідів воронки й міняються, лише якщо перебудувати
   структуру картки в CRM. Якщо колись зміняться — нові видно у відповіді на
   будь-яке створення ліда (поле fieldInstructionId поруч із fieldSlug).
   Помилковий id не губить заявку: лід усе одно створиться, просто коментар
   не ляже у своє поле. */

const CRM_BLOCK_INSTRUCTION = 'a095a1f4-a4ba-4acd-b16d-280ccdecda2e';   // lead_info
const CRM_SECTION_INSTRUCTION = '1ca9a8aa-a91b-44c1-9c9c-6a76c0b13463'; // basic_info
const CRM_FIELD_COMMENT = '6c2375ed-b132-47da-9e31-6de620a17f18';
const CRM_FIELD_PHONE = '52d3e7c3-8aab-4fed-814d-5b976d9766ce';
const CRM_FIELD_SOURCE = '42defd61-1472-4b5d-86e6-b9158f302ef9';

/** Випадковий id для значення поля — CRM чекає його від того, хто створює. */
function crm_id(): string
{
    $bytes = function_exists('random_bytes') ? random_bytes(16) : pack('N4', mt_rand(), mt_rand(), mt_rand(), mt_rand());
    $bytes[6] = chr((ord($bytes[6]) & 0x0f) | 0x40);
    $bytes[8] = chr((ord($bytes[8]) & 0x3f) | 0x80);
    return vsprintf('%s%s-%s-%s-%s-%s%s%s', str_split(bin2hex($bytes), 4));
}

function crm_field(string $slug, string $type, string $instruction, string $value, string $label): array
{
    $id = crm_id();
    return [
        'fieldId' => $id,
        'fieldInstructionId' => $instruction,
        'fieldSlug' => $slug,
        'label' => $label,
        'type' => $type,
        'value' => ['fieldId' => $id, 'type' => $type, 'value_string' => $value],
    ];
}

/** «0931234567» → «+380931234567»: CRM звіряє клієнта за номером, і той самий
    номер у двох написаннях створив би двох різних людей. */
function crm_phone(string $phone): string
{
    $digits = preg_replace('/[^0-9]/', '', $phone);
    if ($digits === '') {
        return '';
    }
    if (strlen($digits) === 10 && $digits[0] === '0') {
        return '+38' . $digits;
    }
    if (strlen($digits) === 9) {
        return '+380' . $digits;
    }
    if (strlen($digits) === 12 && strpos($digits, '380') === 0) {
        return '+' . $digits;
    }
    /* Поле підставляє «+380», а людина за звичкою додає свій нуль — «+3800931234567».
       Зайвий нуль прибираємо, інакше в CRM з'явиться двійник. */
    if (strlen($digits) === 13 && strpos($digits, '3800') === 0) {
        return '+38' . substr($digits, 3);
    }
    return strpos($phone, '+') === 0 ? '+' . $digits : $digits;
}

function send_crm(string $title, string $name, string $church, string $phone, array $lines): bool
{
    $key = setting('crm_key');
    $business = setting('crm_business');
    $funnel = setting('crm_funnel');
    if ($key === '' || $business === '' || $funnel === '') {
        return false;
    }
    $url = setting('crm_url');
    if ($url === '') {
        $url = 'https://api.my-community.pp.ua/api/api-lead/create';
    }

    /* У коментар іде те саме, що бачить Telegram, — крім імені й телефону:
       вони вже окремими полями картки. */
    $comment = implode("\n", array_merge([$title], array_slice($lines, 2)));
    $phone = crm_phone($phone);

    $fields = [crm_field('comment', 'textarea', CRM_FIELD_COMMENT, $comment, 'Коментар')];
    if ($phone !== '') {
        $fields[] = crm_field('phone', 'phone', CRM_FIELD_PHONE, $phone, 'Номер телефону');
    }
    $fields[] = crm_field('lead_source', 'text', CRM_FIELD_SOURCE, 'mychurch.com.ua', 'Джерело Ліда');

    /* Назва картки в CRM: церква попереду — у списку воронки менеджер бачить,
       від кого заявка, не відкриваючи її. Без назви церкви лишається ім'я. */
    $cardTitle = $church !== ''
        ? $title . ' — ' . $church . ' · ' . $name
        : $title . ' — ' . $name;

    return post_json($url, [
        'title' => $cardTitle,
        'businessId' => $business,
        'funnelId' => $funnel,
        'sourceType' => 'website',
        'clientPhone' => $phone,
        'blocks' => [[
            'blockId' => crm_id(),
            'blockInstructionId' => CRM_BLOCK_INSTRUCTION,
            'blockSlug' => 'lead_info',
            'sections' => [[
                'sectionId' => crm_id(),
                'sectionInstructionId' => CRM_SECTION_INSTRUCTION,
                'sectionSlug' => 'basic_info',
                'label' => 'ПРО ЛІД',
                'fields' => $fields,
            ]],
        ]],
    ], ['X-API-KEY: ' . $key]);
}

/* Другий канал, якщо хостинг уміє слати пошту і в налаштуваннях є адреса.
   Потрібен рівно для одного: щоб лід не зник, поки Telegram недоступний. */
/* Пошта через Resend — хостингова mail() на шаредах часто мовчки не доходить
   (лист або в спамі, або нікуди). Ключ лежить там само, де решта секретів;
   без нього все працює як раніше, через mail(). */
function send_resend(string $subject, string $text): bool
{
    $key = setting('resend_key');
    $to = setting('email_to');
    if ($key === '' || $to === '') {
        return false;
    }
    $from = setting('email_from');
    if ($from === '') {
        $from = 'Сайт «Моя Церква» <onboarding@resend.dev>';
    }
    return post_json('https://api.resend.com/emails', [
        'from' => $from,
        'to' => array_map('trim', explode(',', $to)),
        'subject' => $subject,
        'text' => $text,
    ], ['Authorization: Bearer ' . $key]);
}

function send_email(string $subject, string $text): bool
{
    if (send_resend($subject, $text)) {
        return true;
    }
    $to = setting('email_to');
    if ($to === '' || !function_exists('mail')) {
        return false;
    }
    $from = setting('email_from');
    if ($from === '') {
        $host = isset($_SERVER['HTTP_HOST']) ? preg_replace('/[^a-z0-9.\-]/i', '', (string) $_SERVER['HTTP_HOST']) : 'localhost';
        $from = 'site@' . $host;
    }
    $headers = "From: " . $from . "\r\n"
        . "Content-Type: text/plain; charset=utf-8\r\n"
        . "MIME-Version: 1.0\r\n";
    $encoded = '=?UTF-8?B?' . base64_encode($subject) . '?=';
    return @mail($to, $encoded, $text, $headers);
}

/* ── Розбір заявки ─────────────────────────────────────────────────────── */

/* Тіло ліда — це кілька рядків; мегабайти сюди приходять тільки зі зла. */
const MAX_BODY = 8192;

$raw = file_get_contents('php://input');
if (!is_string($raw)) {
    $raw = '';
}
if (strlen($raw) > MAX_BODY) {
    respond(413, ['ok' => false, 'error' => 'too_large']);
}
$body = json_decode($raw, true);
if (!is_array($body)) {
    respond(400, ['ok' => false, 'error' => 'bad_json']);
}

/* Бот заповнив приховане поле — тихо відповідаємо «ок», нікуди не шлемо. */
if (clean(isset($body['company']) ? $body['company'] : '', 100) !== '') {
    respond(200, ['ok' => true]);
}

$name = line_value(isset($body['name']) ? $body['name'] : '', 80);
$phone = line_value(isset($body['phone']) ? $body['phone'] : '', 32);
$digits = preg_replace('/\D/u', '', $phone);
$nameLength = function_exists('mb_strlen') ? mb_strlen($name, 'UTF-8') : strlen($name);
if ($nameLength < 2 || strlen((string) $digits) < 9) {
    respond(422, ['ok' => false, 'error' => 'invalid']);
}

$source = (isset($body['source']) && $body['source'] === 'brief') ? 'brief' : 'demo';
$dedupeKey = $source . '|' . $digits;

/* Заслінки — до збирання повідомлення: флуд не має коштувати нам роботи. */
$verdict = gate(client_ip(), $dedupeKey);
if ($verdict === 'rate_limited' || $verdict === 'rate_limited_all') {
    if ($verdict === 'rate_limited_all') {
        error_log('[lead] спрацювала загальна заслінка — схоже на ботнет');
    }
    respond(429, ['ok' => false, 'error' => 'rate_limited']);
}
/* Дубль: той самий телефон із тієї самої форми. Відповідаємо «ок» —
   заявка справді прийнята, просто повідомлення вже пішло. Форма покаже
   «дякуємо», а не помилку, і людина не почне слати втретє. */
if ($verdict === 'duplicate') {
    respond(200, ['ok' => true, 'duplicate' => true]);
}

$title = $source === 'brief' ? '🧩 Бриф із /modules' : '📞 Заявка на демо';
$size = line_value(isset($body['size']) ? $body['size'] : '', 60);
$about = clean(isset($body['about']) ? $body['about'] : '', 2000);
$page = line_value(isset($body['page']) ? $body['page'] : '', 200);
$utm = line_value(isset($body['utm']) ? $body['utm'] : '', 300);
$goals = goal_labels(isset($body['goals']) ? $body['goals'] : null);

$tools = [];
if (isset($body['tools']) && is_array($body['tools'])) {
    foreach (array_slice($body['tools'], 0, 12) as $tool) {
        $value = line_value($tool, 40);
        if ($value !== '') {
            $tools[] = $value;
        }
    }
}

$church = line_value(isset($body['church']) ? $body['church'] : '', 120);

$lines = ["Ім'я: " . $name, 'Телефон: ' . $phone];
if ($church !== '') {
    $lines[] = 'Церква: ' . $church;
}
if ($size !== '') {
    $lines[] = 'Розмір: ' . $size;
}
if ($tools) {
    $lines[] = 'Інструменти: ' . implode(', ', $tools);
}
if ($goals) {
    $lines[] = 'Хочуть покращити: ' . implode(', ', $goals);
}
if ($about !== '') {
    $lines[] = 'Побажання: ' . $about;
}
if ($page !== '') {
    $lines[] = 'Сторінка: ' . $page;
}
if ($utm !== '') {
    /* Мітки кампанії: по них видно, яка реклама привела заявку. */
    $lines[] = 'Кампанія: ' . $utm;
}
$lines[] = 'Мова: ' . ((isset($body['lang']) && $body['lang'] === 'en') ? 'en' : 'ua');
$lines[] = 'Час: ' . gmdate('c');

/* Один набір рядків — два представлення: чистий текст у пошту,
   екранований і з жирним заголовком у Telegram. */
$text = implode("\n", array_merge([$title], $lines));
$html = implode("\n", array_merge(
    ['<b>' . escape_html($title) . '</b>'],
    array_map('escape_html', $lines)
));

/* Канали незалежні: CRM — головний (там картка й воронка), Telegram —
   щоб менеджер побачив заявку одразу. Помилка одного не скасовує інший. */
$delivered = [];
if (send_crm($title, $name, $church, $phone, $lines)) {
    $delivered[] = 'crm';
}
if (send_telegram($html)) {
    $delivered[] = 'telegram';
}
if (send_email($source === 'brief' ? 'Бриф з сайту — ' . $name : 'Заявка на демо — ' . $name, $text)) {
    $delivered[] = 'email';
}

if (!$delivered) {
    /* Жоден канал не відпрацював — лід не має зникнути безслідно:
       кладемо його поруч зі станом заслінок, щоб можна було передзвонити. */
    forget($dedupeKey);
    @file_put_contents(
        state_dir() . '/lead-failed.log',
        gmdate('c') . ' ' . str_replace("\n", ' | ', $text) . "\n",
        FILE_APPEND | LOCK_EX
    );
    error_log('[lead] не доставлено: ' . str_replace("\n", ' | ', $text));
    $configured = (setting('telegram_token') !== '' && setting('telegram_chat') !== '')
        || (setting('crm_key') !== '' && setting('crm_funnel') !== '');
    respond(503, ['ok' => false, 'error' => $configured ? 'delivery_failed' : 'not_configured']);
}

respond(200, ['ok' => true, 'delivered' => $delivered]);
