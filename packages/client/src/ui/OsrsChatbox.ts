import { OSRS_ASSETS } from './osrsAssets.js';

const MAX_LINES = 50;

export class OsrsChatbox {
  private root: HTMLElement;
  private messagesEl: HTMLElement;
  private lines: string[] = [];

  constructor(root: HTMLElement) {
    this.root = root;
    this.root.className = 'osrs-chatbox';
    const a = OSRS_ASSETS;
    this.root.innerHTML = `
      <div class="osrs-chatbox-messages" id="chat-messages"></div>
      <div class="osrs-chatbox-stones">
        <img src="${a.chatbox.stones}" alt="" class="osrs-chatbox-stones-bg" />
      </div>
    `;
    this.messagesEl = this.root.querySelector('#chat-messages') as HTMLElement;

    this.push('Welcome to Ura Ura Swell.', 'game');
  }

  push(text: string, channel: 'game' | 'xp' | 'system' = 'game'): void {
    const prefix =
      channel === 'xp'
        ? '<span class="chat-xp">'
        : channel === 'system'
          ? '<span class="chat-sys">'
          : '<span>';
    const suffix = '</span>';
    this.lines.push(`${prefix}${text}${suffix}`);
    if (this.lines.length > MAX_LINES) {
      this.lines.shift();
    }
    this.messagesEl.innerHTML = this.lines.join('<br/>');
    this.messagesEl.scrollTop = this.messagesEl.scrollHeight;
  }
}
