import { db } from "@/lib/database" // Solo usa cliente del navegador
import type { Order } from "@/types"

export interface OrderData {
  orderId: string
  customerInfo: {
    firstName: string
    lastName: string
    email: string
    phone: string
  }
  shippingAddress: {
    address: string
    city: string
    state: string
    zip: string
    notes?: string
  }
  items: Array<{
    id: string
    name: string
    price: number
    quantity: number
    image: string
  }>
  subtotal: number
  shipping: number
  tax: number
  total: number
  paymentMethod: {
    last4: string
    brand: string
  }
  status: string
  createdAt: string
}

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

export async function processPayment(
  paymentDetails: {
    cardNumber: string
    expiry: string
    cvv: string
    cardholderName: string
  },
  amount: number,
): Promise<{ success: boolean; error?: string }> {
  // Simulate payment processing
  await new Promise((resolve) => setTimeout(resolve, 2000))

  // Validate card using Luhn algorithm
  const validation = validateCard(paymentDetails.cardNumber)

  if (!validation.valid) {
    return {
      success: false,
      error: "Número de tarjeta inválido",
    }
  }

  // Validate expiry
  const [month, year] = paymentDetails.expiry.split("/")
  const currentDate = new Date()
  const currentYear = currentDate.getFullYear() % 100
  const currentMonth = currentDate.getMonth() + 1

  if (!month || !year || Number.parseInt(month) > 12 || Number.parseInt(month) < 1) {
    return {
      success: false,
      error: "Fecha de expiración inválida",
    }
  }

  if (
    Number.parseInt(year) < currentYear ||
    (Number.parseInt(year) === currentYear && Number.parseInt(month) < currentMonth)
  ) {
    return {
      success: false,
      error: "Tarjeta expirada",
    }
  }

  // Validate CVV
  if (paymentDetails.cvv.length < 3 || paymentDetails.cvv.length > 4) {
    return {
      success: false,
      error: "CVV inválido",
    }
  }

  // Simulate random payment failures (10% chance)
  if (Math.random() < 0.1) {
    return {
      success: false,
      error: "Pago rechazado. Por favor, intenta con otra tarjeta.",
    }
  }

  return { success: true }
}

export async function saveOrder(orderData: OrderData): Promise<void> {
  const order: Order = {
    orderId: orderData.orderId,
    userId: null,
    customerInfo: orderData.customerInfo,
    shippingAddress: orderData.shippingAddress,
    items: orderData.items,
    subtotal: orderData.subtotal,
    shipping: orderData.shipping,
    tax: orderData.tax,
    total: orderData.total,
    paymentMethod: orderData.paymentMethod,
    status: orderData.status as Order["status"],
    createdAt: orderData.createdAt,
    updatedAt: orderData.createdAt,
  }

  await db.saveOrder(order)
}

export async function getOrder(orderId: string): Promise<Order | null> {
  return await db.getOrder(orderId)
}
