/** @jsx h */
/** @jsxFrag Fragment */
import { h, Fragment, createSignal } from 'serajs';
import { injectStyles } from './styles.js';

/**
 * Popup component for code review.
 * @param {object} props
 * @param {string} [props.title] - Popup title
 * @param {Function} [props.onClose] - Callback when popup is closed
 */
function PopupCR({ title = 'Code Review', onClose } = {}) {
  const [visible, setVisible] = createSignal(true);
  const [text, setText] = createSignal('');

  function handleClose() {
    setVisible(false);
    if (typeof onClose === 'function') onClose();
  }

  function handleSubmit() {
    const val = text();
    if (!val.trim()) return;
    alert('Submitted: ' + val);
    setText('');
  }

  return (
    <div class="popup-cr-wrapper">
      {() => visible()
        ? (
          <div class="popup-cr">
            <div class="popup-cr-header">
              <span class="popup-cr-title">{title}</span>
              <button class="popup-cr-close" onclick={handleClose}>×</button>
            </div>
            <div class="popup-cr-body">
              <textarea
                class="popup-cr-textarea"
                placeholder="Enter your review comment..."
                oninput={(e) => setText(e.target.value)}
                value={text()}
              />
              <div class="popup-cr-actions">
                <button class="popup-cr-btn popup-cr-btn-submit" onclick={handleSubmit}>Submit</button>
                <button class="popup-cr-btn popup-cr-btn-cancel" onclick={handleClose}>Cancel</button>
              </div>
            </div>
          </div>
        )
        : null
      }
    </div>
  );
}

/**
 * Mount the popup UI into the given container element.
 * @param {HTMLElement} container - The DOM element to render the popup into
 * @param {object} [options]
 * @param {string} [options.title] - Popup title
 * @param {Function} [options.onClose] - Callback when popup is closed
 * @returns {{ unmount: Function }} Object with unmount function
 */
export function mount(container, options = {}) {
  injectStyles();
  const el = PopupCR(options);
  container.appendChild(el);

  return {
    unmount() {
      if (el.parentNode === container) {
        container.removeChild(el);
      }
    }
  };
}

export { PopupCR };

// Expose global API for use in Tampermonkey scripts
if (typeof window !== 'undefined') {
  window.popupCR = { mount, PopupCR };
}
