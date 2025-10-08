import { DetectionResult } from '../types';

export interface ITextProcessor {
  extractPlainText(html: string): string;
  redactText(text: string, findings: DetectionResult[]): string;
}
