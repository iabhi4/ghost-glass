import { BUILT_IN_DETECTORS } from './detectors';
import { DetectionResult, Detector } from './types';

export function scanText(
  text: string,
  detectors: readonly Detector[] = BUILT_IN_DETECTORS,
): DetectionResult[] {
  const results: DetectionResult[] = [];

  if (!text || typeof text !== 'string') {
    return results;
  }

  for (const detector of detectors) {
    detector.pattern.lastIndex = 0;
    
    let match;
    while ((match = detector.pattern.exec(text)) !== null) {
      if (detector.validate && !detector.validate(match)) {
        continue;
      }

      const content = match[0];
      const startIndex = match.index;
      const endIndex = startIndex + content.length;

      results.push({
        id: `${detector.id}-${startIndex}-${endIndex}`,
        detectorId: detector.id,
        label: detector.label,
        confidence: detector.confidence,
        content: content,
        startIndex: startIndex,
        endIndex: endIndex,
      });
    }
  }

  return results;
}
