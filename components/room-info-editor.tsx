'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { Edit2, Save, X, Loader2 } from 'lucide-react'

type RoomInfo = {
  id: string | null
  title: string
  description: string
  price_per_session: number
  image_url: string | null
  updated_at: string
}

type RoomInfoEditorProps = {
  isAdmin: boolean
  onRoomUpdated?: () => void
}

export function RoomInfoEditor({ isAdmin, onRoomUpdated }: RoomInfoEditorProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(true)
  const [roomInfo, setRoomInfo] = useState<RoomInfo>({
    id: null,
    title: 'Sala da Quebra Joinville',
    description: 'Bem-vindo à Sala da Quebra!',
    price_per_session: 150.0,
    image_url: null,
    updated_at: new Date().toISOString(),
  })

  const [formData, setFormData] = useState<RoomInfo>(roomInfo)

  // Fetch room info on mount
  useEffect(() => {
    const fetchRoomInfo = async () => {
      setIsFetching(true)
      try {
        const res = await fetch('/api/room-info')
        if (!res.ok) throw new Error('Erro ao carregar informacoes')
        const data = await res.json()
        setRoomInfo(data)
        setFormData(data)
      } catch (err) {
        toast.error(err instanceof Error ? err.message : 'Erro ao carregar')
      } finally {
        setIsFetching(false)
      }
    }
    fetchRoomInfo()
  }, [])

  const handleSave = async () => {
    if (!isAdmin) {
      toast.error('Voce nao tem permissao para editar')
      return
    }

    setIsLoading(true)
    try {
      const res = await fetch('/api/room-info', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          price_per_session: parseFloat(String(formData.price_per_session)),
          image_url: formData.image_url,
        }),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Erro ao salvar')
      }

      const updated = await res.json()
      setRoomInfo(updated)
      setFormData(updated)
      setIsEditing(false)
      toast.success('Informacoes da sala atualizadas!')
      onRoomUpdated?.()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro ao salvar')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    setFormData(roomInfo)
    setIsEditing(false)
  }

  if (isFetching) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="rounded-lg border border-border bg-secondary/30 p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold uppercase tracking-widest text-foreground">
          {roomInfo.title}
        </h1>
        {isAdmin && (
          <Button
            variant={isEditing ? 'ghost' : 'outline'}
            size="sm"
            onClick={() => setIsEditing(!isEditing)}
            className="gap-2"
          >
            <Edit2 className="h-4 w-4" />
            {isEditing ? 'Cancelar' : 'Editar'}
          </Button>
        )}
      </div>

      {isEditing ? (
        <div className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="title" className="text-xs uppercase tracking-wider text-muted-foreground">
              Titulo da Sala
            </Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="bg-background"
              placeholder="Nome da sala"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description" className="text-xs uppercase tracking-wider text-muted-foreground">
              Descricao
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="min-h-24 bg-background"
              placeholder="Descricao da sala..."
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="price" className="text-xs uppercase tracking-wider text-muted-foreground">
              Preco por Sessao (R$)
            </Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              value={formData.price_per_session}
              onChange={(e) => setFormData({ ...formData, price_per_session: parseFloat(e.target.value) })}
              className="bg-background"
              placeholder="150.00"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="image" className="text-xs uppercase tracking-wider text-muted-foreground">
              URL da Imagem
            </Label>
            <Input
              id="image"
              value={formData.image_url || ''}
              onChange={(e) => setFormData({ ...formData, image_url: e.target.value || null })}
              className="bg-background"
              placeholder="https://..."
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              onClick={handleSave}
              disabled={isLoading}
              className="flex-1 gap-2 bg-primary font-bold uppercase text-primary-foreground"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Salvar Alteracoes
                </>
              )}
            </Button>
            <Button
              onClick={handleCancel}
              disabled={isLoading}
              variant="ghost"
              className="gap-2"
            >
              <X className="h-4 w-4" />
              Cancelar
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-sm leading-relaxed text-foreground">
            {roomInfo.description}
          </p>
          <div className="rounded-md border border-border bg-primary/10 p-4">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Preco</p>
            <p className="text-3xl font-bold text-primary">
              R$ {roomInfo.price_per_session.toFixed(2)}
            </p>
            <p className="text-xs text-muted-foreground">por sessao</p>
          </div>
        </div>
      )}
    </div>
  )
}
