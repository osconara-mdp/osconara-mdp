// Cuentas simuladas para Sesión 5 (login) — se reemplazan por Supabase Auth real en Sesión 6.
// Las contraseñas de acá son SOLO para probar la pantalla en esta sesión de desarrollo; no son
// las contraseñas reales de nadie. En Sesión 6, cada persona va a elegir su propia contraseña
// directamente en el panel de Supabase, y nunca se va a pegar en el chat ni en el código.

export type Rol = 'administrativa' | 'supervisor'

export interface Usuario {
  email: string
  nombre: string
  rol: Rol
}

interface CuentaMock {
  usuario: Usuario
  password: string
}

export const CUENTAS_MOCK: CuentaMock[] = [
  { usuario: { email: 'karina@osconara-mdp.local', nombre: 'Karina Godoy', rol: 'administrativa' }, password: 'mostrador1' },
  { usuario: { email: 'yesica@osconara-mdp.local', nombre: 'Yesica Viladomat', rol: 'administrativa' }, password: 'mostrador2' },
  { usuario: { email: 'jorge@osconara-mdp.local', nombre: 'Jorge Daniel Flores', rol: 'supervisor' }, password: 'supervisor1' },
  { usuario: { email: 'marcelo@osconara-mdp.local', nombre: 'Marcelo Torres', rol: 'supervisor' }, password: 'supervisor2' },
]

export function validarCredenciales(email: string, password: string): Usuario | null {
  const cuenta = CUENTAS_MOCK.find(
    (c) => c.usuario.email.toLowerCase() === email.trim().toLowerCase() && c.password === password,
  )
  return cuenta ? cuenta.usuario : null
}
