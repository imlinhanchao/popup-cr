# 摸鱼派弹窗聊天室

支持在摸鱼派网页非聊天室页面显示一个小窗聊天室。另外支持弹出独立窗口。

## 调试扩展

运行 `npm run dev`，然后将 5173 端口映射到域名上（需配置 https）。

然后使用鱼排扩展集市的[鱼排扩展调试器](https://ext.adventext.fun/item/10)。在摸鱼派页面按下 `Ctrl + Shift + Alt + D` 调出扩展调试窗口，填入如下代码：

```js
const { activate } = await import('https://your.domain.com/module.js?t=' + Date.now())
activate(window, document, fishpi)
```

确定后就会载入扩展了。后面再更新代码，只要刷新即可重载。

