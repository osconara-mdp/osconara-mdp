import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Check, X } from 'lucide-react'
import type { BusquedaReciente } from '@/hooks/useBusquedasRecientes'

interface BusquedasRecientesProps {
  recientes: BusquedaReciente[]
  dniActivo?: string
  onSeleccionar: (dni: string) => void
  onBorrarTodo: () => void
}

export function BusquedasRecientes({
  recientes,
  dniActivo,
  onSeleccionar,
  onBorrarTodo,
}: BusquedasRecientesProps) {
  const [confirmando, setConfirmando] = useState(false)

  if (recientes.length === 0) return null

  return (
    <div className="mt-3">
      <div className="flex h-5 items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wide text-txt-tertiary">Recientes</span>
        <AnimatePresence mode="wait" initial={false}>
          {confirmando ? (
            <motion.div
              key="confirmar"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.12 }}
              className="flex items-center gap-2 text-xs"
            >
              <span className="text-txt-tertiary">¿Borrar todo?</span>
              <button
                type="button"
                onClick={() => {
                  onBorrarTodo()
                  setConfirmando(false)
                }}
                className="font-semibold text-status-error hover:underline"
              >
                Sí
              </button>
              <button
                type="button"
                onClick={() => setConfirmando(false)}
                className="text-txt-secondary hover:underline"
              >
                No
              </button>
            </motion.div>
          ) : (
            <motion.button
              key="borrar"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.12 }}
              type="button"
              onClick={() => setConfirmando(true)}
              className="text-xs text-txt-tertiary underline decoration-dotted hover:text-status-error"
            >
              Borrar
            </motion.button>
          )}
        </AnimatePresence>
      </div>
      <div className="mt-2 flex flex-wrap gap-2">
        {recientes.map((r) => {
          const activo = r.estado === 'activo'
          const color = activo ? 'var(--status-success)' : 'var(--status-error)'
          const seleccionado = r.dni === dniActivo
          return (
            <motion.button
              key={r.dni}
              type="button"
              whileTap={{ scale: 0.97 }}
              onClick={() => onSeleccionar(r.dni)}
              aria-pressed={seleccionado}
              className={
                'flex items-center gap-2 rounded-full border bg-surface-primary py-1.5 pl-1.5 pr-3 text-xs text-txt-secondary hover:border-brand-secondary ' +
                (seleccionado ? 'border-brand-secondary bg-brand-secondary-soft' : 'border-border-default')
              }
            >
              <span
                aria-hidden
                className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full"
                style={{ background: color, border: '1.5px solid var(--brand-detail)' }}
              >
                {activo ? (
                  <Check size={10} strokeWidth={3} className="text-white" />
                ) : (
                  <X size={10} strokeWidth={3} className="text-white" />
                )}
              </span>
              <span className="sr-only">{activo ? 'Activo' : 'Dado de baja'} —</span>
              <span className="tabular">{r.dni}</span>
              <span className="text-txt-tertiary">· {r.nombreCompleto.split(' ')[0]}</span>
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}
