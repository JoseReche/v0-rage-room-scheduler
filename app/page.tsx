'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Hammer, CalendarDays, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

type LandingInfo = {
  title: string
  about_text: string
  description: string
  price_per_item: number
  price_per_day: number
}

const fallbackInfo: LandingInfo = {
  title: 'Sala da Raiva Joinville',
  about_text:
    'Uma Sala da Raiva (Rage Room) e um ambiente controlado onde voce descarrega o estresse quebrando objetos com seguranca, equipamentos de protecao e orientacao.',
  description:
    'Experiencia intensa, divertida e segura para aliviar tensoes do dia a dia.',
  price_per_item: 25,
  price_per_day: 150,
}

export default function Home() {
  const [room, setRoom] = useState<LandingInfo>(fallbackInfo)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/room-info')
        if (!res.ok) return
        const data = await res.json()
        setRoom({
          title: data.title || fallbackInfo.title,
          about_text: data.about_text || fallbackInfo.about_text,
          description: data.description || fallbackInfo.description,
          price_per_item: data.price_per_item ?? fallbackInfo.price_per_item,
          price_per_day: data.price_per_day ?? data.price_per_session ?? fallbackInfo.price_per_day,
        })
      } catch {
        // keep fallback content
      }
    }

    fetchData()
  }, [])

  return (
    <main className="min-h-screen bg-background">
      <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-primary bg-primary/10">
            <Hammer className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-3xl font-black uppercase tracking-tighter text-foreground md:text-5xl">
            {room.title}
          </h1>
        </div>

        <div className="rounded-xl border border-border bg-card p-6 md:p-8">
          <h2 className="text-xl font-bold uppercase tracking-wider text-primary">O que e uma Sala da Raiva?</h2>
          <p className="mt-3 text-base leading-relaxed text-foreground">{room.about_text}</p>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{room.description}</p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg border border-border bg-primary/10 p-5">
              <p className="text-xs uppercase tracking-widest text-muted-foreground">Valor por item</p>
              <p className="mt-2 text-3xl font-black text-primary">R$ {room.price_per_item.toFixed(2)}</p>
            </div>
            <div className="rounded-lg border border-border bg-primary/10 p-5">
              <p className="text-xs uppercase tracking-widest text-muted-foreground">Valor por dia</p>
              <p className="mt-2 text-3xl font-black text-primary">R$ {room.price_per_day.toFixed(2)}</p>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/auth/login">
              <Button className="gap-2 font-bold uppercase">
                Entrar para Agendar
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/auth/sign-up">
              <Button variant="outline" className="gap-2 font-bold uppercase">
                Criar Conta
              </Button>
            </Link>
            <Link href="/room">
              <Button variant="ghost" className="gap-2 font-bold uppercase text-muted-foreground">
                <CalendarDays className="h-4 w-4" />
                Ver Sala
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
