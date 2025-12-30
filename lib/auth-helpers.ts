import { createClient as createBrowserClient } from "@/lib/supabase/client"
import { createClient as createServerClient } from "@/lib/supabase/server"

export interface UserProfile {
  id: string
  email: string
  full_name: string | null
  phone: string | null
  created_at: string
  updated_at: string
}

export interface UserAddress {
  id: string
  user_id: string
  address_name: string
  full_name: string
  phone: string
  street_address: string
  city: string
  state: string
  zip_code: string
  is_default: boolean
  created_at: string
}

export async function getUserProfile() {
  const supabase = createBrowserClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  const { data, error } = await supabase.from("users").select("*").eq("id", user.id).single()

  if (error) {
    console.error("Error fetching user profile:", error)
    return null
  }

  return data as UserProfile
}

export async function getServerUserProfile() {
  try {
    const supabase = await createServerClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return null

    const { data, error } = await supabase.from("users").select("*").eq("id", user.id).single()

    if (error) {
      console.error("Error fetching user profile:", error)
      return null
    }

    return data as UserProfile
  } catch (error) {
    console.error("Error in getServerUserProfile:", error)
    return null
  }
}

export async function getUserAddresses() {
  const supabase = createBrowserClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return []

  const { data, error } = await supabase
    .from("user_addresses")
    .select("*")
    .eq("user_id", user.id)
    .order("is_default", { ascending: false })
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching user addresses:", error)
    return []
  }

  return data as UserAddress[]
}

export async function updateUserProfile(profile: Partial<UserProfile>) {
  const supabase = createBrowserClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error("No user logged in")

  const { error } = await supabase
    .from("users")
    .update({
      ...profile,
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id)

  if (error) throw error

  return true
}
