"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, ImageIcon, Loader2 } from "lucide-react"
import { toast } from "sonner"

interface ProductImageUploadProps {
  value: string
  onChange: (url: string) => void
  productId?: string
}

export function ProductImageUpload({ value, onChange, productId }: ProductImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [existingImages, setExistingImages] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchExistingImages()
  }, [])

  async function fetchExistingImages() {
    try {
      const response = await fetch("/api/admin/product-images")
      if (response.ok) {
        const images = await response.json()
        setExistingImages(images)
      }
    } catch (error) {
      console.error("Error fetching images:", error)
    } finally {
      setLoading(false)
    }
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Por favor selecciona una imagen válida")
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("La imagen no debe superar 5MB")
      return
    }

    setUploading(true)

    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/admin/upload-product-image", {
        method: "POST",
        body: formData,
      })

      if (response.ok) {
        const data = await response.json()
        onChange(data.url)
        // Refresh existing images list
        await fetchExistingImages()
        toast.success("Imagen subida exitosamente")
      } else {
        const error = await response.json()
        toast.error(error.error || "Error al subir la imagen")
      }
    } catch (error) {
      toast.error("Error al subir la imagen")
      console.error("Upload error:", error)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-2">
        <Label>Imagen del Producto</Label>

        {/* Upload nueva imagen */}
        <div className="flex gap-2">
          <Input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            disabled={uploading}
            className="flex-1"
            id="product-image-upload"
          />
          <Button
            type="button"
            variant="outline"
            disabled={uploading}
            onClick={() => document.getElementById("product-image-upload")?.click()}
          >
            {uploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Subiendo...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Subir Nueva
              </>
            )}
          </Button>
        </div>

        {/* Selector de imágenes existentes */}
        {!loading && existingImages.length > 0 && (
          <div className="space-y-2">
            <Label className="text-sm text-muted-foreground">O selecciona una imagen existente:</Label>
            <Select value={value} onValueChange={onChange}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona una imagen existente" />
              </SelectTrigger>
              <SelectContent>
                {existingImages.map((img) => (
                  <SelectItem key={img} value={img}>
                    <div className="flex items-center gap-2">
                      <ImageIcon className="h-4 w-4" />
                      {img}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Preview */}
        {value && (
          <div className="mt-4">
            <Label className="text-sm text-muted-foreground mb-2 block">Vista previa:</Label>
            <div className="relative w-32 h-32 border rounded-lg overflow-hidden">
              <img
                src={value || "/placeholder.svg"}
                alt="Preview"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = "/placeholder.svg"
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
