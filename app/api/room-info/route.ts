import { createClient } from '@/lib/supabase/server'
import { ADMIN_EMAIL } from '@/lib/constants'
import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('room_info')
    .select('*')
    .single()

  if (error) {
    // Return default room info if table is empty
    return NextResponse.json({
      id: null,
      title: 'Sala da Raiva Joinville',
      about_text:
        'Uma Sala da Raiva (Rage Room) e um ambiente seguro para descarregar o estresse quebrando objetos com equipamentos de protecao e acompanhamento.',
      description:
        'Bem-vindo à Sala da Raiva! Venha liberar sua raiva num ambiente seguro e controlado.',
      price_per_item: 25.0,
      price_per_day: 150.0,
      price_per_session: 150.0,
      image_url: null,
      updated_at: new Date().toISOString(),
    })
  }

  return NextResponse.json({
    ...data,
    about_text:
      data.about_text ||
      'Uma Sala da Raiva (Rage Room) e um ambiente seguro para descarregar o estresse quebrando objetos com equipamentos de protecao e acompanhamento.',
    price_per_item: data.price_per_item ?? 25.0,
    price_per_day: data.price_per_day ?? data.price_per_session ?? 150.0,
    price_per_session: data.price_per_day ?? data.price_per_session ?? 150.0,
  })
}

export async function PATCH(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Nao autorizado' }, { status: 401 })
  }

  if (user.email !== ADMIN_EMAIL) {
    return NextResponse.json(
      { error: 'Apenas o administrador pode editar informacoes da sala' },
      { status: 403 }
    )
  }

  const body = await request.json()
  const { title, about_text, description, price_per_item, price_per_day, image_url } = body

  // Get or create room info
  const { data: existing } = await supabase
    .from('room_info')
    .select('id')
    .single()

  let result

  if (existing?.id) {
    // Update existing
    result = await supabase
      .from('room_info')
      .update({
        title: title || undefined,
        about_text: about_text || undefined,
        description: description || undefined,
        price_per_item: price_per_item || undefined,
        price_per_day: price_per_day || undefined,
        price_per_session: price_per_day || undefined,
        image_url: image_url || undefined,
        updated_at: new Date().toISOString(),
        updated_by: user.id,
      })
      .eq('id', existing.id)
      .select()
      .single()
  } else {
    // Create new
    result = await supabase
      .from('room_info')
      .insert({
        title: title || 'Sala da Raiva Joinville',
        about_text:
          about_text ||
          'Uma Sala da Raiva (Rage Room) e um ambiente seguro para descarregar o estresse quebrando objetos com equipamentos de protecao e acompanhamento.',
        description:
          description ||
          'Bem-vindo à Sala da Raiva! Venha liberar sua raiva num ambiente seguro e controlado.',
        price_per_item: price_per_item || 25.0,
        price_per_day: price_per_day || 150.0,
        price_per_session: price_per_day || 150.0,
        image_url: image_url || null,
        updated_by: user.id,
      })
      .select()
      .single()
  }

  if (result.error) {
    return NextResponse.json({ error: result.error.message }, { status: 500 })
  }

  return NextResponse.json(result.data)
}
