import type {
  IChatRoomMessage,
  IBarragerMsg,
  IMusicMessage,
  IRedPacketMessage,
  IWeatherMessage,
  FishPi,
  IRedPacketInfo,
} from "fishpi";
// @ts-expect-error - Vue is imported from CDN at runtime
import { ref, computed, onMounted, nextTick, Transition, h } from '../vender';

const redpacketType: Record<string, string> = {
  random: "拼手气红包",
  average: "普通红包",
  specify: "专属红包",
  heartbeat: "心跳红包",
  rockPaperScissors: "猜拳红包",
};

const weatherIcon: Record<string, string> = {
  CLEAR_DAY: "☀️", CLEAR_NIGHT: "🌙", CLOUDY: "☁️", DUST: "🤧", FOG: "🌫️",
  HEAVY_HAZE: "⛆", HEAVY_RAIN: "🌧️", HEAVY_SNOW: "❄️", LIGHT_HAZE: "🌫️",
  LIGHT_RAIN: "🌧️", LIGHT_SNOW: "❄️", MODERATE_HAZE: "⛆", MODERATE_RAIN: "🌧️",
  MODERATE_SNOW: "❄️", PARTLY_CLOUDY_DAY: "⛅", PARTLY_CLOUDY_NIGHT: "🌙",
  SAND: "⛱️", STORM_RAIN: "⛈️", STORM_SNOW: "❄️", WIND: "🍃",
};

interface ChatMessageProps {
  msg: IChatRoomMessage;
  info: any;
  fishpi: FishPi;
}

export const ChatMessage = {
  props: ['msg', 'info', 'fishpi'],
  setup(props: ChatMessageProps) {
    const hover = ref(false);
    const expanded = ref(false);
    const showExpandBtn = ref(false);
    const contentEl = ref<HTMLElement | null>(null);

    onMounted(() => {
      nextTick(() => {
        if (props.msg.type === "redPacket") return;
        if (contentEl.value && contentEl.value.scrollHeight > contentEl.value.clientHeight) {
          showExpandBtn.value = true;
        }
      });
    });

    const toggle = () => {
      expanded.value = !expanded.value;
    };

    const openRedPacket = (gesture?: number) => {
      props.fishpi.chatroom.redpacket.open(props.msg.oId, gesture).then((res: IRedPacketInfo) => {
        const { info, who } = res;
        
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
          document.getElementById('popup-cr')!.removeChild(modal);
        });
        
        modal.addEventListener("click", (e) => {
          if (e.target === modal) {
            document.getElementById('popup-cr')!.removeChild(modal);
          }
        });

        document.getElementById('popup-cr')!.appendChild(modal);
      });
    };

    const displayName = computed(() => props.msg.userNickname || props.msg.userName);
    const isMe = computed(() => props.msg.userName == props.info.userName);
    
    const displayContent = computed(() => {
      if (props.msg.type === "redPacket") {
        const rp = props.msg.content as IRedPacketMessage;
        const isRPS = rp.type === "rockPaperScissors";
        const gestures = isRPS && !isMe.value ? `
          <div class="rps-gestures">
            <div class="rps-btn" title="石头" onclick="this.dispatchEvent(new CustomEvent('openrp', { detail: 0, bubbles: true }))">
              <img src="https://fishpi.cn/images/redpacket/gesture/rock.png" />
            </div>
            <div class="rps-btn" title="剪刀" onclick="this.dispatchEvent(new CustomEvent('openrp', { detail: 1, bubbles: true }))">
              <img src="https://fishpi.cn/images/redpacket/gesture/scissors.png" />
            </div>
            <div class="rps-btn" title="布" onclick="this.dispatchEvent(new CustomEvent('openrp', { detail: 2, bubbles: true }))">
              <img src="https://fishpi.cn/images/redpacket/gesture/paper.png" />
            </div>
          </div>
        ` : "";
        return `
          <div class="redpacket-msg">
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
      if (props.msg.type === "weather") {
        const weatherData = props.msg.content as IWeatherMessage;
        const content = `${weatherIcon[weatherData.data[0].code]}${weatherData.city} ${weatherData.description}`;
        return `<div>${content}</div>`;
      }
      if (props.msg.type === "music") {
        const musicData = props.msg.content as IMusicMessage;
        return `<span class="music-msg" data-music-source="${musicData.source}">
        🎵 ${musicData.title} <span class="music-status">▶</span>
          <audio class="music-audio" src="${musicData.source}" style="display:none;"></audio>
        </span>`;
      }
      if (props.msg.type === "custom") {
        return `<div class="custom-msg">${props.msg.content}</div>`;
      }
      if (props.msg.type === "barrager") {
        const content = props.msg.content as any as IBarragerMsg;
        return `<div class="barrager-msg" style="color:${content.barragerColor}">${content.barragerContent}</div>`;
      }
      return typeof props.msg.content === "string"
        ? props.msg.content
        : JSON.stringify(props.msg.content);
    });

    const handleContentClick = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target.classList.contains('redpacket-msg') || target.closest('.redpacket-msg')) {
        openRedPacket();
      }
    };

    const handleRPSClick = (e: Event) => {
      if ((e as CustomEvent).detail !== undefined) {
        e.stopPropagation();
        openRedPacket((e as CustomEvent).detail);
      }
    };

    // 返回 render 函数（使用 JSX）
    return () => (
      <div>
        {props.msg.userName ? (
          <section 
            class={['chat-message', { 'is-me': isMe.value }]}
            onMouseenter={() => hover.value = true}
            onMouseleave={() => hover.value = false}
          >
            <img class="avatar" src={props.msg.userAvatarURL} />
            <div class="chat-message-main">
              <span class="nickname">{displayName.value}</span>
              <div class="content-wrapper">
                <span 
                  ref={contentEl}
                  class={['content', 'vditor-reset', 'ft__smaller', {
                    'expanded': expanded.value || props.msg.type === 'redPacket'
                  }]}
                  innerHTML={displayContent.value}
                  onClick={handleContentClick}
                  onOpenrp={handleRPSClick}
                ></span>
                {showExpandBtn.value && (
                  <button class="expand-btn" onClick={toggle}>
                    {expanded.value ? '收起' : '展开'}
                  </button>
                )}
              </div>
            </div>
            <Transition name="fade">
              {hover.value && (
                <div class="time">{props.msg.time}</div>
              )}
            </Transition>
          </section>
        ) : (
          <section class="system-msg-wrapper" innerHTML={displayContent.value}></section>
        )}
      </div>
    );
  }
};
