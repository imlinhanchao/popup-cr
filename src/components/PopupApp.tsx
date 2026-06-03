import type { FishPi, IChatRoomMessage } from "fishpi";
// @ts-expect-error - Vue is imported from CDN at runtime
import { ref, reactive, computed, onMounted, nextTick, Transition, h } from '../vender';
import { ChatMessage } from './ChatMessage';

interface PopupAppProps {
  info: any;
  fishpi: FishPi;
  full: boolean;
}

export const PopupApp = {
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

    const handleMinBarClick = (e: MouseEvent) => {
      // 只有在没有拖拽的情况下才恢复窗口
      if (!dragging.value) {
        restore();
      }
    };

    const startDrag = (e: MouseEvent) => {
      e.preventDefault();
      const startX = e.clientX - pos.x;
      const startY = e.clientY - pos.y;
      let hasMoved = false;

      const onMouseMove = (moveEvent: MouseEvent) => {
        hasMoved = true;
        dragging.value = true;
        pos.x = moveEvent.clientX - startX;
        pos.y = moveEvent.clientY - startY;
      };

      const onMouseUp = () => {
        dragging.value = false;
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", onMouseUp);
        if (hasMoved) {
          save();
        }
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

    // 返回 render 函数（使用 JSX）
    return () => (
      <div class={['popup-cr-wrapper', { 'fullscreen-popup': props.full }]}>
        {
        !visible.value ? (
          <div 
            class="chat-min-bar" 
            style={transformStyle.value}
            onMousedown={startDrag}
            onClick={handleMinBarClick}
          >
            <span>💬</span>
            <span>{title.value}</span>
          </div>
          ) : (
            <div class="chat-window" style={transformStyle.value}>
              <div class="chat-header" onMousedown={startDrag}>
                <span class="chat-header-title">
                  <span>💬</span>
                  <span style="vertical-align: middle;">{title.value}</span>
                </span>
                <span>
                  <button class="popup-cr-close" onClick={popupChat} title="弹窗">↗️</button>
                  <button class="popup-cr-close" onClick={minimize} title="最小化">➖</button>
                </span>
              </div>
              <div class="chat-body">
                {messages.value.map((msg: IChatRoomMessage) => 
                  h(ChatMessage as any, {
                    key: msg.oId,
                    msg: msg,
                    info: props.info,
                    fishpi: props.fishpi
                  })
                )}
              </div>
              {unreadCount.value > 0 ? (
                <div class="new-message-notice" onClick={() => scrollToBottom(false)}>
                  <span>{unreadCount.value}</span> 条新消息 <code>↓</code>
                </div>
              ) : <span></span>}
              <div class="chat-input-container">
                <input 
                  type="text" 
                  value={newMessage.value}
                  onInput={(e: any) => newMessage.value = e.target.value}
                  placeholder="说点什么" 
                  onKeydown={(e: KeyboardEvent) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      sendMessage();
                    }
                  }}
                />
                <button onClick={sendMessage}>发送</button>
              </div>
            </div>
          )
        }
      </div>
    );
  }
};
