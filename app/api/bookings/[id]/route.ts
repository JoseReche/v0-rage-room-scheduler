import { getAuthenticatedContext } from '@/lib/server/auth'
import { deleteBookingRecord, updateBookingStatusRecord } from '@/lib/server/repositories/bookings-repository'
import { NextRequest, NextResponse } from 'next/server'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { supabase, user, isAdmin } = await getAuthenticatedContext()

  if (!user) {
    return NextResponse.json({ error: 'Nao autorizado' }, { status: 401 })
  }

  if (!isAdmin) {
    return NextResponse.json({ error: 'Apenas o administrador pode aprovar/rejeitar agendamentos' }, { status: 403 })
  }

  const { id } = await params
  const body = await request.json()
  const { status } = body

  if (!['approved', 'rejected'].includes(status)) {
    return NextResponse.json({ error: 'Status invalido' }, { status: 400 })
  }

  const { data, error } = await updateBookingStatusRecord(supabase, id, status)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { supabase, user, isAdmin } = await getAuthenticatedContext()

  if (!user) {
    return NextResponse.json({ error: 'Nao autorizado' }, { status: 401 })
  }

  const { id } = await params

  const { error } = await deleteBookingRecord(supabase, id, isAdmin ? undefined : user.id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
