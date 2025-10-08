export interface IDOMHandler {
  insertTextAtCursor(text: string): void;
  getActiveElement(): Element | null;
  getSelectionText(): string;
  clearSelection(): void;
}
