import { MobileNavbar } from "@/components/mobile/mobile-navbar"
import { MobileHero } from "@/components/mobile/mobile-hero"
import { MobileProductCarousel } from "@/components/mobile/mobile-product-carousel"
import { MobileCategories } from "@/components/mobile/mobile-categories"
import { MobileFeaturedProducts } from "@/components/mobile/mobile-featured-products"
import { MobileFooter } from "@/components/mobile/mobile-footer"

export default function MobilePage() {
  return (
    <main className="min-h-screen bg-[rgb(15,15,35)]">
      <MobileNavbar />
      <MobileHero />
      <MobileProductCarousel />
      <MobileCategories />
      <MobileFeaturedProducts />
      <MobileFooter />
    </main>
  )
}
