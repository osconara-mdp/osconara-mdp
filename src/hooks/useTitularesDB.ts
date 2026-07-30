import { useCallback, useRef } from 'react'
import { TITULARES_MOCK, type EstadoAportes, type Familiar, type Titular } from '@/lib/mock-data'

// "Base de datos" en memoria del navegador — se pierde al recargar la página. Sesión 6
// (servicios externos) la reemplaza por las tablas reales de Supabase (titulares/grupo_familiar,
// ver supabase/migrations/0001_esquema_inicial.sql), sin cambiar la forma en que la usan las
// pantallas.
//
// Usa un ref (no useState) a propósito: escribir y leer deben ser SÍNCRONOS en el mismo tick —
// quien crea un afiliado y enseguida lo busca no puede esperar a que React re-renderice. La
// pantalla que sí necesita re-render (la ficha) ya lo obtiene a través de useBuscarAfiliado.
export function useTitularesDB() {
  const titularesRef = useRef<Record<string, Titular>>({ ...TITULARES_MOCK })

  const buscarPorDni = useCallback((dni: string): Titular | null => {
    const limpio = dni.replace(/\D/g, '')
    return titularesRef.current[limpio] ?? null
  }, [])

  const existeDni = useCallback((dni: string) => Boolean(titularesRef.current[dni.replace(/\D/g, '')]), [])

  const crear = useCallback(
    (datos: { dni: string; nombreCompleto: string; empleador: string; estado: EstadoAportes }) => {
      const limpio = datos.dni.replace(/\D/g, '')
      const hoy = new Date().toLocaleDateString('es-AR')
      titularesRef.current[limpio] = {
        dni: formatearDni(limpio),
        nombreCompleto: datos.nombreCompleto,
        empleador: datos.empleador,
        estado: datos.estado,
        fechaUltimoCruce: hoy,
        familia: [],
        tramites: [],
      }
    },
    [],
  )

  const actualizarEstado = useCallback((dni: string, estado: EstadoAportes) => {
    const limpio = dni.replace(/\D/g, '')
    const existente = titularesRef.current[limpio]
    if (!existente) return
    titularesRef.current[limpio] = { ...existente, estado }
  }, [])

  const agregarFamiliar = useCallback((dni: string, familiar: Familiar) => {
    const limpio = dni.replace(/\D/g, '')
    const existente = titularesRef.current[limpio]
    if (!existente) return
    titularesRef.current[limpio] = { ...existente, familia: [...existente.familia, familiar] }
  }, [])

  const quitarFamiliar = useCallback((dni: string, nombreFamiliar: string) => {
    const limpio = dni.replace(/\D/g, '')
    const existente = titularesRef.current[limpio]
    if (!existente) return
    titularesRef.current[limpio] = {
      ...existente,
      familia: existente.familia.filter((f) => f.nombre !== nombreFamiliar),
    }
  }, [])

  const editarDatos = useCallback(
    (dni: string, datos: { nombreCompleto: string; empleador: string }) => {
      const limpio = dni.replace(/\D/g, '')
      const existente = titularesRef.current[limpio]
      if (!existente) return
      titularesRef.current[limpio] = {
        ...existente,
        nombreCompleto: datos.nombreCompleto,
        empleador: datos.empleador,
      }
    },
    [],
  )

  // No se permite eliminar un afiliado que ya tiene trámites cargados — el esquema real
  // (supabase/migrations/0001) usa `on delete restrict` en tramites.titular_id justamente para
  // que el historial nunca se pierda al borrar un titular por error.
  const eliminar = useCallback((dni: string): { ok: boolean; motivo?: string } => {
    const limpio = dni.replace(/\D/g, '')
    const existente = titularesRef.current[limpio]
    if (!existente) return { ok: false, motivo: 'No existe ese afiliado.' }
    if (existente.tramites.length > 0) {
      return { ok: false, motivo: 'Tiene trámites cargados — el historial no se puede borrar.' }
    }
    delete titularesRef.current[limpio]
    return { ok: true }
  }, [])

  const listarEmpleadores = useCallback((): string[] => {
    const set = new Set(Object.values(titularesRef.current).map((t) => t.empleador))
    return Array.from(set)
  }, [])

  return {
    buscarPorDni,
    existeDni,
    crear,
    actualizarEstado,
    agregarFamiliar,
    quitarFamiliar,
    editarDatos,
    eliminar,
    listarEmpleadores,
  }
}

function formatearDni(limpio: string): string {
  // 30482917 -> 30.482.917 (formato estándar argentino, con puntos de miles)
  return limpio.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
}
