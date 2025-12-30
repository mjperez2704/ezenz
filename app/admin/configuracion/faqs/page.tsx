"use client"

import { useState, useEffect } from "react"
import { AdminNav } from "@/components/admin-nav"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Edit2, Trash2, Save, X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface FAQ {
  id: string
  question: string
  answer: string
  order: number
  active: boolean
}

export default function AdminFAQsPage() {
  const [faqs, setFaqs] = useState<FAQ[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [newFAQ, setNewFAQ] = useState({ question: "", answer: "" })
  const [showNewForm, setShowNewForm] = useState(false)
  const { toast } = useToast()

  // Cargar FAQs desde localStorage (simulado)
  useEffect(() => {
    const storedFAQs = localStorage.getItem("faqs")
    if (storedFAQs) {
      setFaqs(JSON.parse(storedFAQs))
    } else {
      // FAQs por defecto
      const defaultFAQs: FAQ[] = [
        {
          id: "1",
          question: "¿Cuánto tarda el envío?",
          answer: "Procesamos todos los pedidos en 1-2 días hábiles. El envío estándar toma 5-7 días hábiles.",
          order: 1,
          active: true,
        },
        {
          id: "2",
          question: "¿Ofrecen garantía de devolución?",
          answer: "Sí, ofrecemos una garantía de devolución de dinero de 30 días en todos nuestros productos.",
          order: 2,
          active: true,
        },
        {
          id: "3",
          question: "¿Los productos son veganos?",
          answer: "La mayoría de nuestros productos son 100% veganos. Verifica la etiqueta de cada producto.",
          order: 3,
          active: true,
        },
        {
          id: "4",
          question: "¿Necesito receta médica?",
          answer: "No, nuestros suplementos son de venta libre y no requieren receta médica.",
          order: 4,
          active: true,
        },
      ]
      setFaqs(defaultFAQs)
      localStorage.setItem("faqs", JSON.stringify(defaultFAQs))
    }
  }, [])

  const saveFAQs = (updatedFAQs: FAQ[]) => {
    localStorage.setItem("faqs", JSON.stringify(updatedFAQs))
    setFaqs(updatedFAQs)
  }

  const handleAddFAQ = () => {
    if (!newFAQ.question || !newFAQ.answer) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos",
        variant: "destructive",
      })
      return
    }

    const newFAQItem: FAQ = {
      id: Date.now().toString(),
      question: newFAQ.question,
      answer: newFAQ.answer,
      order: faqs.length + 1,
      active: true,
    }

    const updatedFAQs = [...faqs, newFAQItem]
    saveFAQs(updatedFAQs)

    setNewFAQ({ question: "", answer: "" })
    setShowNewForm(false)

    toast({
      title: "FAQ agregada",
      description: "La pregunta frecuente se agregó correctamente",
    })
  }

  const handleUpdateFAQ = (id: string, updates: Partial<FAQ>) => {
    const updatedFAQs = faqs.map((faq) => (faq.id === id ? { ...faq, ...updates } : faq))
    saveFAQs(updatedFAQs)
    setEditingId(null)

    toast({
      title: "FAQ actualizada",
      description: "Los cambios se guardaron correctamente",
    })
  }

  const handleDeleteFAQ = (id: string) => {
    const updatedFAQs = faqs.filter((faq) => faq.id !== id)
    saveFAQs(updatedFAQs)

    toast({
      title: "FAQ eliminada",
      description: "La pregunta frecuente se eliminó correctamente",
    })
  }

  return (
    <div className="min-h-screen bg-[rgb(15,15,35)]">
      <AdminNav />

      <div className="p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Gestión de FAQs</h1>
              <p className="text-white/60">Administra las preguntas frecuentes de la página de contacto</p>
            </div>
            <Button
              onClick={() => setShowNewForm(!showNewForm)}
              className="bg-gradient-to-r from-[rgb(170,151,196)] to-[rgb(201,18,64)] hover:opacity-90"
            >
              <Plus className="h-4 w-4 mr-2" />
              Nueva FAQ
            </Button>
          </div>

          {/* New FAQ Form */}
          {showNewForm && (
            <Card className="bg-white/5 border-[rgb(74,34,86)] mb-6">
              <CardHeader>
                <CardTitle className="text-white">Nueva Pregunta Frecuente</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-white/80">Pregunta</Label>
                  <Input
                    value={newFAQ.question}
                    onChange={(e) => setNewFAQ({ ...newFAQ, question: e.target.value })}
                    className="bg-white/5 border-[rgb(74,34,86)] text-white"
                    placeholder="¿Cuál es tu pregunta?"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-white/80">Respuesta</Label>
                  <Textarea
                    value={newFAQ.answer}
                    onChange={(e) => setNewFAQ({ ...newFAQ, answer: e.target.value })}
                    className="bg-white/5 border-[rgb(74,34,86)] text-white min-h-[100px]"
                    placeholder="Respuesta detallada..."
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={handleAddFAQ}
                    className="bg-gradient-to-r from-[rgb(170,151,196)] to-[rgb(201,18,64)] hover:opacity-90"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Guardar
                  </Button>
                  <Button
                    onClick={() => setShowNewForm(false)}
                    variant="outline"
                    className="border-white/20 text-white"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Cancelar
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* FAQs List */}
          <div className="space-y-4">
            {faqs.map((faq) => (
              <Card key={faq.id} className="bg-white/5 border-[rgb(74,34,86)]">
                <CardContent className="p-6">
                  {editingId === faq.id ? (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label className="text-white/80">Pregunta</Label>
                        <Input
                          defaultValue={faq.question}
                          onBlur={(e) => handleUpdateFAQ(faq.id, { question: e.target.value })}
                          className="bg-white/5 border-[rgb(74,34,86)] text-white"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-white/80">Respuesta</Label>
                        <Textarea
                          defaultValue={faq.answer}
                          onBlur={(e) => handleUpdateFAQ(faq.id, { answer: e.target.value })}
                          className="bg-white/5 border-[rgb(74,34,86)] text-white min-h-[100px]"
                        />
                      </div>
                      <Button
                        onClick={() => setEditingId(null)}
                        className="bg-gradient-to-r from-[rgb(170,151,196)] to-[rgb(201,18,64)] hover:opacity-90"
                      >
                        Guardar Cambios
                      </Button>
                    </div>
                  ) : (
                    <div>
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <h3 className="text-white font-semibold text-lg mb-2">{faq.question}</h3>
                          <p className="text-white/70">{faq.answer}</p>
                        </div>
                        <div className="flex gap-2 ml-4">
                          <Button
                            onClick={() => setEditingId(faq.id)}
                            size="sm"
                            variant="outline"
                            className="border-[rgb(170,151,196)] text-[rgb(170,151,196)]"
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            onClick={() => handleDeleteFAQ(faq.id)}
                            size="sm"
                            variant="outline"
                            className="border-red-500 text-red-400"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
