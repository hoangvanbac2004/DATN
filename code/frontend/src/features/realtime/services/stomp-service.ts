import type { RealtimeEvent } from '../types';

export class StompClient {
  private ws: WebSocket | null = null;
  private url: string;
  private token: string | null = null;
  private subscriptions: Map<string, (event: RealtimeEvent) => void> = new Map();
  private isConnected = false;
  private reconnectTimer: NodeJS.Timeout | null = null;

  constructor(wsUrl?: string) {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = window.location.hostname;
    this.url = wsUrl || `${protocol}//${host}:8080/ws`;
  }

  public connect(token: string) {
    this.token = token;
    if (this.ws && (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING)) {
      return;
    }

    try {
      this.ws = new WebSocket(this.url);

      this.ws.onopen = () => {
        const connectFrame =
          `CONNECT\n` +
          `accept-version:1.2,1.1,1.0\n` +
          `Authorization:Bearer ${this.token}\n` +
          `heart-beat:10000,10000\n\n\0`;
        this.ws?.send(connectFrame);
      };

      this.ws.onmessage = (event) => {
        const message = event.data as string;
        if (message.startsWith('CONNECTED')) {
          this.isConnected = true;
          this.resubscribeAll();
        } else if (message.startsWith('MESSAGE')) {
          this.handleIncomingMessage(message);
        }
      };

      this.ws.onclose = () => {
        this.isConnected = false;
        this.scheduleReconnect();
      };

      this.ws.onerror = () => {
        this.ws?.close();
      };
    } catch {
      this.scheduleReconnect();
    }
  }

  public subscribe(destination: string, callback: (event: RealtimeEvent) => void): string {
    const subId = `sub-${Math.random().toString(36).substring(2, 9)}`;
    this.subscriptions.set(destination, callback);

    if (this.isConnected && this.ws?.readyState === WebSocket.OPEN) {
      const subFrame = `SUBSCRIBE\nid:${subId}\ndestination:${destination}\n\n\0`;
      this.ws.send(subFrame);
    }

    return destination;
  }

  public unsubscribe(destination: string) {
    this.subscriptions.delete(destination);
  }

  public disconnect() {
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
    if (this.ws) {
      if (this.isConnected) {
        this.ws.send(`DISCONNECT\n\n\0`);
      }
      this.ws.close();
    }
    this.isConnected = false;
  }

  private resubscribeAll() {
    let index = 0;
    this.subscriptions.forEach((_, destination) => {
      index++;
      const subFrame = `SUBSCRIBE\nid:sub-${index}\ndestination:${destination}\n\n\0`;
      this.ws?.send(subFrame);
    });
  }

  private handleIncomingMessage(rawMessage: string) {
    try {
      const parts = rawMessage.split('\n\n');
      if (parts.length < 2) return;

      const bodyStr = parts[1].replace(/\0$/, '');
      const event = JSON.parse(bodyStr) as RealtimeEvent;

      const headerLines = parts[0].split('\n');
      const destLine = headerLines.find((l) => l.startsWith('destination:'));
      if (destLine) {
        const destination = destLine.replace('destination:', '').trim();
        const callback = this.subscriptions.get(destination);
        if (callback) callback(event);
      }
    } catch {
      // Ignore parse error
    }
  }

  private scheduleReconnect() {
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
    this.reconnectTimer = setTimeout(() => {
      if (this.token) this.connect(this.token);
    }, 5000);
  }
}

export const stompService = new StompClient();
