import Image from "next/image"
import { Youtube, Mail, Instagram, Facebook } from "lucide-react"

export function ContactSection() {
  return (
    <section
      className="relative w-full min-h-[540px] py-12 sm:py-16 md:h-[540px] flex items-center justify-center -my-px bg-cover bg-center"
      style={{ backgroundImage: "url(/images/fondo_seccion_contactanos.jpg)" }}
    >
      {/*<div className="w-full max-w-[1920px] px-4 sm:px-8 md:px-16 mx-auto">*/}
      <div className="w-full px-4 sm:px-8 md:px-16 mx-auto">
        {/* Mobile/Tablet Layout */}
        <div className="md:hidden space-y-8">
          {/* Title */}
          <div className="flex items-center justify-center gap-4 sm:gap-6">
            <Image
              src="/images/estrella_stardust.png"
              alt="Star"
              width={24}
              height={24}
              className="sm:w-[30px] sm:h-[30px] flex-shrink-0"
            />
            <h2 className="text-4xl sm:text-5xl font-bold text-white italic font-condor">CONTACTANOS</h2>
          </div>

          {/* Contact Info - Stacked */}
          <div className="space-y-6 max-w-md mx-auto">
            <div className="flex items-center gap-4 sm:gap-6">
              <Youtube className="w-6 h-6 sm:w-8 sm:h-8 text-white flex-shrink-0" />
              <span className="text-white text-lg sm:text-2xl font-medium font-montserrat">Stardust</span>
            </div>

            <div className="flex items-center gap-4 sm:gap-6">
              <Mail className="w-6 h-6 sm:w-8 sm:h-8 text-white flex-shrink-0" />
              <span className="text-white text-base sm:text-2xl font-medium break-all font-montserrat">
                stardustcorp@gmail.com
              </span>
            </div>

            <div className="flex items-center gap-4 sm:gap-6">
              <Facebook className="w-6 h-6 sm:w-8 sm:h-8 text-white flex-shrink-0" />
              <span className="text-white text-lg sm:text-2xl font-medium font-montserrat">@Stardust</span>
            </div>

            <div className="flex items-center gap-4 sm:gap-6">
              <Instagram className="w-6 h-6 sm:w-8 sm:h-8 text-white flex-shrink-0" />
              <span className="text-white text-lg sm:text-2xl font-medium font-montserrat">@stardust_oficial</span>
            </div>

            <div className="flex items-center gap-4 sm:gap-6">
              <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
              </svg>
              <span className="text-white text-lg sm:text-2xl font-medium font-montserrat">+52 442-145-7866</span>
            </div>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden md:grid grid-cols-3 gap-32 items-center">
          {/* Left Side - Title */}
          <div className="flex items-center gap-6">
            <Image src="/images/estrella_stardust.png" alt="Star" width={30} height={30} className="flex-shrink-0" />
            <h2 className="text-4xl font-bold text-white italic font-condor">CONTACTANOS</h2>
          </div>

          {/* Middle - Contact Info */}
          <div className="space-y-6">
            <div className="flex items-center gap-6">
              <Youtube className="w-8 h-8 text-white flex-shrink-0" />
              <span className="text-white text-2xl font-medium font-montserrat">Stardust</span>
            </div>

            <div className="flex items-center gap-6">
              <Mail className="w-8 h-8 text-white flex-shrink-0" />
              <span className="text-white text-2xl font-medium font-montserrat">stardustcorp@gmail.com</span>
            </div>

            <div className="flex items-center gap-6">
              <Facebook className="w-8 h-8 text-white flex-shrink-0" />
              <span className="text-white text-2xl font-medium font-montserrat">@Stardust</span>
            </div>
          </div>

          {/* Right Side */}
          <div className="space-y-6">
            <div className="flex items-center gap-6">
              <Instagram className="w-8 h-8 text-white flex-shrink-0" />
              <span className="text-white text-2xl font-medium font-montserrat">@stardust_oficial</span>
            </div>

            <div className="flex items-center gap-6">
              <svg className="w-8 h-8 text-white flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
              </svg>
              <span className="text-white text-2xl font-medium font-montserrat">+52 442-145-7866</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
