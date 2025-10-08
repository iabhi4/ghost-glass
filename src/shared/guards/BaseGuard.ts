import { IGuard } from '../interfaces/IGuard';
import { IEventManager } from '../interfaces/IEventManager';
import { ITextProcessor } from '../interfaces/ITextProcessor';
import { IDOMHandler } from '../interfaces/IDOMHandler';
import { scanText } from '../scanner';
import { DetectionResult } from '../types';

export abstract class BaseGuard implements IGuard {
  protected eventManager: IEventManager;
  protected textProcessor: ITextProcessor;
  protected domHandler: IDOMHandler;

  constructor(
    eventManager: IEventManager,
    textProcessor: ITextProcessor,
    domHandler: IDOMHandler
  ) {
    this.eventManager = eventManager;
    this.textProcessor = textProcessor;
    this.domHandler = domHandler;
  }

  abstract initialize(): void;
  abstract destroy(): void;
  abstract handleEvent(event: Event): void;

  protected scanAndProcessText(text: string): DetectionResult[] {
    const plainText = this.textProcessor.extractPlainText(text);
    return scanText(plainText);
  }

  protected redactText(text: string, findings: DetectionResult[]): string {
    return this.textProcessor.redactText(text, findings);
  }

  onSecretsDetected?(findings: DetectionResult[]): void;
}
