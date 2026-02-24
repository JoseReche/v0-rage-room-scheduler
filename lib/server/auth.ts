import { ADMIN_EMAIL } from '@/lib/constants'
import { createClient } from '@/lib/supabase/server'

export async function getAuthenticatedContext() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return { supabase, user, isAdmin: user?.email === ADMIN_EMAIL }
}
