export function EstadoVacio() {
  return (
    <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed border-border-default px-6 py-16 text-center">
      <div
        aria-hidden
        className="h-14 w-14 rounded-full"
        style={{ border: '3px solid var(--brand-detail)' }}
      />
      <p className="max-w-sm text-sm text-txt-secondary">
        Escribí el DNI de un afiliado arriba para ver su ficha, su grupo familiar y el estado de
        sus aportes.
      </p>
    </div>
  )
}

export function EstadoNoEncontrado({ dni }: { dni: string }) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-lg border border-border-default bg-surface-primary px-6 py-14 text-center">
      <p className="text-sm font-medium text-txt-primary">
        No encontramos ningún afiliado con el DNI {dni}.
      </p>
      <p className="max-w-sm text-sm text-txt-tertiary">
        Revisá que esté bien escrito, o confirmá si ya se importó el último padrón de la
        Superintendencia de Servicios de Salud (SSS).
      </p>
    </div>
  )
}

export function EstadoError() {
  return (
    <div
      role="alert"
      className="flex flex-col items-center gap-2 rounded-lg border px-6 py-14 text-center"
      style={{ borderColor: 'var(--status-error)', background: 'var(--status-error-soft)' }}
    >
      <p className="text-sm font-medium" style={{ color: 'var(--status-error)' }}>
        Ese DNI no parece válido.
      </p>
      <p className="max-w-sm text-sm text-txt-secondary">
        Escribilo sin puntos y con 7 u 8 dígitos, y volvé a intentar.
      </p>
    </div>
  )
}

export function EstadoCargando() {
  return (
    <div className="animate-pulse rounded-lg border border-border-default bg-surface-primary p-6">
      <div className="h-6 w-56 rounded-sm bg-surface-tertiary" />
      <div className="mt-2 h-4 w-32 rounded-sm bg-surface-tertiary" />
      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="h-10 rounded-sm bg-surface-tertiary" />
        <div className="h-10 rounded-sm bg-surface-tertiary" />
      </div>
      <div className="mt-6 h-4 w-24 rounded-sm bg-surface-tertiary" />
      <div className="mt-2 h-8 w-full rounded-sm bg-surface-tertiary" />
    </div>
  )
}
