import { createClient } from "@/lib/supabase/client"
import type { Review, NewsletterSubscriber, Order } from "@/types"

// Interfaces existentes (sin cambios)
export interface Product {
  id: string
  name: string
  slug?: string
  category: string
  description: string
  long_description?: string
  image: string
  benefits: string[]
  gradient?: string
  price: number
  stock: number
  ingredients?: string[]
  usage?: string
  rating?: number
  reviews_count?: number
  tax_id?: string
}

export interface SiteSettings {
  general: {
    siteName: string
    siteDescription: string
    contactEmail: string
    contactPhone: string
    logo: string
    mobileRedirectEnabled: boolean
  }
  payment: {
    stripeEnabled: boolean
    stripePublishableKey: string
    paypalEnabled: boolean
    paypalClientId: string
    cashOnDeliveryEnabled: boolean
  }
  email: {
    smtpHost: string
    smtpPort: string
    smtpUser: string
    smtpPassword: string
    fromEmail: string
    fromName: string
  }
  social: {
    facebook: string
    instagram: string
  }
  notifications: {
    pushEnabled: boolean
    emailOrderConfirmation: boolean
    emailShipping: boolean
    smsEnabled: boolean
  }
}

export interface DeliveryZone {
  id: string
  name: string
  state: string
  cities: string[]
  shipping_cost: number
  delivery_time: string
  active: boolean
  created_at: string
}

export interface Supplier {
  id: string
  name: string
  contact_name?: string
  email?: string
  phone?: string
  address?: string
  notes?: string
  active: boolean
  created_at: string
}

export interface Banner {
  id: string
  title: string
  description?: string
  image_url: string
  link_url?: string
  position: "hero" | "middle" | "footer"
  active: boolean
  start_date?: string
  end_date?: string
  created_at: string
}

export interface Customer {
  id: string
  email: string
  first_name: string
  last_name: string
  phone?: string
  address?: string
  city?: string
  state?: string
  zip_code?: string
  total_orders: number
  total_spent: number
  created_at: string
}

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  phone?: string
  createdAt: string
}

export interface OrderData {
  orderId: string
  userId?: string
  authenticatedUserId?: string | null
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
    image?: string
  }>
  subtotal: number
  shipping: number
  tax: number
  total: number
  paymentMethod: {
    last4: string
    brand: string
  }
  status: "pending" | "processing" | "completed" | "failed"
  createdAt: string
  updatedAt?: string
}

export interface EditableContent {
  id: number
  key: string
  title: string
  content: string
  content_type: string
  created_at: string
  updated_at: string
}

class Database {
  private static instance: Database

