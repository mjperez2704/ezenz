"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"

export function HeroSection() {
  return (
    <section className="relative bg-black h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 hidden md:block">
        <Image
          src="/images/fondo-seccion-hero.png"
          alt="Cosmic background"
          fill
          className="object-cover"
          priority
          quality={100}
        />
        <div className="absolute inset-0 bg-black/20" />
      </div>

      <div className="absolute inset-0 md:hidden bg-black flex flex-col items-center justify-center gap-8 px-8">
        <div className="w-full max-w-sm">
          <Image
            src="/images/design-mode/logo_header.png"
            alt="E-zenz Logo"
            width={400}
            height={300}
            className="w-full h-auto"
            priority
          />
        </div>
        <Link href="/productos">
          <Button className="bg-white hover:bg-white/90 text-black border-none px-12 py-6 text-base tracking-[0.3em] uppercase font-bold">
            SHOP NOW
          </Button>
        </Link>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 text-center hidden md:flex flex-col items-center justify-end h-full pb-16">
        <div className="animate-fadeIn flex flex-col items-center gap-6">
          <div className="flex-shrink-0">
            <Image
              src="/images/design-mode/logo_header.png"
              alt="EZENZ logo"
              width={505}
              height={151}
              className="rounded-md"
            />
          </div>
          <div>
            <Link href="/productos">
              <Button className="bg-white hover:bg-white/90 text-black border-none px-12 sm:px-16 py-6 sm:py-7 text-base sm:text-lg tracking-[0.3em] uppercase font-bold">
                SHOP NOW
              </Button>
            </Link>
          </div>

          {/* App Download Card */}
          <div className="w-full max-w-[280px]">
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-xl">
              <div className="flex items-center justify-between gap-3">
                <div className="flex-shrink-0">
                  <Image src="/images/logo-app.png" alt="Stardust App" width={60} height={60} className="rounded-md" />
                </div>

                <div className="flex flex-col items-start flex-1">
                  <p className="text-gray-900 font-semibold text-sm mb-2">Descarga la app</p>
                  <div className="flex items-center gap-2">
                    <Link
                      href="https://play.google.com/store"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:opacity-80 transition-opacity"
                    >
                      <Image src="/logos/play_store.png" alt="Google Play" width={32} height={32} className="rounded" />
                    </Link>

                    <Link
                      href="https://www.apple.com/app-store/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:opacity-80 transition-opacity"
                    >
                      <Image src="/logos/app_store.png" alt="App Store" width={32} height={32} className="rounded" />
                    </Link>

                    <Link
                      href="https://appgallery.huawei.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:opacity-80 transition-opacity"
                    >
                      <Image
                        src="/logos/huawei_store.png"
                        alt="Huawei AppGallery"
                        width={32}
                        height={32}
                        className="rounded"
                      />
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            <p className="text-white md:text-white text-black text-sm sm:text-base mt-3 text-center drop-shadow-lg">
              Para obtener descuentos exclusivos!
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
