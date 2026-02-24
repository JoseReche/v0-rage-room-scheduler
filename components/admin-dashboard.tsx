'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import useSWR from 'swr'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import {
  Hammer,
  LogOut,
  CheckCircle2,
  XCircle,
  DollarSign,
  Gift,
  Trash2,
  Search,
  ShieldCheck,
} from 'lucide-react'
import { toast } from 'sonner'
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

const fetcher = (url: string) => fetch(url).then((res) => res.json())

type AdminDashboardProps = {
  userEmail: string
  userId: string
}

export function AdminDashboard({ userEmail, userId }: AdminDashboardProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const router = useRouter()

  const { data: allBookings = [], mutate } = useSWR<Booking[]>(
    '/api/bookings?all=true',
    fetcher,
    { refreshInterval: 10000 }
  )

  // Filter bookings based on search term
  const filteredBookings = allBookings.filter((booking) => {
    const searchLower = searchTerm.toLowerCase()
    return (
      booking.customer_name.toLowerCase().includes(searchLower) ||
      booking.customer_phone?.includes(searchTerm) ||
      booking.booking_date.includes(searchTerm) ||
      booking.id.includes(searchTerm)
    )
  })

  // Separate bookings by status
  const pendingBookings = filteredBookings.filter(
    (b) => b.status === 'pending' && b.payment_type === 'paid'
  )
  const approvedBookings = filteredBookings.filter((b) => b.status === 'approved')
  const rejectedBookings = filteredBookings.filter((b) => b.status === 'rejected')

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
      mutate()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro ao atualizar')
    } finally {
      setUpdatingId(null)
    }
  }

  const handleDelete = async (id: string) => {
    setDeletingId(id)
    try {
      const res = await fetch(`/api/bookings/${id}`, {
        method: 'DELETE',
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Erro ao deletar')
      }
      toast.success('Agendamento removido.')
      mutate()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro ao deletar')
    } finally {
      setDeletingId(null)
    }
  }

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/auth/login')
  }

  const statsTotal = allBookings.length
  const statsPending = allBookings.filter((b) => b.status === 'pending').length
  const statsApproved = allBookings.filter((b) => b.status === 'approved').length
  const statsRejected = allBookings.filter((b) => b.status === 'rejected').length

  return (
    <div className="min-h-svh bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-primary bg-primary/10">
              <ShieldCheck className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-lg font-black uppercase tracking-tighter text-foreground md:text-xl">
                Painel Admin
              </h1>
              <p className="hidden text-xs uppercase tracking-widest text-muted-foreground md:block">
                Gerenciamento de Agendamentos
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-muted-foreground md:inline">{userEmail}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-muted-foreground hover:text-foreground hover:bg-secondary"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-6 md:px-6 md:py-8">
        {/* Stats */}
        <div className="mb-6 grid gap-4 md:grid-cols-4">
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Total de Agendamentos
            </p>
            <p className="mt-2 text-3xl font-bold text-foreground">{statsTotal}</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Pendentes de Aprovacao
            </p>
            <p className="mt-2 text-3xl font-bold text-yellow-600">{statsPending}</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Aprovados
            </p>
            <p className="mt-2 text-3xl font-bold text-green-600">{statsApproved}</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Rejeitados
            </p>
            <p className="mt-2 text-3xl font-bold text-red-600">{statsRejected}</p>
          </div>
        </div>

        {/* Search */}
        <div className="mb-6 flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Pesquisar por nome, telefone, data ou ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Pending Bookings Section */}
        {pendingBookings.length > 0 && (
          <div className="mb-8">
            <h2 className="mb-4 text-sm font-bold uppercase tracking-wider text-muted-foreground">
              Pendentes de Aprovacao ({pendingBookings.length})
            </h2>
            <div className="space-y-3">
              {pendingBookings.map((booking) => (
                <BookingCard
                  key={booking.id}
                  booking={booking}
                  onApprove={() => handleUpdateStatus(booking.id, 'approved')}
                  onReject={() => handleUpdateStatus(booking.id, 'rejected')}
                  onDelete={() => handleDelete(booking.id)}
                  isUpdating={updatingId === booking.id}
                  isDeleting={deletingId === booking.id}
                  showActions
                />
              ))}
            </div>
          </div>
        )}

        {/* Approved Bookings Section */}
        {approvedBookings.length > 0 && (
          <div className="mb-8">
            <h2 className="mb-4 text-sm font-bold uppercase tracking-wider text-muted-foreground">
              Aprovados ({approvedBookings.length})
            </h2>
            <div className="space-y-3">
              {approvedBookings.map((booking) => (
                <BookingCard
                  key={booking.id}
                  booking={booking}
                  onDelete={() => handleDelete(booking.id)}
                  isDeleting={deletingId === booking.id}
                  showActions={false}
                />
              ))}
            </div>
          </div>
        )}

        {/* Rejected Bookings Section */}
        {rejectedBookings.length > 0 && (
          <div className="mb-8">
            <h2 className="mb-4 text-sm font-bold uppercase tracking-wider text-muted-foreground">
              Rejeitados ({rejectedBookings.length})
            </h2>
            <div className="space-y-3">
              {rejectedBookings.map((booking) => (
                <BookingCard
                  key={booking.id}
                  booking={booking}
                  onDelete={() => handleDelete(booking.id)}
                  isDeleting={deletingId === booking.id}
                  showActions={false}
                />
              ))}
            </div>
          </div>
        )}

        {filteredBookings.length === 0 && (
          <div className="rounded-lg border border-border bg-card p-8 text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Nenhum agendamento encontrado
            </p>
          </div>
        )}
      </main>
    </div>
  )
}

