export function luhnCheck(cardNumber: string): boolean {
  if (!/^\d+$/.test(cardNumber)) {
    return false;
  }

  const digits = cardNumber.split('').map(Number);
  let sum = 0;
  let isSecond = false;

  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = digits[i];
    if (isSecond) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }
    sum += digit;
    isSecond = !isSecond;
  }

  return sum % 10 === 0;
}
