import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Nao autorizado' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const month = searchParams.get('month')
  const year = searchParams.get('year')
  const allParam = searchParams.get('all')

  let query = supabase
    .from('bookings')
    .select('*')
    .order('booking_date', { ascending: true })

  // If all=true and user is admin, return all bookings
  if (allParam === 'true') {
    const { ADMIN_EMAIL } = await import('@/lib/constants')
    if (user.email !== ADMIN_EMAIL) {
      return NextResponse.json({ error: 'Acesso negado' }, { status: 403 })
    }
    // Return all bookings for admin
  } else if (month && year) {
    const startDate = `${year}-${month.padStart(2, '0')}-01`
    const endDate = new Date(Number(year), Number(month), 0).toISOString().split('T')[0]
    query = query.gte('booking_date', startDate).lte('booking_date', endDate)
  }

  const { data, error } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Nao autorizado' }, { status: 401 })
  }

  const body = await request.json()
  const { booking_date, time_slot, customer_name, customer_phone, notes, payment_type } = body

  if (!booking_date || !time_slot || !customer_name) {
    return NextResponse.json(
      { error: 'Campos obrigatorios: data, horario e nome do cliente' },
      { status: 400 }
    )
  }

  const validPaymentTypes = ['free', 'paid']
  const finalPaymentType = validPaymentTypes.includes(payment_type) ? payment_type : 'free'
  // Free bookings are auto-approved; paid bookings need admin approval
  const status = finalPaymentType === 'free' ? 'approved' : 'pending'

  // Check how many bookings exist for this date
  const { data: existingBookings, error: checkError } = await supabase
    .from('bookings')
    .select('id, time_slot')
    .eq('booking_date', booking_date)

  if (checkError) {
    return NextResponse.json({ error: checkError.message }, { status: 500 })
  }

  if (existingBookings && existingBookings.length >= 2) {
    return NextResponse.json(
      { error: 'Este dia ja tem o maximo de 2 agendamentos' },
      { status: 409 }
    )
  }

  const slotTaken = existingBookings?.some(b => b.time_slot === time_slot)
  if (slotTaken) {
    return NextResponse.json(
      { error: `O horario "${time_slot === 'morning' ? 'Manha' : 'Tarde'}" ja esta reservado neste dia` },
      { status: 409 }
    )
  }

  const { data, error } = await supabase
    .from('bookings')
    .insert({
      user_id: user.id,
      booking_date,
      time_slot,
      customer_name,
      customer_phone: customer_phone || null,
      notes: notes || null,
      payment_type: finalPaymentType,
      status,
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data, { status: 201 })
}
