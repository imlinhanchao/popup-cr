/** @jsx h */
/** @jsxFrag Fragment */
import { h, createSignal, Fragment } from 'serajs';
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

  const wrapper = h('div', { class: 'popup-cr-wrapper' },
    () => visible()
      ? h('div', { class: 'popup-cr' },
          h('div', { class: 'popup-cr-header' },
            h('span', { class: 'popup-cr-title' }, title),
            h('button', { class: 'popup-cr-close', onclick: handleClose }, '×')
          ),
          h('div', { class: 'popup-cr-body' },
            h('textarea', {
              class: 'popup-cr-textarea',
              placeholder: 'Enter your review comment...',
              oninput: (e) => setText(e.target.value),
              value: text()
            }),
            h('div', { class: 'popup-cr-actions' },
              h('button', { class: 'popup-cr-btn popup-cr-btn-submit', onclick: handleSubmit }, 'Submit'),
              h('button', { class: 'popup-cr-btn popup-cr-btn-cancel', onclick: handleClose }, 'Cancel')
            )
          )
        )
      : null
  );

  return wrapper;
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
