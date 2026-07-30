import { useEffect } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { X } from 'lucide-react'

interface ModalProps {
  abierto: boolean
  titulo: string
  onCerrar: () => void
  children: React.ReactNode
}

export function Modal({ abierto, titulo, onCerrar, children }: ModalProps) {
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    if (!abierto) return
    function alPresionarTecla(e: KeyboardEvent) {
      if (e.key === 'Escape') onCerrar()
    }
    document.addEventListener('keydown', alPresionarTecla)
    return () => document.removeEventListener('keydown', alPresionarTecla)
  }, [abierto, onCerrar])

  return (
    <AnimatePresence>
      {abierto && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          <div
            className="absolute inset-0"
            style={{ background: 'var(--surface-overlay)' }}
            onClick={onCerrar}
            aria-hidden
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={titulo}
            initial={{ opacity: 0, y: reducedMotion ? 0 : 16, scale: reducedMotion ? 1 : 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: reducedMotion ? 0 : 8, scale: reducedMotion ? 1 : 0.98 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-md rounded-lg border border-border-default bg-surface-primary p-6 shadow-lg"
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-xl font-semibold text-txt-primary">{titulo}</h2>
              <button
                type="button"
                aria-label="Cerrar"
                onClick={onCerrar}
                className="-m-2 rounded-full p-2 text-txt-tertiary hover:bg-surface-secondary hover:text-txt-primary"
              >
                <X size={18} />
              </button>
            </div>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
