import { DetectionResult } from '../types';
import { ITextProcessor } from '../interfaces/ITextProcessor';

export class TextProcessor implements ITextProcessor {
  extractPlainText(html: string): string {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    
    let plainText = tempDiv.textContent || tempDiv.innerText || html;
    
    plainText = plainText
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/\s+/g, ' ')
      .trim();
    
    return plainText;
  }

  redactText(originalText: string, findings: DetectionResult[]): string {
    let redacted = originalText;
    findings
      .slice()
      .sort((a, b) => b.startIndex - a.startIndex)
      .forEach(finding => {
        const placeholder = `[REDACTED:${finding.label}]`;
        redacted = redacted.substring(0, finding.startIndex) + placeholder + redacted.substring(finding.endIndex);
      });
    return redacted;
  }
}
