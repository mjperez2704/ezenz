import { type NextRequest, NextResponse } from "next/server"
import { writeFile, mkdir } from "fs/promises"
import { join } from "path"
import { existsSync } from "fs"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No se proporcionó archivo" }, { status: 400 })
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "El archivo debe ser una imagen" }, { status: 400 })
    }

    // Convert filename to UPPERCASE
    const originalName = file.name
    const extension = originalName.substring(originalName.lastIndexOf("."))
    const nameWithoutExt = originalName.substring(0, originalName.lastIndexOf("."))
    const uppercaseName = nameWithoutExt.toUpperCase() + extension.toUpperCase()

    // Ensure /public/productos/ directory exists
    const productsDir = join(process.cwd(), "public", "productos")
    if (!existsSync(productsDir)) {
      await mkdir(productsDir, { recursive: true })
    }

    // Save file
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const filePath = join(productsDir, uppercaseName)

    await writeFile(filePath, buffer)

    const url = `/productos/${uppercaseName}`

    return NextResponse.json({
      url,
      message: "Imagen subida exitosamente",
    })
  } catch (error) {
    console.error("Error uploading image:", error)
    return NextResponse.json({ error: "Error al subir la imagen" }, { status: 500 })
  }
}
