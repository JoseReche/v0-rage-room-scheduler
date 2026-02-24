import Link from 'next/link'
import {
  ArrowRight,
  Building2,
  Check,
  Cctv,
  FileCheck2,
  Flame,
  HardHat,
  Shield,
} from 'lucide-react'

import { Button } from '@/components/ui/button'

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

const safetyItems = [
  { icon: HardHat, label: 'EPIs inclusos' },
  { icon: Cctv, label: 'Ambiente monitorado' },
  { icon: Shield, label: 'Estrutura reforcada' },
  { icon: FileCheck2, label: 'Termo de responsabilidade' },
]

const flowSteps = [
  'Escolha sua experiencia',
  'Vista os EPIs',
  'Entre na sala',
  'Libere',
  'Saia leve',
]

export default function Home() {
  return (
    <main className="industrial-bg text-[#f0ece5]">
      <section className="hero-impact relative overflow-hidden border-b border-[#2a2a2a]">
        <div className="crack-overlay pointer-events-none absolute inset-0" />

        <div className="mx-auto grid min-h-[88vh] max-w-6xl items-end gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-24">
          <div className="space-y-6">
            <p className="text-xs font-bold uppercase tracking-[0.35em] text-[#9f998d]">
              Joinville · SC
            </p>

            <h1 className="industrial-title text-6xl leading-[0.85] sm:text-7xl lg:text-8xl">
              Sala da Raiva
            </h1>

            <p className="text-xl font-semibold uppercase tracking-[0.12em] text-[#d45a1a]">
              Explosao controlada de emocoes.
            </p>

            <div className="flex flex-wrap gap-3">
              <Link href="/auth/login">
                <Button className="industrial-btn bg-[#d45a1a] text-black hover:bg-[#b94910]">
                  Agendar Experiencia
                </Button>
              </Link>

              <a href="#corporativo">
                <Button
                  variant="outline"
                  className="industrial-btn border-[#5a4b3f] bg-[#1a1a1ab3] text-[#f0ece5] hover:bg-[#202020]"
                >
                  Para Empresas
                </Button>
              </a>
            </div>
          </div>

          <div className="industrial-panel relative h-full min-h-[360px] border border-[#3b3229] p-6">
            <div className="metal-divider mb-6" />
            <p className="max-w-sm text-sm uppercase tracking-[0.14em] text-[#c9c2b7]">
              Ambiente de galpao industrial com luz dramatica, atmosfera densa e energia direcionada.
            </p>
            <p className="mt-8 text-xs uppercase tracking-[0.16em] text-[#867f73]">
              Marca adulta · experiencia imersiva · controle total
            </p>
          </div>
        </div>
      </section>

      <section className="concrete-strip border-b border-[#2a2a2a]">
        <div className="mx-auto max-w-5xl px-4 py-20 text-center sm:px-6 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#9f998d]">Sobre a experiencia</p>
          <h2 className="industrial-title mx-auto mt-5 max-w-4xl text-3xl leading-tight sm:text-5xl">
            Nao e sobre quebrar objetos. <br />E sobre liberar o que voce carrega.
          </h2>
          <div className="metal-divider mx-auto mt-8 w-full max-w-xl" />
        </div>
      </section>

      <section className="border-b border-[#2a2a2a] bg-[#131313]">
        <div className="mx-auto grid max-w-6xl gap-6 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:px-8">
          <article className="industrial-panel border border-[#3a3128] p-7">
            <p className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-[#d45a1a]">
              <Flame className="h-4 w-4" /> Experiencia Individual
            </p>
            <ul className="space-y-2 text-sm uppercase tracking-[0.12em] text-[#cbc3b7]">
              {individualReasons.map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <Check className="h-3.5 w-3.5 text-[#d45a1a]" /> {item}
                </li>
              ))}
            </ul>
            <p className="mt-6 text-lg font-semibold uppercase tracking-[0.08em] text-[#f0ece5]">
              Nao guarda. Nao engole. Libera.
            </p>
            <Link href="/auth/sign-up" className="mt-7 inline-block">
              <Button className="industrial-btn bg-[#d45a1a] text-black hover:bg-[#b94910]">Quero descarregar</Button>
            </Link>
          </article>

          <article id="corporativo" className="industrial-panel border border-[#3a3128] p-7">
            <p className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-[#d45a1a]">
              <Building2 className="h-4 w-4" /> Experiencia Corporativa
            </p>
            <ul className="space-y-2 text-sm uppercase tracking-[0.12em] text-[#cbc3b7]">
              {corporateReasons.map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <Check className="h-3.5 w-3.5 text-[#d45a1a]" /> {item}
                </li>
              ))}
            </ul>
            <p className="mt-6 text-lg font-semibold uppercase tracking-[0.08em] text-[#f0ece5]">
              Alta performance comeca com equilibrio emocional.
            </p>
            <Link href="/auth/login" className="mt-7 inline-block">
              <Button
                variant="outline"
                className="industrial-btn border-[#5a4b3f] bg-transparent text-[#f0ece5] hover:bg-[#1f1f1f]"
              >
                Solicitar proposta
              </Button>
            </Link>
          </article>
        </div>
      </section>

      <section className="border-b border-[#2a2a2a] bg-[#171717]">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
          <p className="text-center text-xs font-bold uppercase tracking-[0.25em] text-[#9f998d]">Seguranca</p>
          <h2 className="industrial-title mt-4 text-center text-3xl sm:text-4xl">Seguro. Controlado. Profissional.</h2>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {safetyItems.map((item) => {
              const Icon = item.icon
              return (
                <div key={item.label} className="border border-[#3a3a3a] bg-[#111111] p-5 text-center">
                  <Icon className="mx-auto h-6 w-6 text-[#d45a1a]" />
                  <p className="mt-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#d5cec2]">{item.label}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <section className="concrete-strip border-b border-[#2a2a2a]">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#9f998d]">Como funciona</p>
          <div className="mt-8 grid gap-4 md:grid-cols-5">
            {flowSteps.map((step, index) => (
              <div key={step} className="border border-[#3a3a3a] bg-[#121212] p-5">
                <p className="text-4xl font-black text-[#d45a1a]">{index + 1}</p>
                <p className="mt-3 text-xs font-semibold uppercase tracking-[0.16em] text-[#d7d0c4]">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#090909]">
        <div className="mx-auto max-w-4xl px-4 py-24 text-center sm:px-6 lg:px-8">
          <h2 className="industrial-title text-4xl leading-tight sm:text-6xl">Voce nao precisa aguentar tudo.</h2>
          <Link href="/auth/login" className="mt-10 inline-block">
            <Button className="industrial-btn h-12 bg-[#d45a1a] px-10 text-base text-black hover:bg-[#b94910]">
              Agendar agora
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>
    </main>
  )
}
