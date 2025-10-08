import { BaseGuard } from './BaseGuard';
import { IEventManager } from '../interfaces/IEventManager';
import { ITextProcessor } from '../interfaces/ITextProcessor';
import { IDOMHandler } from '../interfaces/IDOMHandler';
import { DetectionResult } from '../types';

export class CopyGuard extends BaseGuard {
  constructor(
    eventManager: IEventManager,
    textProcessor: ITextProcessor,
    domHandler: IDOMHandler
  ) {
    super(eventManager, textProcessor, domHandler);
    console.log('GhostGlass: CopyGuard initialized.');
  }

  initialize(): void {
    this.eventManager.addEventListener('copy', this.handleEvent, true);
  }

  destroy(): void {
    this.eventManager.removeEventListener('copy', this.handleEvent, true);
  }

  handleEvent = (event: Event): void => {
    this.handleCopyEvent(event as ClipboardEvent);
  };

  private handleCopyEvent = (event: ClipboardEvent): void => {
    try {
      console.log('GhostGlass: Copy event detected!');
      
      const selectedText = this.domHandler.getSelectionText();
      console.log('GhostGlass: Selected text:', selectedText);
      
      if (!selectedText.trim()) {
        console.log('GhostGlass: Empty selection.');
        return;
      }

      console.log('GhostGlass: Scanning text for secrets...');
      const findings = this.scanAndProcessText(selectedText);
      console.log('GhostGlass: Scan results:', findings);
      
      if (findings.length === 0) {
        console.log('GhostGlass: No secrets found, allowing normal copy.');
        return;
      }

      console.log(`GhostGlass: Found ${findings.length} secrets in copied text.`);
      
      event.preventDefault();
      event.stopPropagation();

      const redactedText = this.redactText(selectedText, findings);
      console.log('GhostGlass: Redacted text:', redactedText);
      
      if (event.clipboardData) {
        event.clipboardData.clearData();
        event.clipboardData.setData('text/plain', this.textProcessor.extractPlainText(redactedText));
        console.log('GhostGlass: Redacted text set to clipboard.');
      }
      
    } catch (error) {
      console.error('GhostGlass: Error in copy event handler:', error);
      
      if (error instanceof Error && error.message.includes('Extension context invalidated')) {
        console.log('GhostGlass: Extension context invalidated, allowing normal copy...');
        return;
      }
    }
  };
}
