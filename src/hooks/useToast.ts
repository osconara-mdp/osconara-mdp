import { useCallback, useRef, useState } from 'react'

interface ToastState {
  texto: string
  onDeshacer?: () => void
  duracionMs: number
}

export function useToast() {
  const [toast, setToast] = useState<ToastState | null>(null)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const mostrar = useCallback((texto: string, onDeshacer?: () => void) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    const duracionMs = onDeshacer ? 5000 : 2500
    setToast({ texto, onDeshacer, duracionMs })
    timeoutRef.current = setTimeout(() => setToast(null), duracionMs)
  }, [])

  const cerrar = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setToast(null)
  }, [])

  return { toast, mostrar, cerrar }
}
