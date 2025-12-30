import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()

    if (error || !user) {
      return NextResponse.json({ success: false, error: "No autenticado" }, { status: 401 })
    }

    const notificationId = params.id

    // Aquí eliminarías la notificación de la base de datos
    // await db.deleteNotification(notificationId, user.id)

    return NextResponse.json({
      success: true,
      message: "Notificación eliminada",
    })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Error al eliminar notificación" },
      { status: 500 },
    )
  }
}
