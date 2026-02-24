import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ADMIN_EMAIL } from '@/lib/constants'
import { RoomInfoEditor } from '@/components/room-info-editor'
import { AdminBookingsManager } from '@/components/admin-bookings-manager'
import { Button } from '@/components/ui/button'
import { LogOut } from 'lucide-react'

export default async function AdminPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user || user.email !== ADMIN_EMAIL) {
    redirect('/protected')
  }

  const isAdmin = user.email === ADMIN_EMAIL

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-sm">
        <div className="mx-auto max-w-4xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold uppercase tracking-widest text-primary">
                Painel de Administracao
              </h1>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
            <form
              action={async () => {
                'use server'
                const sb = await createClient()
                await sb.auth.signOut()
                redirect('/auth/login')
              }}
            >
              <Button
                type="submit"
                variant="ghost"
                size="sm"
                className="gap-2 text-muted-foreground hover:text-foreground"
              >
                <LogOut className="h-4 w-4" />
                Sair
              </Button>
            </form>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="mx-auto max-w-4xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
        {/* Room Information Section */}
        <section>
          <h2 className="mb-4 text-lg font-semibold uppercase tracking-wider text-foreground">
            Informacoes da Sala
          </h2>
          <RoomInfoEditor isAdmin={isAdmin} />
        </section>

        {/* Bookings Management Section */}
        <section>
          <h2 className="mb-4 text-lg font-semibold uppercase tracking-wider text-foreground">
            Gestao de Agendamentos
          </h2>
          <AdminBookingsManager isAdmin={isAdmin} />
        </section>
      </div>
    </main>
  )
}
