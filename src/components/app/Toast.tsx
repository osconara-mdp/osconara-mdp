import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { Check } from 'lucide-react'

interface ToastProps {
  toast: { texto: string; onDeshacer?: () => void; duracionMs: number } | null
  onCerrar: () => void
}

export function Toast({ toast, onCerrar }: ToastProps) {
  const reducedMotion = useReducedMotion()

  return (
    <div aria-live="polite" className="pointer-events-none fixed inset-x-0 top-4 z-50 flex justify-center px-4">
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: reducedMotion ? 0 : -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: reducedMotion ? 0 : -8 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="pointer-events-auto overflow-hidden rounded-lg border border-border-default bg-brand-primary shadow-lg"
          >
            <div className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-txt-inverse">
              <motion.span
                initial={{ scale: reducedMotion ? 1 : 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 500, damping: 20, delay: reducedMotion ? 0 : 0.05 }}
                className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/15"
              >
                <Check size={12} strokeWidth={3} />
              </motion.span>
              {toast.texto}
              {toast.onDeshacer && (
                <button
                  type="button"
                  onClick={() => {
                    toast.onDeshacer?.()
                    onCerrar()
                  }}
                  className="ml-1 font-semibold underline hover:text-white/80"
                >
                  Deshacer
                </button>
              )}
            </div>
            {toast.onDeshacer && (
              <motion.div
                key={toast.texto}
                initial={{ scaleX: 1 }}
                animate={{ scaleX: 0 }}
                transition={{ duration: toast.duracionMs / 1000, ease: 'linear' }}
                style={{ transformOrigin: 'left' }}
                className="h-0.5 bg-brand-detail"
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