type BookingCardProps = {
  booking: Booking
  onApprove?: () => void
  onReject?: () => void
  onDelete: () => void
  isUpdating?: boolean
  isDeleting?: boolean
  showActions?: boolean
}

function BookingCard({
  booking,
  onApprove,
  onReject,
  onDelete,
  isUpdating = false,
  isDeleting = false,
  showActions = false,
}: BookingCardProps) {
  return (
    <div className="flex items-center gap-4 rounded-lg border border-border bg-card p-4">
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <Badge variant="outline" className="text-xs shrink-0">
            {format(new Date(booking.booking_date), "d 'de' MMMM 'de' yyyy", { locale: ptBR })}
          </Badge>
          <Badge variant="outline" className="text-xs shrink-0">
            {booking.time_slot === 'morning' ? 'Manha' : 'Tarde'}
          </Badge>
          <Badge
            variant={booking.payment_type === 'paid' ? 'default' : 'secondary'}
            className="text-xs shrink-0"
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
            className="text-xs shrink-0"
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

        <div className="space-y-1">
          <p className="font-semibold text-foreground">{booking.customer_name}</p>
          {booking.customer_phone && (
            <p className="text-sm text-muted-foreground">{booking.customer_phone}</p>
          )}
          {booking.notes && (
            <p className="text-sm text-muted-foreground">{booking.notes}</p>
          )}
          <p className="text-xs text-muted-foreground/70">ID: {booking.id}</p>
        </div>
      </div>

      <div className="flex flex-col gap-2 shrink-0">
        {showActions && onApprove && onReject && (
          <>
            <Button
              size="sm"
              variant="default"
              onClick={onApprove}
              disabled={isUpdating}
              className="h-8 text-xs"
            >
              <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
              Aprovar
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={onReject}
              disabled={isUpdating}
              className="h-8 text-xs"
            >
              <XCircle className="h-3.5 w-3.5 mr-1" />
              Rejeitar
            </Button>
          </>
        )}
        <Button
          size="sm"
          variant="ghost"
          onClick={onDelete}
          disabled={isDeleting}
          className="h-8 text-xs text-muted-foreground hover:text-destructive hover:bg-destructive/10"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  )
}

import { Clock } from 'lucide-react'
