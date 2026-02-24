'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { CheckCircle2, XCircle, Trash2, Clock, User, Phone, FileText, DollarSign, Gift, Loader2 } from 'lucide-react'
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

type AdminBookingsManagerProps = {
  isAdmin: boolean
}

export function AdminBookingsManager({ isAdmin }: AdminBookingsManagerProps) {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  // Fetch all bookings
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
    if (isAdmin) fetchBookings()
  }, [isAdmin])

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
      setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status } : b))
      )
      toast.success(status === 'approved' ? 'Agendamento aprovado!' : 'Agendamento rejeitado.')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro ao atualizar')
    } finally {
      setUpdatingId(null)
    }
  }

  const handleDelete = async (id: string) => {
    setDeletingId(id)
    try {
      const res = await fetch(`/api/bookings/${id}`, { method: 'DELETE' })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Erro ao excluir')
      }
      setBookings((prev) => prev.filter((b) => b.id !== id))
      toast.success('Agendamento removido.')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro ao excluir')
    } finally {
      setDeletingId(null)
    }
  }

  const pendingPaidBookings = bookings.filter(
    (b) => b.status === 'pending' && b.payment_type === 'paid'
  )
  const approvedBookings = bookings.filter((b) => b.status === 'approved')
  const rejectedBookings = bookings.filter((b) => b.status === 'rejected')

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Pending Approvals Section */}
      <div className="rounded-lg border border-border bg-secondary/30 p-6">
        <h2 className="mb-4 text-xl font-bold uppercase tracking-widest text-foreground">
          Aguardando Aprovacao ({pendingPaidBookings.length})
        </h2>
        {pendingPaidBookings.length === 0 ? (
          <p className="text-sm text-muted-foreground">Nenhum agendamento pendente.</p>
        ) : (
          <div className="space-y-3">
            {pendingPaidBookings.map((booking) => (
              <BookingCard
                key={booking.id}
                booking={booking}
                isAdmin={isAdmin}
                updatingId={updatingId}
                deletingId={deletingId}
                onUpdateStatus={handleUpdateStatus}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>

      {/* Approved Bookings Section */}
      <div className="rounded-lg border border-border bg-secondary/30 p-6">
        <h2 className="mb-4 text-xl font-bold uppercase tracking-widest text-foreground">
          Agendamentos Aprovados ({approvedBookings.length})
        </h2>
        {approvedBookings.length === 0 ? (
          <p className="text-sm text-muted-foreground">Nenhum agendamento aprovado.</p>
        ) : (
          <div className="space-y-3">
            {approvedBookings.map((booking) => (
              <BookingCard
                key={booking.id}
                booking={booking}
                isAdmin={isAdmin}
                updatingId={updatingId}
                deletingId={deletingId}
                onUpdateStatus={handleUpdateStatus}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>

      {/* Rejected Bookings Section */}
      {rejectedBookings.length > 0 && (
        <div className="rounded-lg border border-border bg-secondary/30 p-6">
          <h2 className="mb-4 text-xl font-bold uppercase tracking-widest text-foreground">
            Agendamentos Rejeitados ({rejectedBookings.length})
          </h2>
          <div className="space-y-3">
            {rejectedBookings.map((booking) => (
              <BookingCard
                key={booking.id}
                booking={booking}
                isAdmin={isAdmin}
                updatingId={updatingId}
                deletingId={deletingId}
                onUpdateStatus={handleUpdateStatus}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function BookingCard({
  booking,
  isAdmin,
  updatingId,
  deletingId,
  onUpdateStatus,
  onDelete,
}: {
  booking: Booking
  isAdmin: boolean
  updatingId: string | null
  deletingId: string | null
  onUpdateStatus: (id: string, status: 'approved' | 'rejected') => Promise<void>
  onDelete: (id: string) => Promise<void>
}) {
  return (
    <div className="flex flex-col gap-3 rounded-md border border-border bg-background/50 p-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex-1 space-y-1">
        <div className="flex flex-wrap items-center gap-2">
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

        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <User className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="font-semibold text-foreground">{booking.customer_name}</span>
            <span className="text-xs text-muted-foreground">
              {booking.time_slot === 'morning' ? 'Manha' : 'Tarde'} • {booking.booking_date}
            </span>
          </div>
          {booking.customer_phone && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Phone className="h-3.5 w-3.5" />
              {booking.customer_phone}
            </div>
          )}
          {booking.notes && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <FileText className="h-3.5 w-3.5" />
              {booking.notes}
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {isAdmin && booking.status === 'pending' && booking.payment_type === 'paid' && (
          <>
            <Button
              size="sm"
              variant="default"
              onClick={() => onUpdateStatus(booking.id, 'approved')}
              disabled={updatingId === booking.id}
              className="h-8 text-xs gap-1"
            >
              <CheckCircle2 className="h-3.5 w-3.5" />
              Aprovar
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => onUpdateStatus(booking.id, 'rejected')}
              disabled={updatingId === booking.id}
              className="h-8 text-xs gap-1"
            >
              <XCircle className="h-3.5 w-3.5" />
              Rejeitar
            </Button>
          </>
        )}
        {isAdmin && (
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onDelete(booking.id)}
            disabled={deletingId === booking.id}
            className="h-8 text-xs text-muted-foreground hover:text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        )}
      </div>
    </div>
  )
}
