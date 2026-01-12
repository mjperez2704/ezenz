import { createClient } from "@supabase/supabase-js"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ProductsClient } from "@/components/products-client"

async function getProducts() {
  try {
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

    const { data, error } = await supabase.from("products").select("*").order("display_order")

    if (error) {
      console.error("[v0] Error fetching products:", error)
      return []
    }

    console.log("[v0] Successfully fetched products:", data?.length || 0)
    return data || []
  } catch (error) {
    console.error("[v0] Error fetching products:", error)
    return []
  }
}

export default async function ProductsPage() {
  const products = await getProducts()

  return (
    <main className="min-h-screen bg-[rgb(15,15,35)]">
      <Navbar />

      {/* Hero Header */}
      <section className="relative pt-32 pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[rgb(15,15,35)] via-[rgb(20,20,40)] to-transparent">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[rgb(170,151,196)] rounded-full blur-[120px] opacity-10" />
          <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-[rgb(201,18,64)] rounded-full blur-[120px] opacity-10" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto text-center font-condor">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 text-balance font-condor tracking-wider text-white">
            NUESTRA{" "}
            <span className="bg-gradient-to-r font-condor from-[rgb(170,151,196)] to-[rgb(201,18,64)] bg-clip-text text-transparent">
              COLECCIÓN
            </span>
          </h1>
          <p className="text-xl text-white/70 max-w-3xl mx-auto text-pretty leading-relaxed">
            Explora nuestra línea completa de suplementos diseñados científicamente para optimizar tu bienestar en todos
            los aspectos de tu vida.
          </p>
        </div>
      </section>

      <ProductsClient initialProducts={products} />

      <Footer />
    </main>
  )
}
