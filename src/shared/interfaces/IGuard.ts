import { DetectionResult } from '../types';

export interface IGuard {
  initialize(): void;
  destroy(): void;
  handleEvent(event: Event): void;
  onSecretsDetected?(findings: DetectionResult[]): void;
}
