'use client'

import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Flame, Hammer } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) throw error
      router.push('/protected')
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'Ocorreu um erro')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-md">
        <div className="mb-10 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border-2 border-primary bg-primary/10">
            <Hammer className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-4xl font-black uppercase tracking-tighter text-foreground">
            Rage Room
          </h1>
          <p className="mt-2 text-sm uppercase tracking-widest text-muted-foreground">
            Quebre tudo. Libere sua raiva.
          </p>
        </div>

        <div className="rounded-lg border border-border bg-card p-6">
          <div className="mb-6 flex items-center gap-2">
            <Flame className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-bold uppercase tracking-tight text-card-foreground">
              Entrar
            </h2>
          </div>

          <form onSubmit={handleLogin}>
            <div className="flex flex-col gap-5">
              <div className="grid gap-2">
                <Label htmlFor="email" className="text-sm uppercase tracking-wider text-muted-foreground">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border-border bg-secondary text-foreground placeholder:text-muted-foreground focus:border-primary"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password" className="text-sm uppercase tracking-wider text-muted-foreground">
                  Senha
                </Label>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="border-border bg-secondary text-foreground placeholder:text-muted-foreground focus:border-primary"
                />
              </div>
              {error && (
                <div className="rounded-md border border-destructive/50 bg-destructive/10 px-3 py-2">
                  <p className="text-sm text-destructive">{error}</p>
                </div>
              )}
              <Button
                type="submit"
                className="w-full bg-primary font-bold uppercase tracking-wider text-primary-foreground hover:bg-primary/90"
                disabled={isLoading}
              >
                {isLoading ? 'Entrando...' : 'Entrar'}
              </Button>
            </div>
            <div className="mt-5 text-center text-sm text-muted-foreground">
              {'Nao tem conta? '}
              <Link
                href="/auth/sign-up"
                className="font-semibold text-primary underline underline-offset-4 hover:text-primary/80"
              >
                Criar conta
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
