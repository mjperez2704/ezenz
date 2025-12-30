import Link from "next/link"
import Image from "next/image"
import { Mail, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function ConfirmacionPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[rgb(15,15,35)] via-[rgb(35,15,55)] to-[rgb(15,15,35)] flex items-center justify-center p-4 sm:p-6 md:p-10 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-[rgb(170,151,196)]/20 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[rgb(201,18,64)]/10 rounded-full blur-[120px] animate-pulse delay-700" />
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="flex justify-center mb-8">
          <Link href="/" className="relative w-48 h-12 group">
            <Image
              src="/images/design-mode/logo.png"
              alt="STARDUST"
              fill
              className="object-contain group-hover:scale-105 transition-transform"
            />
          </Link>
        </div>

        <Card className="bg-white/5 backdrop-blur-xl border-[rgb(170,151,196)]/30 shadow-2xl">
          <CardHeader className="space-y-1 text-center">
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-gradient-to-br from-[rgb(170,151,196)] to-[rgb(201,18,64)] rounded-full relative">
                <Mail className="h-8 w-8 text-white" />
                <Sparkles className="h-4 w-4 text-white absolute -top-1 -right-1 animate-pulse" />
              </div>
            </div>
            <CardTitle className="text-2xl sm:text-3xl font-bold text-white">¡Revisa tu correo!</CardTitle>
            <CardDescription className="text-white/70">Te hemos enviado un enlace de confirmación</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-white/80 text-center text-sm">
              Por favor revisa tu bandeja de entrada y haz clic en el enlace de confirmación para activar tu cuenta.
            </p>
            <p className="text-white/60 text-center text-xs">
              Si no ves el correo, revisa tu carpeta de spam o correo no deseado.
            </p>
            <div className="pt-4 space-y-2">
              <Link href="/auth/login">
                <Button className="w-full bg-gradient-to-r from-[rgb(170,151,196)] to-[rgb(201,18,64)] hover:from-[rgb(190,171,216)] hover:to-[rgb(221,38,84)] text-white">
                  Ir al inicio de sesión
                </Button>
              </Link>
              <Link href="/">
                <Button variant="ghost" className="w-full text-white/70 hover:text-white hover:bg-white/10">
                  Volver al inicio
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
