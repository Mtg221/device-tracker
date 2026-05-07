import { useEffect } from 'react'
import '../styles/toast.css'

export default function Toast({ toast, onDone }) {
  useEffect(() => {
    if (!toast) return
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