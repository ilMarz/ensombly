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

function Toggle({ enabled, onChange, loading }: { enabled: boolean; onChange: (v: boolean) => void; loading: boolean }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={enabled}
      onClick={() => onChange(!enabled)}
      disabled={loading}
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none disabled:opacity-50 ${enabled ? 'bg-primary' : 'bg-muted'}`}
    >
      <span className={`inline-block h-5 w-5 rounded-full bg-white shadow transform transition-transform duration-200 ${enabled ? 'translate-x-5' : 'translate-x-0'}`} />
    </button>
  )
}

export function PlatformFlagsForm({ betaMode, disableSub }: { betaMode: boolean; disableSub: boolean }) {
  const [beta, setBeta] = useState(betaMode)
  const [subDisabled, setSubDisabled] = useState(disableSub)
  const [loadingBeta, setLoadingBeta] = useState(false)
  const [loadingSub, setLoadingSub] = useState(false)

  async function saveFlag(key: 'beta_mode' | 'disable_sub', value: boolean) {
    const setLoading = key === 'beta_mode' ? setLoadingBeta : setLoadingSub
    const setValue = key === 'beta_mode' ? setBeta : setSubDisabled
    setLoading(true)
    const res = await fetch('/api/admin/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ [key]: value }),
    })
    if (res.ok) setValue(value)
    setLoading(false)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between py-3 border-b border-border/50">
        <div>
          <p className="text-sm font-medium">Modalità Beta</p>
          <p className="text-xs text-muted-foreground mt-0.5">Mostra banner beta su tutta l&apos;applicazione</p>
        </div>
        <Toggle enabled={beta} onChange={(v) => saveFlag('beta_mode', v)} loading={loadingBeta} />
      </div>
      <div className="flex items-center justify-between py-3">
        <div>
          <p className="text-sm font-medium">Disabilita abbonamenti</p>
          <p className="text-xs text-muted-foreground mt-0.5">Nasconde i piani e blocca il checkout</p>
        </div>
        <Toggle enabled={subDisabled} onChange={(v) => saveFlag('disable_sub', v)} loading={loadingSub} />
      </div>
    </div>
  )
}
