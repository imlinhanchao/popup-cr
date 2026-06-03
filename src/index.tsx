import type { FishPi } from "fishpi";
import { createApp } from './vender';
import { injectStyles } from "./styles";
import { PopupApp } from "./components/PopupApp";

export interface PopupCROptions {
  title?: string;
  onClose?: () => void;
}

export interface PopupCRInstance {
  unmount: () => void;
}

/**
 * Mount the popup UI into the given container element.
 * Vue handles the rendering and interactivity.
 */
export async function mount(
  container: HTMLElement,
  fishpi: FishPi,
  full = false,
) {
  if (document.getElementById("popup-cr")) {
    console.warn("PopupCR is already mounted");
    return { unmount() {} };
  }
  const info = await fishpi.account.info();
  injectStyles();

  // Music player handler
  document.body.addEventListener("click", (e) => {
    const target = e.target as HTMLElement;
    if (target.matches(".music-status")) {
      const musicMsgEl = target.closest(".music-msg") as HTMLElement;
      const audio = musicMsgEl.querySelector(".music-audio") as HTMLAudioElement;
      const statusEl = musicMsgEl.querySelector(".music-status") as HTMLElement;
      if (audio) {
        if (audio.paused) {
          audio.play();
          statusEl.textContent = "⏸";
        } else {
          audio.pause();
          statusEl.textContent = "▶";
        }
      }
    }
  });

  const wrapper = document.createElement("div");
  wrapper.id = "popup-cr";
  container.appendChild(wrapper);

  // 创建 Vue 应用 - 使用独立的组件文件
  const app = createApp(PopupApp, {
    info,
    fishpi,
    full,
  });

  app.mount(wrapper);

  return {
    unmount() {
      app.unmount();
      if (wrapper.parentNode === container) {
        container.removeChild(wrapper);
      }
    },
  };
}
