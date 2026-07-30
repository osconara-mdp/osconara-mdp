import { useCallback, useEffect, useRef, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import type { Rol, Usuario } from '@/lib/mock-usuarios'

type EstadoAuth =
  | { fase: 'sin-sesion' }
  | { fase: 'validando' }
  | { fase: 'con-sesion'; usuario: Usuario }
  | { fase: 'credenciales-invalidas' }
  | { fase: 'bloqueado'; segundos: number }

const INTENTOS_ANTES_DE_BLOQUEAR = 3
const BLOQUEO_SEGUNDOS = 30

async function cargarUsuario(authUserId: string, email: string): Promise<Usuario | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('full_name, role')
    .eq('id', authUserId)
    .maybeSingle()
  if (error || !data) return null
  return { id: authUserId, email, nombre: data.full_name, rol: data.role as Rol }
}

// Login real contra Supabase Auth (supabase.auth.signInWithPassword). El límite de intentos
// vive acá mismo (no se delega solo a Supabase) porque 4 cuentas fijas de acceso administrativo
// son un blanco fácil de fuerza bruta si nadie lo frena.
export function useAuth() {
  const [estado, setEstado] = useState<EstadoAuth>({ fase: 'sin-sesion' })
  const intentosFallidos = useRef(0)
  const bloqueadoHasta = useRef(0)

  // Si ya había una sesión viva (recarga de página), la recupera sin pedir login de nuevo.
  useEffect(() => {
    let cancelado = false
    supabase.auth.getSession().then(async ({ data }) => {
      const session = data.session
      if (!session || cancelado) return
      const usuario = await cargarUsuario(session.user.id, session.user.email ?? '')
      if (!cancelado && usuario) setEstado({ fase: 'con-sesion', usuario })
    })
    return () => {
      cancelado = true
    }
  }, [])

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
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })

    if (error || !data.user) {
      intentosFallidos.current += 1
      if (intentosFallidos.current >= INTENTOS_ANTES_DE_BLOQUEAR) {
        bloqueadoHasta.current = Date.now() + BLOQUEO_SEGUNDOS * 1000
        intentosFallidos.current = 0
        setEstado({ fase: 'bloqueado', segundos: BLOQUEO_SEGUNDOS })
      } else {
        setEstado({ fase: 'credenciales-invalidas' })
      }
      return
    }

    const usuario = await cargarUsuario(data.user.id, data.user.email ?? email)
    if (!usuario) {
      await supabase.auth.signOut()
      setEstado({ fase: 'credenciales-invalidas' })
      return
    }

    intentosFallidos.current = 0
    setEstado({ fase: 'con-sesion', usuario })
  }, [])

  const cerrarSesion = useCallback(() => {
    void supabase.auth.signOut()
    setEstado({ fase: 'sin-sesion' })
  }, [])

  return { estado, iniciarSesion, cerrarSesion }
}
