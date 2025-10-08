import { EventManager } from '@/shared/services/EventManager';
import { TextProcessor } from '@/shared/services/TextProcessor';
import { DOMHandler } from '@/shared/services/DOMHandler';
import { CopyGuard } from '@/shared/guards/CopyGuard';
import { PasteGuard } from '@/shared/guards/PasteGuard';

console.log('GhostGlass: Starting clipboard protection initialization...');

try {
  // Initialize services
  const eventManager = new EventManager();
  const textProcessor = new TextProcessor();
  const domHandler = new DOMHandler();

  // Initialize guards with dependency injection
  const copyGuard = new CopyGuard(eventManager, textProcessor, domHandler);
  const pasteGuard = new PasteGuard(eventManager, textProcessor, domHandler);
  
  // Initialize all guards
  copyGuard.initialize();
  pasteGuard.initialize();
  
  console.log('GhostGlass: Clipboard protection setup complete.');
  console.log('GhostGlass: Content script is running on:', window.location.href);

  // Test click handler
  document.addEventListener('click', () => {
    console.log('GhostGlass: Click event detected - content script is active');
  }, { once: true });

  // Handle extension context invalidation
  const handleContextInvalidation = () => {
    console.log('GhostGlass: Extension context invalidated, cleaning up...');
    copyGuard.destroy();
    pasteGuard.destroy();
  };

  if (typeof chrome !== 'undefined' && chrome.runtime) {
    chrome.runtime.onConnect.addListener((port) => {
      port.onDisconnect.addListener(handleContextInvalidation);
    });
  }

} catch (error) {
  console.error('GhostGlass: Error during initialization:', error);
  
  if (error instanceof Error && error.message.includes('Extension context invalidated')) {
    console.log('GhostGlass: Extension context invalidated, page will reload...');
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  }
}