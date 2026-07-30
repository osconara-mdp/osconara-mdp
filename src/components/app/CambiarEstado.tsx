import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import type { EstadoAportes } from '@/lib/mock-data'

interface CambiarEstadoProps {
  estado: EstadoAportes
  onConfirmar: (nuevoEstado: EstadoAportes) => void
}

export function CambiarEstado({ estado, onConfirmar }: CambiarEstadoProps) {
  const [confirmando, setConfirmando] = useState(false)
  const opuesto: EstadoAportes = estado === 'activo' ? 'inactivo' : 'activo'
  const copiaOpuesto = opuesto === 'activo' ? 'Marcar como activo' : 'Marcar como dado de baja'

  return (
    <div className="mt-1 flex h-6 items-center">
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
            <span className="text-txt-tertiary">
              ¿Confirmar {opuesto === 'activo' ? 'reactivación' : 'baja'} manual?
            </span>
            <motion.button
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={() => {
                onConfirmar(opuesto)
                setConfirmando(false)
              }}
              className="font-semibold text-brand-secondary hover:underline"
            >
              Sí
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={() => setConfirmando(false)}
              className="text-txt-secondary hover:underline"
            >
              No
            </motion.button>
          </motion.div>
        ) : (
          <motion.button
            key="boton"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.12 }}
            whileTap={{ scale: 0.97 }}
            type="button"
            onClick={() => setConfirmando(true)}
            className="text-xs text-txt-tertiary underline decoration-dotted hover:text-brand-secondary"
          >
            {copiaOpuesto} (carga manual)
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  )
}
