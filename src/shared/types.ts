export type DetectorId =
  | 'email'
  | 'phone'
  | 'credit_card'
  | 'jwt'
  | 'aws_key'
  | 'cloud_api_keys'
  | 'gcp_key'
  | 'openai_key'
  | 'stripe_key'
  | 'ip'
  | 'hex_token';

export type DetectionAction = 'redact' | 'warn';

export interface DetectionResult {
  id: string;
  detectorId: DetectorId;
  label: string;
  confidence: 'high' | 'medium' | 'low';
  content: string;
  startIndex: number;
  endIndex: number;
}

export interface Detector {
  id: DetectorId;
  label: string;
  confidence: 'high' | 'medium' | 'low';
  pattern: RegExp;
  validate?: (match: RegExpExecArray) => boolean;
}
