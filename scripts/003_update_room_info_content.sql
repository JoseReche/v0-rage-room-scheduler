-- Add editable landing page fields for Sala da Raiva Joinville
ALTER TABLE public.room_info
  ADD COLUMN IF NOT EXISTS about_text TEXT,
  ADD COLUMN IF NOT EXISTS price_per_item NUMERIC(10,2) DEFAULT 25.00,
  ADD COLUMN IF NOT EXISTS price_per_day NUMERIC(10,2) DEFAULT 150.00;

-- Keep legacy field synchronized with daily price for compatibility
UPDATE public.room_info
SET
  about_text = COALESCE(about_text, 'Uma Sala da Raiva (Rage Room) e um ambiente seguro para descarregar o estresse quebrando objetos com equipamentos de protecao e acompanhamento.'),
  price_per_item = COALESCE(price_per_item, 25.00),
  price_per_day = COALESCE(price_per_day, COALESCE(price_per_session, 150.00)),
  price_per_session = COALESCE(price_per_day, COALESCE(price_per_session, 150.00));
