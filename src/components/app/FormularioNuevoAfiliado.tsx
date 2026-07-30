import { useState, type FormEvent } from 'react'
import { motion } from 'motion/react'
import type { EstadoAportes } from '@/lib/mock-data'

interface FormularioNuevoAfiliadoProps {
  existeDni: (dni: string) => boolean
  empleadoresConocidos: string[]
  onGuardar: (
    datos: { dni: string; nombreCompleto: string; empleador: string; estado: EstadoAportes },
    opciones: { cargarOtro: boolean },
  ) => void
  onCancelar: () => void
}

export function FormularioNuevoAfiliado({
  existeDni,
  empleadoresConocidos,
  onGuardar,
  onCancelar,
}: FormularioNuevoAfiliadoProps) {
  const [dni, setDni] = useState('')
  const [nombreCompleto, setNombreCompleto] = useState('')
  const [empleador, setEmpleador] = useState('')
  const [estado, setEstado] = useState<EstadoAportes>('activo')
  const [error, setError] = useState('')

  function validarYObtenerDatos() {
    const dniLimpio = dni.replace(/\D/g, '')
    if (dniLimpio.length < 7) {
      setError('El DNI tiene que tener 7 u 8 dígitos.')
      return null
    }
    if (existeDni(dniLimpio)) {
      setError('Ya hay un afiliado cargado con ese DNI. Buscalo en vez de crearlo de nuevo.')
      return null
    }
    if (!nombreCompleto.trim() || !empleador.trim()) {
      setError('Completá el nombre y el empleador.')
      return null
    }
    return { dni: dniLimpio, nombreCompleto: nombreCompleto.trim(), empleador: empleador.trim(), estado }
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const datos = validarYObtenerDatos()
    if (!datos) return
    onGuardar(datos, { cargarOtro: false })
  }

  function handleGuardarYCargarOtro() {
    const datos = validarYObtenerDatos()
    if (!datos) return
    onGuardar(datos, { cargarOtro: true })
    setDni('')
    setNombreCompleto('')
    setEstado('activo')
    setError('')
    // El empleador se mantiene: cargar varios afiliados de la misma empresa es el caso común.
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <label htmlFor="nuevo-dni" className="mb-1 block text-xs font-medium uppercase tracking-wide text-txt-tertiary">
          DNI
        </label>
        <input
          id="nuevo-dni"
          type="text"
          inputMode="numeric"
          autoFocus
          value={dni}
          onChange={(e) => setDni(e.target.value)}
          placeholder="Sin puntos, 7 u 8 dígitos"
          className="h-12 w-full rounded-lg border border-border-default bg-surface-base px-4 text-base text-txt-primary placeholder:text-txt-tertiary focus:border-brand-secondary focus:outline-none focus:ring-2 focus:ring-brand-secondary/30"
        />
      </div>

      <div>
        <label htmlFor="nuevo-nombre" className="mb-1 block text-xs font-medium uppercase tracking-wide text-txt-tertiary">
          Nombre completo
        </label>
        <input
          id="nuevo-nombre"
          type="text"
          value={nombreCompleto}
          onChange={(e) => setNombreCompleto(e.target.value)}
          placeholder="Nombre y apellido del titular"
          className="h-12 w-full rounded-lg border border-border-default bg-surface-base px-4 text-base text-txt-primary placeholder:text-txt-tertiary focus:border-brand-secondary focus:outline-none focus:ring-2 focus:ring-brand-secondary/30"
        />
      </div>

      <div>
        <label htmlFor="nuevo-empleador" className="mb-1 block text-xs font-medium uppercase tracking-wide text-txt-tertiary">
          Empleador
        </label>
        <input
          id="nuevo-empleador"
          type="text"
          list="empleadores-conocidos"
          value={empleador}
          onChange={(e) => setEmpleador(e.target.value)}
          placeholder="Razón social de la empresa"
          className="h-12 w-full rounded-lg border border-border-default bg-surface-base px-4 text-base text-txt-primary placeholder:text-txt-tertiary focus:border-brand-secondary focus:outline-none focus:ring-2 focus:ring-brand-secondary/30"
        />
        <datalist id="empleadores-conocidos">
          {empleadoresConocidos.map((e) => (
            <option key={e} value={e} />
          ))}
        </datalist>
      </div>

      <fieldset>
        <legend className="mb-1 text-xs font-medium uppercase tracking-wide text-txt-tertiary">
          Estado de aportes
        </legend>
        <div className="flex gap-2">
          <motion.button
            whileTap={{ scale: 0.97 }}
            type="button"
            onClick={() => setEstado('activo')}
            aria-pressed={estado === 'activo'}
            className={
              'h-11 flex-1 rounded-lg border text-sm font-medium transition-colors duration-150 ease-out ' +
              (estado === 'activo'
                ? 'border-status-success bg-status-success-soft text-status-success'
                : 'border-border-default text-txt-secondary hover:border-brand-secondary')
            }
          >
            Activo
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.97 }}
            type="button"
            onClick={() => setEstado('inactivo')}
            aria-pressed={estado === 'inactivo'}
            className={
              'h-11 flex-1 rounded-lg border text-sm font-medium transition-colors duration-150 ease-out ' +
              (estado === 'inactivo'
                ? 'border-status-error bg-status-error-soft text-status-error'
                : 'border-border-default text-txt-secondary hover:border-brand-secondary')
            }
          >
            Dado de baja
          </motion.button>
        </div>
      </fieldset>

      {error && (
        <p role="alert" className="text-sm" style={{ color: 'var(--status-error)' }}>
          {error}
        </p>
      )}

      <div className="mt-2 flex flex-wrap justify-end gap-3">
        <button
          type="button"
          onClick={onCancelar}
          className="h-11 rounded-lg px-4 text-sm font-semibold text-txt-secondary hover:bg-surface-secondary"
        >
          Cancelar
        </button>
        <motion.button
          whileTap={{ scale: 0.97 }}
          type="button"
          onClick={handleGuardarYCargarOtro}
          className="h-11 rounded-lg border border-border-default px-4 text-sm font-semibold text-txt-secondary hover:border-brand-secondary hover:text-brand-secondary"
        >
          Guardar y cargar otro
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.97 }}
          type="submit"
          className="h-11 rounded-lg bg-brand-primary px-6 text-sm font-semibold text-txt-inverse transition-colors duration-150 ease-out hover:bg-brand-primary-hover"
        >
          Guardar afiliado
        </motion.button>
      </div>
    </form>
  )
}
