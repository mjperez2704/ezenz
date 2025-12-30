import { NextResponse } from "next/server"
import { readdirSync } from "fs"
import { join } from "path"

export async function GET() {
  try {
    const productsDir = join(process.cwd(), "public", "productos")
    const files = readdirSync(productsDir)

    // Filter only image files and return with /productos/ prefix
    const imageFiles = files
      .filter((file) => /\.(jpg|jpeg|png|gif|webp)$/i.test(file))
      .map((file) => `/productos/${file}`)

    return NextResponse.json(imageFiles)
  } catch (error) {
    console.error("Error reading product images:", error)
    return NextResponse.json({ error: "Error al leer imágenes" }, { status: 500 })
  }
}
