import { createClient } from "@/lib/supabase/server"
import type { Order, Review, NewsletterSubscriber, Product, Customer } from "@/types"

// Server-side database operations
export async function getNewsletterSubscriptions(): Promise<NewsletterSubscriber[]> {
  try {
    const supabase = await createClient()
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

export async function getAllOrders(): Promise<Order[]> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase.from("orders").select("*").order("created_at", { ascending: false })

    if (error) throw error

    return (data || []).map((order) => {
      const [firstName, ...lastNameParts] = order.customer_name.split(" ")
      const lastName = lastNameParts.join(" ")
      const [brand, last4] = order.payment_method.split(" ****")

      return {
        orderId: order.id,
        userId: order.user_id,
        customerInfo: {
          firstName,
          lastName,
          email: order.customer_email,
          phone: order.customer_phone,
        },
        shippingAddress: order.shipping_address,
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
        updatedAt: order.created_at,
      }
    })
  } catch (error) {
    console.error("Error fetching orders:", error)
    return []
  }
}

export async function getAllProducts(): Promise<Product[]> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase.from("products").select("*").order("name")

    if (error) throw error
    return data || []
  } catch (error) {
    console.error("Error fetching products:", error)
    return []
  }
}

export async function getAllReviews(): Promise<Review[]> {
  try {
    const supabase = await createClient()
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

export async function getAllCustomers(): Promise<Customer[]> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase.from("customers").select("*").order("created_at", { ascending: false })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error("Error fetching customers:", error)
    return []
  }
}

export function isSupabaseConfigured(): boolean {
  return !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
}

export async function getStats(): Promise<{
  totalProducts: number
  totalOrders: number
  totalRevenue: number
  totalReviews: number
  totalSubscribers: number
}> {
  if (!isSupabaseConfigured()) {
    return {
      totalProducts: 0,
      totalOrders: 0,
      totalRevenue: 0,
      totalReviews: 0,
      totalSubscribers: 0,
    }
  }

  try {
    const supabase = await createClient()

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

interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  display_order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export async function getAllCategories(): Promise<Category[]> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase.from("categories").select("*").order("display_order", { ascending: true })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error("Error fetching categories:", error)
    return []
  }
}

interface TaxType {
  id: string
  name: string
  description: string | null
  rate: number
  is_active: boolean
  country: string
  created_at: string
  updated_at: string
}

export async function getAllTaxes(): Promise<TaxType[]> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase.from("taxes").select("*").order("name", { ascending: true })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error("Error fetching taxes:", error)
    return []
  }
}

export async function getTaxById(taxId: string): Promise<TaxType | null> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase.from("taxes").select("*").eq("id", taxId).single()

    if (error) throw error
    return data
  } catch (error) {
    console.error("Error fetching tax:", error)
    return null
  }
}
