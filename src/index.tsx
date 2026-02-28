import type { FishPi, IChatRoomMessage, IRedPacketMessage } from 'fishpi';
import Alpine from 'alpinejs';
import { injectStyles } from './styles';

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
    random: '拼手气红包',
    average: '普通红包',
    specify: '专属红包',
    heartbeat: '心跳红包',
    rockPaperScissors: '猜拳红包',
}

/**
 * Mount the popup UI into the given container element.
 * Alpine handles the rendering and interactivity.
 */
export async function mount(container: HTMLElement, fishpi: FishPi, full = false) {
  if (document.getElementById('popup-cr')) {
    console.warn('PopupCR is already mounted');
    return { unmount() {} };
  }
  injectStyles();
  ensureAlpine();

  // helper component for rendering individual messages
  Alpine.data('chatMessage', (msg: IChatRoomMessage) => ({
    msg,
    hover: false,
    get displayName() {
      return this.msg.userNickname || this.msg.userName;
    },
    get displayContent() {
      // branch based on message type
      if (this.msg.type === 'redPacket') {
        const rp = this.msg.content as IRedPacketMessage;
        // build simple HTML snippet layout
        return `
          <div class="redpacket-msg">
            <div class="redpacket-top">
              <div class="redpacket-icon-wrapper">
                <svg class="ft__red hongbao__icon">
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
      // default: string or fallback to JSON
      return typeof this.msg.content === 'string'
        ? this.msg.content
        : JSON.stringify(this.msg.content);
    }
  }));

  const setting = JSON.parse(localStorage.getItem('popupCRSetting') || '{}');
  if (full) setting.visible = true; // force visible in fullscreen mode

  const componentName = `popupCR`;
  // define a chat component that loads history on init
  Alpine.data(componentName, () => ({
    visible: true,
    title: '聊天室',
    newMessage: '',
    messages: [] as IChatRoomMessage[],
    dragging: false,
    pos: { x: 0, y: 0 },
    ...setting,
    scrollToBottom() {
      this.$nextTick(() => {
        const body = this.$el.querySelector('.chat-body');
        if (body) {
          body.scrollTop = body.scrollHeight;
        }
      });
    },
    async init() {
      // fetch history when the component first initializes
      try {
        this.messages = await fishpi.chatroom.history().then(res => res.reverse());
        this.scrollToBottom();
        fishpi.chatroom.addListener('all', (type: string, msg: any) => {
          switch (type) {
            case 'custom': break;
            case 'barrager': break;
            case 'revoke': break;
            case 'redPacketStatus': break;
            case 'online': break;
            case 'discuss': break;
            default: 
              this.messages.push(msg); 
              this.scrollToBottom();
              break;
          }
          
        })
      } catch (err) {
        console.error('failed to load chat history', err);
      }
    },
    async sendMessage() {
      const msg = this.newMessage.trim();
      if (!msg) return;
      try {
        await fishpi.chatroom.send(msg);
        this.newMessage = '';
      } catch (e) {
        console.error('send error', e);
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
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
        this.save(); // save position on drag end
      };

      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    },
    save() {
      const { pos, title, visible } = this;
      localStorage.setItem('popupCRSetting', JSON.stringify({ pos, title, visible }));
    }
  }));

  const wrapper = document.createElement('div');
  wrapper.id = 'popup-cr';
  wrapper.innerHTML = `
    <div x-data="${componentName}" class="popup-cr-wrapper${ full ? ' fullscreen-popup' : ''}">
      <!-- Minimal bar when minimized -->
      <div x-show="!visible" class="chat-min-bar" @click="restore" x-transition>
        <svg><use xlink:href="#idleChat"></use></svg>
        <span x-text="title"></span>
      </div>

      <!-- Main chat window -->
      <div x-show="visible" class="chat-window" 
           :style="\`transform: translate(\${pos.x}px, \${pos.y}px)\`"
           x-transition:enter="chat-transition-enter"
           x-transition:leave="chat-transition-leave">
        <div class="chat-header" @mousedown="startDrag">
          <span class="chat-header-title">
            <svg style="height: 1em; width: 1em; vertical-align: middle;">
              <use xlink:href="#idleChat"></use>
            </svg>
            <span x-text="title" style="vertical-align: middle;"></span>
          </span>
          <button class="popup-cr-close" @click="minimize" title="最小化基础">-</button>
        </div>
        <div class="chat-body">
          <template x-for="msg in messages" :key="msg.oId">
            <!-- each message uses chatMessage component -->
            <div x-data="chatMessage(msg)" class="chat-message"
                 @mouseenter="hover=true" @mouseleave="hover=false">
              <img class="avatar" :src="msg.userAvatarURL" />
              <div class="chat-message-main">
                <span class="nickname" x-text="displayName"></span>
                <span class="content vditor-reset ft__smaller " x-html="displayContent"></span>
              </div>
              <div class="time" x-show="hover" x-transition.opacity.duration.200ms x-text="msg.time"></div>
            </div>
          </template>
        </div>
        <div class="chat-input-container">
          <input type="text" x-model="newMessage" placeholder="Type a message..." @keydown.enter.prevent="sendMessage" />
          <button @click="sendMessage">Send</button>
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
