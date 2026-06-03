# 摸鱼派弹窗聊天室

支持在摸鱼派网页非聊天室页面显示一个小窗聊天室。另外支持弹出独立窗口。

## 技术栈

- Vue 3 (从 CDN 导入)
- TypeScript
- tsdown (构建工具)

## 项目结构

```
src/
├── components/          # Vue 组件
│   ├── ChatMessage.ts  # 聊天消息组件
│   └── PopupApp.ts     # 主应用组件
├── index.tsx           # 入口文件，导出 mount 函数
├── styles.ts           # 样式定义
└── types.d.ts          # TypeScript 类型声明
```

## 组件说明

### ChatMessage 组件
负责渲染单条聊天消息，支持：
- 普通文本消息
- 红包消息（含猜拳红包）
- 音乐消息
- 天气消息
- 弹幕消息
- 自定义消息

### PopupApp 组件
主应用组件，包含：
- 聊天窗口的显示/隐藏
- 消息列表渲染
- 消息发送
- 窗口拖拽
- 设置持久化

## 调试扩展

运行 `npm run dev`，然后将 5173 端口映射到域名上（需配置 https）。

然后使用鱼排扩展集市的[鱼排扩展调试器](https://ext.adventext.fun/item/10)。在摸鱼派页面按下 `Ctrl + Shift + Alt + D` 调出扩展调试窗口，填入如下代码：

```js
const { activate } = await import('https://your.domain.com/module.js?t=' + Date.now())
activate(window, document, fishpi)
```

确定后就会载入扩展了。后面再更新代码，只要刷新即可重载。

## 开发

```bash
# 安装依赖
npm install

# 开发模式（带热重载）
npm run dev

# 构建生产版本
npm run build
```

## 添加新组件

要添加新的 Vue 组件，只需：

1. 在 `src/components/` 目录创建新的 `.ts` 文件
2. 导出组件对象（包含 `setup` 和 `template`）
3. 在需要使用的组件中导入

示例：

```typescript
// src/components/MyComponent.ts
import { ref } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js';

export const MyComponent = {
  props: ['someProp'],
  setup(props) {
    const count = ref(0);
    return { count };
  },
  template: `<div>{{ count }}</div>`
};
```

