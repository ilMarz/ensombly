'use client'

import { useState } from 'react'

export function InviteAdminForm() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'ok' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')
    setErrorMsg('')
    const res = await fetch('/api/admin/invite', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })
    if (res.ok) {
      setStatus('ok')
      setEmail('')
    } else {
      const data = await res.json().catch(() => ({}))
      setErrorMsg(data.error ?? 'Errore durante l\'invio')
      setStatus('error')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 items-end flex-wrap">
      <div className="flex-1 min-w-[220px]">
        <label className="block text-xs text-muted-foreground mb-1.5">Email</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => { setEmail(e.target.value); setStatus('idle') }}
          placeholder="collega@email.com"
          className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </div>
      <button
        type="submit"
        disabled={status === 'loading'}
        className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-colors"
      >
        {status === 'loading' ? 'Invio...' : 'Invia invito'}
      </button>
      {status === 'ok' && <p className="text-sm text-emerald-400 w-full">Invito inviato ✓</p>}
      {status === 'error' && <p className="text-sm text-red-400 w-full">{errorMsg}</p>}
    </form>
  )
}

export function NotificationEmailForm({ currentEmail }: { currentEmail: string | null }) {
  const [email, setEmail] = useState(currentEmail ?? '')
  const [status, setStatus] = useState<'idle' | 'loading' | 'ok' | 'error'>('idle')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')
    const res = await fetch('/api/admin/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ notification_email: email }),
    })
    setStatus(res.ok ? 'ok' : 'error')
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 items-end flex-wrap">
      <div className="flex-1 min-w-[220px]">
        <label className="block text-xs text-muted-foreground mb-1.5">
          Email di notifica
          <span className="ml-1 text-muted-foreground/60">(nuovi utenti + acquisti)</span>
        </label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => { setEmail(e.target.value); setStatus('idle') }}
          placeholder="admin@email.com"
          className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </div>
      <button
        type="submit"
        disabled={status === 'loading'}
        className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-colors"
      >
        {status === 'loading' ? 'Salvataggio...' : 'Salva'}
      </button>
      {status === 'ok' && <p className="text-sm text-emerald-400 w-full">Salvato ✓</p>}
      {status === 'error' && <p className="text-sm text-red-400 w-full">Errore durante il salvataggio</p>}
    </form>
  )
}
