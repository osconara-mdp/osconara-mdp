import { useState, type FormEvent } from 'react'
import { motion } from 'motion/react'
import { Plus } from 'lucide-react'
import type { Parentesco } from '@/lib/mock-data'

const PARENTESCOS: Parentesco[] = ['Cónyuge', 'Hijo', 'Hija', 'Otro']

export function AgregarFamiliar({
  onAgregar,
}: {
  onAgregar: (nombre: string, parentesco: Parentesco) => void
}) {
  const [abierto, setAbierto] = useState(false)
  const [nombre, setNombre] = useState('')
  const [parentesco, setParentesco] = useState<Parentesco>('Hijo')

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!nombre.trim()) return
    onAgregar(nombre.trim(), parentesco)
    setNombre('')
    setAbierto(false)
  }

  if (!abierto) {
    return (
      <motion.button
        whileTap={{ scale: 0.97 }}
        type="button"
        onClick={() => setAbierto(true)}
        className="flex h-8 items-center gap-1 rounded-full border border-dashed border-border-strong px-3 text-xs text-txt-secondary hover:border-brand-secondary hover:text-brand-secondary"
      >
        <Plus size={12} />
        Agregar familiar
      </motion.button>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full flex-wrap items-center gap-2">
      <input
        type="text"
        autoFocus
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        placeholder="Nombre y apellido"
        className="h-9 min-w-0 flex-1 rounded-lg border border-border-default bg-surface-primary px-3 text-sm text-txt-primary placeholder:text-txt-tertiary focus:border-brand-secondary focus:outline-none focus:ring-2 focus:ring-brand-secondary/30"
      />
      <select
        value={parentesco}
        onChange={(e) => setParentesco(e.target.value as Parentesco)}
        className="h-9 rounded-lg border border-border-default bg-surface-primary px-2 text-sm text-txt-primary focus:border-brand-secondary focus:outline-none"
      >
        {PARENTESCOS.map((p) => (
          <option key={p} value={p}>
            {p}
          </option>
        ))}
      </select>
      <motion.button
        whileTap={{ scale: 0.97 }}
        type="submit"
        className="h-9 rounded-lg bg-brand-primary px-3 text-xs font-semibold text-txt-inverse hover:bg-brand-primary-hover"
      >
        Agregar
      </motion.button>
      <button
        type="button"
        onClick={() => setAbierto(false)}
        className="h-9 rounded-lg px-2 text-xs text-txt-tertiary hover:text-txt-secondary"
      >
        Cancelar
      </button>
    </form>
  )
}
