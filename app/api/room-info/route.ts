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
      description:
        'Bem-vindo à Sala da Raiva! Venha liberar sua raiva num ambiente seguro e controlado.',
      price_per_session: 150.0,
      image_url: null,
      updated_at: new Date().toISOString(),
    })
  }

  return NextResponse.json(data)
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
  const { title, description, price_per_session, image_url } = body

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
        description: description || undefined,
        price_per_session: price_per_session || undefined,
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
        description:
          description ||
          'Bem-vindo à Sala da Raiva! Venha liberar sua raiva num ambiente seguro e controlado.',
        price_per_session: price_per_session || 150.0,
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
