import { ExtensionSettings, DEFAULT_SETTINGS } from '../config/Settings';

export class ConfigManager {
  private settings: ExtensionSettings;

  constructor() {
    this.settings = { ...DEFAULT_SETTINGS };
    this.loadSettings();
  }

  private async loadSettings(): Promise<void> {
    try {
      if (typeof chrome !== 'undefined' && chrome.storage) {
        const result = await chrome.storage.sync.get(['extensionSettings']);
        if (result.extensionSettings) {
          this.settings = { ...DEFAULT_SETTINGS, ...result.extensionSettings };
        }
      }
    } catch (error) {
      console.warn('GhostGlass: Failed to load settings, using defaults:', error);
    }
  }

  public getSettings(): ExtensionSettings {
    return { ...this.settings };
  }

  public async updateSettings(newSettings: Partial<ExtensionSettings>): Promise<void> {
    this.settings = { ...this.settings, ...newSettings };
    
    try {
      if (typeof chrome !== 'undefined' && chrome.storage) {
        await chrome.storage.sync.set({ extensionSettings: this.settings });
      }
    } catch (error) {
      console.error('GhostGlass: Failed to save settings:', error);
    }
  }

  public isGuardEnabled(guardType: 'copy' | 'paste'): boolean {
    return this.settings.enabledGuards.includes(guardType);
  }

  public isDebugMode(): boolean {
    return this.settings.debugMode;
  }
}
