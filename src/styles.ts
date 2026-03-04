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
  font-size: 15px;
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
  gap: 12px;
  padding: 8px 12px;
  transition: background 0.2s ease;
  position: relative;
  margin-bottom: 4px;
}

.chat-message.is-me {
  flex-direction: row-reverse;
}

.chat-message .avatar {
  width: 38px;
  height: 38px;
  border-radius: 8px;
  flex-shrink: 0;
  border: 1px solid rgba(0,0,0,0.05);
  object-fit: cover;
}

.chat-message-main {
  flex: 1;
  min-width: 0; 
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.chat-message.is-me .chat-message-main {
  align-items: flex-end;
}

.chat-message .nickname {
  font-weight: 500;
  font-size: 11px;
  color: #57606a;
  margin-bottom: 4px;
  display: block;
}

.chat-message .content-wrapper {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  max-width: 100%;
  position: relative;
}

.chat-message.is-me .content-wrapper {
  align-items: flex-end;
}

.chat-message .content {
    word-break: break-word;
    color: #24292f;
    background: #f1f3f5;
    padding: 8px 12px;
    border-radius: 4px 12px 12px 12px;
    font-size: 14px;
    line-height: 1.5;
    position: relative;
    box-shadow: 0 1px 2px rgba(0,0,0,0.05);
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
}

.chat-message.is-me .content {
    background: #f0d463;
    border-radius: 12px 4px 12px 12px;
}

.chat-message .content.expanded {
  -webkit-line-clamp: unset;
  overflow: visible;
  display: block;
}

.expand-btn {
  font-size: 11px;
  color: #0969da;
  background: none;
  border: none;
  cursor: pointer;
  padding: 2px 4px;
  margin-top: 2px;
}

.chat-message .content img {
  max-width: 100%;
  height: auto;
  border-radius: 4px;
  margin-top: 4px;
}

.chat-message .content img[alt=图片表情] {
  max-width: 30px;
}

.chat-message .time {
  position: absolute;
  top: -14px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 10px;
  color: #8c959f;
  background: rgba(255,255,255,0.8);
  padding: 2px 6px;
  border-radius: 10px;
  opacity: 0;
  transition: opacity 0.2s ease;
  white-space: nowrap;
}

.chat-message.is-me .time {
    left: auto;
    right: 50px;
    transform: none;
}

.chat-message:hover .time {
  opacity: 1;
}

.system-msg-wrapper {
    display: flex;
    justify-content: center;
    margin: 8px 0;
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

.new-message-notice {
  position: absolute;
  bottom: 80px;
  right: 20px;
  background: #f0d463;
  color: #24292f;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  z-index: 100;
  display: flex;
  align-items: center;
  gap: 4px;
  transition: all 0.2s ease;
}

.new-message-notice:hover {
  transform: translateY(-2px);
  background: #e5c856;
}

.redpacket-msg {
  background: linear-gradient(135deg, #f78989 0%, #dd2828 100%);
  border: 1px solid #c21a1a;
  border-radius: 8px;
  color: #fff;
  cursor: pointer;
  position: relative;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  overflow: visible;
}

.redpacket-msg:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(221, 40, 40, 0.3);
}

.red-packet-detail-modal {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 300px;
    max-height: 80vh;
    background: #dd2828;
    color: #fff;
    border-radius: 12px;
    z-index: 1000000;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
}

.red-packet-detail-header {
    background: #f78989;
    padding: 20px 16px;
    text-align: center;
    position: relative;
    border-bottom: 1px solid rgba(255,255,255,0.1);
}

.red-packet-detail-header .close-btn {
    position: absolute;
    top: 8px;
    right: 8px;
    background: none;
    border: none;
    color: #fff;
    font-size: 20px;
    cursor: pointer;
    line-height: 1;
}

.red-packet-detail-user {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    margin-bottom: 8px;
}

.red-packet-detail-user img {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    border: 2px solid #fff;
}

.red-packet-detail-msg {
    font-size: 14px;
    opacity: 0.9;
}

.red-packet-detail-title {
    font-size: 24px;
    font-weight: bold;
    color: #fee3aa;
    text-align: center;
    margin: 16px 0;
}

.red-packet-detail-list {
    flex: 1;
    overflow-y: auto;
    background: #fff;
    color: #333;
    padding: 12px;
}

.red-packet-list-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 0;
    border-bottom: 1px solid #eee;
}

.red-packet-list-item:last-child {
    border-bottom: none;
}

.red-packet-list-user {
    display: flex;
    align-items: center;
    gap: 8px;
}

.red-packet-list-user img {
    width: 32px;
    height: 32px;
    border-radius: 50%;
}

.red-packet-list-info {
    text-align: right;
}

.red-packet-list-money {
    font-weight: bold;
    color: #dd2828;
}

.red-packet-list-time {
    font-size: 12px;
    color: #999;
}

.red-packet-modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 999999;
}

.rps-gestures {
  position: absolute;
  right: -40px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  gap: 4px;
  z-index: 10;
}

.rps-btn {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.2s ease, background 0.2s ease;
  padding: 4px;
  overflow: hidden;
}

.rps-btn:hover {
  transform: scale(1.1);
}

.rps-btn img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}
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

.vditor-reset .hongbao-icon, .hongbao-icon {
  width: 70px;
  height: 40px;
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

.vditor-reset .coin__icon, .coin__icon {
  width: 14px;
  height: 14px;
  fill: #ffd700; /* Gold coin color fallback if inline SVG relies on fill */
}

.music-msg .music-status {
  margin-left: 6px;
  font-size: 12px;
  color: #57606a;
  cursor: pointer;
  transition: color 0.2s ease;
}
  
.music-msg .music-status:hover {
  color: #24292f;
}

.barrager-msg {
  display: block;
  animation: shake 0.5s ease-in-out 2;
  font-weight: bold;
}

.barrager-msg:hover {
  animation: none;
  transform: translateY(-2px);
  color: #e5c856;
}

@keyframes shake {
  0% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  50% { transform: translateX(5px); }
  75% { transform: translateX(-5px); }
  100% { transform: translateX(0); }
}

.custom-msg {
  opacity: 0.7;
  text-align: center;
  display: block;
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
