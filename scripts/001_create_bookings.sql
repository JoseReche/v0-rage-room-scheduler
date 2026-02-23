-- Create bookings table for rage room sessions
-- Max 2 bookings per day enforced by application logic + unique constraint

CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  booking_date DATE NOT NULL,
  time_slot TEXT NOT NULL CHECK (time_slot IN ('morning', 'afternoon')),
  customer_name TEXT NOT NULL,
  customer_phone TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(booking_date, time_slot)
);

ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- All authenticated users can view all bookings (to see availability)
CREATE POLICY "bookings_select_all" ON public.bookings
  FOR SELECT TO authenticated
  USING (true);

-- Users can insert their own bookings
CREATE POLICY "bookings_insert_own" ON public.bookings
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own bookings
CREATE POLICY "bookings_update_own" ON public.bookings
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id);

-- Users can delete their own bookings
CREATE POLICY "bookings_delete_own" ON public.bookings
  FOR DELETE TO authenticated
  USING (auth.uid() = user_id);
