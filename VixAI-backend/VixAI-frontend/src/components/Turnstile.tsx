import { useEffect, useRef } from 'react'

// Use a safe cast to avoid TS lint issues when vite types are not globally available
const SITEKEY = (import.meta as any).env?.VITE_TURNSTILE_SITEKEY as string | undefined

declare global {
  interface Window {
    turnstile?: any
  }
}

export default function Turnstile({ onToken, theme = 'auto' }: { onToken: (token: string) => void; theme?: 'light' | 'dark' | 'auto' }) {
  const containerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!SITEKEY) {
      console.warn('VITE_TURNSTILE_SITEKEY not set; Turnstile widget will not render')
      return
    }

    const scriptId = 'cf-turnstile-script'
    const ensureScript = () => {
      return new Promise<void>((resolve) => {
        if (window.turnstile) return resolve()
        let s = document.getElementById(scriptId) as HTMLScriptElement | null
        if (!s) {
          s = document.createElement('script')
          s.id = scriptId
          s.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js'
          s.async = true
          s.defer = true
          s.onload = () => resolve()
          document.head.appendChild(s)
        } else if (window.turnstile) {
          resolve()
        } else {
          s.addEventListener('load', () => resolve())
        }
      })
    }

    let widgetId: any
    ensureScript().then(() => {
      if (!containerRef.current || !window.turnstile) return
      widgetId = window.turnstile.render(containerRef.current, {
        sitekey: SITEKEY,
        theme,
        callback: (token: string) => onToken(token),
        'error-callback': () => onToken(''),
        'timeout-callback': () => onToken(''),
      })
    })

    return () => {
      try {
        if (window.turnstile && widgetId) {
          window.turnstile.remove(widgetId)
        }
      } catch {}
    }
  }, [onToken, theme])

  return <div ref={containerRef} />
}
