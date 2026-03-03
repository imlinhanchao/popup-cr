import type {
  FishPi,
  IBarragerMsg,
  IChatRoomMessage,
  IMusicMessage,
  IRedPacketInfo,
  IRedPacketMessage,
  IWeatherMessage,
} from "fishpi";
import Alpine from "alpinejs";
import { injectStyles } from "./styles";

export interface PopupCROptions {
  title?: string;
  onClose?: () => void;
}

export interface PopupCRInstance {
  unmount: () => void;
}

let alpineStarted = false;
let popupCounter = 0;

function ensureAlpine(): void {
  if (!alpineStarted) {
    Alpine.start();
    alpineStarted = true;
  }
}

const redpacketType = {
  random: "拼手气红包",
  average: "普通红包",
  specify: "专属红包",
  heartbeat: "心跳红包",
  rockPaperScissors: "猜拳红包",
};

/**
 * Mount the popup UI into the given container element.
 * Alpine handles the rendering and interactivity.
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
  ensureAlpine();

  document.body.addEventListener("click", (e) => {
    const target = e.target as HTMLElement;
    if (target.matches(".music-status")) {
      const musicMsgEl = target.closest(".music-msg") as HTMLElement;
      const audio = musicMsgEl.querySelector(
        ".music-audio",
      ) as HTMLAudioElement;
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

  // helper component for rendering individual messages
  Alpine.data("chatMessage", (msg: IChatRoomMessage) => ({
    msg,
    hover: false,
    expanded: false,
    showExpandBtn: false,
    init() {
      this.$nextTick(() => {
        if (this.msg.type === "redPacket") return;
        const contentEl = this.$refs.content as HTMLElement;
        if (contentEl && contentEl.scrollHeight > contentEl.clientHeight) {
          this.showExpandBtn = true;
        }
      });
    },
    toggle() {
      this.expanded = !this.expanded;
    },
    openRedPacket(gesture: number) {
      fishpi.chatroom.redpacket.open(this.msg.oId, gesture).then((res: IRedPacketInfo) => {
        // Redpacket info is in res
        const { info, who } = res;
        const currentUserName = (window as any).fishpi?.userName || ""; // Fallback if info is not available
        
        // Calculate title like in redpacket.vue
        const myResult = who.find((w: any) => w.userName === info.userName); // info.userName is current user in fishpi-desktop context? No, it's sender.
        // Let's use simpler logic for title
        let redpacketTitle = "";
        const me = who.find((w: any) => w.userName === (window as any).currentUserName); // We need the current user name
        
        // Let's use info from the mount function scope if possible
        const modal = document.createElement("div");
        modal.className = "red-packet-modal-overlay";
        
        const listItems = who.map((w: any) => `
          <div class="red-packet-list-item">
            <div class="red-packet-list-user">
              <img src="${w.avatar}" />
              <span>${w.userName}</span>
            </div>
            <div class="red-packet-list-info">
              <div class="red-packet-list-money">${w.userMoney} 积分</div>
              <div class="red-packet-list-time">${w.time}</div>
            </div>
          </div>
        `).join("");

        modal.innerHTML = `
          <div class="red-packet-detail-modal">
            <div class="red-packet-detail-header">
              <button class="close-btn">&times;</button>
              <div class="red-packet-detail-user">
                <img src="${info.userAvatarURL}" />
                <span>${info.userName} 的红包</span>
              </div>
              <div class="red-packet-detail-msg">${info.msg}</div>
            </div>
            <div class="red-packet-detail-list">
              ${listItems}
            </div>
          </div>
        `;
        
        modal.querySelector(".close-btn")?.addEventListener("click", () => {
          document.getElementById('popup-cr').removeChild(modal);
        });
        
        modal.addEventListener("click", (e) => {
          if (e.target === modal) {
            document.getElementById('popup-cr').removeChild(modal);
          }
        });

        document.getElementById('popup-cr').appendChild(modal);
      });
    },
    get displayName() {
      return this.msg.userNickname || this.msg.userName;
    },
    get isMe() {
      return this.msg.userName == info.userName;
    },
    get displayContent() {
      // branch based on message type
      if (this.msg.type === "redPacket") {
        const rp = this.msg.content as IRedPacketMessage;
        const isRPS = rp.type === "rockPaperScissors";
        const gestures = isRPS && !this.isMe ? `
          <div class="rps-gestures">
            <div class="rps-btn" title="石头" @click.stop="openRedPacket(0)">
              <img src="https://fishpi.cn/images/redpacket/gesture/rock.png" />
            </div>
            <div class="rps-btn" title="剪刀" @click.stop="openRedPacket(1)">
              <img src="https://fishpi.cn/images/redpacket/gesture/scissors.png" />
            </div>
            <div class="rps-btn" title="布" @click.stop="openRedPacket(2)">
              <img src="https://fishpi.cn/images/redpacket/gesture/paper.png" />
            </div>
          </div>
        ` : "";
        // build simple HTML snippet layout
        return `
          <div class="redpacket-msg" @click.stop="openRedPacket()">
            ${gestures}
            <div class="redpacket-top">
              <div class="redpacket-icon-wrapper">
                <svg class="ft__red hongbao-icon">
                  <use xlink:href="#redPacketIcon"></use>
                </svg>
              </div>
              <div class="redpacket-greeting">${rp.msg}</div>
            </div>
            <div class="redpacket-bottom">
              <span class="redpacket-type">${redpacketType[rp.type] || rp.type}</span>
              <span class="redpacket-money">
                <svg class="coin__icon"><use xlink:href="#coin"></use></svg>
                <span>${rp.money}</span>
              </span>
            </div>
          </div>
        `;
      }
      if (this.msg.type === "weather") {
        const weatherIcon = {
          CLEAR_DAY: "☀️",
          CLEAR_NIGHT: "🌙",
          CLOUDY: "☁️",
          DUST: "🤧",
          FOG: "🌫️",
          HEAVY_HAZE: "⛆",
          HEAVY_RAIN: "🌧️",
          HEAVY_SNOW: "❄️",
          LIGHT_HAZE: "🌫️",
          LIGHT_RAIN: "🌧️",
          LIGHT_SNOW: "❄️",
          MODERATE_HAZE: "⛆",
          MODERATE_RAIN: "🌧️",
          MODERATE_SNOW: "❄️",
          PARTLY_CLOUDY_DAY: "⛅",
          PARTLY_CLOUDY_NIGHT: "🌙",
          SAND: "⛱️",
          STORM_RAIN: "⛈️",
          STORM_SNOW: "❄️",
          WIND: "🍃",
        };
        const weatherData = this.msg.content as IWeatherMessage;
        const content = `${weatherIcon[weatherData.data[0].code]}${weatherData.city} ${weatherData.description}`;
        return `<div>${content}</div>`;
      }
      if (this.msg.type === "music") {
        const musicData = this.msg.content as IMusicMessage;
        return `<span class="music-msg" data-music-source="${musicData.source}">
        🎵 ${musicData.title} <span class="music-status">▶</span>
          <audio class="music-audio" src="${musicData.source}" style="display:none;"></audio>
        </span>`;
      }
      if (this.msg.type === "custom") {
        return `<div class="custom-msg">${this.msg.content}</div>`;
      }
      if (this.msg.type === "barrager") {
        const content = this.msg.content as any as IBarragerMsg;
        return `<div class="barrager-msg" style="color:${content.barragerColor}">${content.barragerContent}</div>`;
      }
      // default: string or fallback to JSON
      return typeof this.msg.content === "string"
        ? this.msg.content
        : JSON.stringify(this.msg.content);
    },
  }));

  const setting = JSON.parse(localStorage.getItem("popupCRSetting") || "{}");
  if (full) setting.visible = true; // force visible in fullscreen mode

  const componentName = `popupCR`;
  // define a chat component that loads history on init
  Alpine.data(componentName, () => ({
    visible: false,
    title: "聊天室",
    newMessage: "",
    messages: [] as IChatRoomMessage[],
    unreadCount: 0,
    dragging: false,
    pos: { x: 0, y: 0 },
    ...setting,
    isAtBottom() {
      const body = document.querySelector(".popup-cr-wrapper .chat-body");
      if (!body) return true;
      return body.scrollHeight - body.scrollTop - body.clientHeight < 100;
    },
    async scrollToBottom(wait=true) {
      if(wait) await this.$nextTick()
      const body = document.querySelector(".popup-cr-wrapper .chat-body");
      if (body) {
        body.scrollTop = body.scrollHeight;
        this.unreadCount = 0;
      }
    },
    async init() {
      // fetch history when the component first initializes
      try {
        this.messages = await fishpi.chatroom
          .history()
          .then((res) => res.reverse());
        this.scrollToBottom();
        fishpi.chatroom.addListener("all", (type: string, msg: any) => {
          switch (type) {
            case "custom":
              this.messages.push({
                oId: "custom-" + Date.now(),
                type,
                userName: '',
                content: msg,
              });
              break;
            case "barrager":
              this.messages.push({
                oId: "barrager-" + Date.now(),
                type,
                userName: msg.userName,
                userNickname: msg.userNickname,
                userAvatarURL: msg.userAvatarURL,
                content: msg,
              });
              break;
            case "revoke":
              const index = this.messages.findIndex((m: IChatRoomMessage) => m.oId === msg);
              if (index >= 0) this.messages.splice(index, 1);
              break;
            case "redPacketStatus":
              break;
            case "online":
              break;
            case "discuss":
              break;
            default:
              const wasAtBottom = this.isAtBottom();
              this.messages.push(msg);
              if (wasAtBottom) {
                this.scrollToBottom();
              } else {
                this.unreadCount++;
              }
              break;
          }
        });
      } catch (err) {
        console.error("failed to load chat history", err);
      }
    },
    async sendMessage() {
      const msg = this.newMessage.trim();
      if (!msg) return;
      try {
        await fishpi.chatroom.send(msg);
        this.newMessage = "";
      } catch (e) {
        console.error("send error", e);
      }
    },
    minimize() {
      this.visible = false;
      this.save(); // save state when minimizing
    },
    restore() {
      this.visible = true;
      this.save(); // save state when restoring
    },
    startDrag(e: MouseEvent) {
      this.dragging = true;
      const startX = e.clientX - this.pos.x;
      const startY = e.clientY - this.pos.y;

      const onMouseMove = (moveEvent: MouseEvent) => {
        if (!this.dragging) return;
        this.pos.x = moveEvent.clientX - startX;
        this.pos.y = moveEvent.clientY - startY;
      };

      const onMouseUp = () => {
        this.dragging = false;
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", onMouseUp);
        this.save(); // save position on drag end
      };

      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
    },
    save() {
      const { pos, title, visible } = this;
      localStorage.setItem(
        "popupCRSetting",
        JSON.stringify({ pos, title, visible }),
      );
    },
    popupChat() {
      const popup = window.open("/cr-popup", "_blank", "width=400,height=600");
      setTimeout(() => {
        if (popup?.document) {
          popup.document.addEventListener("DOMContentLoaded", () => {
            Array.from(popup.document.body.children).forEach(c => c.style.display = 'none');
          });
        }
      }, 500);
    },
  }));

  const wrapper = document.createElement("div");
  wrapper.id = "popup-cr";
  wrapper.innerHTML = `
    <div x-data="${componentName}" class="popup-cr-wrapper${full ? " fullscreen-popup" : ""}">
      <!-- Minimal bar when minimized -->
      <div x-show="!visible" class="chat-min-bar" @click="restore" x-transition>
        <span>💬</span>
        <span x-text="title"></span>
      </div>

      <!-- Main chat window -->
      <div x-show="visible" class="chat-window" 
           :style="\`transform: translate(\${pos.x}px, \${pos.y}px)\`"
           x-transition:enter="chat-transition-enter"
           x-transition:leave="chat-transition-leave">
        <div class="chat-header" @mousedown="startDrag">
          <span class="chat-header-title">
            <span>💬</span>
            <span x-text="title" style="vertical-align: middle;"></span>
          </span>
          <span>
            <button class="popup-cr-close" @click="popupChat" title="弹窗">↗️</button>
            <button class="popup-cr-close" @click="minimize" title="最小化基础">➖</button>
          </span>
        </div>
        <div class="chat-body">
          <template x-for="msg in messages" :key="msg.oId">
            <!-- each message uses chatMessage component -->
            <div x-data="chatMessage(msg)">
              <section x-show="msg.userName" class="chat-message"
                 :class="{ 'is-me': isMe }"
                 @mouseenter="hover=true" @mouseleave="hover=false">
                <img class="avatar" :src="msg.userAvatarURL" />
                <div class="chat-message-main">
                  <span class="nickname" x-text="displayName"></span>
                  <div class="content-wrapper">
                    <span x-ref="content" class="content vditor-reset ft__smaller" 
                          :class="{ 'expanded': expanded || msg.type === 'redPacket' }"
                          x-html="displayContent"></span>
                    <button class="expand-btn" x-show="showExpandBtn" 
                            @click="toggle" x-text="expanded ? '收起' : '展开'"></button>
                  </div>
                </div>
                <div class="time" x-show="hover" x-transition.opacity.duration.200ms x-text="msg.time"></div>
              </section>
              <section x-show="!msg.userName" x-html="displayContent" class="system-msg-wrapper">
              </section>
            </div>
          </template>
        </div>
        <!-- New message notice -->
        <div x-show="unreadCount > 0" class="new-message-notice" @click="scrollToBottom(false)" x-transition>
          <span x-text="unreadCount"></span> 条新消息 <code>↓</code>
        </div>
        <div class="chat-input-container">
          <input type="text" x-model="newMessage" placeholder="说点什么" @keydown.enter.prevent="sendMessage" />
          <button @click="sendMessage">发送</button>
        </div>
      </div>
    </div>
  `.trim();

  container.appendChild(wrapper);
  // Alpine needs to process newly added DOM
  Alpine.initTree(wrapper);

  return {
    unmount() {
      if (wrapper.parentNode === container) {
        container.removeChild(wrapper);
      }
    },
  };
}
