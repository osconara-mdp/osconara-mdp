import { useCallback, useEffect, useRef, useState } from 'react'
import { validarCredenciales, type Usuario } from '@/lib/mock-usuarios'

type EstadoAuth =
  | { fase: 'sin-sesion' }
  | { fase: 'validando' }
  | { fase: 'con-sesion'; usuario: Usuario }
  | { fase: 'credenciales-invalidas' }
  | { fase: 'bloqueado'; segundos: number }

function esperar(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

const INTENTOS_ANTES_DE_BLOQUEAR = 3
const BLOQUEO_SEGUNDOS = 30

// Login simulado — se reemplaza por supabase.auth.signInWithPassword() en Sesión 6, sin cambiar
// la forma en que el resto de la app usa `usuario` (email, nombre, rol). El límite de intentos
// vive acá mismo (no se delega solo a Supabase) porque 4 cuentas fijas de acceso administrativo
// son un blanco fácil de fuerza bruta si nadie lo frena.
export function useAuth() {
  const [estado, setEstado] = useState<EstadoAuth>({ fase: 'sin-sesion' })
  const intentosFallidos = useRef(0)
  const bloqueadoHasta = useRef(0)

  // Cuenta regresiva real del bloqueo — sin esto el mensaje "Esperá 30 segundos" queda
  // congelado y parece que la pantalla no responde.
  useEffect(() => {
    if (estado.fase !== 'bloqueado') return
    const id = setInterval(() => {
      const restante = Math.ceil((bloqueadoHasta.current - Date.now()) / 1000)
      if (restante <= 0) {
        setEstado({ fase: 'sin-sesion' })
      } else {
        setEstado({ fase: 'bloqueado', segundos: restante })
      }
    }, 1000)
    return () => clearInterval(id)
  }, [estado.fase])

  const iniciarSesion = useCallback(async (email: string, password: string) => {
    const ahora = Date.now()
    if (ahora < bloqueadoHasta.current) {
      setEstado({ fase: 'bloqueado', segundos: Math.ceil((bloqueadoHasta.current - ahora) / 1000) })
      return
    }

    setEstado({ fase: 'validando' })
    await esperar(500)
    const usuario = validarCredenciales(email, password)
    if (usuario) {
      intentosFallidos.current = 0
      setEstado({ fase: 'con-sesion', usuario })
      return
    }

    intentosFallidos.current += 1
    if (intentosFallidos.current >= INTENTOS_ANTES_DE_BLOQUEAR) {
      bloqueadoHasta.current = Date.now() + BLOQUEO_SEGUNDOS * 1000
      intentosFallidos.current = 0
      setEstado({ fase: 'bloqueado', segundos: BLOQUEO_SEGUNDOS })
    } else {
      setEstado({ fase: 'credenciales-invalidas' })
    }
  }, [])

  const cerrarSesion = useCallback(() => setEstado({ fase: 'sin-sesion' }), [])

  return { estado, iniciarSesion, cerrarSesion }
}
