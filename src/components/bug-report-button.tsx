'use client'

import { useState, useRef, useEffect } from 'react'

export function BugReportButton() {
  const [open, setOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'ok' | 'error'>('idle')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (open) setTimeout(() => textareaRef.current?.focus(), 50)
  }, [open])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')
    const res = await fetch('/api/bug-report', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, url: window.location.href }),
    })
    if (res.ok) {
      setStatus('ok')
      setMessage('')
      setTimeout(() => { setOpen(false); setStatus('idle') }, 2000)
    } else {
      setStatus('error')
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
      >
        <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current stroke-[1.7] shrink-0">
          <path d="M12 2a4 4 0 0 1 4 4v1h1a2 2 0 0 1 2 2v1l2 1-2 1v1a2 2 0 0 1-2 2h-1v1a4 4 0 0 1-8 0v-1H6a2 2 0 0 1-2-2v-1L2 10l2-1V8a2 2 0 0 1 2-2h1V6a4 4 0 0 1 4-4z" strokeLinecap="round" strokeLinejoin="round" />
          <line x1="12" y1="12" x2="12" y2="16" strokeLinecap="round" />
          <circle cx="12" cy="9" r="0.5" fill="currentColor" stroke="none" />
        </svg>
        Report a bug
      </button>

      {open && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-foreground/20 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="relative bg-card border border-border rounded-2xl shadow-2xl shadow-black/40 w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-base">Segnala un bug</h2>
              <button
                onClick={() => setOpen(false)}
                className="p-1.5 rounded-lg hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current stroke-[2]">
                  <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            {status === 'ok' ? (
              <div className="text-center py-6 space-y-2">
                <p className="text-2xl">✓</p>
                <p className="font-medium text-emerald-400">Segnalazione inviata!</p>
                <p className="text-sm text-muted-foreground">Grazie per il feedback.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs text-muted-foreground mb-1.5">
                    Descrivi il problema
                  </label>
                  <textarea
                    ref={textareaRef}
                    required
                    minLength={10}
                    maxLength={2000}
                    rows={5}
                    value={message}
                    onChange={(e) => { setMessage(e.target.value); setStatus('idle') }}
                    placeholder="Cosa è successo? Quali passi hai seguito per riprodurlo?"
                    className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary resize-none"
                  />
                  <p className="text-xs text-muted-foreground/50 mt-1 text-right">{message.length}/2000</p>
                </div>
                <p className="text-xs text-muted-foreground/60">
                  La pagina corrente verrà inclusa automaticamente nella segnalazione.
                </p>
                {status === 'error' && (
                  <p className="text-sm text-red-400">Errore durante l&apos;invio. Riprova.</p>
                )}
                <div className="flex gap-2 justify-end">
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="px-4 py-2 text-sm rounded-lg border border-border hover:bg-secondary transition-colors"
                  >
                    Annulla
                  </button>
                  <button
                    type="submit"
                    disabled={status === 'loading' || message.length < 10}
                    className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-colors"
                  >
                    {status === 'loading' ? 'Invio...' : 'Invia segnalazione'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  )
}
