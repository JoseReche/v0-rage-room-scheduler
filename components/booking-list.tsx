'use client'

import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { User, Phone, Clock, FileText, CheckCircle2, XCircle, DollarSign, Gift } from 'lucide-react'
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
  currentUserEmail: string
  onBookingsUpdated: () => void
}

export function BookingList({
  bookings,
  selectedDate,
  currentUserEmail,
  onBookingsUpdated,
}: BookingListProps) {
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const isAdmin = currentUserEmail === ADMIN_EMAIL

  const dateBookings = bookings.filter(
    (b) => b.booking_date === format(selectedDate, 'yyyy-MM-dd')
  )

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
      onBookingsUpdated()
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
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <div className="flex items-center gap-2">
                      <Clock className="h-3.5 w-3.5 text-primary" />
                      <span className="text-xs font-bold uppercase tracking-wider text-primary">
                        {booking.time_slot === 'morning' ? 'Manha' : 'Tarde'}
                      </span>
                    </div>
                    <Badge
                      variant={booking.payment_type === 'paid' ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      {booking.payment_type === 'paid' ? (
                        <>
                          <DollarSign className="h-3 w-3 mr-1" />
                          {PAYMENT_TYPE_LABELS.paid}
                        </>
                      ) : (
                        <>
                          <Gift className="h-3 w-3 mr-1" />
                          {PAYMENT_TYPE_LABELS.free}
                        </>
                      )}
                    </Badge>
                    <Badge
                      variant={
                        booking.status === 'approved'
                          ? 'default'
                          : booking.status === 'rejected'
                            ? 'destructive'
                            : 'secondary'
                      }
                      className="text-xs"
                    >
                      {booking.status === 'approved' && (
                        <>
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          {STATUS_LABELS.approved}
                        </>
                      )}
                      {booking.status === 'pending' && (
                        <>
                          <Clock className="h-3 w-3 mr-1" />
                          {STATUS_LABELS.pending}
                        </>
                      )}
                      {booking.status === 'rejected' && (
                        <>
                          <XCircle className="h-3 w-3 mr-1" />
                          {STATUS_LABELS.rejected}
                        </>
                      )}
                    </Badge>
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

                <div className="flex flex-col gap-2">
                  {isAdmin && booking.status === 'pending' && booking.payment_type === 'paid' && (
                    <>
                      <Button
                        size="sm"
                        variant="default"
                        onClick={() => handleUpdateStatus(booking.id, 'approved')}
                        disabled={updatingId === booking.id}
                        className="h-8 text-xs"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                        Aprovar
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleUpdateStatus(booking.id, 'rejected')}
                        disabled={updatingId === booking.id}
                        className="h-8 text-xs"
                      >
                        <XCircle className="h-3.5 w-3.5 mr-1" />
                        Rejeitar
                      </Button>
                    </>
                  )}
                </div>
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
