export interface IEventManager {
  initialize(): void;
  destroy(): void;
  addEventListener(type: string, listener: EventListener, useCapture?: boolean): void;
  removeEventListener(type: string, listener: EventListener, useCapture?: boolean): void;
}
