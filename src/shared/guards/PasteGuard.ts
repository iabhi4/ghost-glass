import { BaseGuard } from './BaseGuard';
import { IEventManager } from '../interfaces/IEventManager';
import { ITextProcessor } from '../interfaces/ITextProcessor';
import { IDOMHandler } from '../interfaces/IDOMHandler';
import { DetectionResult } from '../types';

export class PasteGuard extends BaseGuard {
  constructor(
    eventManager: IEventManager,
    textProcessor: ITextProcessor,
    domHandler: IDOMHandler
  ) {
    super(eventManager, textProcessor, domHandler);
    console.log('GhostGlass: PasteGuard initialized.');
  }

  initialize(): void {
    this.eventManager.addEventListener('paste', this.handleEvent, true);
  }

  destroy(): void {
    this.eventManager.removeEventListener('paste', this.handleEvent, true);
  }

  handleEvent = (event: Event): void => {
    this.handlePasteEvent(event as ClipboardEvent);
  };

  private handlePasteEvent = (event: ClipboardEvent): void => {
    try {
      console.log('GhostGlass: Paste event detected!');
      
      if (!event.clipboardData) {
        console.log('GhostGlass: No clipboard data available.');
        return;
      }

      const pastedText = event.clipboardData.getData('text/plain');
      console.log('GhostGlass: Pasted text:', pastedText);
      
      if (!pastedText.trim()) {
        console.log('GhostGlass: Empty paste content.');
        return;
      }

      console.log('GhostGlass: Scanning pasted text for secrets...');
      const findings = this.scanAndProcessText(pastedText);
      console.log('GhostGlass: Paste scan results:', findings);
      
      if (findings.length === 0) {
        console.log('GhostGlass: No secrets found in paste, allowing normal paste.');
        return;
      }

      console.log(`GhostGlass: Found ${findings.length} secrets in pasted text.`);
      
      event.preventDefault();
      event.stopPropagation();

      const redactedText = this.redactText(pastedText, findings);
      console.log('GhostGlass: Redacted paste text:', redactedText);
      
      this.domHandler.insertTextAtCursor(redactedText);
      console.log('GhostGlass: Redacted text inserted at cursor.');
      
    } catch (error) {
      console.error('GhostGlass: Error in paste event handler:', error);
      
      if (error instanceof Error && error.message.includes('Extension context invalidated')) {
        console.log('GhostGlass: Extension context invalidated, allowing normal paste...');
        return;
      }
    }
  };
}
