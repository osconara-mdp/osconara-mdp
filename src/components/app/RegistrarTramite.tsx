import { useState, type FormEvent } from 'react'
import { motion } from 'motion/react'
import { Plus } from 'lucide-react'

export function RegistrarTramite({ onRegistrar }: { onRegistrar: (descripcion: string) => void }) {
  const [abierto, setAbierto] = useState(false)
  const [descripcion, setDescripcion] = useState('')

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!descripcion.trim()) return
    onRegistrar(descripcion.trim())
    setDescripcion('')
    setAbierto(false)
  }

  if (!abierto) {
    return (
      <motion.button
        whileTap={{ scale: 0.97 }}
        type="button"
        onClick={() => setAbierto(true)}
        className="flex h-9 items-center gap-1.5 rounded-lg border border-dashed border-border-strong px-3 text-xs text-txt-secondary hover:border-brand-secondary hover:text-brand-secondary"
      >
        <Plus size={12} />
        Registrar trámite
      </motion.button>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full flex-col gap-2 sm:flex-row sm:items-start">
      <input
        type="text"
        autoFocus
        value={descripcion}
        onChange={(e) => setDescripcion(e.target.value)}
        placeholder="Qué trámite hiciste (ej. autorización de consulta clínica)"
        className="h-9 min-w-0 flex-1 rounded-lg border border-border-default bg-surface-primary px-3 text-sm text-txt-primary placeholder:text-txt-tertiary focus:border-brand-secondary focus:outline-none focus:ring-2 focus:ring-brand-secondary/30"
      />
      <div className="flex gap-2">
        <motion.button
          whileTap={{ scale: 0.97 }}
          type="submit"
          className="h-9 shrink-0 rounded-lg bg-brand-primary px-3 text-xs font-semibold text-txt-inverse hover:bg-brand-primary-hover"
        >
          Guardar
        </motion.button>
        <button
          type="button"
          onClick={() => setAbierto(false)}
          className="h-9 shrink-0 rounded-lg px-2 text-xs text-txt-tertiary hover:text-txt-secondary"
        >
          Cancelar
        </button>
      </div>
    </form>
  )
}
