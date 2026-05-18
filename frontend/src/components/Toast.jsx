import { useEffect } from 'react'
import '../styles/toast.css'

export default function Toast({ toast, onDone }) { // Toast component to display messages
  useEffect(() => {
    if (!toast) return // No toast to show, do nothing
    const t = setTimeout(onDone, 3200)
    return () => clearTimeout(t)
  }, [toast])

  if (!toast) return null

  return (
    <div className={`toast show ${toast.type || ''}`}>
      {toast.msg}
    </div>
  )
}