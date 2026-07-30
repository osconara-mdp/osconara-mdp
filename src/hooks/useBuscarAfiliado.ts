import { useCallback, useState } from 'react'
import type { Titular } from '@/lib/mock-data'

type Estado =
  | { fase: 'vacio' }
  | { fase: 'cargando' }
  | { fase: 'exito'; titular: Titular }
  | { fase: 'no-encontrado'; dni: string }
  | { fase: 'error' }

// Simula la latencia de una consulta real — se reemplaza por el cliente de Supabase en Sesión 6.
function esperar(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export function useBuscarAfiliado(buscarPorDni: (dni: string) => Titular | null) {
  const [estado, setEstado] = useState<Estado>({ fase: 'vacio' })

  const buscar = useCallback(
    async (dni: string) => {
      setEstado({ fase: 'cargando' })
      if (dni.replace(/\D/g, '').length < 7) {
        await esperar(550)
        setEstado({ fase: 'error' })
        return
      }
      await esperar(550)
      const titular = buscarPorDni(dni)
      if (titular) setEstado({ fase: 'exito', titular })
      else setEstado({ fase: 'no-encontrado', dni })
    },
    [buscarPorDni],
  )

  const limpiar = useCallback(() => setEstado({ fase: 'vacio' }), [])

  return { estado, buscar, limpiar }
}
