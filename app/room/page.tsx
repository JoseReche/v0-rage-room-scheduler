import { RoomDisplay } from '@/components/room-display'
import { BookingDashboard } from '@/components/booking-dashboard'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export const metadata = {
  title: 'Sala da Raiva Joinville | Agendamentos',
  description: 'Conheça a Sala da Raiva Joinville e faça seu agendamento.',
}

export default async function RoomPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Header Navigation */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-sm">
        <div className="mx-auto max-w-4xl px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/protected">
            <Button variant="ghost" size="sm" className="gap-2">
              <ChevronLeft className="h-4 w-4" />
              Voltar
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Room Information */}
        <section className="mb-12">
          <RoomDisplay />
        </section>

        {/* Booking Section */}
        <section>
          <BookingDashboard userEmail={user.email || ''} />
        </section>
      </div>
    </main>
  )
}
