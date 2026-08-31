<?php
/**
 * SIGIL briefing-form endpoint — PHP edition, for Namecheap / cPanel hosting.
 *
 * Same contract as the Cloudflare Worker in worker/briefing.js:
 *   POST /api/briefing  (JSON or form-encoded)  {name, organization, email, message, website}
 *   → 200 {ok:true, id:"SIGIL-…"}  |  4xx/5xx {ok:false, error:"…"}
 * The form's front-end (src/assets/briefing.js) posts here; the rewrite in
 * public/.htaccess maps /api/briefing to this file.
 *
 * Rules follow the Worker (name 2–200, email shape, message 10–5000, honeypot
 * "website" must be empty) plus: organization ≤ 200 (mirrors the form's
 * maxlength), header-safe email characters only, and a small per-IP / global
 * rate limit (the Worker relied on Cloudflare for that).
 *
 * Mail leaves through PHP mail() → the server's local MTA (exim on cPanel), with
 * the envelope sender set to `from` so SPF/DMARC can align and cPanel signs DKIM
 * for sigilsovereign.com.
 *  - If the mailbox for `to` is hosted on this cPanel account, delivery is local.
 *  - If MX points elsewhere (Zoho, Namecheap Private Email…), set cPanel →
 *    Email Routing → "Remote Mail Exchanger" for the domain first.
 *
 * Overrides live in api/briefing.config.php (NOT in the repository; the CI deploy
 * never touches files it did not upload, and .htaccess refuses to serve it):
 *   <?php return ['to' => 'info@sigilsovereign.com',
 *                 'from' => 'website@sigilsovereign.com',
 *                 'receipt_secret' => 'a long random string'];
 *
 * Compatible with PHP 7.4+ (no match/never/str_contains). mbstring optional.
 */
declare(strict_types=1);

ini_set('display_errors', '0');
error_reporting(E_ALL);

const ALLOW_ORIGIN = 'https://sigilsovereign.com';
const MAX_BODY_BYTES = 65536;
// Abuse limits: the account's outbound-mail quota is shared by the whole site.
const RATE_PER_IP        = 5;     // submissions per client IP …
const RATE_IP_WINDOW     = 600;   // … per 10 minutes
const RATE_GLOBAL        = 60;    // submissions from everyone …
const RATE_GLOBAL_WINDOW = 3600;  // … per hour

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');

