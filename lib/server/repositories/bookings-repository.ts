import type { TimeSlot } from '@/lib/constants'
import type { SupabaseClient } from '@supabase/supabase-js'

export type BookingStatus = 'pending' | 'approved' | 'rejected'

export function buildBookingsQuery(supabase: SupabaseClient) {
  return supabase.from('bookings').select('*').order('booking_date', { ascending: true })
}

export async function findBookingsByDate(supabase: SupabaseClient, bookingDate: string) {
  return supabase
    .from('bookings')
    .select('id, time_slot')
    .eq('booking_date', bookingDate)
}

export async function createBookingRecord(
  supabase: SupabaseClient,
  booking: {
    user_id: string
    booking_date: string
    time_slot: TimeSlot
    customer_name: string
    customer_phone: string | null
    notes: string | null
    payment_type: 'paid'
    status: 'pending'
  }
) {
  return supabase.from('bookings').insert(booking).select().single()
}

export async function updateBookingStatusRecord(
  supabase: SupabaseClient,
  id: string,
  status: BookingStatus
) {
  return supabase.from('bookings').update({ status }).eq('id', id).select().single()
}

export async function deleteBookingRecord(supabase: SupabaseClient, id: string, userId?: string) {
  let query = supabase.from('bookings').delete().eq('id', id)

  if (userId) {
    query = query.eq('user_id', userId)
  }

  return query
}
