import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { Info } from 'lucide-react'

export function InfoNota({ texto }: { texto: string }) {
  const [abierto, setAbierto] = useState(false)
  const contenedorRef = useRef<HTMLSpanElement>(null)
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    if (!abierto) return
    function alTocarAfuera(e: MouseEvent) {
      if (!contenedorRef.current?.contains(e.target as Node)) setAbierto(false)
    }
    function alPresionarTecla(e: KeyboardEvent) {
      if (e.key === 'Escape') setAbierto(false)
    }
    document.addEventListener('mousedown', alTocarAfuera)
    document.addEventListener('keydown', alPresionarTecla)
    return () => {
      document.removeEventListener('mousedown', alTocarAfuera)
      document.removeEventListener('keydown', alPresionarTecla)
    }
  }, [abierto])

  return (
    <span ref={contenedorRef} className="relative ml-1 inline-flex items-center">
      <button
        type="button"
        aria-expanded={abierto}
        aria-label="Más información"
        onClick={() => setAbierto((v) => !v)}
        className="-m-4 flex items-center justify-center p-4 text-txt-tertiary hover:text-brand-secondary"
      >
        <Info size={14} />
      </button>
      <AnimatePresence>
        {abierto && (
          <motion.span
            role="tooltip"
            initial={{ opacity: 0, x: reducedMotion ? 0 : 4 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="absolute left-full top-1/2 z-10 ml-2 w-48 -translate-y-1/2 rounded-lg border border-border-default bg-surface-elevated p-3 text-xs font-normal normal-case tracking-normal text-txt-secondary shadow-md"
          >
            {texto}
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  )
}
