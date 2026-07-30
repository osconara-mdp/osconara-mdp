import { useCallback, useState } from 'react'
import type { Titular } from '@/lib/mock-data'

type Estado =
  | { fase: 'vacio' }
  | { fase: 'cargando' }
  | { fase: 'exito'; titular: Titular }
  | { fase: 'no-encontrado'; dni: string }
  | { fase: 'error' }

export function useBuscarAfiliado(buscarPorDni: (dni: string) => Promise<Titular | null>) {
  const [estado, setEstado] = useState<Estado>({ fase: 'vacio' })

  const buscar = useCallback(
    async (dni: string) => {
      setEstado({ fase: 'cargando' })
      if (dni.replace(/\D/g, '').length < 7) {
        setEstado({ fase: 'error' })
        return
      }
      try {
        const titular = await buscarPorDni(dni)
        if (titular) setEstado({ fase: 'exito', titular })
        else setEstado({ fase: 'no-encontrado', dni })
      } catch {
        setEstado({ fase: 'error' })
      }
    },
    [buscarPorDni],
  )

  const limpiar = useCallback(() => setEstado({ fase: 'vacio' }), [])

  return { estado, buscar, limpiar }
}
