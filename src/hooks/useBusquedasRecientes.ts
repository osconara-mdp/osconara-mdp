import { useCallback, useEffect, useState } from 'react'

export interface BusquedaReciente {
  dni: string
  nombreCompleto: string
  estado: 'activo' | 'inactivo'
}

const CLAVE_STORAGE = 'osconara.busquedas-recientes'
const MAXIMO = 5

function leerStorage(): BusquedaReciente[] {
  try {
    const crudo = window.localStorage.getItem(CLAVE_STORAGE)
    return crudo ? (JSON.parse(crudo) as BusquedaReciente[]) : []
  } catch {
    return []
  }
}

// Historial de las últimas búsquedas exitosas del turno, para no retipear el mismo DNI dos
// veces en el mostrador. Vive en localStorage: es una comodidad del navegador, no un dato de
// negocio — no reemplaza el historial de trámites (ese sí vive en la base de datos).
export function useBusquedasRecientes() {
  const [recientes, setRecientes] = useState<BusquedaReciente[]>([])

  useEffect(() => {
    setRecientes(leerStorage())
  }, [])

  const agregar = useCallback((entrada: BusquedaReciente) => {
    setRecientes((actuales) => {
      const sinDuplicado = actuales.filter((r) => r.dni !== entrada.dni)
      const nuevos = [entrada, ...sinDuplicado].slice(0, MAXIMO)
      try {
        window.localStorage.setItem(CLAVE_STORAGE, JSON.stringify(nuevos))
      } catch {
        // localStorage puede fallar (modo privado, cuota) — la comodidad se pierde, no la app.
      }
      return nuevos
    })
  }, [])

  const borrarTodo = useCallback(() => {
    setRecientes([])
    try {
      window.localStorage.removeItem(CLAVE_STORAGE)
    } catch {
      // idem: la app sigue funcionando aunque no se pueda persistir.
    }
  }, [])

  return { recientes, agregar, borrarTodo }
}
