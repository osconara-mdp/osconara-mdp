import { useEffect, useMemo, useState } from 'react'
import { motion } from 'motion/react'
import { Check, Printer, X } from 'lucide-react'
import type { ResumenAfiliado } from '@/lib/mock-data'

type Filtro = 'todos' | 'activo' | 'inactivo'

const FILTROS: { valor: Filtro; texto: string }[] = [
  { valor: 'todos', texto: 'Todos' },
  { valor: 'activo', texto: 'Activos' },
  { valor: 'inactivo', texto: 'Dados de baja' },
]

function formatearDni(limpio: string): string {
  return limpio.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
}

function normalizar(texto: string): string {
  return texto.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
}

export function ListadoAfiliados({
  cargar,
  onSeleccionar,
}: {
  cargar: () => Promise<ResumenAfiliado[]>
  onSeleccionar: (dni: string) => void
}) {
  const [lista, setLista] = useState<ResumenAfiliado[] | null>(null)
  const [error, setError] = useState(false)
  const [filtro, setFiltro] = useState<Filtro>('todos')
  const [texto, setTexto] = useState('')

  useEffect(() => {
    let cancelado = false
    cargar()
      .then((datos) => {
        if (!cancelado) setLista(datos)
      })
      .catch(() => {
        if (!cancelado) setError(true)
      })
    return () => {
      cancelado = true
    }
  }, [cargar])

  const visibles = useMemo(() => {
    if (!lista) return []
    const q = normalizar(texto.trim())
    return lista.filter(
      (a) =>
        (filtro === 'todos' || a.estado === filtro) &&
        (!q || normalizar(a.nombreCompleto).includes(q) || a.dni.includes(q.replace(/\D/g, '') || '\u0000') || normalizar(a.empleador).includes(q)),
    )
  }, [lista, filtro, texto])

  if (error) {
    return (
      <p role="alert" className="rounded-lg border border-border-default bg-surface-primary px-6 py-10 text-center text-sm text-txt-secondary">
        No se pudo cargar el listado. Revisá la conexión y volvé a intentar.
      </p>
    )
  }

  if (!lista) {
    return (
      <div className="animate-pulse rounded-lg border border-border-default bg-surface-primary p-6">
        <div className="h-5 w-40 rounded-sm bg-surface-tertiary" />
        <div className="mt-4 h-10 w-full rounded-sm bg-surface-tertiary" />
        <div className="mt-2 h-10 w-full rounded-sm bg-surface-tertiary" />
        <div className="mt-2 h-10 w-full rounded-sm bg-surface-tertiary" />
      </div>
    )
  }

  if (lista.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed border-border-default px-6 py-14 text-center">
        <p className="text-sm font-medium text-txt-primary">Todavía no hay afiliados cargados.</p>
        <p className="max-w-sm text-sm text-txt-tertiary">
          Usá "Nuevo afiliado" para cargar el primero — después van a aparecer acá.
        </p>
      </div>
    )
  }

  return (
    <section className="imprimir-area rounded-lg border border-border-default bg-surface-primary p-4 shadow-md sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-display inline-block border-b-2 border-brand-detail pb-1 text-lg font-semibold text-txt-primary">
          Afiliados cargados <span className="tabular text-sm font-normal text-txt-tertiary">({lista.length})</span>
        </h2>
        <button
          type="button"
          onClick={() => window.print()}
          className="no-imprimir flex h-9 items-center gap-1.5 rounded-lg border border-border-default px-3 text-xs font-semibold text-txt-secondary hover:border-brand-secondary hover:text-brand-secondary"
        >
          <Printer size={14} />
          Imprimir listado
        </button>
      </div>

      <div className="no-imprimir mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <input
          type="search"
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          aria-label="Filtrar el listado por nombre, DNI o empleador"
          placeholder="Filtrar por nombre, DNI o empleador"
          className="h-10 min-w-0 flex-1 rounded-lg border border-border-default bg-surface-base px-3 text-sm text-txt-primary placeholder:text-txt-tertiary focus:border-brand-secondary focus:outline-none focus:ring-2 focus:ring-brand-secondary/30"
        />
        <div className="flex gap-2">
          {FILTROS.map((f) => (
            <button
              key={f.valor}
              type="button"
              onClick={() => setFiltro(f.valor)}
              aria-pressed={filtro === f.valor}
              className={
                'h-10 rounded-lg border px-3 text-xs font-medium ' +
                (filtro === f.valor
                  ? 'border-brand-secondary bg-brand-secondary-soft text-brand-secondary'
                  : 'border-border-default text-txt-secondary hover:border-brand-secondary')
              }
            >
              {f.texto}
            </button>
          ))}
        </div>
      </div>

      {visibles.length === 0 ? (
        <p className="mt-4 text-sm text-txt-tertiary">Ningún afiliado coincide con ese filtro.</p>
      ) : (
        <ul className="mt-3">
          {visibles.map((a) => {
            const activo = a.estado === 'activo'
            return (
              <li key={a.dni} className="border-b border-border-default last:border-b-0">
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.99 }}
                  onClick={() => onSeleccionar(a.dni)}
                  className="flex w-full items-center gap-3 py-3 text-left hover:bg-surface-secondary"
                >
                  <span
                    aria-hidden
                    className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full"
                    style={{
                      background: activo ? 'var(--status-success)' : 'var(--status-error)',
                      border: '1.5px solid var(--brand-detail)',
                    }}
                  >
                    {activo ? (
                      <Check size={12} strokeWidth={3} className="text-white" />
                    ) : (
                      <X size={12} strokeWidth={3} className="text-white" />
                    )}
                  </span>
                  <span className="sr-only">{activo ? 'Activo' : 'Dado de baja'} —</span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium text-txt-primary">{a.nombreCompleto}</span>
                    <span className="block truncate text-xs text-txt-tertiary">{a.empleador}</span>
                  </span>
                  <span className="tabular shrink-0 text-xs text-txt-secondary">{formatearDni(a.dni)}</span>
                </motion.button>
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}
