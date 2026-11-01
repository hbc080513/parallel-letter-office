const {
  setCors,
  sendJson,
  sendError,
  checkQuota,
  clampNumber,
  getBody,
  fetchWithTimeout
} = require("./_lib");

module.exports = async function handler(req, res) {
  setCors(req, res);

  if (req.method === "OPTIONS") {
    res.statusCode = 204;
    return res.end();
  }

  if (req.method !== "POST") {
    return sendError(req, res, 405, "只支持 POST 请求。");
  }

  let body;
  try {
    body = getBody(req);
  } catch (error) {
    return sendError(req, res, 400, "请求格式不正确。");
  }

  const messages = Array.isArray(body.messages) ? body.messages : [];
  if (!messages.length || messages.length > 12) {
    return sendError(req, res, 400, "信件上下文长度不正确。");
  }

  const totalChars = messages.reduce((sum, message) => {
    return sum + (message && typeof message.content === "string" ? message.content.length : 0);
  }, 0);

  if (totalChars > 16000) {
    return sendError(req, res, 413, "信件内容太长，请缩短后再试。");
  }

  const quota = checkQuota(req, "reply");
  if (!quota.ok) return sendError(req, res, 429, quota.message);

  try {
    const upstream = await fetchWithTimeout(
      "https://api.deepseek.com/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.DEEPSEEK_API_KEY}`
        },
        body: JSON.stringify({
          model: process.env.DEEPSEEK_MODEL || "deepseek-chat",
          messages,
          temperature: clampNumber(body.temperature, 0.6, 1.1, 0.9),
          max_tokens: Math.round(clampNumber(body.max_tokens, 300, 900, 900)),
          stream: false
        })
      },
      28000
    );

    const text = await upstream.text();
    let data = null;
    try {
      data = JSON.parse(text);
    } catch (error) {
      // 由下方统一处理。
    }

    if (!upstream.ok) {
      const detail =
        data && data.error && data.error.message
          ? String(data.error.message).slice(0, 300)
          : `DeepSeek HTTP ${upstream.status}`;
      return sendError(req, res, upstream.status >= 500 ? 502 : upstream.status, detail);
    }

    if (!data) {
      return sendError(req, res, 502, "AI 返回了无法解析的内容，请稍后再试。");
    }

    return sendJson(req, res, 200, data);
  } catch (error) {
    const aborted = error && error.name === "AbortError";
    return sendError(
      req,
      res,
      504,
      aborted ? "AI 回复超时，请稍后再试。" : "AI 服务暂时不可用，请稍后再试。"
    );
  }
};
