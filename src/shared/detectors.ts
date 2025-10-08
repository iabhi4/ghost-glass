import { Detector } from './types';
import { luhnCheck } from './utils';

export const BUILT_IN_DETECTORS = [
  {
    id: 'email',
    label: 'Email Address',
    confidence: 'high',
    pattern: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
  },
  {
    id: 'phone',
    label: 'Phone Number',
    confidence: 'high',
    pattern: /\b(?:\+\d{1,3}[-.\s]?)?(?:\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}|\+\d{1,3}[-.\s]?\d{7,15}|\d{10,15})\b/g,
  },
  {
    id: 'credit_card',
    label: 'Credit Card Number',
    confidence: 'high',
    pattern: /\b(?:\d[ -]*?){13,19}\b/g,
    validate: (match) => {
      const numbersOnly = match[0].replace(/[\s-]/g, '');
      if (numbersOnly.length < 13 || numbersOnly.length > 19) {
        return false;
      }
      return luhnCheck(numbersOnly);
    },
  },
  {
    id: 'aws_key',
    label: 'AWS Access Key ID',
    confidence: 'high',
    pattern: /\b(AKIA[0-9A-Z]{16})\b/g,
  },
  {
    id: 'openai_key',
    label: 'OpenAI API Key',
    confidence: 'high',
    pattern: /\b(sk-[a-zA-Z0-9]{48})\b/g,
  },
  {
    id: 'jwt',
    label: 'JSON Web Token (JWT)',
    confidence: 'medium',
    pattern: /eyJ[a-zA-Z0-9_-]{5,}\.eyJ[a-zA-Z0-9_-]{5,}\.[a-zA-Z0-9_-]{10,}/g,
  },
] as const satisfies readonly Detector[];