import type { FishPi, IChatRoomMessage } from "fishpi";
// @ts-expect-error - Vue is imported from CDN at runtime
import { ref, reactive, computed, onMounted, nextTick } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js';
import { ChatMessage } from './ChatMessage';

interface PopupAppProps {
  info: any;
  fishpi: FishPi;
  full: boolean;
}

export const PopupApp = {
  components: {
    ChatMessage
  },
  props: ['info', 'fishpi', 'full'],
  setup(props: PopupAppProps) {
    const setting = JSON.parse(localStorage.getItem("popupCRSetting") || "{}");
    
    const visible = ref(props.full ? true : (setting.visible ?? false));
    const title = ref(setting.title || "聊天室");
    const newMessage = ref("");
    const messages = ref<IChatRoomMessage[]>([]);
    const unreadCount = ref(0);
    const dragging = ref(false);
    const pos = reactive({ x: setting.pos?.x || 0, y: setting.pos?.y || 0 });

    const isAtBottom = () => {
      const body = document.querySelector(".popup-cr-wrapper .chat-body");
      if (!body) return true;
      return body.scrollHeight - body.scrollTop - body.clientHeight < 200;
    };

    const scrollToBottom = async (wait = true) => {
      if (wait) await nextTick();
      const body = document.querySelector(".popup-cr-wrapper .chat-body");
      if (body) {
        body.scrollTop = body.scrollHeight;
        unreadCount.value = 0;
      }
    };

    const sendMessage = async () => {
      const msg = newMessage.value.trim();
      if (!msg) return;
      try {
        await props.fishpi.chatroom.send(msg);
        newMessage.value = "";
        scrollToBottom();
      } catch (e) {
        console.error("send error", e);
      }
    };

    const minimize = () => {
      visible.value = false;
      save();
    };

    const restore = () => {
      visible.value = true;
      save();
    };

    const startDrag = (e: MouseEvent) => {
      dragging.value = true;
      const startX = e.clientX - pos.x;
      const startY = e.clientY - pos.y;

      const onMouseMove = (moveEvent: MouseEvent) => {
        if (!dragging.value) return;
        pos.x = moveEvent.clientX - startX;
        pos.y = moveEvent.clientY - startY;
      };

      const onMouseUp = () => {
        dragging.value = false;
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", onMouseUp);
        save();
      };

      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
    };

    const save = () => {
      localStorage.setItem(
        "popupCRSetting",
        JSON.stringify({ pos, title: title.value, visible: visible.value }),
      );
    };

    const popupChat = () => {
      const popup = window.open("/cr-popup", "_blank", "width=400,height=600");
      setTimeout(() => {
        if (popup?.document) {
          popup.document.addEventListener("DOMContentLoaded", () => {
            Array.from(popup.document.body.children).forEach((c: any) => c.style.display = 'none');
          });
        }
      }, 500);
    };

    const transformStyle = computed(() => `transform: translate(${pos.x}px, ${pos.y}px)`);

    onMounted(async () => {
      try {
        messages.value = await props.fishpi.chatroom.history().then((res: IChatRoomMessage[]) => res.reverse());
        scrollToBottom();
        
        props.fishpi.chatroom.addListener("all", (type: string, msg: any) => {
          switch (type) {
            case "custom":
              messages.value.push({
                oId: "custom-" + Date.now(),
                type,
                userName: '',
                content: msg,
              });
              break;
            case "barrager":
              messages.value.push({
                oId: "barrager-" + Date.now(),
                type,
                userName: msg.userName,
                userNickname: msg.userNickname,
                userAvatarURL: msg.userAvatarURL,
                content: msg,
              });
              break;
            case "revoke":
              const index = messages.value.findIndex((m: IChatRoomMessage) => m.oId === msg);
              if (index >= 0) messages.value.splice(index, 1);
              break;
            case "redPacketStatus":
            case "online":
            case "discuss":
              break;
            default:
              const wasAtBottom = isAtBottom();
              messages.value.push(msg);
              if (wasAtBottom) {
                scrollToBottom();
              } else {
                unreadCount.value++;
              }
              break;
          }
        });
      } catch (err) {
        console.error("failed to load chat history", err);
      }
    });

    return {
      visible,
      title,
      newMessage,
      messages,
      unreadCount,
      pos,
      transformStyle,
      sendMessage,
      minimize,
      restore,
      startDrag,
      scrollToBottom,
      popupChat,
    };
  },
  template: `
    <div :class="['popup-cr-wrapper', { 'fullscreen-popup': full }]">
      <Transition name="fade">
        <div v-show="!visible" class="chat-min-bar" @click="restore">
          <span>💬</span>
          <span>{{ title }}</span>
        </div>
      </Transition>

      <Transition name="slide">
        <div v-show="visible" class="chat-window" :style="transformStyle">
          <div class="chat-header" @mousedown="startDrag">
            <span class="chat-header-title">
              <span>💬</span>
              <span style="vertical-align: middle;">{{ title }}</span>
            </span>
            <span>
              <button class="popup-cr-close" @click="popupChat" title="弹窗">↗️</button>
              <button class="popup-cr-close" @click="minimize" title="最小化">➖</button>
            </span>
          </div>
          <div class="chat-body">
            <ChatMessage
              v-for="msg in messages"
              :key="msg.oId"
              :msg="msg"
              :info="info"
              :fishpi="fishpi"
            />
          </div>
          <Transition name="fade">
            <div v-show="unreadCount > 0" class="new-message-notice" @click="scrollToBottom(false)">
              <span>{{ unreadCount }}</span> 条新消息 <code>↓</code>
            </div>
          </Transition>
          <div class="chat-input-container">
            <input type="text" v-model="newMessage" placeholder="说点什么" @keydown.enter.prevent="sendMessage" />
            <button @click="sendMessage">发送</button>
          </div>
        </div>
      </Transition>
    </div>
  `
};
