'use client'

import { useState, useCallback } from 'react'
import { format } from 'date-fns'
import useSWR from 'swr'
import { BookingCalendar } from '@/components/booking-calendar'
import { BookingForm } from '@/components/booking-form'
import { BookingList } from '@/components/booking-list'
import { Hammer, LogOut, CalendarDays, ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ADMIN_EMAIL } from '@/lib/constants'

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

type BookingDashboardProps = {
  userId: string
  userEmail: string
}

export function BookingDashboard({ userId, userEmail }: BookingDashboardProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const router = useRouter()

  const month = format(currentMonth, 'M')
  const year = format(currentMonth, 'yyyy')

  const { data: bookings = [], mutate } = useSWR<Booking[]>(
    `/api/bookings?month=${month}&year=${year}`,
    fetcher,
    { refreshInterval: 10000 }
  )

  const handleBookingChange = useCallback(() => {
    mutate()
  }, [mutate])

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/auth/login')
  }

  const selectedDateBookings = selectedDate
    ? bookings.filter(
        (b) => b.booking_date === format(selectedDate, 'yyyy-MM-dd')
      )
    : []

  return (
    <div className="min-h-svh bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 md:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-primary bg-primary/10">
              <Hammer className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-lg font-black uppercase tracking-tighter text-foreground md:text-xl">
                Rage Room
              </h1>
              <p className="hidden text-xs uppercase tracking-widest text-muted-foreground md:block">
                Painel de Agendamentos
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-muted-foreground md:inline">
              {userEmail}
            </span>
            {userEmail === ADMIN_EMAIL && (
              <Link href="/admin">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-muted-foreground hover:text-foreground"
                >
                  <ShieldCheck className="mr-2 h-4 w-4" />
                  Painel Admin
                </Button>
              </Link>
            )}
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
      <main className="mx-auto max-w-6xl px-4 py-6 md:px-6 md:py-8">
        <div className="grid gap-6 lg:grid-cols-5">
          {/* Calendar */}
          <div className="lg:col-span-3">
            <div className="rounded-lg border border-border bg-card p-4 md:p-6">
              <BookingCalendar
                bookings={bookings}
                selectedDate={selectedDate}
                onSelectDate={setSelectedDate}
                currentMonth={currentMonth}
                onMonthChange={setCurrentMonth}
              />
            </div>
          </div>

          {/* Sidebar */}
          <div className="flex flex-col gap-6 lg:col-span-2">
            {selectedDate ? (
              <>
                {/* Booking Form */}
                <div className="rounded-lg border border-border bg-card p-4 md:p-6">
                  <BookingForm
                    selectedDate={selectedDate}
                    existingBookings={selectedDateBookings}
                    onBookingCreated={handleBookingChange}
                  />
                </div>

                {/* Booking List for selected day */}
                <div className="rounded-lg border border-border bg-card p-4 md:p-6">
                  <BookingList
                    bookings={bookings}
                    selectedDate={selectedDate}
                    currentUserId={userId}
                    currentUserEmail={userEmail}
                    onBookingDeleted={handleBookingChange}
                  />
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-lg border border-border bg-card p-8 text-center">
                <CalendarDays className="mb-3 h-10 w-10 text-muted-foreground/50" />
                <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  Selecione um dia
                </p>
                <p className="mt-1 text-xs text-muted-foreground/70">
                  Clique em uma data no calendario para agendar ou ver sessoes
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
