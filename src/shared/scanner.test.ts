import { scanText } from './scanner';

const testText = `
  Hello, my email is test@example.com.
  Please use this AWS key: AKIAIOSFODNN7EXAMPLE.
  And my OpenAI key is sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx.
  Here's a fake credit card that passes luhn: 49927398716.
  This is a bad key: 1234567890.
  A sample JWT: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
`;

console.log('--- Running Scanner Test ---');
const findings = scanText(testText);

if (findings.length > 0) {
  console.log(`Found ${findings.length} potential secrets:`);
  findings.forEach((finding) => {
    console.log(
      `  - [${finding.confidence.toUpperCase()}] ${finding.label}: "${finding.content}" (at index ${finding.startIndex})`
    );
  });
} else {
  console.log('No secrets found.');
}
console.log('--- Test Complete ---');
