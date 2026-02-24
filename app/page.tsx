'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import {
  Shield,
  HardHat,
  Cctv,
  FileCheck2,
  ArrowRight,
  Building2,
  Hammer,
  CalendarDays,
} from 'lucide-react'
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
    'Nao e sobre quebrar objetos. E sobre liberar o que voce carrega.',
  description:
    'Explosao controlada de emocoes, com seguranca, estrutura profissional e atmosfera industrial.',
  price_per_item: 25,
  price_per_day: 150,
}

const individualReasons = [
  'Termino',
  'Demissao',
  'Divorcio',
  'Aniversario',
  'Frustracao acumulada',
]

const corporateReasons = [
  'Team building',
  'Integracao de equipe',
  'Reducao de estresse',
  'Experiencia fora do padrao',
]

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
          price_per_item:
            data.price_per_item ?? fallbackInfo.price_per_item,
          price_per_day:
            data.price_per_day ??
            data.price_per_session ??
            fallbackInfo.price_per_day,
        })
      } catch {
        // keep fallback content
      }
    }

    fetchData()
  }, [])

  return (
    <main className="industrial-bg min-h-screen text-[#f2eee7]">
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-[#2a2a2a]">
        <div className="industrial-glow pointer-events-none absolute inset-0" />

        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-20 sm:px-6 md:grid-cols-2 lg:px-8 lg:py-28">
          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.25em] text-[#9f9a92]">
              Joinville · SC
            </p>

            <h1 className="industrial-title text-5xl leading-[0.9] sm:text-7xl">
              Sala da
              <br />
              Raiva
            </h1>

            <p className="mt-6 max-w-xl text-sm uppercase tracking-[0.2em] text-[#ff5e00]">
              Explosao controlada de emocoes.
            </p>

            <p className="mt-4 max-w-xl text-sm text-[#b8b2a8]">
              {room.description}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/auth/login">
                <Button className="industrial-btn bg-[#ff5e00] text-black hover:bg-[#d54f00]">
                  Agendar Experiencia
                </Button>
              </Link>

              <Link href="/auth/sign-up">
                <Button variant="outline">
                  Criar Conta
                </Button>
              </Link>

              <Link href="/room">
                <Button variant="ghost" className="text-[#b8b2a8]">
                  <CalendarDays className="mr-2 h-4 w-4" />
                  Ver Sala
                </Button>
              </Link>

              <a href="#corporativo">
                <Button
                  variant="outline"
                  className="industrial-btn border-[#4a4239] bg-transparent text-[#f2eee7] hover:bg-[#1a1a1a]"
                >
                  Para Empresas
                </Button>
              </a>
            </div>
          </div>

          {/* TABELA */}
          <div className="industrial-panel min-h-[360px] rounded-md border border-[#3a332c] p-6">
            <div className="mb-4 flex items-center gap-2">
              <Hammer className="h-5 w-5 text-[#ff5e00]" />
              <p className="text-xs uppercase tracking-[0.2em] text-[#9f9a92]">
                Tabela Base
              </p>
            </div>

            <div className="space-y-5">
              <div className="flex items-end justify-between border-b border-[#2e2e2e] pb-4">
                <span className="text-xs uppercase tracking-[0.2em] text-[#9f9a92]">
                  Valor por item
                </span>
                <strong className="text-3xl font-black text-[#ff5e00]">
                  R$ {room.price_per_item.toFixed(2)}
                </strong>
              </div>

              <div className="flex items-end justify-between border-b border-[#2e2e2e] pb-4">
                <span className="text-xs uppercase tracking-[0.2em] text-[#9f9a92]">
                  Valor por dia
                </span>
                <strong className="text-3xl font-black text-[#ff5e00]">
                  R$ {room.price_per_day.toFixed(2)}
                </strong>
              </div>

              <p className="text-xs uppercase tracking-[0.14em] text-[#857f76]">
                Valores editaveis pelo administrador no painel.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}