function respond(array $obj, int $status = 200): void
{
  http_response_code($status);
  echo json_encode($obj, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
  exit;
}

// Whatever goes wrong, the caller gets JSON — never a bare 500 or an HTML page.
set_exception_handler(static function (Throwable $e): void {
  error_log('briefing: ' . get_class($e) . ': ' . $e->getMessage());
  respond(['ok' => false, 'error' => 'server_error'], 500);
});

$config = [
  'to'             => 'info@sigilsovereign.com',
  // Must be on this domain (SPF / DKIM alignment); does not need to be a real mailbox.
  'from'           => 'website@sigilsovereign.com',
  // Empty → receipt ids are still unique, just not signed.
  'receipt_secret' => '',
];
$localConfig = __DIR__ . '/briefing.config.php';
if (is_file($localConfig)) {
  $override = include $localConfig;
  if (is_array($override)) {
    foreach (['to', 'from', 'receipt_secret'] as $k) {
      if (isset($override[$k]) && is_string($override[$k])) {
        $config[$k] = $override[$k];
      }
    }
  }
}
foreach (['to', 'from'] as $k) {
  // These reach mail() and the sendmail command line: accept only a plain address.
  if (filter_var($config[$k], FILTER_VALIDATE_EMAIL) === false || preg_match('/[^\x21-\x7E]/', $config[$k])) {
    error_log("briefing: invalid '{$k}' address in configuration");
    respond(['ok' => false, 'error' => 'server_error'], 500);
  }
}

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
if ($method === 'OPTIONS') {
  http_response_code(204);
  exit;
}
if ($method !== 'POST') {
  header('Allow: POST, OPTIONS');
  respond(['ok' => false, 'error' => 'method_not_allowed'], 405);
}

// Basic same-origin check (browsers always send Origin on a cross-site POST).
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if ($origin !== '' && $origin !== ALLOW_ORIGIN) {
  respond(['ok' => false, 'error' => 'bad_origin'], 403);
}

// ---- parse body ---------------------------------------------------------------
if ((int) ($_SERVER['CONTENT_LENGTH'] ?? 0) > MAX_BODY_BYTES) {
  respond(['ok' => false, 'error' => 'bad_request'], 400);
}
$contentType = $_SERVER['CONTENT_TYPE'] ?? ($_SERVER['HTTP_CONTENT_TYPE'] ?? '');
if (stripos($contentType, 'application/json') !== false) {
  $raw = file_get_contents('php://input', false, null, 0, MAX_BODY_BYTES + 1);
  if ($raw === false || strlen($raw) > MAX_BODY_BYTES) {
    respond(['ok' => false, 'error' => 'bad_request'], 400);
  }
  $data = json_decode($raw, true, 8);
  if (!is_array($data)) {
    respond(['ok' => false, 'error' => 'bad_request'], 400);
  }
} else {
  $data = $_POST;
}

$field = static function (string $key) use ($data): string {
  $v = $data[$key] ?? '';
  // NUL bytes are never legitimate and make mail() throw.
  return is_string($v) ? trim(str_replace("\0", '', $v)) : '';
};
$name         = $field('name');
$email        = $field('email');
$organization = $field('organization');
$message      = $field('message');
$website      = $field('website'); // honeypot

// Length in code points (mbstring if present, else a UTF-8-aware regex; bytes
// only for malformed UTF-8).
$length = static function (string $s): int {
  if (function_exists('mb_strlen')) {
    return mb_strlen($s, 'UTF-8');
  }
  $n = preg_match_all('/./su', $s);
  return $n === false ? strlen($s) : $n;
};

// ---- validation -----------------------------------------------------------------
if ($length($name) < 2 || $length($name) > 200) {
  respond(['ok' => false, 'error' => 'name'], 422);
}
// Worker's shape rule, plus header safety: printable ASCII, no address-syntax
// characters, so the value can sit in Reply-To: <…> unquoted.
if (!preg_match('/^[^\s@]+@[^\s@]+\.[^\s@]+$/', $email) || strlen($email) > 254
    || preg_match('/[^\x21-\x7E]|[<>"(),;:\\\\\[\]]/', $email)) {
  respond(['ok' => false, 'error' => 'email'], 422);
}
if ($length($message) < 10 || $length($message) > 5000) {
  respond(['ok' => false, 'error' => 'message'], 422);
}
if ($length($organization) > 200) {
  respond(['ok' => false, 'error' => 'organization'], 422);
}
// Honeypot: a hidden field named "website" must stay empty. Silently accept and drop.
if ($website !== '') {
  respond(['ok' => true, 'id' => 'ok']);
}

// Header-injection guard: nothing that reaches a mail header may contain CR/LF.
$oneLine = static function (string $s): string {
  return trim((string) preg_replace('/[\r\n]+/', ' ', $s));
};
$name         = $oneLine($name);
$organization = $oneLine($organization);

// ---- rate limit (token counts in a flock'd JSON file; fails open) ---------------
$rateLimited = static function (string $ip): bool {
  $file = rtrim(sys_get_temp_dir(), '/') . '/sigil-briefing-rate.json';
  $fh = @fopen($file, 'c+');
  if ($fh === false) {
    return false; // cannot throttle here: allow rather than break the form
  }
  $limited = false;
  if (flock($fh, LOCK_EX)) {
    $now  = time();
    $data = json_decode((string) stream_get_contents($fh), true);
    if (!is_array($data)) {
      $data = [];
    }
    $ips = is_array($data['ip'] ?? null) ? $data['ip'] : [];
    $all = is_array($data['all'] ?? null) ? $data['all'] : [];
    // Prune expired stamps.
    foreach ($ips as $k => $stamps) {
      $stamps = array_values(array_filter(is_array($stamps) ? $stamps : [], static function ($t) use ($now) {
        return is_int($t) && $t > $now - RATE_IP_WINDOW;
      }));
      if ($stamps) { $ips[$k] = $stamps; } else { unset($ips[$k]); }
    }
    $all = array_values(array_filter($all, static function ($t) use ($now) {
      return is_int($t) && $t > $now - RATE_GLOBAL_WINDOW;
    }));
    $key = hash('sha256', $ip);
    $mine = $ips[$key] ?? [];
    if (count($mine) >= RATE_PER_IP || count($all) >= RATE_GLOBAL) {
      $limited = true;
    } else {
      $mine[] = $now;
      $ips[$key] = $mine;
      $all[] = $now;
      rewind($fh);
      ftruncate($fh, 0);
      fwrite($fh, (string) json_encode(['ip' => $ips, 'all' => $all]));
      fflush($fh);
    }
    flock($fh, LOCK_UN);
  }
  fclose($fh);
  return $limited;
};
if ($rateLimited((string) ($_SERVER['REMOTE_ADDR'] ?? '0.0.0.0'))) {
  header('Retry-After: ' . RATE_IP_WINDOW);
  respond(['ok' => false, 'error' => 'rate_limited'], 429);
}

// ---- receipt id (HMAC, same shape as the Worker: SIGIL- + 16 hex) ----------------
$secret  = $config['receipt_secret'] !== '' ? $config['receipt_secret'] : 'unsigned';
$sig     = hash_hmac('sha256', $email . '|' . (string) (int) round(microtime(true) * 1000), $secret, true);
$receipt = 'SIGIL-' . bin2hex(substr($sig, 0, 8));

// ---- compose + send -------------------------------------------------------------
// RFC 2047 for non-ASCII header text: a sequence of encoded-words of ≤ 75 chars
// (≤ 45 input bytes each, cut on UTF-8 character boundaries).
$encodeHeader = static function (string $s): string {
  if (!preg_match('/[^\x20-\x7E]/', $s)) {
    return $s;
  }
  $chars = preg_split('//u', $s, -1, PREG_SPLIT_NO_EMPTY);
  if ($chars === false) {
    $chars = str_split($s);
  }
  $words = [];
  $chunk = '';
  foreach ($chars as $ch) {
    if ($chunk !== '' && strlen($chunk) + strlen($ch) > 45) {
      $words[] = '=?UTF-8?B?' . base64_encode($chunk) . '?=';
      $chunk = '';
    }
    $chunk .= $ch;
  }
  if ($chunk !== '') {
    $words[] = '=?UTF-8?B?' . base64_encode($chunk) . '?=';
  }
  return implode(' ', $words);
};

$subject = 'Briefing request — ' . ($organization !== '' ? $organization : $name);
$body =
  "New briefing request from sigilsovereign.com\n\n" .
  "Name:         {$name}\n" .
  "Organization: " . ($organization !== '' ? $organization : '(not given)') . "\n" .
  "Email:        {$email}\n" .
  "Receipt:      {$receipt}\n" .
  "Received:     " . gmdate('Y-m-d\TH:i:s\Z') . "\n\n" .
  "Message:\n" . $message . "\n";

$headers = [
  'From: SIGIL website <' . $config['from'] . '>',
  'Reply-To: <' . $email . '>',
  'MIME-Version: 1.0',
  'Content-Type: text/plain; charset=UTF-8',
  // quoted-printable keeps every line under the RFC 5322 limit without ever
  // splitting a multi-byte UTF-8 character.
  'Content-Transfer-Encoding: quoted-printable',
  'X-Mailer: sigilsovereign-briefing',
];

try {
  $sent = @mail(
    $config['to'],
    $encodeHeader($subject),
    quoted_printable_encode($body),
    implode("\r\n", $headers),
    '-f' . $config['from']   // envelope sender → Return-Path on our domain
  );
} catch (Throwable $e) {
  error_log('briefing: mail() failed: ' . $e->getMessage());
  $sent = false;
}
if (!$sent) {
  respond(['ok' => false, 'error' => 'send_failed'], 502);
}

respond(['ok' => true, 'id' => $receipt]);
