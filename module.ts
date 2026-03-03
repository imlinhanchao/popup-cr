import { mount } from './src/index';
import type { FishPi } from 'fishpi';

export function activate(window: Window, document: Document, fishpi: FishPi) {
  const url = location.href;
  if (!url.includes('/cr') && !url.includes('/cr-popup')) {
    mount(document.body, fishpi);
  } else if (url.includes('/cr-popup')) {
    document.body.classList.add('popup-only');
    mount(document.body, fishpi, true);
  } else if (url.includes('/cr')) {
    const chatContent = document.querySelector('#chatContent') as HTMLDivElement;
    if (chatContent) {
      chatContent.style.position = 'relative'; // ensure parent is positioned for absolute child
      const popupBtn = document.createElement('button');
      popupBtn.textContent = '弹出聊天';
      popupBtn.style.position = 'absolute';
      popupBtn.style.top = '2px';
      popupBtn.style.right = '2px';
      popupBtn.style.zIndex = '1000';
      popupBtn.style.border = 'none';
      popupBtn.style.background = '#f0d463';
      popupBtn.style.color = '#000';
      popupBtn.style.padding = '6px 12px';
      popupBtn.style.borderRadius = '4px';
      popupBtn.style.cursor = 'pointer';
      chatContent.appendChild(popupBtn);

      popupBtn.addEventListener('click', () => {
        const popup = window.open('/cr-popup', '_blank', 'width=400,height=600');
        debugger;
        if (popup?.document) {
          popup.document.addEventListener('DOMContentLoaded', () => {
            Array.from(popup.document.body.children).forEach(c => c.style.display = 'none');
          });
        }
      });
    }
  }
}
