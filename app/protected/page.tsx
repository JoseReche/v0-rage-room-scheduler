import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { BookingDashboard } from '@/components/booking-dashboard'

export default async function ProtectedPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  return (
    <BookingDashboard
      userEmail={user.email || ''}
    />
  )
}
