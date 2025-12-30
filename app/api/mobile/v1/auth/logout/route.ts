import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    await supabase.auth.signOut()

    return NextResponse.json({ message: "Logout exitoso" })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Error al cerrar sesión" }, { status: 500 })
  }
}
