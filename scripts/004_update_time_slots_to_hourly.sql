-- Update booking time slots to hourly schedule starting at 16:00
ALTER TABLE public.bookings DROP CONSTRAINT IF EXISTS bookings_time_slot_check;

ALTER TABLE public.bookings
  ADD CONSTRAINT bookings_time_slot_check
  CHECK (time_slot IN ('16:00', '17:00', '18:00', '19:00', '20:00', '21:00'));