  private constructor() {}

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database()
    }
    return Database.instance
  }

  // Helper para determinar si estamos en cliente o servidor
  private getClient() {
    return createClient()
  }

  // PRODUCTS - Métodos sincrónicos para compatibilidad (usan cliente)
  getAllProducts(): Product[] {
    // Este método debe ser llamado desde el cliente
    // Para uso en servidor, usar getAllProductsAsync
    console.warn(
      "getAllProducts() is synchronous and should only be used on client. Use getAllProductsAsync() on server.",
    )
    return []
  }

  async getAllProductsAsync(): Promise<Product[]> {
    try {
      const supabase = this.getClient()
      const { data, error } = await supabase.from("products").select("*").order("name")

      if (error) throw error
      return data || []
    } catch (error) {
      console.error("Error fetching products:", error)
      return []
    }
  }

  async getProductById(id: string): Promise<Product | null> {
    try {
      const supabase = this.getClient()
      const { data, error } = await supabase.from("products").select("*").eq("id", id).single()

      if (error) throw error
      return data
    } catch (error) {
      console.error("Error fetching product:", error)
      return null
    }
  }

  async getProductBySlug(slug: string): Promise<Product | null> {
    try {
      const supabase = this.getClient()
      const { data, error } = await supabase.from("products").select("*").eq("slug", slug).single()

      if (error) throw error
      return data
    } catch (error) {
      console.error("Error fetching product:", error)
      return null
    }
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    try {
      const supabase = this.getClient()
      const { data, error } = await supabase.from("products").select("*").eq("category", category)

      if (error) throw error
      return data || []
    } catch (error) {
      console.error("Error fetching products by category:", error)
      return []
    }
  }

  async updateProductStock(productId: string, quantity: number): Promise<boolean> {
    try {
      const supabase = this.getClient()

      // Primero obtener el stock actual
      const { data: product, error: fetchError } = await supabase
        .from("products")
        .select("stock")
        .eq("id", productId)
        .single()

      if (fetchError || !product) return false
      if (product.stock < quantity) return false

      // Actualizar el stock
      const { error: updateError } = await supabase
        .from("products")
        .update({ stock: product.stock - quantity })
        .eq("id", productId)

      if (updateError) throw updateError
      return true
    } catch (error) {
      console.error("Error updating product stock:", error)
      return false
    }
  }

  async searchProducts(query: string): Promise<Product[]> {
    try {
      const supabase = this.getClient()
      const lowerQuery = query.toLowerCase()

      const { data, error } = await supabase
        .from("products")
        .select("*")
        .or(`name.ilike.%${lowerQuery}%,description.ilike.%${lowerQuery}%,category.ilike.%${lowerQuery}%`)

      if (error) throw error
      return data || []
    } catch (error) {
      console.error("Error searching products:", error)
      return []
    }
  }

  async filterProducts(filters: {
    categories?: string[]
    priceRange?: { min: number; max: number }
    benefits?: string[]
  }): Promise<Product[]> {
    try {
      const supabase = this.getClient()
      let query = supabase.from("products").select("*")

      if (filters.categories && filters.categories.length > 0) {
        query = query.in("category", filters.categories)
      }

      if (filters.priceRange) {
        query = query.gte("price", filters.priceRange.min).lte("price", filters.priceRange.max)
      }

      const { data, error } = await query

      if (error) throw error
      return data || []
    } catch (error) {
      console.error("Error filtering products:", error)
      return []
    }
  }

  async createProduct(product: Omit<Product, "id">): Promise<Product | null> {
    try {
      const supabase = this.getClient()
      const { data, error } = await supabase.from("products").insert(product).select().single()

      if (error) throw error
      return data
    } catch (error) {
      console.error("Error creating product:", error)
      return null
    }
  }

  async updateProduct(id: string, updates: Partial<Product>): Promise<boolean> {
    try {
      const supabase = this.getClient()
      const { error } = await supabase.from("products").update(updates).eq("id", id)

      if (error) throw error
      return true
    } catch (error) {
      console.error("Error updating product:", error)
      return false
    }
  }

  async deleteProduct(id: string): Promise<boolean> {
    try {
      const supabase = this.getClient()
      const { error } = await supabase.from("products").delete().eq("id", id)

      if (error) throw error
      return true
    } catch (error) {
      console.error("Error deleting product:", error)
      return false
    }
  }

  // ORDERS
  async saveOrder(order: OrderData): Promise<void> {
    try {
      const supabase = this.getClient()

      const { error } = await supabase.from("orders").insert({
        id: order.orderId,
        user_id: order.userId || null,
        authenticated_user_id: order.authenticatedUserId || null,
        customer_name: `${order.customerInfo.firstName} ${order.customerInfo.lastName}`,
        customer_email: order.customerInfo.email,
        customer_phone: order.customerInfo.phone,
        shipping_address: order.shippingAddress,
        items: order.items,
        subtotal: order.subtotal,
        shipping: order.shipping,
        tax: order.tax,
        total: order.total,
        status: order.status,
        payment_method: `${order.paymentMethod.brand} ****${order.paymentMethod.last4}`,
      })

      if (error) throw error

      // Actualizar stock de productos
      for (const item of order.items) {
        await this.updateProductStock(item.id, item.quantity)
      }
    } catch (error) {
      console.error("Error saving order:", error)
      throw error
    }
  }

  async getOrder(orderId: string): Promise<OrderData | null> {
    try {
      const supabase = this.getClient()
      const { data, error } = await supabase.from("orders").select("*").eq("id", orderId).single()

      if (error) throw error
      if (!data) return null

      // Transformar de formato DB a formato Order
      const [firstName, ...lastNameParts] = data.customer_name.split(" ")
      const lastName = lastNameParts.join(" ")
      const [brand, last4] = data.payment_method.split(" ****")

      return {
        orderId: data.id,
        userId: data.user_id,
        authenticatedUserId: data.authenticated_user_id,
        customerInfo: {
          firstName,
          lastName,
          email: data.customer_email,
          phone: data.customer_phone,
        },
        shippingAddress: {
          address: data.shipping_address.address,
          city: data.shipping_address.city,
          state: data.shipping_address.state,
          zip: data.shipping_address.zip,
          notes: data.shipping_address.notes,
        },
        items: data.items,
        subtotal: Number.parseFloat(data.subtotal),
        shipping: Number.parseFloat(data.shipping),
        tax: Number.parseFloat(data.tax),
        total: Number.parseFloat(data.total),
        paymentMethod: {
          brand,
          last4,
        },
        status: data.status,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      }
    } catch (error) {
      console.error("Error fetching order:", error)
      return null
    }
  }

  async getAllOrders(): Promise<OrderData[]> {
    try {
      const supabase = this.getClient()
      const { data, error } = await supabase.from("orders").select("*").order("created_at", { ascending: false })

      if (error) throw error

      return (data || []).map((order) => {
        const [firstName, ...lastNameParts] = order.customer_name.split(" ")
        const lastName = lastNameParts.join(" ")
        const [brand, last4] = order.payment_method.split(" ****")

        return {
          orderId: order.id,
          userId: order.user_id,
          authenticatedUserId: order.authenticated_user_id,
          customerInfo: {
            firstName,
            lastName,
            email: order.customer_email,
            phone: order.customer_phone,
          },
          shippingAddress: {
            address: order.shipping_address.address,
            city: order.shipping_address.city,
            state: order.shipping_address.state,
            zip: order.shipping_address.zip,
            notes: order.shipping_address.notes,
          },
          items: order.items,
          subtotal: Number.parseFloat(order.subtotal),
          shipping: Number.parseFloat(order.shipping),
          tax: Number.parseFloat(order.tax),
          total: Number.parseFloat(order.total),
          paymentMethod: {
            brand,
            last4,
          },
          status: order.status,
          createdAt: order.created_at,
          updatedAt: order.updated_at,
        }
      })
    } catch (error) {
      console.error("Error fetching orders:", error)
      return []
    }
  }

  async getOrdersByEmail(email: string): Promise<OrderData[]> {
    try {
      const supabase = this.getClient()
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("customer_email", email)
        .order("created_at", { ascending: false })

      if (error) throw error

      return (data || []).map((order) => {
        const [firstName, ...lastNameParts] = order.customer_name.split(" ")
        const lastName = lastNameParts.join(" ")
        const [brand, last4] = order.payment_method.split(" ****")

        return {
          orderId: order.id,
          userId: order.user_id,
          authenticatedUserId: order.authenticated_user_id,
          customerInfo: {
            firstName,
            lastName,
            email: order.customer_email,
            phone: order.customer_phone,
          },
          shippingAddress: {
            address: order.shipping_address.address,
            city: order.shipping_address.city,
            state: order.shipping_address.state,
            zip: order.shipping_address.zip,
            notes: order.shipping_address.notes,
          },
          items: order.items,
          subtotal: Number.parseFloat(order.subtotal),
          shipping: Number.parseFloat(order.shipping),
          tax: Number.parseFloat(order.tax),
          total: Number.parseFloat(order.total),
          paymentMethod: {
            brand,
            last4,
          },
          status: order.status,
          createdAt: order.created_at,
          updatedAt: order.updated_at,
        }
      })
    } catch (error) {
      console.error("Error fetching orders by email:", error)
      return []
    }
  }

  async updateOrderStatus(orderId: string, status: OrderData["status"]): Promise<boolean> {
    try {
      const supabase = this.getClient()
      const { error } = await supabase.from("orders").update({ status }).eq("id", orderId)

      if (error) throw error
      return true
    } catch (error) {
      console.error("Error updating order status:", error)
      return false
    }
  }

  // REVIEWS
  async saveReview(review: Review): Promise<void> {
    try {
      const supabase = this.getClient()

      const { error } = await supabase.from("reviews").insert({
        id: review.id,
        product_id: review.productId,
        user_name: review.author,
        user_email: review.userId || "guest@stardust.com",
        rating: review.rating,
        title: review.title || "",
        comment: review.comment,
        helpful_count: review.helpful,
      })

      if (error) throw error
    } catch (error) {
      console.error("Error saving review:", error)
      throw error
    }
  }

  async getReviewsByProduct(productId: string): Promise<Review[]> {
    try {
      const supabase = this.getClient()
      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .eq("product_id", productId)
        .order("created_at", { ascending: false })

      if (error) throw error

      return (data || []).map((review) => ({
        id: review.id,
        productId: review.product_id,
        author: review.user_name,
        rating: review.rating,
        title: review.title,
        comment: review.comment,
        date: review.created_at,
        helpful: review.helpful_count,
        verified: true,
      }))
    } catch (error) {
      console.error("Error fetching reviews:", error)
      return []
    }
  }

  async getAllReviews(): Promise<Review[]> {
    try {
      const supabase = this.getClient()
      const { data, error } = await supabase.from("reviews").select("*").order("created_at", { ascending: false })

      if (error) throw error

      return (data || []).map((review) => ({
        id: review.id,
        productId: review.product_id,
        author: review.user_name,
        rating: review.rating,
        title: review.title,
        comment: review.comment,
        date: review.created_at,
        helpful: review.helpful_count,
        verified: true,
      }))
    } catch (error) {
      console.error("Error fetching all reviews:", error)
      return []
    }
  }

  async deleteReview(reviewId: string): Promise<boolean> {
    try {
      const supabase = this.getClient()
      const { error } = await supabase.from("reviews").delete().eq("id", reviewId)

      if (error) throw error
      return true
    } catch (error) {
      console.error("Error deleting review:", error)
      return false
    }
  }

  async updateReviewHelpful(reviewId: string): Promise<boolean> {
    try {
      const supabase = this.getClient()

      // Incrementar el contador
      const { error } = await supabase.rpc("increment_review_helpful", {
        review_id: reviewId,
      })

      // Si el RPC no existe, usar actualización manual
      if (error && error.message.includes("does not exist")) {
        const { data: review } = await supabase.from("reviews").select("helpful_count").eq("id", reviewId).single()

        if (!review) return false

        const { error: updateError } = await supabase
          .from("reviews")
          .update({ helpful_count: review.helpful_count + 1 })
          .eq("id", reviewId)

        if (updateError) throw updateError
      } else if (error) {
        throw error
      }

      return true
    } catch (error) {
      console.error("Error updating review helpful:", error)
      return false
    }
  }

  // NEWSLETTER SUBSCRIPTIONS
  async saveNewsletterSubscription(email: string): Promise<boolean> {
    try {
      const supabase = this.getClient()

      const { error } = await supabase.from("newsletter_subscribers").insert({ email })

      // Si hay error de duplicado, retornar false
      if (error && error.code === "23505") {
        return false
      }

      if (error) throw error
      return true
    } catch (error) {
      console.error("Error saving newsletter subscription:", error)
      return false
    }
  }

  async getNewsletterSubscriptions(): Promise<NewsletterSubscriber[]> {
    try {
      const supabase = this.getClient()
      const { data, error } = await supabase
        .from("newsletter_subscribers")
        .select("email, subscribed_at")
        .order("subscribed_at", { ascending: false })

      if (error) throw error

      return (data || []).map((sub) => ({
        email: sub.email,
        date: sub.subscribed_at,
      }))
    } catch (error) {
      console.error("Error fetching newsletter subscriptions:", error)
      return []
    }
  }

  // USERS (mantenido para compatibilidad pero no usado activamente)
  async saveUser(user: User): Promise<void> {
    console.warn("saveUser() is deprecated. Use Supabase Auth instead.")
  }

  async getUserByEmail(email: string): Promise<User | null> {
    console.warn("getUserByEmail() is deprecated. Use Supabase Auth instead.")
    return null
  }

  // STATS
  async getStats(): Promise<{
    totalProducts: number
    totalOrders: number
    totalRevenue: number
    totalReviews: number
    totalSubscribers: number
  }> {
    try {
      const supabase = this.getClient()

      const [products, orders, reviews, subscribers] = await Promise.all([
        supabase.from("products").select("id", { count: "exact" }),
        supabase.from("orders").select("total"),
        supabase.from("reviews").select("id", { count: "exact" }),
        supabase.from("newsletter_subscribers").select("id", { count: "exact" }),
      ])

      const totalRevenue = orders.data?.reduce((sum, order) => sum + Number.parseFloat(order.total.toString()), 0) || 0

      return {
        totalProducts: products.count || 0,
        totalOrders: orders.data?.length || 0,
        totalRevenue,
        totalReviews: reviews.count || 0,
        totalSubscribers: subscribers.count || 0,
      }
    } catch (error) {
      console.error("Error fetching stats:", error)
      return {
        totalProducts: 0,
        totalOrders: 0,
        totalRevenue: 0,
        totalReviews: 0,
        totalSubscribers: 0,
      }
    }
  }

  async getSettings(): Promise<SiteSettings | null> {
    try {
      const supabase = this.getClient()
      const { data, error } = await supabase.from("site_settings").select("key, value")

      if (error) throw error

      const settings: any = {}
      data?.forEach((row) => {
        settings[row.key] = row.value
      })

      return settings as SiteSettings
    } catch (error) {
      console.error("Error fetching settings:", error)
      return null
    }
  }

  async updateSettings(key: keyof SiteSettings, value: any): Promise<boolean> {
    try {
      const supabase = this.getClient()
      const { error } = await supabase
        .from("site_settings")
        .update({ value, updated_at: new Date().toISOString() })
        .eq("key", key)

      if (error) throw error
      return true
    } catch (error) {
      console.error("Error updating settings:", error)
      return false
    }
  }

  async getAllDeliveryZones(): Promise<DeliveryZone[]> {
    try {
      const supabase = this.getClient()
      const { data, error } = await supabase.from("delivery_zones").select("*").order("name")

      if (error) throw error
      return data || []
    } catch (error) {
      console.error("Error fetching delivery zones:", error)
      return []
    }
  }

  async createDeliveryZone(zone: Omit<DeliveryZone, "id" | "created_at">): Promise<DeliveryZone | null> {
    try {
      const supabase = this.getClient()
      const { data, error } = await supabase.from("delivery_zones").insert(zone).select().single()

      if (error) throw error
      return data
    } catch (error) {
      console.error("Error creating delivery zone:", error)
      return null
    }
  }

  async updateDeliveryZone(id: string, updates: Partial<DeliveryZone>): Promise<boolean> {
    try {
      const supabase = this.getClient()
      const { error } = await supabase.from("delivery_zones").update(updates).eq("id", id)

      if (error) throw error
      return true
    } catch (error) {
      console.error("Error updating delivery zone:", error)
      return false
    }
  }

  async deleteDeliveryZone(id: string): Promise<boolean> {
    try {
      const supabase = this.getClient()
      const { error } = await supabase.from("delivery_zones").delete().eq("id", id)

      if (error) throw error
      return true
    } catch (error) {
      console.error("Error deleting delivery zone:", error)
      return false
    }
  }

  async getAllSuppliers(): Promise<Supplier[]> {
    try {
      const supabase = this.getClient()
      const { data, error } = await supabase.from("suppliers").select("*").order("name")

      if (error) throw error
      return data || []
    } catch (error) {
      console.error("Error fetching suppliers:", error)
      return []
    }
  }

  async createSupplier(supplier: Omit<Supplier, "id" | "created_at">): Promise<Supplier | null> {
    try {
      const supabase = this.getClient()
      const { data, error } = await supabase.from("suppliers").insert(supplier).select().single()

      if (error) throw error
      return data
    } catch (error) {
      console.error("Error creating supplier:", error)
      return null
    }
  }

  async updateSupplier(id: string, updates: Partial<Supplier>): Promise<boolean> {
    try {
      const supabase = this.getClient()
      const { error } = await supabase.from("suppliers").update(updates).eq("id", id)

      if (error) throw error
      return true
    } catch (error) {
      console.error("Error updating supplier:", error)
      return false
    }
  }

  async deleteSupplier(id: string): Promise<boolean> {
    try {
      const supabase = this.getClient()
      const { error } = await supabase.from("suppliers").delete().eq("id", id)

      if (error) throw error
      return true
    } catch (error) {
      console.error("Error deleting supplier:", error)
      return false
    }
  }

  async getAllBanners(): Promise<Banner[]> {
    try {
      const supabase = this.getClient()
      const { data, error } = await supabase.from("banners").select("*").order("created_at", { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error("Error fetching banners:", error)
      return []
    }
  }

  async getActiveBanners(position?: string): Promise<Banner[]> {
    try {
      const supabase = this.getClient()
      let query = supabase.from("banners").select("*").eq("active", true)

      if (position) {
        query = query.eq("position", position)
      }

      const { data, error } = await query

      if (error) throw error
      return data || []
    } catch (error) {
      console.error("Error fetching active banners:", error)
      return []
    }
  }

  async createBanner(banner: Omit<Banner, "id" | "created_at">): Promise<Banner | null> {
    try {
      const supabase = this.getClient()
      const { data, error } = await supabase.from("banners").insert(banner).select().single()

      if (error) throw error
      return data
    } catch (error) {
      console.error("Error creating banner:", error)
      return null
    }
  }

  async updateBanner(id: string, updates: Partial<Banner>): Promise<boolean> {
    try {
      const supabase = this.getClient()
      const { error } = await supabase.from("banners").update(updates).eq("id", id)

      if (error) throw error
      return true
    } catch (error) {
      console.error("Error updating banner:", error)
      return false
    }
  }

  async deleteBanner(id: string): Promise<boolean> {
    try {
      const supabase = this.getClient()
      const { error } = await supabase.from("banners").delete().eq("id", id)

      if (error) throw error
      return true
    } catch (error) {
      console.error("Error deleting banner:", error)
      return false
    }
  }

  async getAllCustomers(): Promise<Customer[]> {
    try {
      const supabase = this.getClient()
      const { data, error } = await supabase.from("customers").select("*").order("created_at", { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error("Error fetching customers:", error)
      return []
    }
  }

  async getCustomerByEmail(email: string): Promise<Customer | null> {
    try {
      const supabase = this.getClient()
      const { data, error } = await supabase.from("customers").select("*").eq("email", email).single()

      if (error && error.code !== "PGRST116") throw error
      return data
    } catch (error) {
      console.error("Error fetching customer:", error)
      return null
    }
  }

  async createOrUpdateCustomer(customer: Omit<Customer, "id" | "created_at">): Promise<Customer | null> {
    try {
      const supabase = this.getClient()

      // Intentar actualizar primero
      const existing = await this.getCustomerByEmail(customer.email)

      if (existing) {
        const { data, error } = await supabase
          .from("customers")
          .update(customer)
          .eq("email", customer.email)
          .select()
          .single()

        if (error) throw error
        return data
      } else {
        const { data, error } = await supabase.from("customers").insert(customer).select().single()

        if (error) throw error
        return data
      }
    } catch (error) {
      console.error("Error creating/updating customer:", error)
      return null
    }
  }

  async updateCustomerStats(email: string, orderTotal: number): Promise<boolean> {
    try {
      const supabase = this.getClient()

      const customer = await this.getCustomerByEmail(email)
      if (!customer) return false

      const { error } = await supabase
        .from("customers")
        .update({
          total_orders: customer.total_orders + 1,
          total_spent: customer.total_spent + orderTotal,
        })
        .eq("email", email)

      if (error) throw error
      return true
    } catch (error) {
      console.error("Error updating customer stats:", error)
      return false
    }
  }

  // Editable Content
  async getEditableContent(key: string): Promise<EditableContent | null> {
    try {
      const supabase = this.getClient()
      const { data, error } = await supabase.from("editable_content").select("*").eq("key", key).maybeSingle()

      if (error) throw error
      return data
    } catch (error) {
      console.error("Error fetching editable content:", error)
      return null
    }
  }

  async getAllEditableContent(): Promise<EditableContent[]> {
    try {
      const supabase = this.getClient()
      console.log("[v0] getAllEditableContent: Consultando editable_content...")
      const { data, error } = await supabase.from("editable_content").select("*").order("title")

      console.log("[v0] getAllEditableContent: Query result:", {
        dataLength: data?.length,
        error: error?.message,
        firstItem: data?.[0],
      })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error("[v0] Error fetching all editable content:", error)
      return []
    }
  }

  async updateEditableContent(key: string, content: string): Promise<boolean> {
    try {
      const supabase = this.getClient()
      const { error } = await supabase
        .from("editable_content")
        .update({
          content,
          updated_at: new Date().toISOString(),
        })
        .eq("key", key)

      if (error) throw error
      return true
    } catch (error) {
      console.error("Error updating editable content:", error)
      return false
    }
  }
}

// Exportar instancia singleton
export const db = Database.getInstance()

export async function saveOrder(order: Order): Promise<void> {
  return db.saveOrder(order)
}

export { Database }
