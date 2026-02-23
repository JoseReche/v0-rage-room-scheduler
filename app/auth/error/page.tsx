import { Hammer, AlertTriangle } from 'lucide-react'
import Link from 'next/link'

export default async function AuthErrorPage({
  searchParams,
}: {
  searchParams: Promise<{ error: string }>
}) {
  const params = await searchParams

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
        </div>

        <div className="rounded-lg border border-destructive/50 bg-card p-6 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
            <AlertTriangle className="h-6 w-6 text-destructive" />
          </div>
          <h2 className="text-xl font-bold uppercase tracking-tight text-card-foreground">
            Algo deu errado
          </h2>
          {params?.error ? (
            <p className="mt-3 text-sm text-muted-foreground">
              Erro: {params.error}
            </p>
          ) : (
            <p className="mt-3 text-sm text-muted-foreground">
              Ocorreu um erro inesperado.
            </p>
          )}
          <Link
            href="/auth/login"
            className="mt-6 inline-block text-sm font-semibold text-primary underline underline-offset-4 hover:text-primary/80"
          >
            Voltar ao login
          </Link>
        </div>
      </div>
    </div>
  )
}
