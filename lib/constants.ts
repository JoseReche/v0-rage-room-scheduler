export const ADMIN_EMAIL = 'jose.carlosreche@gmail.com'

// WhatsApp number in international format (no spaces, no dashes, no +)
export const WHATSAPP_NUMBER = '5547991621578'

export const TIME_SLOT_LABELS: Record<string, string> = {
  morning: 'Manha (09:00 - 12:00)',
  afternoon: 'Tarde (14:00 - 18:00)',
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
  time_slot: string
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
