import { h, Fragment, createSignal } from 'serajs';
import { injectStyles } from './styles';

export interface PopupCROptions {
  title?: string;
  onClose?: () => void;
}

export interface PopupCRInstance {
  unmount: () => void;
}

/**
 * Popup component for code review.
 */
function PopupCR({ title = 'Code Review', onClose }: PopupCROptions = {}): Element {
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
                oninput={(e: Event) => setText((e.target as HTMLTextAreaElement).value)}
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
  ) as Element;
}

/**
 * Mount the popup UI into the given container element.
 * @param container - The DOM element to render the popup into
 * @param options - Optional popup configuration
 * @returns Object with unmount function
 */
export function mount(container: HTMLElement, options: PopupCROptions = {}): PopupCRInstance {
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
