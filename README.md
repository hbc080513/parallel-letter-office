# 平行世界回信邮局 · Parallel Letter Office

> 把没能说出口的话，寄给另一个时空的你。

[GitHub 仓库](https://github.com/hbc080513/parallel-letter-office) · 一个治愈系单页书信互动项目。你可以写给 **过去的自己、未来的自己、平行世界的自己**，或投进 **匿名树洞**；页面会生成一封有温度的回信，并让文字像墨迹一样逐字浮现。

项目是一个可以直接双击打开的单文件 HTML，不需要构建工具、不需要安装依赖，打开就能写第一封信。

## 功能

- 四种收信对象，各自有不同的语气与视角
- 三种信纸皮肤：复古牛皮纸、简约白纸、星空平行世界
- 回信逐字出现，标点处有自然停顿；点击信纸可立即展开全文
- 首屏只显示写信区，寄出后才出现回信面板
- 古风氛围纯音乐：D 宫五声、古筝/琵琶式拨弦，Web Audio 实时生成
- 回信朗读：
  - 配置 MiniMax 后使用 `female-shaonv` 温柔少女声合成
  - 未配置或合成失败时，自动回退浏览器 Web Speech
- 情绪识别与排版：根据来信内容选择安慰、劝解、陪伴或庆祝的语气
- 一键复制回信、导出信纸图片
- 响应式布局，适配桌面与手机

## 快速开始

```bash
git clone https://github.com/hbc080513/parallel-letter-office.git
cd parallel-letter-office
```

直接双击打开 `index.html` 即可。

没有 API Key 也能运行：回信会使用内置的本地生成逻辑，适合离线演示。

## 配置 API（可选）

打开 `index.html`，在文件顶部找到：

```js
const DEEPSEEK_CONFIG = {
  apiKey: "",
  endpoint: "https://api.deepseek.com/chat/completions",
  model: "deepseek-chat",
  // ...
};

const MINIMAX_CONFIG = {
  apiKey: "",
  endpoint: "https://api.minimaxi.com/v1/t2a_v2",
  voiceId: "female-shaonv",
  // ...
};
```

- **DeepSeek**：填入 API Key 后，回信由 `deepseek-chat` 生成；失败会自动回退本地回信。
- **MiniMax**：填入 API Key 后，朗读会调用 MiniMax T2A 合成；失败会自动回退浏览器朗读。
- 两个 Key 都是可选的，留空即可使用本地模式。

### 安全提醒

这是一个纯前端项目，Key 会留在访问者的 HTML 中。**不要把填好 Key 的文件公开部署或提交到仓库**。正式项目应该把 Key 放在自己的后端或代理服务里。

仓库中的 Key 已清空，请只在本地填写。

## 技术栈

- 原生 HTML / CSS / JavaScript，单文件结构
- Web Audio API 实时生成背景音乐
- Web Speech API 作为朗读兜底
- DeepSeek Chat API（可选）
- MiniMax T2A API（可选）
- `html2canvas` CDN（仅导出图片时加载）

## 浏览器说明

- 推荐 Chrome / Edge
- 带声音的自动播放受浏览器策略限制；背景音乐首次被拦截时，点击页面任意位置即可开始
- 朗读音色和语音合成能力取决于浏览器/系统已安装的语音，以及是否配置了 MiniMax

## 项目结构

```text
parallel-letter-office/
├── index.html
├── README.md
└── LICENSE
```

## 开源协议

[MIT](LICENSE)

---

如果这个项目让你想起某个想写信的人，欢迎 Star，或把它改成你自己的版本。
