// Tipos del usuario de sesión — el dato real vive en Supabase Auth + la tabla `profiles`
// (ver useAuth.ts y supabase/migrations/0001_esquema_inicial.sql).

export type Rol = 'administrativa' | 'supervisor'

export interface Usuario {
  email: string
  nombre: string
  rol: Rol
}
