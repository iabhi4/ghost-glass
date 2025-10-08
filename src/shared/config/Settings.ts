import { Detector } from '../types';

export interface ExtensionSettings {
  enabledGuards: ('copy' | 'paste')[];
  detectionThreshold: 'high' | 'medium' | 'low';
  customDetectors: Detector[];
  debugMode: boolean;
}

export const DEFAULT_SETTINGS: ExtensionSettings = {
  enabledGuards: ['copy', 'paste'],
  detectionThreshold: 'high',
  customDetectors: [],
  debugMode: false,
};
