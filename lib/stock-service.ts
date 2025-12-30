import { createClient } from "./supabase/client"

export interface StockReservation {
  id: string
  product_id: string
  quantity: number
  session_id: string
  reserved_at: string
  expires_at: string
  status: "active" | "completed" | "expired" | "cancelled"
}

export interface StockAvailability {
  productId: string
  actualStock: number
  reservedStock: number
  availableStock: number
  isLowStock: boolean
  lowStockThreshold: number
}

export class StockService {
  private static RESERVATION_DURATION_MINUTES = 15

  static async reserveStock(
    productId: string,
    quantity: number,
    sessionId: string,
  ): Promise<{ success: boolean; error?: string; reservationId?: string }> {
    try {
      const supabase = createClient()
      if (!supabase) {
        return { success: false, error: "Supabase client not available" }
      }

      // Clean expired reservations first
      await this.cleanExpiredReservations()

      // Check available stock
      const availability = await this.getStockAvailability(productId)
      if (!availability) {
        return { success: false, error: "Product not found" }
      }

      if (availability.availableStock < quantity) {
        return {
          success: false,
          error: `Solo hay ${availability.availableStock} unidades disponibles`,
        }
      }

      // Create reservation
      const expiresAt = new Date()
      expiresAt.setMinutes(expiresAt.getMinutes() + this.RESERVATION_DURATION_MINUTES)

      const { data, error } = await supabase
        .from("stock_reservations")
        .insert({
          product_id: productId,
          quantity,
          session_id: sessionId,
          expires_at: expiresAt.toISOString(),
          status: "active",
        })
        .select()
        .single()

      if (error) {
        console.error("Error creating reservation:", error)
        return { success: false, error: "Error al reservar stock" }
      }

      return { success: true, reservationId: data.id }
    } catch (error) {
      console.error("Error in reserveStock:", error)
      return { success: false, error: "Error al reservar stock" }
    }
  }

  static async completeReservation(sessionId: string): Promise<boolean> {
    try {
      const supabase = createClient()
      if (!supabase) return false

      const { error } = await supabase
        .from("stock_reservations")
        .update({ status: "completed" })
        .eq("session_id", sessionId)
        .eq("status", "active")

      return !error
    } catch (error) {
      console.error("Error completing reservation:", error)
      return false
    }
  }

  static async cancelReservation(sessionId: string): Promise<boolean> {
    try {
      const supabase = createClient()
      if (!supabase) return false

      const { error } = await supabase
        .from("stock_reservations")
        .update({ status: "cancelled" })
        .eq("session_id", sessionId)
        .eq("status", "active")

      return !error
    } catch (error) {
      console.error("Error cancelling reservation:", error)
      return false
    }
  }

  static async getStockAvailability(productId: string): Promise<StockAvailability | null> {
    try {
      const supabase = createClient()
      if (!supabase) return null

      // Get product info
      const { data: product, error: productError } = await supabase
        .from("products")
        .select("stock, low_stock_threshold")
        .eq("id", productId)
        .single()

      if (productError || !product) return null

      // Get reserved stock
      const { data: reservations, error: reservationError } = await supabase
        .from("stock_reservations")
        .select("quantity")
        .eq("product_id", productId)
        .eq("status", "active")
        .gt("expires_at", new Date().toISOString())

      if (reservationError) {
        console.error("Error fetching reservations:", reservationError)
      }

      const reservedStock = reservations?.reduce((sum, r) => sum + r.quantity, 0) || 0
      const availableStock = Math.max(product.stock - reservedStock, 0)

      return {
        productId,
        actualStock: product.stock,
        reservedStock,
        availableStock,
        isLowStock: product.stock <= (product.low_stock_threshold || 5),
        lowStockThreshold: product.low_stock_threshold || 5,
      }
    } catch (error) {
      console.error("Error in getStockAvailability:", error)
      return null
    }
  }

  static async cleanExpiredReservations(): Promise<number> {
    try {
      const supabase = createClient()
      if (!supabase) return 0

      const { data, error } = await supabase
        .from("stock_reservations")
        .update({ status: "expired" })
        .eq("status", "active")
        .lt("expires_at", new Date().toISOString())
        .select()

      if (error) {
        console.error("Error cleaning expired reservations:", error)
        return 0
      }

      return data?.length || 0
    } catch (error) {
      console.error("Error in cleanExpiredReservations:", error)
      return 0
    }
  }

  static async getLowStockProducts(): Promise<any[]> {
    try {
      const supabase = createClient()
      if (!supabase) return []

      const { data, error } = await supabase
        .from("products")
        .select("*")
        .lte("stock", supabase.rpc("low_stock_threshold"))
        .eq("notify_on_low_stock", true)

      if (error) {
        console.error("Error fetching low stock products:", error)
        return []
      }

      return data || []
    } catch (error) {
      console.error("Error in getLowStockProducts:", error)
      return []
    }
  }

  static async checkMultipleProductsAvailability(
    items: { productId: string; quantity: number }[],
  ): Promise<{ available: boolean; unavailableProducts: string[] }> {
    const unavailableProducts: string[] = []

    for (const item of items) {
      const availability = await this.getStockAvailability(item.productId)
      if (!availability || availability.availableStock < item.quantity) {
        unavailableProducts.push(item.productId)
      }
    }

    return {
      available: unavailableProducts.length === 0,
      unavailableProducts,
    }
  }
}
