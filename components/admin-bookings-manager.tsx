'use client'

import { useMemo, useState, useEffect } from 'react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import {
  CheckCircle2,
  XCircle,
  Clock,
  User,
  Phone,
  FileText,
  DollarSign,
  Gift,
  Loader2,
  CalendarDays,
} from 'lucide-react'
import { STATUS_LABELS, PAYMENT_TYPE_LABELS, TIME_SLOT_LABELS, type TimeSlot } from '@/lib/constants'

type Booking = {
  id: string
  user_id: string
  booking_date: string
  time_slot: TimeSlot
  customer_name: string
  customer_phone: string | null
  notes: string | null
  status: 'pending' | 'approved' | 'rejected'
  payment_type: 'free' | 'paid'
  created_at: string
}

type AdminBookingsManagerProps = {
  isAdmin: boolean
}

export function AdminBookingsManager({ isAdmin }: AdminBookingsManagerProps) {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  useEffect(() => {
    const fetchBookings = async () => {
      setIsLoading(true)
      try {
        const res = await fetch('/api/bookings?all=true')
        if (!res.ok) throw new Error('Erro ao carregar agendamentos')
        const data = await res.json()
        setBookings(data || [])
      } catch (err) {
        toast.error(err instanceof Error ? err.message : 'Erro ao carregar')
      } finally {
        setIsLoading(false)
      }
    }

    if (isAdmin) {
      fetchBookings()
    }
  }, [isAdmin])

  const groupedByDate = useMemo(() => {
    const grouped = bookings.reduce<Record<string, Booking[]>>((acc, booking) => {
      if (!acc[booking.booking_date]) {
        acc[booking.booking_date] = []
      }
      acc[booking.booking_date].push(booking)
      return acc
    }, {})

    return Object.entries(grouped)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, dateBookings]) => ({
        date,
        dateBookings: dateBookings.sort((a, b) => a.time_slot.localeCompare(b.time_slot)),
      }))
  }, [bookings])

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

      setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status } : b)))
      toast.success(status === 'approved' ? 'Agendamento aprovado!' : 'Agendamento rejeitado.')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro ao atualizar')
    } finally {
      setUpdatingId(null)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (groupedByDate.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-secondary/20 p-8 text-center text-sm text-muted-foreground">
        Nenhum agendamento cadastrado.
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {groupedByDate.map(({ date, dateBookings }) => {
        const pendingCount = dateBookings.filter((booking) => booking.status === 'pending').length

        return (
          <section key={date} className="rounded-xl border border-border bg-secondary/20 p-5">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2 border-b border-border pb-3">
              <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-foreground">
                <CalendarDays className="h-4 w-4 text-primary" />
                {format(new Date(`${date}T12:00:00`), "EEEE, d 'de' MMMM", { locale: ptBR })}
              </h3>
              {pendingCount > 0 && (
                <Badge className="bg-amber-500/20 text-amber-200 hover:bg-amber-500/20">
                  {pendingCount} pendente(s)
                </Badge>
              )}
            </div>

            <div className="space-y-3">
              {dateBookings.map((booking) => (
                <article
                  key={booking.id}
                  className={`rounded-lg border p-4 ${
                    booking.status === 'pending'
                      ? 'border-amber-400/70 bg-amber-500/10'
                      : 'border-border bg-background/50'
                  }`}
                >
                  <div className="mb-3 flex flex-wrap items-center gap-2">
                    <Badge variant={booking.payment_type === 'paid' ? 'default' : 'secondary'} className="text-xs">
                      {booking.payment_type === 'paid' ? (
                        <>
                          <DollarSign className="mr-1 h-3 w-3" />
                          {PAYMENT_TYPE_LABELS.paid}
                        </>
                      ) : (
                        <>
                          <Gift className="mr-1 h-3 w-3" />
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
                      {booking.status === 'approved' && <CheckCircle2 className="mr-1 h-3 w-3" />}
                      {booking.status === 'pending' && <Clock className="mr-1 h-3 w-3" />}
                      {booking.status === 'rejected' && <XCircle className="mr-1 h-3 w-3" />}
                      {STATUS_LABELS[booking.status]}
                    </Badge>

                    <span className="text-xs font-semibold uppercase tracking-widest text-primary">
                      {TIME_SLOT_LABELS[booking.time_slot]}
                    </span>
                  </div>

                  <div className="grid gap-2 text-sm text-muted-foreground md:grid-cols-2">
                    <p className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <span className="font-semibold text-foreground">{booking.customer_name}</span>
                    </p>
                    <p className="text-xs">Solicitacao: {format(new Date(booking.created_at), 'dd/MM/yyyy HH:mm')}</p>
                    <p className="text-xs">Usuario ID: {booking.user_id}</p>
                    {booking.customer_phone ? (
                      <p className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        {booking.customer_phone}
                      </p>
                    ) : (
                      <p className="text-xs">Telefone: nao informado</p>
                    )}
                    {booking.notes && (
                      <p className="flex items-center gap-2 md:col-span-2">
                        <FileText className="h-4 w-4" />
                        {booking.notes}
                      </p>
                    )}
                  </div>

                  {isAdmin && booking.status === 'pending' && (
                    <div className="mt-4 flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleUpdateStatus(booking.id, 'approved')}
                        disabled={updatingId === booking.id}
                      >
                        <CheckCircle2 className="mr-1 h-4 w-4" /> Aprovar
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleUpdateStatus(booking.id, 'rejected')}
                        disabled={updatingId === booking.id}
                      >
                        <XCircle className="mr-1 h-4 w-4" /> Rejeitar
                      </Button>
                    </div>
                  )}
                </article>
              ))}
            </div>
          </section>
        )
      })}
    </div>
  )
}
