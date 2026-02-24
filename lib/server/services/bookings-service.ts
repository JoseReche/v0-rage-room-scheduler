import { buildBookingsQuery, createBookingRecord, findBookingsByDate } from '@/lib/server/repositories/bookings-repository'
import type { SupabaseClient, User } from '@supabase/supabase-js'

export async function listBookings(
  supabase: SupabaseClient,
  filters: {
    all: boolean
    month?: string | null
    year?: string | null
  }
) {
  let query = buildBookingsQuery(supabase)

  if (!filters.all && filters.month && filters.year) {
    const startDate = `${filters.year}-${filters.month.padStart(2, '0')}-01`
    const endDate = new Date(Number(filters.year), Number(filters.month), 0)
      .toISOString()
      .split('T')[0]

    query = query.gte('booking_date', startDate).lte('booking_date', endDate)
  }

  return query
}

export async function createBooking(
  supabase: SupabaseClient,
  user: User,
  booking: {
    booking_date: string
    time_slot: 'morning' | 'afternoon'
    customer_name: string
    customer_phone?: string
    notes?: string
  }
) {
  const { data: existingBookings, error: checkError } = await findBookingsByDate(
    supabase,
    booking.booking_date
  )

  if (checkError) {
    return { error: checkError.message, status: 500 as const }
  }

  if (existingBookings && existingBookings.length >= 2) {
    return { error: 'Este dia ja tem o maximo de 2 agendamentos', status: 409 as const }
  }

  const slotTaken = existingBookings?.some((b) => b.time_slot === booking.time_slot)
  if (slotTaken) {
    return {
      error: `O horario "${booking.time_slot === 'morning' ? 'Manha' : 'Tarde'}" ja esta reservado neste dia`,
      status: 409 as const,
    }
  }

  const { data, error } = await createBookingRecord(supabase, {
    user_id: user.id,
    booking_date: booking.booking_date,
    time_slot: booking.time_slot,
    customer_name: booking.customer_name,
    customer_phone: booking.customer_phone || null,
    notes: booking.notes || null,
    payment_type: 'paid',
    status: 'pending',
  })

  if (error) {
    return { error: error.message, status: 500 as const }
  }

  return { data }
}
