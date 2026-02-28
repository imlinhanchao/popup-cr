const CSS = `
.popup-cr-wrapper {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 999999;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  pointer-events: none; /* Let clicks pass through if not on children */
}
.fullscreen-popup.popup-cr-wrapper {
  position: static;
  width: 100%;
  height: 100%;
}

body.popup-only {
  height: 100%;
}

body.popup-only > * {
  display: none;
}

body.popup-only #popup-cr {
  display: block;
  height: 100%;
}

.popup-cr-wrapper > * {
  pointer-events: auto; /* Enable clicks on actual UI elements */
}

.chat-min-bar {
  background: #f0d463;
  color: #24292f;
  padding: 8px 16px;
  border-radius: 20px;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  font-size: 14px;
  transition: all 0.2s ease;
  user-select: none;
}

.fullscreen-popup .popup-cr-close {
  display: none; /* Hide close button in fullscreen mode */
}

.chat-min-bar:hover {
  background: #e5c856;
  transform: translateY(-2px);
}

.chat-min-bar svg {
  width: 16px;
  height: 16px;
  fill: currentColor;
}

/* chat window styles */
.chat-window {
  background: #ffffff;
  border: 1px solid #d0d7de;
  border-radius: 12px;
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.12), 0 4px 12px rgba(0, 0, 0, 0.08);
  width: 380px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  font-size: 14px;
  /* position: relative; Removed to support dragging with fixed positioning if needed, or keeping it for absolute layout */
}

.fullscreen-popup .chat-window {
  width: 100%;
  height: 100%;
  border-radius: 0;
}

.chat-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: #f6f8fa;
  border-bottom: 1px solid #d0d7de;
  color: #24292f;
  font-weight: 600;
  cursor: move; /* Indicate draggable */
  user-select: none;
}

.popup-cr-title {
  font-size: 15px;
  letter-spacing: 0.3px;
  color: #24292f;
  display: flex;
  align-items: center;
}

.popup-cr-close {
  background: transparent;
  border: none;
  color: #57606a;
  font-size: 22px;
  line-height: 1;
  cursor: pointer;
  padding: 0 4px;
  opacity: 0.7;
  transition: all 0.2s ease;
  border-radius: 4px;
}

.popup-cr-close:hover {
  opacity: 1;
  color: #24292f;
  background: #ebeef2;
}

.chat-body {
  padding: 16px 12px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  height: 450px;
  overflow-y: auto;
  scroll-behavior: smooth;
  background-color: #ffffff;
}

.fullscreen-popup .chat-body {
  height: auto;
}

/* Scrollbar styling */
.chat-body::-webkit-scrollbar {
  width: 6px;
}
.chat-body::-webkit-scrollbar-track {
  background: transparent;
}
.chat-body::-webkit-scrollbar-thumb {
  background-color: #d0d7de;
  border-radius: 20px;
}

.chat-message {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 2px 8px;
  border-radius: 8px;
  transition: background 0.2s ease;
  position: relative;
}

.chat-message:hover {
  background: #f6f8fa;
}

.chat-message .avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  flex-shrink: 0;
  border: 1px solid #e1e4e8;
  object-fit: cover;
}

.chat-message-main {
  flex: 1;
  min-width: 0; 
  display: flex;
  flex-direction: column;
}

.chat-message .nickname {
  font-weight: 600;
  font-size: 13px;
  color: #24292f;
  margin-bottom: 2px;
  display: block;
}

.chat-message .content {
  word-break: break-word;
  color: #24292f;
}

.chat-message .content img {
  max-width: 100%;
  height: auto;
  border-radius: 4px;
  margin-top: 4px;
}

.chat-message .time {
  position: absolute;
  top: 8px;
  right: 12px;
  font-size: 11px;
  color: #8c959f;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.chat-message:hover .time {
  opacity: 1;
}

.chat-input-container {
  display: flex;
  gap: 8px;
  padding: 12px 16px;
  border-top: 1px solid #d0d7de;
  background: #f6f8fa;
  align-items: center;
}

.chat-input-container input {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #d0d7de;
  border-radius: 20px;
  font-size: 14px;
  outline: none;
  transition: all 0.2s ease;
  background: #ffffff;
}

.chat-input-container input:focus {
  border-color: #f0d463;
  box-shadow: 0 0 0 3px rgba(240, 212, 99, 0.15);
}

.chat-input-container button {
  background: #f0d463;
  color: #24292f;
  border: none;
  padding: 8px 16px;
  border-radius: 20px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  transition: background 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.chat-input-container button:hover {
  background: #e5c856;
}

.redpacket-msg {
  background: linear-gradient(135deg, #f78989 0%, #dd2828 100%);
  border: 1px solid #c21a1a;
  border-radius: 8px;
  color: #fff;
  margin-top: 4px;
  box-shadow: 0 4px 10px rgba(221, 40, 40, 0.15);
  display: flex;
  flex-direction: column;
  width: 240px;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.redpacket-msg:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 14px rgba(221, 40, 40, 0.25);
}

.redpacket-top {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.15);
}

.redpacket-icon-wrapper {
  width: 32px;
  height: 32px;
  display: flex;
  flex-shrink: 0;
}

.hongbao__icon {
  width: 20px;
  height: 20px;
  fill: #fff;
}

.redpacket-greeting {
  font-weight: 500;
  font-size: 14px;
  flex: 1;
  text-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
  word-break: break-word;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.redpacket-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 14px;
  background: rgba(255, 255, 255, 0.1);
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
}

.redpacket-type {
  font-size: 12px;
  opacity: 0.9;
}

.redpacket-money {
  display: flex;
  align-items: center;
  gap: 4px;
  font-weight: 600;
  font-size: 13px;
}

.coin__icon {
  width: 14px;
  height: 14px;
  fill: #ffd700; /* Gold coin color fallback if inline SVG relies on fill */
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
