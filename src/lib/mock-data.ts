// Tipos del dominio de la app — compartidos por los componentes de pantalla y por
// useTitularesDB (Sesión 6: los datos vienen de Supabase, no de acá).

export type EstadoAportes = 'activo' | 'inactivo'

export type Parentesco = 'Cónyuge' | 'Hijo' | 'Hija' | 'Otro'

export interface Familiar {
  nombre: string
  parentesco: Parentesco
}

export interface Tramite {
  descripcion: string
  fecha: string
  usuario: string
}

export interface Titular {
  dni: string
  nombreCompleto: string
  empleador: string
  estado: EstadoAportes
  fechaUltimoCruce: string
  email: string | null
  telefono: string | null
  direccion: string | null
  familia: Familiar[]
  tramites: Tramite[]
}
