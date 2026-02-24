export const ADMIN_EMAIL = 'jose.carlosreche@gmail.com'

// WhatsApp number in international format (no spaces, no dashes, no +)
export const WHATSAPP_NUMBER = '5547991621578'

export const AVAILABLE_TIME_SLOTS = ['16:00', '17:00', '18:00', '19:00', '20:00', '21:00'] as const
export type TimeSlot = (typeof AVAILABLE_TIME_SLOTS)[number]

export const TIME_SLOT_LABELS: Record<TimeSlot, string> = {
  '16:00': '16:00',
  '17:00': '17:00',
  '18:00': '18:00',
  '19:00': '19:00',
  '20:00': '20:00',
  '21:00': '21:00',
}

export const STATUS_LABELS: Record<string, string> = {
  pending: 'Pendente',
  approved: 'Aprovado',
  rejected: 'Rejeitado',
}

export const PAYMENT_TYPE_LABELS: Record<string, string> = {
  free: 'Gratuito',
  paid: 'Pago',
}

export function buildWhatsAppUrl(booking: {
  customer_name: string
  booking_date: string
  time_slot: TimeSlot
  payment_type: string
  notes?: string | null
}) {
  const date = new Date(booking.booking_date + 'T12:00:00')
  const formattedDate = date.toLocaleDateString('pt-BR')
  const slotLabel = TIME_SLOT_LABELS[booking.time_slot] || booking.time_slot
  const paymentLabel = PAYMENT_TYPE_LABELS[booking.payment_type] || booking.payment_type

  let message = `*Nova Solicitacao de Agendamento - Sala da Raiva Joinville*\n\n`
  message += `*Cliente:* ${booking.customer_name}\n`
  message += `*Data:* ${formattedDate}\n`
  message += `*Horario:* ${slotLabel}\n`
  message += `*Tipo:* ${paymentLabel}\n`
  if (booking.notes) {
    message += `*Observacoes:* ${booking.notes}\n`
  }
  if (booking.payment_type === 'paid') {
    message += `\n_Este agendamento requer aprovacao do administrador._`
  }

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
}
