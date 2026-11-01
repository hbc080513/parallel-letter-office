# 平行世界回信邮局 · Parallel Letter Office

[GitHub 仓库](https://github.com/hbc080513/parallel-letter-office) · [在线体验](https://hbc080513.github.io/parallel-letter-office/)

一个治愈系单页书信互动项目。你可以写给 **过去的自己、未来的自己、平行世界的自己**，或投进 **匿名树洞**；页面会生成一封有温度的回信，并让文字像墨迹一样逐字浮现。

**开箱即用：不需要安装、不需要 API Key、不需要服务器。** 下载 `index.html` 双击打开即可。

## 功能

- 四种收信对象，各自有不同的语气与视角
- 三种信纸皮肤：复古牛皮纸、简约白纸、星空平行世界
- 回信逐字出现，标点处有自然停顿；点击信纸可立即展开全文
- 首屏只显示写信区，寄出后才出现回信面板
- 古风氛围纯音乐：D 宫五声、古筝/琵琶式拨弦，Web Audio 实时生成
- 回信朗读：默认使用浏览器 Web Speech；配置 MiniMax 后可切换合成音色
- 情绪识别与排版：根据来信内容选择安慰、劝解、陪伴或庆祝的语气
- 一键复制回信、导出信纸图片
- 响应式布局，适配桌面与手机

## 直接使用

### 在线打开

https://hbc080513.github.io/parallel-letter-office/

### 下载到本地

```bash
git clone https://github.com/hbc080513/parallel-letter-office.git
cd parallel-letter-office
```

然后双击 `index.html`。

或者只下载 `index.html` 一个文件，放到任何地方打开。

没有 API Key 时：

- 回信由内置的本地情绪分析与回信生成器完成
- 朗读使用浏览器自带的 Web Speech
- 背景音乐、皮肤、复制、导出图片都正常

## 可选：接入 DeepSeek / MiniMax

公开页面刻意没有放 Key，避免被陌生人刷额度。

如果你自己在本地使用，可以打开 `index.html`，在顶部的配置里填写自己的 Key：

```js
const DEEPSEEK_CONFIG = {
  apiKey: "",
  // ...
};

const MINIMAX_CONFIG = {
  apiKey: "",
  // ...
};
```

- **DeepSeek**：用于生成 AI 回信；失败会自动回退本地回信
- **MiniMax**：用于 `female-shaonv` 温柔少女声朗读；失败会自动回退浏览器朗读
- 只想体验页面：两个都留空即可

> 注意：这是纯前端项目，Key 填进去就会留在页面里。**不要把填好 Key 的文件公开部署或提交到 GitHub。** 正式公开使用应把 Key 放在自己的后端代理中。

## 技术栈

- 原生 HTML / CSS / JavaScript，单文件结构
- Web Audio API 实时生成背景音乐
- Web Speech API 作为朗读兜底
- DeepSeek Chat API（可选）
- MiniMax T2A API（可选）
- `html2canvas` CDN（仅导出图片时加载）

## 浏览器说明

- 推荐 Chrome / Edge
- 带声音的自动播放受浏览器策略限制；背景音乐被拦截时，点击页面任意位置即可开始
- 朗读音色取决于浏览器/系统已安装的语音；配置 MiniMax 后优先使用合成音色

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
