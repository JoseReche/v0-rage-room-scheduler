'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Flame, Clock, MessageCircle, DollarSign } from 'lucide-react'
import { toast } from 'sonner'
import { buildWhatsAppUrl } from '@/lib/constants'

type Booking = {
  id: string
  user_id: string
  booking_date: string
  time_slot: 'morning' | 'afternoon'
  customer_name: string
  customer_phone: string | null
  notes: string | null
  status: 'pending' | 'approved' | 'rejected'
  payment_type: 'paid' | 'free'
  created_at: string
}

type BookingFormProps = {
  selectedDate: Date
  existingBookings: Booking[]
  onBookingCreated: () => void
}

export function BookingForm({
  selectedDate,
  existingBookings,
  onBookingCreated,
}: BookingFormProps) {
  const [customerName, setCustomerName] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [notes, setNotes] = useState('')
  const [selectedSlot, setSelectedSlot] = useState<'morning' | 'afternoon' | null>(null)
  const paymentType: 'paid' = 'paid'
  const [isLoading, setIsLoading] = useState(false)

  const morningTaken = existingBookings.some((b) => b.time_slot === 'morning')
  const afternoonTaken = existingBookings.some((b) => b.time_slot === 'afternoon')
  const isFull = morningTaken && afternoonTaken

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedSlot) {
      toast.error('Selecione um horario')
      return
    }

    setIsLoading(true)

    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          booking_date: format(selectedDate, 'yyyy-MM-dd'),
          time_slot: selectedSlot,
          customer_name: customerName,
          customer_phone: customerPhone,
          notes,
          payment_type: paymentType,
        }),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Erro ao criar agendamento')
      }

      const bookingDate = format(selectedDate, 'yyyy-MM-dd')
      const whatsappUrl = buildWhatsAppUrl({
        customer_name: customerName,
        booking_date: bookingDate,
        time_slot: selectedSlot,
        payment_type: paymentType,
        notes: notes || null,
      })

      toast.success('Agendamento criado! Aguardando aprovacao do administrador.')

      // Open WhatsApp in a new tab
      window.open(whatsappUrl, '_blank')

      setCustomerName('')
      setCustomerPhone('')
      setNotes('')
      setSelectedSlot(null)
      onBookingCreated()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro ao criar agendamento')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div>
      <div className="mb-4 flex items-center gap-2">
        <Flame className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-bold uppercase tracking-tight text-foreground">
          {format(selectedDate, "d 'de' MMMM", { locale: ptBR })}
        </h3>
      </div>

      {isFull ? (
        <div className="rounded-md border border-destructive/50 bg-destructive/10 p-4 text-center">
          <p className="text-sm font-semibold text-destructive">
            Este dia ja esta lotado (2/2 agendamentos)
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <Label className="mb-2 block text-xs uppercase tracking-wider text-muted-foreground">
              Horario
            </Label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                disabled={morningTaken}
                onClick={() => setSelectedSlot('morning')}
                className={`
                  flex items-center justify-center gap-2 rounded-md border p-3 text-sm font-semibold transition-all
                  ${morningTaken
                    ? 'border-border bg-muted text-muted-foreground cursor-not-allowed line-through'
                    : selectedSlot === 'morning'
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border bg-secondary text-foreground hover:border-primary/50'
                  }
                `}
              >
                <Clock className="h-4 w-4" />
                Manha
              </button>
              <button
                type="button"
                disabled={afternoonTaken}
                onClick={() => setSelectedSlot('afternoon')}
                className={`
                  flex items-center justify-center gap-2 rounded-md border p-3 text-sm font-semibold transition-all
                  ${afternoonTaken
                    ? 'border-border bg-muted text-muted-foreground cursor-not-allowed line-through'
                    : selectedSlot === 'afternoon'
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border bg-secondary text-foreground hover:border-primary/50'
                  }
                `}
              >
                <Clock className="h-4 w-4" />
                Tarde
              </button>
            </div>
          </div>

          <div className="rounded-md border border-border bg-primary/10 p-3">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Tipo de Sessao</p>
            <p className="mt-1 flex items-center gap-2 text-sm font-semibold text-primary">
              <DollarSign className="h-4 w-4" />
              Sessao Paga (aprovacao do administrador)
            </p>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="customer-name" className="text-xs uppercase tracking-wider text-muted-foreground">
              Nome do Cliente *
            </Label>
            <Input
              id="customer-name"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              required
              placeholder="Nome completo"
              className="border-border bg-secondary text-foreground placeholder:text-muted-foreground"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="customer-phone" className="text-xs uppercase tracking-wider text-muted-foreground">
              Telefone
            </Label>
            <Input
              id="customer-phone"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              placeholder="(00) 00000-0000"
              className="border-border bg-secondary text-foreground placeholder:text-muted-foreground"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="notes" className="text-xs uppercase tracking-wider text-muted-foreground">
              Observacoes
            </Label>
            <Input
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Observacoes sobre a sessao..."
              className="border-border bg-secondary text-foreground placeholder:text-muted-foreground"
            />
          </div>

          <Button
            type="submit"
            disabled={isLoading || !selectedSlot}
            className="mt-2 w-full bg-primary font-bold uppercase tracking-wider text-primary-foreground hover:bg-primary/90"
          >
            {isLoading ? (
              'Agendando...'
            ) : (
              <span className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4" />
                Agendar e Enviar WhatsApp
              </span>
            )}
          </Button>
        </form>
      )}
    </div>
  )
}
