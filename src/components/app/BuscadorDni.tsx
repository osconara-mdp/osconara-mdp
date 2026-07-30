import { useEffect, useRef, useState, type FormEvent } from 'react'
import { motion } from 'motion/react'
import { X } from 'lucide-react'

interface BuscadorDniProps {
  onBuscar: (dni: string) => void
  onLimpiar: () => void
  cargando: boolean
}

export function BuscadorDni({ onBuscar, onLimpiar, cargando }: BuscadorDniProps) {
  const [valor, setValor] = useState('')
  const dniValido = valor.replace(/\D/g, '').length >= 7
  const inputRef = useRef<HTMLInputElement>(null)
  const cargandoAnterior = useRef(cargando)

  // Devuelve el foco al buscador apenas termina una consulta (éxito, error o no encontrado),
  // para que el mostrador pueda encadenar la siguiente sin tocar el mouse ni tabular.
  useEffect(() => {
    if (cargandoAnterior.current && !cargando) inputRef.current?.focus()
    cargandoAnterior.current = cargando
  }, [cargando])

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (dniValido && !cargando) onBuscar(valor)
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-3">
      <label htmlFor="dni" className="sr-only">
        DNI del afiliado
      </label>
      <div className="relative flex-1">
        <input
          ref={inputRef}
          id="dni"
          type="text"
          inputMode="numeric"
          autoFocus
          placeholder="DNI del afiliado…"
          value={valor}
          onChange={(e) => setValor(e.target.value)}
          onFocus={(e) => e.currentTarget.select()}
          className="h-14 w-full rounded-lg border border-border-default bg-surface-primary px-4 pr-10 text-base text-txt-primary placeholder:text-txt-tertiary focus:border-brand-secondary focus:outline-none focus:ring-2 focus:ring-brand-secondary/30"
        />
        {valor.length > 0 && (
          <button
            type="button"
            aria-label="Limpiar búsqueda"
            onClick={() => {
              setValor('')
              onLimpiar()
            }}
            className="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-txt-tertiary hover:text-txt-secondary"
          >
            <X size={16} />
          </button>
        )}
      </div>
      <motion.button
        type="submit"
        disabled={!dniValido || cargando}
        whileTap={dniValido && !cargando ? { scale: 0.97 } : undefined}
        className="h-14 rounded-lg bg-brand-primary px-6 text-sm font-semibold text-txt-inverse transition-colors duration-150 ease-out hover:bg-brand-primary-hover disabled:cursor-not-allowed disabled:opacity-40"
      >
        {cargando ? 'Buscando…' : 'Buscar'}
      </motion.button>
    </form>
  )
}
