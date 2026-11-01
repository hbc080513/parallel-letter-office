const {
  setCors,
  sendJson,
  sendError,
  checkQuota,
  clampNumber,
  getBody,
  fetchWithTimeout
} = require("./_lib");

const ALLOWED_VOICES = new Set([
  "female-shaonv",
  "female-chengshu",
  "female-yujie"
]);

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

  const text = typeof body.text === "string" ? body.text.trim() : "";
  if (!text) return sendError(req, res, 400, "没有要朗读的文字。");
  if (text.length > 1000) {
    return sendError(req, res, 413, "朗读文字太长，请缩短后再试。");
  }

  const voiceSetting =
    body.voice_setting && typeof body.voice_setting === "object" ? body.voice_setting : {};
  const requestedVoice = voiceSetting.voice_id || body.voiceId;
  const voiceId = ALLOWED_VOICES.has(requestedVoice) ? requestedVoice : "female-shaonv";
  const speed = clampNumber(voiceSetting.speed ?? body.speed, 0.7, 1.1, 0.9);
  const pitch = clampNumber(voiceSetting.pitch ?? body.pitch, -6, 6, 0);

  const quota = checkQuota(req, "tts");
  if (!quota.ok) return sendError(req, res, 429, quota.message);

  try {
    const upstream = await fetchWithTimeout(
      "https://api.minimaxi.com/v1/t2a_v2",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.MINIMAX_API_KEY}`
        },
        body: JSON.stringify({
          model: "speech-02-hd",
          text,
          stream: false,
          voice_setting: {
            voice_id: voiceId,
            speed,
            vol: 1,
            pitch
          },
          audio_setting: {
            sample_rate: 32000,
            bitrate: 128000,
            format: "mp3",
            channel: 1
          },
          language_boost: "Chinese"
        })
      },
      28000
    );

    const textResponse = await upstream.text();
    let data = null;
    try {
      data = JSON.parse(textResponse);
    } catch (error) {
      // 由下方统一处理。
    }

    if (!upstream.ok) {
      const detail =
        data && data.base_resp && data.base_resp.status_msg
          ? String(data.base_resp.status_msg).slice(0, 300)
          : `MiniMax HTTP ${upstream.status}`;
      return sendError(req, res, upstream.status >= 500 ? 502 : upstream.status, detail);
    }

    if (!data || !data.data || !data.data.audio) {
      const detail =
        data && data.base_resp && data.base_resp.status_msg
          ? String(data.base_resp.status_msg).slice(0, 300)
          : "MiniMax 没有返回音频。";
      return sendError(req, res, 502, detail);
    }

    return sendJson(req, res, 200, data);
  } catch (error) {
    const aborted = error && error.name === "AbortError";
    return sendError(
      req,
      res,
      504,
      aborted ? "语音合成超时，请稍后再试。" : "语音合成服务暂时不可用，请稍后再试。"
    );
  }
};
