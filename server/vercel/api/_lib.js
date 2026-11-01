const ALLOWED_ORIGIN = "https://hbc080513.github.io";

const LIMITS = {
  reply: { perIp: 4, global: 80 },
  tts: { perIp: 6, global: 120 }
};

const buckets = {
  day: "",
  global: { reply: 0, tts: 0 },
  ip: new Map()
};

function today() {
  return new Date().toISOString().slice(0, 10);
}

function resetIfNeeded() {
  const day = today();
  if (buckets.day === day) return;
  buckets.day = day;
  buckets.global.reply = 0;
  buckets.global.tts = 0;
  buckets.ip.clear();
}

function setCors(req, res) {
  const origin = req.headers.origin || "";
  if (origin === ALLOWED_ORIGIN || origin === "null") {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.setHeader("Vary", "Origin");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Accept");
  res.setHeader("Access-Control-Max-Age", "86400");
}

function sendJson(req, res, status, body) {
  setCors(req, res);
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.end(JSON.stringify(body));
}

function sendError(req, res, status, message) {
  sendJson(req, res, status, { error: { message } });
}

function clientIp(req) {
  const forwarded = req.headers["x-forwarded-for"];
  if (typeof forwarded === "string" && forwarded.length) {
    return forwarded.split(",")[0].trim();
  }
  return "unknown";
}

function checkQuota(req, kind) {
  resetIfNeeded();
  const ip = clientIp(req);
  const key = `${kind}:${ip}`;
  const limit = LIMITS[kind];
  const perIp = buckets.ip.get(key) || 0;

  if (perIp >= limit.perIp) {
    return { ok: false, message: "今天的体验次数已经用完，明天再来写信吧。" };
  }
  if (buckets.global[kind] >= limit.global) {
    return { ok: false, message: "今天邮局的体验额度已经用完，请明天再来。" };
  }

  buckets.ip.set(key, perIp + 1);
  buckets.global[kind] += 1;
  return { ok: true };
}

function clampNumber(value, min, max, fallback) {
  const n = Number(value);
  if (!Number.isFinite(n)) return fallback;
  return Math.min(max, Math.max(min, n));
}

function getBody(req) {
  if (req.body && typeof req.body === "object") return req.body;
  if (typeof req.body === "string" && req.body.trim()) {
    return JSON.parse(req.body);
  }
  return {};
}

async function fetchWithTimeout(url, options, timeoutMs) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

module.exports = {
  ALLOWED_ORIGIN,
  setCors,
  sendJson,
  sendError,
  checkQuota,
  clampNumber,
  getBody,
  fetchWithTimeout
};
