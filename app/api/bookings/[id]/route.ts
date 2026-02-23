import { createClient } from '@/lib/supabase/server'
import { ADMIN_EMAIL } from '@/lib/constants'
import { NextRequest, NextResponse } from 'next/server'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Nao autorizado' }, { status: 401 })
  }

  if (user.email !== ADMIN_EMAIL) {
    return NextResponse.json({ error: 'Apenas o administrador pode aprovar/rejeitar agendamentos' }, { status: 403 })
  }

  const { id } = await params
  const body = await request.json()
  const { status } = body

  if (!['approved', 'rejected'].includes(status)) {
    return NextResponse.json({ error: 'Status invalido' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('bookings')
    .update({ status })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Nao autorizado' }, { status: 401 })
  }

  const { id } = await params

  // Admin can delete any booking; regular users can only delete their own
  let query = supabase
    .from('bookings')
    .delete()
    .eq('id', id)

  if (user.email !== ADMIN_EMAIL) {
    query = query.eq('user_id', user.id)
  }

  const { error } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
