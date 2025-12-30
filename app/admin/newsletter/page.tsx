export const dynamic = "force-dynamic";

import { getNewsletterSubscriptions } from "@/lib/database-server"
import { NewsletterTable } from "@/components/admin/newsletter-table"

export default async function NewsletterAdminPage() {
  const subscribers = await getNewsletterSubscriptions()

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Suscriptores del Newsletter</h1>
        <p className="text-muted-foreground">Lista de todos los suscriptores al newsletter</p>
      </div>

      <NewsletterTable subscribers={subscribers} />
    </div>
  )
}
