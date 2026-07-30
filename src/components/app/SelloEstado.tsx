import type { EstadoAportes } from '@/lib/mock-data'

const COPY: Record<EstadoAportes, string> = {
  activo: 'Activo',
  inactivo: 'Baja',
}

const COPY_COMPLETA: Record<EstadoAportes, string> = {
  activo: 'Aportes al día — Activo',
  inactivo: 'Sin aportes — Dado de baja',
}

export function SelloEstado({ estado }: { estado: EstadoAportes }) {
  const color = estado === 'activo' ? 'var(--status-success)' : 'var(--status-error)'
  const fondo = estado === 'activo' ? 'var(--status-success-soft)' : 'var(--status-error-soft)'
  return (
    <div
      role="status"
      className="flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-full px-1 text-center shadow-md"
      style={{ border: '3px solid var(--brand-detail)', background: fondo }}
    >
      <span aria-hidden className="text-xs font-bold uppercase leading-tight tracking-wide" style={{ color }}>
        {COPY[estado]}
      </span>
      <span className="sr-only">{COPY_COMPLETA[estado]}</span>
    </div>
  )
}
