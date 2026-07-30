import { useState, type FormEvent } from 'react'
import { motion, useReducedMotion, type Variants } from 'motion/react'
import { Eye, EyeOff } from 'lucide-react'

interface LoginProps {
  cargando: boolean
  credencialesInvalidas: boolean
  bloqueadoSegundos: number | null
  onIniciarSesion: (email: string, password: string) => void
}

export function Login({ cargando, credencialesInvalidas, bloqueadoSegundos, onIniciarSesion }: LoginProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [verPassword, setVerPassword] = useState(false)
  const [camposIncompletos, setCamposIncompletos] = useState(false)
  const [mostrarAyuda, setMostrarAyuda] = useState(false)
  const reducedMotion = useReducedMotion()

  const bloqueado = bloqueadoSegundos !== null

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (bloqueado || cargando) return
    if (!email.trim() || !password) {
      setCamposIncompletos(true)
      return
    }
    setCamposIncompletos(false)
    onIniciarSesion(email.trim(), password)
  }

  const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: reducedMotion ? 0 : 0.06 } },
  }
  const item: Variants = {
    hidden: { opacity: 0, y: reducedMotion ? 0 : 8 },
    show: { opacity: 1, y: 0, transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] } },
  }

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-surface-base px-6 py-12">
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="w-full max-w-sm overflow-hidden rounded-lg border border-border-default bg-surface-primary shadow-md"
      >
        <div className="h-1 bg-brand-detail" aria-hidden />
        <div className="p-8">
          <motion.div variants={item} className="mb-6 flex flex-col items-center text-center">
            <img src="/brand/logo-obra-social.png" alt="Logo OSCONARA" className="h-12 w-auto object-contain" />
            <div className="mt-2 text-sm font-medium text-txt-secondary">OSCONARA</div>
            <div className="text-xs uppercase tracking-wide text-txt-tertiary">Seccional Mar del Plata</div>
          </motion.div>

          <motion.div variants={item}>
            <h1 className="font-display mb-1 text-xl font-semibold text-txt-primary">Iniciar sesión</h1>
            <p className="mb-5 text-sm text-txt-tertiary">Acceso exclusivo para personal autorizado.</p>
          </motion.div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <motion.div variants={item}>
              <label htmlFor="login-email" className="mb-1 block text-xs font-medium uppercase tracking-wide text-txt-tertiary">
                Correo
              </label>
              <input
                id="login-email"
                type="email"
                autoFocus
                autoComplete="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="usuario@osconara-mdp.local"
                className={
                  'h-12 w-full rounded-lg border bg-surface-base px-4 text-base text-txt-primary placeholder:text-txt-tertiary focus:outline-none focus:ring-2 focus:ring-brand-secondary/30 ' +
                  (camposIncompletos && !email.trim()
                    ? 'border-status-error'
                    : 'border-border-default focus:border-brand-secondary')
                }
              />
            </motion.div>

            <motion.div variants={item}>
              <label htmlFor="login-password" className="mb-1 block text-xs font-medium uppercase tracking-wide text-txt-tertiary">
                Contraseña
              </label>
              <div className="relative">
                <input
                  id="login-password"
                  type={verPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={
                    'h-12 w-full rounded-lg border bg-surface-base px-4 pr-11 text-base text-txt-primary focus:outline-none focus:ring-2 focus:ring-brand-secondary/30 ' +
                    (camposIncompletos && !password
                      ? 'border-status-error'
                      : 'border-border-default focus:border-brand-secondary')
                  }
                />
                <button
                  type="button"
                  onClick={() => setVerPassword((v) => !v)}
                  aria-label={verPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-txt-tertiary hover:text-txt-secondary"
                >
                  {verPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <button
                type="button"
                onClick={() => setMostrarAyuda((v) => !v)}
                className="mt-1.5 text-xs text-txt-tertiary underline decoration-dotted hover:text-brand-secondary"
              >
                ¿Olvidaste tu contraseña?
              </button>
              {mostrarAyuda && (
                <p className="mt-1 text-xs text-txt-tertiary">
                  Pedile a tu supervisor el contacto exacto del encargado de sistemas para que te
                  la restablezca.
                </p>
              )}
            </motion.div>

            {camposIncompletos && (
              <p role="alert" className="text-sm" style={{ color: 'var(--status-error)' }}>
                Completá el correo y la contraseña.
              </p>
            )}

            {credencialesInvalidas && (
              <div role="alert">
                <p className="text-sm" style={{ color: 'var(--status-error)' }}>
                  El correo o la contraseña no son correctos. Probá de nuevo.
                </p>
                <p className="mt-1 text-xs text-txt-tertiary">
                  ¿No podés entrar? Pedile ayuda a tu supervisor.
                </p>
              </div>
            )}

            {bloqueado && (
              <p role="alert" className="text-sm" style={{ color: 'var(--status-error)' }}>
                Demasiados intentos. Esperá {bloqueadoSegundos} segundos y volvé a intentar.
              </p>
            )}

            <motion.div variants={item}>
              <motion.button
                whileTap={!cargando && !bloqueado ? { scale: 0.97 } : undefined}
                type="submit"
                disabled={cargando || bloqueado}
                className="mt-1 h-12 w-full rounded-lg bg-brand-primary text-sm font-semibold text-txt-inverse transition-colors duration-150 ease-out hover:bg-brand-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
              >
                {cargando ? 'Ingresando…' : 'Ingresar'}
              </motion.button>
            </motion.div>
          </form>
        </div>
      </motion.div>
    </div>
  )
}
