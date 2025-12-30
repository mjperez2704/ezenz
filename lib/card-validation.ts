// Luhn algorithm for card validation
function luhnCheck(cardNumber: string): boolean {
  const digits = cardNumber.replace(/\D/g, "")
  let sum = 0
  let isEven = false

  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = Number.parseInt(digits[i])

    if (isEven) {
      digit *= 2
      if (digit > 9) {
        digit -= 9
      }
    }

    sum += digit
    isEven = !isEven
  }

  return sum % 10 === 0
}

// Detect card brand
function detectCardBrand(cardNumber: string): string {
  const digits = cardNumber.replace(/\D/g, "")

  if (digits.startsWith("4")) return "Visa"
  if (digits.startsWith("5")) return "Mastercard"
  if (digits.startsWith("3")) return "Amex"
  if (digits.startsWith("6")) return "Discover"

  return "Card"
}

export function validateCard(cardNumber: string): { valid: boolean; brand: string } {
  const digits = cardNumber.replace(/\D/g, "")
  const isValid = digits.length >= 13 && digits.length <= 19 && luhnCheck(digits)
  const brand = detectCardBrand(digits)

  return { valid: isValid, brand }
}
