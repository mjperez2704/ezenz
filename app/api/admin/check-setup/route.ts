import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase.rpc("check_admin_exists")

    if (error) {
      console.error("[v0] Error al verificar administradores:", error)
      // Si hay error, asumimos que necesita setup
      return NextResponse.json({ needsSetup: true })
    }

    // data será true si existen admins, false si no existen
    return NextResponse.json({ needsSetup: !data })
  } catch (error) {
    console.error("[v0] Error en check-setup:", error)
    return NextResponse.json({ needsSetup: true })
  }
}
