import { createClient } from "./supabase/client"

export interface ShippingEvent {
  id: string
  order_id: string
  event_type:
    | "created"
    | "picked"
    | "packed"
    | "shipped"
    | "in_transit"
    | "out_for_delivery"
    | "delivered"
    | "failed"
    | "returned"
  event_description: string
  event_location: string | null
  event_date: string
  created_at: string
}

export interface ShippingInfo {
  tracking_number: string | null
  shipping_carrier: string | null
  shipped_at: string | null
  estimated_delivery_date: string | null
  delivered_at: string | null
  current_status: string
  events: ShippingEvent[]
}

export class ShippingService {
  static async updateTracking(
    orderId: string,
    trackingNumber: string,
    carrier: string,
    estimatedDeliveryDate?: string,
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const supabase = createClient()
      if (!supabase) {
        return { success: false, error: "Service not available" }
      }

      const updateData: any = {
        tracking_number: trackingNumber,
        shipping_carrier: carrier,
        shipped_at: new Date().toISOString(),
        status: "shipped",
      }

      if (estimatedDeliveryDate) {
        updateData.estimated_delivery_date = estimatedDeliveryDate
      }

      const { error } = await supabase.from("orders").update(updateData).eq("order_id", orderId)

      if (error) {
        console.error("Error updating tracking:", error)
        return { success: false, error: "Error al actualizar tracking" }
      }

      // Add shipping event
      await this.addShippingEvent(
        orderId,
        "shipped",
        `Pedido enviado con ${carrier}. Número de rastreo: ${trackingNumber}`,
        null,
      )

      return { success: true }
    } catch (error) {
      console.error("Error in updateTracking:", error)
      return { success: false, error: "Error al actualizar tracking" }
    }
  }

  static async addShippingEvent(
    orderId: string,
    eventType: ShippingEvent["event_type"],
    description: string,
    location?: string,
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const supabase = createClient()
      if (!supabase) {
        return { success: false, error: "Service not available" }
      }

      const { error } = await supabase.from("shipping_events").insert({
        order_id: orderId,
        event_type: eventType,
        event_description: description,
        event_location: location || null,
      })

      if (error) {
        console.error("Error adding shipping event:", error)
        return { success: false, error: "Error al agregar evento" }
      }

      // Update order status if necessary
      if (eventType === "delivered") {
        await supabase
          .from("orders")
          .update({
            status: "delivered",
            delivered_at: new Date().toISOString(),
          })
          .eq("order_id", orderId)
      }

      return { success: true }
    } catch (error) {
      console.error("Error in addShippingEvent:", error)
      return { success: false, error: "Error al agregar evento" }
    }
  }

  static async getShippingInfo(orderId: string): Promise<ShippingInfo | null> {
    try {
      const supabase = createClient()
      if (!supabase) return null

      // Get order info
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .select("tracking_number, shipping_carrier, shipped_at, estimated_delivery_date, delivered_at, status")
        .eq("order_id", orderId)
        .single()

      if (orderError || !order) {
        console.error("Error fetching order:", orderError)
        return null
      }

      // Get shipping events
      const { data: events, error: eventsError } = await supabase
        .from("shipping_events")
        .select("*")
        .eq("order_id", orderId)
        .order("event_date", { ascending: true })

      if (eventsError) {
        console.error("Error fetching events:", eventsError)
      }

      return {
        tracking_number: order.tracking_number,
        shipping_carrier: order.shipping_carrier,
        shipped_at: order.shipped_at,
        estimated_delivery_date: order.estimated_delivery_date,
        delivered_at: order.delivered_at,
        current_status: order.status,
        events: events || [],
      }
    } catch (error) {
      console.error("Error in getShippingInfo:", error)
      return null
    }
  }

  static getTrackingUrl(carrier: string, trackingNumber: string): string | null {
    const carriers: Record<string, string> = {
      fedex: `https://www.fedex.com/fedextrack/?trknbr=${trackingNumber}`,
      ups: `https://www.ups.com/track?tracknum=${trackingNumber}`,
      dhl: `https://www.dhl.com/en/express/tracking.html?AWB=${trackingNumber}`,
      usps: `https://tools.usps.com/go/TrackConfirmAction?tLabels=${trackingNumber}`,
      estafeta: `https://rastreo.estafeta.com/Rastreo/?numero=${trackingNumber}`,
      redpack: `https://www.redpack.com.mx/es/tracking/?guias=${trackingNumber}`,
    }

    const normalizedCarrier = carrier.toLowerCase()
    return carriers[normalizedCarrier] || null
  }

  static async markAsDelivered(orderId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const supabase = createClient()
      if (!supabase) {
        return { success: false, error: "Service not available" }
      }

      const { error } = await supabase
        .from("orders")
        .update({
          status: "delivered",
          delivered_at: new Date().toISOString(),
        })
        .eq("order_id", orderId)

      if (error) {
        console.error("Error marking as delivered:", error)
        return { success: false, error: "Error al actualizar estado" }
      }

      await this.addShippingEvent(orderId, "delivered", "Pedido entregado exitosamente", null)

      return { success: true }
    } catch (error) {
      console.error("Error in markAsDelivered:", error)
      return { success: false, error: "Error al actualizar estado" }
    }
  }

  static async getPendingShipments(): Promise<any[]> {
    try {
      const supabase = createClient()
      if (!supabase) return []

      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .in("status", ["confirmed", "paid", "processing"])
        .order("created_at", { ascending: false })

      if (error) {
        console.error("Error fetching pending shipments:", error)
        return []
      }

      return data || []
    } catch (error) {
      console.error("Error in getPendingShipments:", error)
      return []
    }
  }
}
