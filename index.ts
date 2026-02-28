import { mount, PopupCR } from './src/index';

// Auto-mount the popup when the script loads
mount(document.body);

// Expose API for external use (e.g., Tampermonkey scripts)
if (typeof window !== 'undefined') {
  (window as any).popupCR = { mount, PopupCR };
}
