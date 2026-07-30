// Datos semilla realistas para Sesión 3 (pantalla de producto, nunca vacía — 32-DEL-MVP-AL-PRODUCTO).
// Reemplazar por consultas reales a Supabase en Sesión 6 (servicios externos).

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
  familia: Familiar[]
  tramites: Tramite[]
}

export const TITULARES_MOCK: Record<string, Titular> = {
  '30482917': {
    dni: '30.482.917',
    nombreCompleto: 'Rubén Alberto Sosa',
    empleador: 'Naviera del Atlántico S.A.',
    estado: 'activo',
    fechaUltimoCruce: '28/07/2026',
    familia: [
      { nombre: 'Marta Sosa', parentesco: 'Cónyuge' },
      { nombre: 'Iván Sosa', parentesco: 'Hijo' },
      { nombre: 'Lucía Sosa', parentesco: 'Hija' },
    ],
    tramites: [
      { descripcion: 'Autorización — consulta clínica', fecha: 'Hoy, 09:14', usuario: 'Karina Godoy' },
      { descripcion: 'Autorización — análisis de laboratorio', fecha: '22/07, 11:40', usuario: 'Yesica Viladomat' },
      { descripcion: 'Actualización de datos de contacto', fecha: '15/07, 16:02', usuario: 'Karina Godoy' },
    ],
  },
  '28114520': {
    dni: '28.114.520',
    nombreCompleto: 'Marcelo Fabián Ibarra',
    empleador: 'Pesquera del Sur S.R.L.',
    estado: 'inactivo',
    fechaUltimoCruce: '28/07/2026',
    familia: [{ nombre: 'Norma Ibarra', parentesco: 'Cónyuge' }],
    tramites: [
      { descripcion: 'Rechazado — sin aportes vigentes', fecha: '20/07, 10:05', usuario: 'Yesica Viladomat' },
    ],
  },
}
