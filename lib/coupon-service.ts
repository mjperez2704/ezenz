import { createClient } from "./supabase/client"

export interface Coupon {
  id: string
  code: string
  description: string | null
  discount_type: "percentage" | "fixed" | "free_shipping"
  discount_value: number
  min_purchase_amount: number
  max_discount_amount: number | null
  usage_limit: number | null
  usage_count: number
  per_user_limit: number
  valid_from: string
  valid_until: string | null
  is_active: boolean
  applicable_to: "all" | "specific_products" | "specific_categories"
  applicable_products: string[] | null
  applicable_categories: string[] | null
}

export interface CouponValidationResult {
  valid: boolean
  discount_amount: number
  error_message?: string
  coupon_id?: string
  coupon?: Coupon
  free_shipping?: boolean
}

export class CouponService {
  static async validateCoupon(
    code: string,
    cartTotal: number,
    userId?: string,
    productIds: string[] = [],
  ): Promise<CouponValidationResult> {
    try {
      const supabase = createClient()
      if (!supabase) {
        return {
          valid: false,
          discount_amount: 0,
          error_message: "Service not available",
        }
      }

      // Normalize code to uppercase
      const normalizedCode = code.trim().toUpperCase()

      // Get coupon
      const { data: coupon, error: couponError } = await supabase
        .from("coupons")
        .select("*")
        .eq("code", normalizedCode)
        .eq("is_active", true)
        .single()

      if (couponError || !coupon) {
        return {
          valid: false,
          discount_amount: 0,
          error_message: "Cupón inválido o expirado",
        }
      }

      // Check date validity
      const now = new Date()
      if (coupon.valid_from && new Date(coupon.valid_from) > now) {
        return {
          valid: false,
          discount_amount: 0,
          error_message: "Cupón aún no disponible",
        }
      }
      if (coupon.valid_until && new Date(coupon.valid_until) < now) {
        return {
          valid: false,
          discount_amount: 0,
          error_message: "Cupón expirado",
        }
      }

      // Check minimum purchase
      if (cartTotal < coupon.min_purchase_amount) {
        return {
          valid: false,
          discount_amount: 0,
          error_message: `Compra mínima requerida: $${coupon.min_purchase_amount}`,
        }
      }

      // Check usage limit
      if (coupon.usage_limit && coupon.usage_count >= coupon.usage_limit) {
        return {
          valid: false,
          discount_amount: 0,
          error_message: "Cupón agotado",
        }
      }

      // Check per-user limit
      if (userId && coupon.per_user_limit) {
        const { data: userUsage, error: usageError } = await supabase
          .from("coupon_usage")
          .select("id")
          .eq("coupon_id", coupon.id)
          .eq("user_id", userId)

        if (!usageError && userUsage && userUsage.length >= coupon.per_user_limit) {
          return {
            valid: false,
            discount_amount: 0,
            error_message: "Ya usaste este cupón",
          }
        }
      }

      // Check product applicability
      if (coupon.applicable_to === "specific_products" && coupon.applicable_products) {
        const hasApplicableProduct = productIds.some((id) => coupon.applicable_products?.includes(id))
        if (!hasApplicableProduct) {
          return {
            valid: false,
            discount_amount: 0,
            error_message: "Cupón no aplicable a estos productos",
          }
        }
      }

      // Calculate discount
      let discountAmount = 0
      let freeShipping = false

      if (coupon.discount_type === "percentage") {
        discountAmount = cartTotal * (coupon.discount_value / 100)
        if (coupon.max_discount_amount) {
          discountAmount = Math.min(discountAmount, coupon.max_discount_amount)
        }
      } else if (coupon.discount_type === "fixed") {
        discountAmount = coupon.discount_value
      } else if (coupon.discount_type === "free_shipping") {
        freeShipping = true
        discountAmount = 0
      }

      // Ensure discount doesn't exceed cart total
      discountAmount = Math.min(discountAmount, cartTotal)

      return {
        valid: true,
        discount_amount: discountAmount,
        coupon_id: coupon.id,
        coupon,
        free_shipping: freeShipping,
      }
    } catch (error) {
      console.error("Error validating coupon:", error)
      return {
        valid: false,
        discount_amount: 0,
        error_message: "Error al validar cupón",
      }
    }
  }

  static async recordCouponUsage(
    couponId: string,
    orderId: string,
    discountApplied: number,
    userId?: string,
  ): Promise<boolean> {
    try {
      const supabase = createClient()
      if (!supabase) return false

      // Record usage
      const { error: usageError } = await supabase.from("coupon_usage").insert({
        coupon_id: couponId,
        user_id: userId,
        order_id: orderId,
        discount_applied: discountApplied,
      })

      if (usageError) {
        console.error("Error recording coupon usage:", usageError)
        return false
      }

      // Increment usage count
      const { error: updateError } = await supabase.rpc("increment", {
        table_name: "coupons",
        row_id: couponId,
        column_name: "usage_count",
      })

      if (updateError) {
        console.error("Error incrementing usage count:", updateError)
      }

      return true
    } catch (error) {
      console.error("Error in recordCouponUsage:", error)
      return false
    }
  }

  static async getAllCoupons(): Promise<Coupon[]> {
    try {
      const supabase = createClient()
      if (!supabase) return []

      const { data, error } = await supabase.from("coupons").select("*").order("created_at", { ascending: false })

      if (error) {
        console.error("Error fetching coupons:", error)
        return []
      }

      return data || []
    } catch (error) {
      console.error("Error in getAllCoupons:", error)
      return []
    }
  }

  static async createCoupon(couponData: Partial<Coupon>): Promise<{ success: boolean; error?: string }> {
    try {
      const supabase = createClient()
      if (!supabase) {
        return { success: false, error: "Service not available" }
      }

      // Normalize code
      const code = couponData.code?.trim().toUpperCase()
      if (!code) {
        return { success: false, error: "Código de cupón requerido" }
      }

      const { error } = await supabase.from("coupons").insert({
        ...couponData,
        code,
      })

      if (error) {
        console.error("Error creating coupon:", error)
        return { success: false, error: "Error al crear cupón" }
      }

      return { success: true }
    } catch (error) {
      console.error("Error in createCoupon:", error)
      return { success: false, error: "Error al crear cupón" }
    }
  }

  static async updateCoupon(couponId: string, updates: Partial<Coupon>): Promise<{ success: boolean; error?: string }> {
    try {
      const supabase = createClient()
      if (!supabase) {
        return { success: false, error: "Service not available" }
      }

      const { error } = await supabase
        .from("coupons")
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq("id", couponId)

      if (error) {
        console.error("Error updating coupon:", error)
        return { success: false, error: "Error al actualizar cupón" }
      }

      return { success: true }
    } catch (error) {
      console.error("Error in updateCoupon:", error)
      return { success: false, error: "Error al actualizar cupón" }
    }
  }

  static async deleteCoupon(couponId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const supabase = createClient()
      if (!supabase) {
        return { success: false, error: "Service not available" }
      }

      const { error } = await supabase.from("coupons").delete().eq("id", couponId)

      if (error) {
        console.error("Error deleting coupon:", error)
        return { success: false, error: "Error al eliminar cupón" }
      }

      return { success: true }
    } catch (error) {
      console.error("Error in deleteCoupon:", error)
      return { success: false, error: "Error al eliminar cupón" }
    }
  }
}
