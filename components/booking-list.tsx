'use client'

import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Trash2, User, Phone, Clock, FileText, CheckCircle2, XCircle, DollarSign, Gift, ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { useState } from 'react'
import { ADMIN_EMAIL, STATUS_LABELS, PAYMENT_TYPE_LABELS } from '@/lib/constants'

type Booking = {
  id: string
  user_id: string
  booking_date: string
  time_slot: 'morning' | 'afternoon'
  customer_name: string
  customer_phone: string | null
  notes: string | null
  status: 'pending' | 'approved' | 'rejected'
  payment_type: 'free' | 'paid'
  created_at: string
}

type BookingListProps = {
  bookings: Booking[]
  selectedDate: Date
  currentUserId: string
  currentUserEmail: string
  onBookingDeleted: () => void
}

export function BookingList({
  bookings,
  selectedDate,
  currentUserId,
  currentUserEmail,
  onBookingDeleted,
}: BookingListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const isAdmin = currentUserEmail === ADMIN_EMAIL

  const dateBookings = bookings.filter(
    (b) => b.booking_date === format(selectedDate, 'yyyy-MM-dd')
  )

  const handleDelete = async (id: string) => {
    setDeletingId(id)
    try {
      const res = await fetch(`/api/bookings/${id}`, { method: 'DELETE' })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Erro ao deletar')
      }
      toast.success('Agendamento removido!')
      onBookingDeleted()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro ao deletar')
    } finally {
      setDeletingId(null)
    }
  }

  const handleUpdateStatus = async (id: string, status: 'approved' | 'rejected') => {
    setUpdatingId(id)
    try {
      const res = await fetch(`/api/bookings/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Erro ao atualizar')
      }
      toast.success(status === 'approved' ? 'Agendamento aprovado!' : 'Agendamento rejeitado.')
      onBookingDeleted()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro ao atualizar')
    } finally {
      setUpdatingId(null)
    }
  }

  return (
    <div>
      <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">
        Agendamentos - {format(selectedDate, "d 'de' MMMM", { locale: ptBR })}
      </h3>

      {dateBookings.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          Nenhum agendamento neste dia.
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {dateBookings.map((booking) => (
            <div
              key={booking.id}
              className="rounded-md border border-border bg-secondary/50 p-4"
            >
              <div className="flex items-start justify-between">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <Clock className="h-3.5 w-3.5 text-primary" />
                    <span className="text-xs font-bold uppercase tracking-wider text-primary">
                      {booking.time_slot === 'morning' ? 'Manha' : 'Tarde'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-sm font-semibold text-foreground">
                      {booking.customer_name}
                    </span>
                  </div>
                  {booking.customer_phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        {booking.customer_phone}
                      </span>
                    </div>
                  )}
                  {booking.notes && (
                    <div className="flex items-center gap-2">
                      <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        {booking.notes}
                      </span>
                    </div>
                  )}
                </div>
                {booking.user_id === currentUserId && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(booking.id)}
                    disabled={deletingId === booking.id}
                    className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Remover agendamento</span>
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-3 text-right text-xs text-muted-foreground">
        {dateBookings.length}/2 agendamentos
      </div>
    </div>
  )
}
