import { Navbar } from "@/components/navbar"
import { HeroSection } from "@/components/hero-section"
import { WhoWeAreSection } from "@/components/who-we-are-section"
import { PhilosophySection } from "@/components/philosophy-section"
import { MissionVisionValuesSection } from "@/components/mission-vision-values-section"
import { ProductLinesSection } from "@/components/product-lines-section"
import { PlatinumLineSection } from "@/components/platinum-line-section"
import { CompetitiveAdvantagesNewSection } from "@/components/competitive-advantages-new-section"
import { InstalledCapacitySection } from "@/components/installed-capacity-section"
import { LaboratoryOfficesSection } from "@/components/laboratory-offices-section"
import { ContactNewSection } from "@/components/contact-new-section"
import { Footer } from "@/components/footer"
import { AnaquelesBóticasSection } from "@/components/anaqueles-boticas-section"

export default function Home() {
  return (
    <main className="min-h-screen bg-[rgb(15,15,35)] flex flex-col items-center">
      <div className="w-full max-w-[1920px]">
        <Navbar />
        <HeroSection />
        <WhoWeAreSection />
        <PhilosophySection />
        <MissionVisionValuesSection />
        <ProductLinesSection />
        <PlatinumLineSection />
        <ContactNewSection />
        <CompetitiveAdvantagesNewSection />
        <LaboratoryOfficesSection />
        <AnaquelesBóticasSection />
        <InstalledCapacitySection />
        <Footer />
      </div>
    </main>
  )
}
