import { useState, type FormEvent } from 'react'
import { motion } from 'motion/react'
import type { Titular } from '@/lib/mock-data'

interface FormularioEditarAfiliadoProps {
  titular: Titular
  empleadoresConocidos: string[]
  onGuardar: (datos: { nombreCompleto: string; empleador: string }) => void
  onCancelar: () => void
  onEliminar: () => { ok: boolean; motivo?: string }
}

export function FormularioEditarAfiliado({
  titular,
  empleadoresConocidos,
  onGuardar,
  onCancelar,
  onEliminar,
}: FormularioEditarAfiliadoProps) {
  const [nombreCompleto, setNombreCompleto] = useState(titular.nombreCompleto)
  const [empleador, setEmpleador] = useState(titular.empleador)
  const [error, setError] = useState('')
  const [confirmandoEliminar, setConfirmandoEliminar] = useState(false)

  const tieneTramites = titular.tramites.length > 0

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!nombreCompleto.trim() || !empleador.trim()) {
      setError('Completá el nombre y el empleador.')
      return
    }
    onGuardar({ nombreCompleto: nombreCompleto.trim(), empleador: empleador.trim() })
  }

  function handleEliminar() {
    onEliminar()
    setConfirmandoEliminar(false)
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-txt-tertiary">DNI</span>
        <p className="tabular text-base text-txt-tertiary">
          {titular.dni} <span className="text-xs">(no se puede cambiar)</span>
        </p>
      </div>

      <div>
        <label htmlFor="editar-nombre" className="mb-1 block text-xs font-medium uppercase tracking-wide text-txt-tertiary">
          Nombre completo
        </label>
        <input
          id="editar-nombre"
          type="text"
          autoFocus
          value={nombreCompleto}
          onChange={(e) => setNombreCompleto(e.target.value)}
          className="h-12 w-full rounded-lg border border-border-default bg-surface-base px-4 text-base text-txt-primary focus:border-brand-secondary focus:outline-none focus:ring-2 focus:ring-brand-secondary/30"
        />
      </div>

      <div>
        <label htmlFor="editar-empleador" className="mb-1 block text-xs font-medium uppercase tracking-wide text-txt-tertiary">
          Empleador
        </label>
        <input
          id="editar-empleador"
          type="text"
          list="empleadores-conocidos-editar"
          value={empleador}
          onChange={(e) => setEmpleador(e.target.value)}
          className="h-12 w-full rounded-lg border border-border-default bg-surface-base px-4 text-base text-txt-primary focus:border-brand-secondary focus:outline-none focus:ring-2 focus:ring-brand-secondary/30"
        />
        <datalist id="empleadores-conocidos-editar">
          {empleadoresConocidos.map((e) => (
            <option key={e} value={e} />
          ))}
        </datalist>
      </div>

      {error && (
        <p role="alert" className="text-sm" style={{ color: 'var(--status-error)' }}>
          {error}
        </p>
      )}

      <div className="mt-2 flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancelar}
          className="h-11 rounded-lg px-4 text-sm font-semibold text-txt-secondary hover:bg-surface-secondary"
        >
          Cancelar
        </button>
        <motion.button
          whileTap={{ scale: 0.97 }}
          type="submit"
          className="h-11 rounded-lg bg-brand-primary px-6 text-sm font-semibold text-txt-inverse transition-colors duration-150 ease-out hover:bg-brand-primary-hover"
        >
          Guardar cambios
        </motion.button>
      </div>

      <div className="mt-2 border-t border-border-default pt-4">
        {tieneTramites ? (
          <p className="text-xs text-txt-tertiary">
            No se puede eliminar: tiene trámites cargados (el historial nunca se borra). Si de
            verdad hay que darlo de baja para siempre, marcalo como "dado de baja" en vez de
            eliminarlo — el registro queda, pero deja de contar como afiliado activo.
          </p>
        ) : confirmandoEliminar ? (
          <div className="flex items-center gap-3 text-sm">
            <span className="text-txt-secondary">¿Eliminar este afiliado por completo?</span>
            <button type="button" onClick={handleEliminar} className="font-semibold text-status-error hover:underline">
              Sí, eliminar
            </button>
            <button
              type="button"
              onClick={() => setConfirmandoEliminar(false)}
              className="text-txt-secondary hover:underline"
            >
              No
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setConfirmandoEliminar(true)}
            className="text-xs text-txt-tertiary underline decoration-dotted hover:text-status-error"
          >
            Eliminar afiliado cargado por error
          </button>
        )}
      </div>
    </form>
  )
}
