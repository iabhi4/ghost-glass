import { IEventManager } from '../interfaces/IEventManager';

export class EventManager implements IEventManager {
  private listeners: Array<{
    type: string;
    listener: EventListener;
    useCapture: boolean;
  }> = [];

  initialize(): void {
    console.log('GhostGlass: EventManager initialized.');
  }

  destroy(): void {
    console.log('GhostGlass: EventManager destroying listeners...');
    this.listeners.forEach(({ type, listener, useCapture }) => {
      document.removeEventListener(type, listener, useCapture);
    });
    this.listeners = [];
  }

  addEventListener(type: string, listener: EventListener, useCapture: boolean = true): void {
    document.addEventListener(type, listener, useCapture);
    this.listeners.push({ type, listener, useCapture });
  }

  removeEventListener(type: string, listener: EventListener, useCapture: boolean = true): void {
    document.removeEventListener(type, listener, useCapture);
    this.listeners = this.listeners.filter(
      l => !(l.type === type && l.listener === listener && l.useCapture === useCapture)
    );
  }
}
