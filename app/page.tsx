'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Shield, HardHat, Cctv, FileCheck2, ArrowRight, Building2 } from 'lucide-react'
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
  about_text: 'Nao e sobre quebrar objetos. E sobre liberar o que voce carrega.',
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
          price_per_item: data.price_per_item ?? fallbackInfo.price_per_item,
          price_per_day: data.price_per_day ?? data.price_per_session ?? fallbackInfo.price_per_day,
        })
      } catch {
        // fallback content
      }
    }

    fetchData()
  }, [])

  return (
    <main className="industrial-bg min-h-screen text-[#f2eee7]">
      <section className="relative overflow-hidden border-b border-[#2a2a2a]">
        <div className="industrial-glow pointer-events-none absolute inset-0" />
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-20 sm:px-6 md:grid-cols-2 lg:px-8 lg:py-28">
          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.25em] text-[#9f9a92]">Joinville - SC</p>
            <h1 className="industrial-title text-5xl leading-[0.9] sm:text-7xl">
              Sala da
              <br />
              Raiva
            </h1>
            <p className="mt-6 max-w-xl text-sm uppercase tracking-[0.2em] text-[#ff5e00]">Explosao controlada de emocoes.</p>
            <p className="mt-4 max-w-xl text-sm text-[#b8b2a8]">{room.description}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/auth/login">
                <Button className="industrial-btn bg-[#ff5e00] text-black hover:bg-[#d54f00]">Agendar Experiencia</Button>
              </Link>
              <a href="#corporativo">
                <Button variant="outline" className="industrial-btn border-[#4a4239] bg-transparent text-[#f2eee7] hover:bg-[#1a1a1a]">Para Empresas</Button>
              </a>
            </div>
          </div>

          <div className="industrial-panel min-h-[360px] rounded-md border border-[#3a332c] p-6">
            <p className="text-xs uppercase tracking-[0.2em] text-[#9f9a92]">Tabela Base</p>
            <div className="mt-6 space-y-5">
              <div className="flex items-end justify-between border-b border-[#2e2e2e] pb-4">
                <span className="text-xs uppercase tracking-[0.2em] text-[#9f9a92]">Valor por item</span>
                <strong className="text-3xl font-black text-[#ff5e00]">R$ {room.price_per_item.toFixed(2)}</strong>
              </div>
              <div className="flex items-end justify-between border-b border-[#2e2e2e] pb-4">
                <span className="text-xs uppercase tracking-[0.2em] text-[#9f9a92]">Valor por dia</span>
                <strong className="text-3xl font-black text-[#ff5e00]">R$ {room.price_per_day.toFixed(2)}</strong>
              </div>
              <p className="text-xs uppercase tracking-[0.14em] text-[#857f76]">Valores editaveis pelo administrador no painel.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="concrete-strip border-y border-[#2b2b2b] px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <p className="text-center text-2xl font-black uppercase tracking-tight sm:text-4xl">
            Nao e sobre quebrar objetos.
            <br />
            E sobre liberar o que voce carrega.
          </p>
          <p className="mx-auto mt-5 max-w-3xl text-center text-sm text-[#bdb7ad]">{room.about_text}</p>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-6 px-4 py-16 sm:px-6 md:grid-cols-2 lg:px-8">
        <article className="industrial-panel rounded-md border border-[#3a332c] p-6">
          <h3 className="text-xl font-black uppercase tracking-tight text-[#ff5e00]">Experiencia Individual</h3>
          <ul className="mt-4 space-y-2 text-sm uppercase tracking-wide text-[#d8d2c8]">
            {individualReasons.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
          <p className="mt-6 text-sm uppercase tracking-[0.12em] text-[#f2eee7]">Nao guarda. Nao engole. Libera.</p>
          <Link href="/auth/login" className="mt-6 inline-block">
            <Button className="industrial-btn bg-[#ff5e00] text-black hover:bg-[#d54f00]">Quero descarregar</Button>
          </Link>
        </article>

        <article id="corporativo" className="industrial-panel rounded-md border border-[#3a332c] p-6">
          <h3 className="text-xl font-black uppercase tracking-tight text-[#ff5e00]">Experiencia Corporativa</h3>
          <ul className="mt-4 space-y-2 text-sm uppercase tracking-wide text-[#d8d2c8]">
            {corporateReasons.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
          <p className="mt-6 text-sm uppercase tracking-[0.12em] text-[#f2eee7]">Alta performance comeca com equilibrio emocional.</p>
          <Link href="/auth/login" className="mt-6 inline-block">
            <Button variant="outline" className="industrial-btn border-[#4a4239] bg-transparent text-[#f2eee7] hover:bg-[#1a1a1a]">
              <Building2 className="mr-2 h-4 w-4" />
              Solicitar proposta
            </Button>
          </Link>
        </article>
      </section>

      <section className="border-y border-[#2a2a2a] bg-[#131313] px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <h3 className="text-center text-3xl font-black uppercase tracking-tight">Seguro. Controlado. Profissional.</h3>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: HardHat, label: 'Epis inclusos' },
              { icon: Cctv, label: 'Ambiente monitorado' },
              { icon: Shield, label: 'Estrutura reforcada' },
              { icon: FileCheck2, label: 'Termo de responsabilidade' },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="rounded-md border border-[#333] bg-[#181818] p-4 text-center">
                <Icon className="mx-auto h-6 w-6 text-[#ff5e00]" />
                <p className="mt-3 text-xs font-bold uppercase tracking-[0.16em] text-[#d1cbc0]">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <h3 className="text-center text-3xl font-black uppercase tracking-tight">Como funciona</h3>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {['Escolha sua experiencia', 'Vista os epis', 'Entre na sala', 'Libere', 'Saia leve'].map((step, i) => (
            <div key={step} className="rounded-md border border-[#312b24] bg-[#171717] p-4">
              <p className="text-4xl font-black text-[#ff5e00]">{i + 1}</p>
              <p className="mt-2 text-xs font-bold uppercase tracking-[0.14em] text-[#d8d2c8]">{step}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-[#2a2a2a] bg-[#0f0f0f] px-4 py-20 text-center sm:px-6 lg:px-8">
        <p className="industrial-title text-4xl sm:text-6xl">Voce nao precisa aguentar tudo.</p>
        <Link href="/auth/login" className="mt-8 inline-block">
          <Button className="industrial-btn bg-[#ff5e00] text-black hover:bg-[#d54f00]">
            Agendar agora
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </section>
    </main>
  )
}
