import { Hammer, Mail } from 'lucide-react'
import Link from 'next/link'

export default function SignUpSuccessPage() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-md">
        <div className="mb-10 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border-2 border-primary bg-primary/10">
            <Hammer className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-4xl font-black uppercase tracking-tighter text-foreground">
            Sala da Raiva Joinville
          </h1>
        </div>

        <div className="rounded-lg border border-border bg-card p-6 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Mail className="h-6 w-6 text-primary" />
          </div>
          <h2 className="text-xl font-bold uppercase tracking-tight text-card-foreground">
            Conta criada!
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Verifique seu email para confirmar sua conta.
            Depois disso, voce pode fazer login e agendar sua sessao de destruicao.
          </p>
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
