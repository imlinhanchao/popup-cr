const CSS = `
.popup-cr-wrapper {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 999999;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.popup-cr {
  background: #ffffff;
  border: 1px solid #e1e4e8;
  border-radius: 8px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  width: 340px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.popup-cr-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 14px;
  background: #0969da;
  color: #ffffff;
}

.popup-cr-title {
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 0.3px;
}

.popup-cr-close {
  background: transparent;
  border: none;
  color: #ffffff;
  font-size: 20px;
  line-height: 1;
  cursor: pointer;
  padding: 0 2px;
  opacity: 0.8;
  transition: opacity 0.15s;
}

.popup-cr-close:hover {
  opacity: 1;
}

.popup-cr-body {
  padding: 12px 14px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.popup-cr-textarea {
  width: 100%;
  min-height: 100px;
  padding: 8px 10px;
  border: 1px solid #d0d7de;
  border-radius: 6px;
  font-size: 13px;
  font-family: inherit;
  resize: vertical;
  box-sizing: border-box;
  outline: none;
  transition: border-color 0.15s;
}

.popup-cr-textarea:focus {
  border-color: #0969da;
  box-shadow: 0 0 0 3px rgba(9, 105, 218, 0.15);
}

.popup-cr-actions {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}

.popup-cr-btn {
  padding: 5px 14px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  border: 1px solid transparent;
  transition: background 0.15s;
}

.popup-cr-btn-submit {
  background: #0969da;
  color: #ffffff;
  border-color: #0969da;
}

.popup-cr-btn-submit:hover {
  background: #0860c8;
}

.popup-cr-btn-cancel {
  background: #f6f8fa;
  color: #24292f;
  border-color: #d0d7de;
}

.popup-cr-btn-cancel:hover {
  background: #eef1f4;
}
`;

let stylesInjected = false;

/**
 * Inject popup styles into the document <head>.
 * Safe to call multiple times — only injects once.
 */
export function injectStyles(): void {
  if (stylesInjected) return;
  const style = document.createElement('style');
  style.textContent = CSS;
  document.head.appendChild(style);
  stylesInjected = true;
}
