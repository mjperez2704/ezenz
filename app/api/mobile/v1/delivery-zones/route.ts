import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/database"

export async function GET(request: NextRequest) {
  try {
    const zones = await db.getAllDeliveryZones()
    const activeZones = zones.filter((z) => z.active)

    return NextResponse.json({
      success: true,
      data: activeZones,
    })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Error al obtener zonas de entrega" },
      { status: 500 },
    )
  }
}
