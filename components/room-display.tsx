'use client'

import { useState, useEffect } from 'react'
import { Loader2, Calendar } from 'lucide-react'

type RoomInfo = {
  id: string | null
  title: string
  description: string
  price_per_session: number
  image_url: string | null
  updated_at: string
}

export function RoomDisplay() {
  const [roomInfo, setRoomInfo] = useState<RoomInfo | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchRoomInfo = async () => {
      setIsLoading(true)
      try {
        const res = await fetch('/api/room-info')
        if (!res.ok) throw new Error('Erro ao carregar')
        const data = await res.json()
        setRoomInfo(data)
      } catch (err) {
        console.error('Erro ao carregar informacoes da sala:', err)
        setRoomInfo({
          id: null,
          title: 'Sala da Raiva Joinville',
          description: 'Bem-vindo à Sala da Raiva!',
          price_per_session: 150.0,
          image_url: null,
          updated_at: new Date().toISOString(),
        })
      } finally {
        setIsLoading(false)
      }
    }
    fetchRoomInfo()
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!roomInfo) {
    return null
  }

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="rounded-lg border border-border overflow-hidden bg-secondary/30">
        {roomInfo.image_url && (
          <div className="relative h-64 sm:h-80 w-full overflow-hidden bg-gradient-to-br from-primary/20 to-primary/5">
            <img
              src={roomInfo.image_url}
              alt={roomInfo.title}
              className="h-full w-full object-cover"
            />
          </div>
        )}
        <div className="p-6 sm:p-8">
          <h1 className="mb-3 text-3xl sm:text-4xl font-bold uppercase tracking-widest text-foreground">
            {roomInfo.title}
          </h1>
          <p className="mb-6 text-base leading-relaxed text-foreground sm:text-lg">
            {roomInfo.description}
          </p>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-md border border-border bg-primary/10 p-4">
              <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">
                Preco por Sessao
              </p>
              <p className="text-3xl font-bold text-primary">
                R$ {roomInfo.price_per_session.toFixed(2)}
              </p>
            </div>

            <div className="rounded-md border border-border bg-primary/10 p-4 flex items-center gap-3">
              <Calendar className="h-8 w-8 text-primary" />
              <div>
                <p className="text-xs uppercase tracking-wider text-muted-foreground">
                  Agende Agora
                </p>
                <p className="text-lg font-bold text-primary">Disponivel 24/7</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
