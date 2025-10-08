import { IDOMHandler } from '../interfaces/IDOMHandler';

export class DOMHandler implements IDOMHandler {
  getActiveElement(): Element | null {
    return document.activeElement;
  }

  getSelectionText(): string {
    const selection = window.getSelection();
    return selection ? selection.toString() : '';
  }

  clearSelection(): void {
    const selection = window.getSelection();
    if (selection) {
      selection.removeAllRanges();
    }
  }

  insertTextAtCursor(text: string): void {
    const activeElement = document.activeElement;
    
    console.log('GhostGlass: insertTextAtCursor called with text:', text);
    console.log('GhostGlass: Active element:', activeElement);
    
    if (!activeElement) {
      console.log('GhostGlass: No active element found.');
      return;
    }

    if (activeElement instanceof HTMLInputElement || activeElement instanceof HTMLTextAreaElement) {
      console.log('GhostGlass: Handling input/textarea element');
      const input = activeElement as HTMLInputElement | HTMLTextAreaElement;
      const start = input.selectionStart || 0;
      const end = input.selectionEnd || 0;
      
      console.log('GhostGlass: Selection range:', { start, end });
      
      const before = input.value.substring(0, start);
      const after = input.value.substring(end);
      
      input.value = before + text + after;
      input.setSelectionRange(start + text.length, start + text.length);
      
      console.log('GhostGlass: Updated input value:', input.value);
      
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new Event('change', { bubbles: true }));
      
    } else if (activeElement instanceof HTMLElement && activeElement.isContentEditable) {
      console.log('GhostGlass: Handling contentEditable element');
      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0) {
        console.log('GhostGlass: No selection in contentEditable, appending to textContent');
        activeElement.textContent = (activeElement.textContent || '') + text;
        return;
      }

      const range = selection.getRangeAt(0);
      range.deleteContents();
      
      const textNode = document.createTextNode(text);
      range.insertNode(textNode);
      
      range.setStartAfter(textNode);
      range.setEndAfter(textNode);
      selection.removeAllRanges();
      selection.addRange(range);
      
      activeElement.dispatchEvent(new Event('input', { bubbles: true }));
      
    } else {
      console.log('GhostGlass: Unsupported element type, trying fallback');
      console.log('GhostGlass: Element tag:', activeElement.tagName);
      console.log('GhostGlass: Element type:', (activeElement as any).type);
      
      if ('value' in activeElement) {
        (activeElement as any).value = text;
        activeElement.dispatchEvent(new Event('input', { bubbles: true }));
        activeElement.dispatchEvent(new Event('change', { bubbles: true }));
        console.log('GhostGlass: Fallback value set');
      } else {
        console.log('GhostGlass: No fallback available for this element type');
      }
    }
  }
}
