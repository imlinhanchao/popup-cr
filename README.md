# popup-cr

A lightweight popup UI component for [Tampermonkey](https://www.tampermonkey.net/) userscripts, built with [SeraJS](https://www.npmjs.com/package/serajs) and [Parcel](https://parceljs.org/).

## Features

- ⚡ Reactive UI powered by SeraJS signals
- 📦 Bundled to a single self-contained file via Parcel
- 🧩 Mount to any specified DOM element
- 🎨 Clean GitHub-style design
- 🔌 Ready-to-install Tampermonkey userscript output

## Project Structure

```
popup-cr/
├── src/
│   ├── index.jsx          # Main entry — exports mount() and PopupCR component
│   └── styles.js          # Popup CSS (injected as <style> tag at runtime)
├── scripts/
│   └── pack.mjs           # Post-build: prepends Tampermonkey metadata header
├── userscript.meta.js     # Tampermonkey metadata block template
├── index.html             # Development/demo page
└── package.json
```

## Getting Started

### Install dependencies

```bash
npm install
```

### Development (watch mode)

```bash
npm run dev
```

Open `index.html` in a browser to see the popup in action.

### Production build

```bash
npm run build
```

Produces two files in `dist/`:
- `dist/index.js` — raw bundle (for embedding as a library)
- `dist/popup-cr.user.js` — ready-to-install Tampermonkey userscript

## Usage

### As a Tampermonkey userscript

Install `dist/popup-cr.user.js` in Tampermonkey. The script exposes `window.popupCR` globally.

```js
// Mount the popup into any element
const container = document.querySelector('#my-element');
const { unmount } = popupCR.mount(container, {
  title: 'Code Review',
  onClose: () => console.log('closed'),
});

// Later, remove it
unmount();
```

### As a library

```html
<script src="dist/index.js"></script>
<script>
  const container = document.getElementById('root');
  popupCR.mount(container, { title: 'My Review' });
</script>
```

## API

### `popupCR.mount(container, options)`

Mounts the popup UI into `container`.

| Parameter | Type | Description |
|-----------|------|-------------|
| `container` | `HTMLElement` | DOM element to render the popup into |
| `options.title` | `string` | Popup title (default: `'Code Review'`) |
| `options.onClose` | `Function` | Callback invoked when the popup is closed |

Returns `{ unmount() }` — call `unmount()` to remove the popup from the DOM.

## Tech Stack

| Tool | Role |
|------|------|
| [SeraJS](https://www.npmjs.com/package/serajs) | Signal-based reactive UI library |
| [Parcel](https://parceljs.org/) | Zero-config bundler |
