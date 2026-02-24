import { listBookings, createBooking } from '@/lib/server/services/bookings-service'
import { getAuthenticatedContext } from '@/lib/server/auth'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { supabase, user, isAdmin } = await getAuthenticatedContext()

  if (!user) {
    return NextResponse.json({ error: 'Nao autorizado' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const month = searchParams.get('month')
  const year = searchParams.get('year')
  const allParam = searchParams.get('all')

  if (allParam === 'true') {
    if (!isAdmin) {
      return NextResponse.json({ error: 'Acesso negado' }, { status: 403 })
    }
  }

  const { data, error } = await listBookings(supabase, {
    all: allParam === 'true',
    month,
    year,
  })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

export async function POST(request: NextRequest) {
  const { supabase, user } = await getAuthenticatedContext()

  if (!user) {
    return NextResponse.json({ error: 'Nao autorizado' }, { status: 401 })
  }

  const body = await request.json()
  const { booking_date, time_slot, customer_name, customer_phone, notes } = body

  if (!booking_date || !time_slot || !customer_name) {
    return NextResponse.json(
      { error: 'Campos obrigatorios: data, horario e nome do cliente' },
      { status: 400 }
    )
  }

  const result = await createBooking(supabase, user, {
    booking_date,
    time_slot,
    customer_name,
    customer_phone,
    notes,
  })

  if ('error' in result) {
    return NextResponse.json({ error: result.error }, { status: result.status })
  }

  return NextResponse.json(result.data, { status: 201 })
}
