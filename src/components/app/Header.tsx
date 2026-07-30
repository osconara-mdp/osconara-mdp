import { LogOut } from 'lucide-react'
import type { Usuario } from '@/lib/mock-usuarios'

const COPY_ROL: Record<Usuario['rol'], string> = {
  administrativa: 'Administrativa',
  supervisor: 'Supervisor',
}

interface HeaderProps {
  usuario: Usuario
  onCerrarSesion: () => void
}

export function Header({ usuario, onCerrarSesion }: HeaderProps) {
  return (
    <header className="flex flex-wrap items-center gap-3 bg-gradient-to-b from-brand-primary to-brand-primary-hover px-4 py-4 sm:justify-between sm:px-8 sm:py-5">
      <div className="flex items-center gap-3">
        <img
          src="/brand/logo-obra-social.png"
          alt="Logo OSCONARA"
          className="h-9 w-auto shrink-0 object-contain sm:h-10"
        />
        <div className="text-txt-inverse">
          <div className="font-display text-base font-semibold leading-none sm:text-lg">OSCONARA</div>
          <div className="mt-1 text-xs font-semibold uppercase tracking-wide text-white/85">
            Seccional Mar del Plata
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="text-xs font-normal text-white/75">
          <span>{usuario.nombre}</span>
          <span className="text-white/55"> · {COPY_ROL[usuario.rol]}</span>
        </div>
        <button
          type="button"
          onClick={onCerrarSesion}
          aria-label="Cerrar sesión"
          className="flex h-9 items-center gap-1.5 rounded-lg border border-white/20 px-3 text-xs font-semibold text-txt-inverse hover:bg-white/10"
        >
          <LogOut size={14} />
          <span className="hidden sm:inline">Salir</span>
        </button>
      </div>
    </header>
  )
}
