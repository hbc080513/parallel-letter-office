# 平行世界回信邮局 · Parallel Letter Office

[GitHub 仓库](https://github.com/hbc080513/parallel-letter-office) · [在线体验](https://hbc080513.github.io/parallel-letter-office/)

一个治愈系单页书信互动项目。你可以写给 **过去的自己、未来的自己、平行世界的自己**，或投进 **匿名树洞**；页面会生成一封有温度的回信，并让文字像墨迹一样逐字浮现。

项目是一个可以直接双击打开的单文件 HTML，不需要构建工具、不需要安装依赖，打开就能写第一封信。

## 功能

- 四种收信对象，各自有不同的语气与视角
- 三种信纸皮肤：复古牛皮纸、简约白纸、星空平行世界
- 回信逐字出现，标点处有自然停顿；点击信纸可立即展开全文
- 首屏只显示写信区，寄出后才出现回信面板
- 古风氛围纯音乐：D 宫五声、古筝/琵琶式拨弦，Web Audio 实时生成
- 回信朗读：
  - 公开版通过服务端代理调用 MiniMax `female-shaonv` 温柔少女声
  - 代理不可用时自动回退浏览器 Web Speech
- 情绪识别与排版：根据来信内容选择安慰、劝解、陪伴或庆祝的语气
- 一键复制回信、导出信纸图片
- 响应式布局，适配桌面与手机

## 快速开始

```bash
git clone https://github.com/hbc080513/parallel-letter-office.git
cd parallel-letter-office
```

直接双击打开 `index.html` 即可。

没有后端或网络访问不到 Vercel 时，页面会自动使用内置的本地回信逻辑和浏览器朗读，仍可完整演示。

## 公开演示的 API

公开版没有把 DeepSeek / MiniMax Key 放进前端，而是通过 `server/vercel` 里的 Serverless Function 代理：

- `POST /api/reply` → DeepSeek Chat
- `POST /api/tts` → MiniMax T2A v2

需要配置的环境变量：

```text
DEEPSEEK_API_KEY
MINIMAX_API_KEY
```

公开演示的限制（防止 Key 被刷）：

- 每个 IP 每天约 4 次 AI 回信
- 每个 IP 每天约 6 次 MiniMax 朗读
- 每个函数实例另有全局上限；超限会自动回退本地模式

这些限制是轻量实现，适合个人演示，不适合高流量生产环境。若要长期公开运营，建议换成 Redis / KV 做持久化限流，并加 Turnstile 或登录。

### 自行部署后端

```bash
cd server/vercel
npx vercel --prod
```

然后在 Vercel 项目里添加上述两个环境变量，重新部署。前端在 `index.html` 顶部修改：

```js
const DEEPSEEK_CONFIG = {
  endpoint: "https://你的域名/api/reply",
  useProxy: true
};

const MINIMAX_CONFIG = {
  endpoint: "https://你的域名/api/tts",
  useProxy: true
};
```

如果是自建域名，把 `api/_lib.js` 里的 `ALLOWED_ORIGIN` 改成你的页面域名。

## 安全提醒

- 不要在前端填写真实 API Key，也不要把 `.env` 提交到仓库
- Key 只放在 Vercel 环境变量或自己的后端
- 本次公开仓库中的 Key 已清空
- 如果 Key 曾经出现在截图、聊天或公开文件中，建议重新生成

## 技术栈

- 原生 HTML / CSS / JavaScript，单文件结构
- Web Audio API 实时生成背景音乐
- Web Speech API 作为朗读兜底
- DeepSeek Chat API（服务端代理）
- MiniMax T2A API（服务端代理）
- Vercel Serverless Functions
- `html2canvas` CDN（仅导出图片时加载）

## 项目结构

```text
parallel-letter-office/
├── index.html
├── server/vercel/
│   ├── api/reply.js
│   ├── api/tts.js
│   └── api/_lib.js
├── README.md
└── LICENSE
```

## 开源协议

[MIT](LICENSE)

---

如果这个项目让你想起某个想写信的人，欢迎 Star，或把它改成你自己的版本。
