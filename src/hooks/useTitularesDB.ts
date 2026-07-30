import { useCallback, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import type { EstadoAportes, Familiar, Parentesco, Titular } from '@/lib/mock-data'

// Consultas reales contra Supabase (titulares/grupo_familiar/tramites — ver
// supabase/migrations/0001_esquema_inicial.sql y 0002_ajustes_app_real.sql). Mantiene la misma
// forma externa que la versión simulada de las Sesiones 3-4, así que App.tsx y las pantallas ya
// aprobadas no cambian.

const PARENTESCO_A_DB: Record<Parentesco, string> = {
  Cónyuge: 'conyuge',
  Hijo: 'hijo',
  Hija: 'hija',
  Otro: 'otro',
}

const PARENTESCO_DE_DB: Record<string, Parentesco> = {
  conyuge: 'Cónyuge',
  hijo: 'Hijo',
  hija: 'Hija',
  otro: 'Otro',
}

interface FilaLigera {
  dni: string
  empleador: string
}

function formatearDni(limpio: string): string {
  // 30482917 -> 30.482.917 (formato estándar argentino, con puntos de miles)
  return limpio.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
}

function formatearFecha(iso: string | null): string {
  if (!iso) return 'Todavía sin cruce'
  return new Date(iso).toLocaleDateString('es-AR')
}

function formatearFechaHora(iso: string): string {
  return new Date(iso).toLocaleString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function useTitularesDB() {
  // Caché liviana (solo dni + empleador) para que existeDni/listarEmpleadores puedan seguir
  // siendo funciones síncronas — las pantallas ya aprobadas las llaman así (ej. adentro del
  // render de FormularioNuevoAfiliado). Se carga una vez al montar y se mantiene al día a mano
  // después de cada alta/edición, sin volver a pedirla entera.
  const [ligeros, setLigeros] = useState<FilaLigera[]>([])

  useEffect(() => {
    let cancelado = false
    supabase
      .from('titulares')
      .select('dni, empleador')
      .then(({ data, error }) => {
        if (cancelado || error || !data) return
        setLigeros(data.map((fila) => ({ dni: fila.dni, empleador: fila.empleador })))
      })
    return () => {
      cancelado = true
    }
  }, [])

  const buscarPorDni = useCallback(async (dni: string): Promise<Titular | null> => {
    const limpio = dni.replace(/\D/g, '')
    const { data: fila, error } = await supabase
      .from('titulares')
      .select('id, dni, nombre_completo, empleador, estado_aportes, fecha_ultimo_cruce')
      .eq('dni', limpio)
      .maybeSingle()
    if (error || !fila) return null

    const [{ data: familiaFilas }, { data: tramiteFilas }] = await Promise.all([
      supabase
        .from('grupo_familiar')
        .select('nombre_completo, parentesco')
        .eq('titular_id', fila.id)
        .order('created_at'),
      supabase
        .from('tramites')
        .select('descripcion, created_at, profiles(full_name)')
        .eq('titular_id', fila.id)
        .order('created_at', { ascending: false }),
    ])

    return {
      dni: formatearDni(fila.dni),
      nombreCompleto: fila.nombre_completo,
      empleador: fila.empleador,
      estado: fila.estado_aportes === 'inactivo' ? 'inactivo' : 'activo',
      fechaUltimoCruce: formatearFecha(fila.fecha_ultimo_cruce),
      familia: (familiaFilas ?? []).map((f) => ({
        nombre: f.nombre_completo,
        parentesco: PARENTESCO_DE_DB[f.parentesco] ?? 'Otro',
      })),
      tramites: (tramiteFilas ?? []).map((t) => ({
        descripcion: t.descripcion,
        fecha: formatearFechaHora(t.created_at),
        usuario: (t.profiles as unknown as { full_name: string } | null)?.full_name ?? 'Usuario',
      })),
    }
  }, [])

  const existeDni = useCallback(
    (dni: string) => ligeros.some((r) => r.dni === dni.replace(/\D/g, '')),
    [ligeros],
  )

  const crear = useCallback(
    async (datos: { dni: string; nombreCompleto: string; empleador: string; estado: EstadoAportes }) => {
      const limpio = datos.dni.replace(/\D/g, '')
      const { error } = await supabase.from('titulares').insert({
        dni: limpio,
        nombre_completo: datos.nombreCompleto,
        empleador: datos.empleador,
        estado_aportes: datos.estado,
      })
      if (error) throw error
      setLigeros((actuales) => [...actuales, { dni: limpio, empleador: datos.empleador }])
    },
    [],
  )

  const actualizarEstado = useCallback(async (dni: string, estado: EstadoAportes) => {
    const limpio = dni.replace(/\D/g, '')
    const { error } = await supabase.from('titulares').update({ estado_aportes: estado }).eq('dni', limpio)
    if (error) throw error
  }, [])

  const agregarFamiliar = useCallback(async (dni: string, familiar: Familiar) => {
    const limpio = dni.replace(/\D/g, '')
    const { data: titular, error: errorTitular } = await supabase
      .from('titulares')
      .select('id')
      .eq('dni', limpio)
      .maybeSingle()
    if (errorTitular || !titular) throw errorTitular ?? new Error('No se encontró el afiliado.')
    const { error } = await supabase.from('grupo_familiar').insert({
      titular_id: titular.id,
      nombre_completo: familiar.nombre,
      parentesco: PARENTESCO_A_DB[familiar.parentesco],
    })
    if (error) throw error
  }, [])

  const quitarFamiliar = useCallback(async (dni: string, nombreFamiliar: string) => {
    const limpio = dni.replace(/\D/g, '')
    const { data: titular } = await supabase.from('titulares').select('id').eq('dni', limpio).maybeSingle()
    if (!titular) return
    await supabase.from('grupo_familiar').delete().eq('titular_id', titular.id).eq('nombre_completo', nombreFamiliar)
  }, [])

  const editarDatos = useCallback(async (dni: string, datos: { nombreCompleto: string; empleador: string }) => {
    const limpio = dni.replace(/\D/g, '')
    const { error } = await supabase
      .from('titulares')
      .update({ nombre_completo: datos.nombreCompleto, empleador: datos.empleador })
      .eq('dni', limpio)
    if (error) throw error
    setLigeros((actuales) => actuales.map((r) => (r.dni === limpio ? { ...r, empleador: datos.empleador } : r)))
  }, [])

  // El FK `on delete restrict` de tramites.titular_id (supabase/migrations/0001) es quien
  // realmente protege el historial — acá solo se traduce ese rechazo a un mensaje humano.
  const eliminar = useCallback(async (dni: string): Promise<{ ok: boolean; motivo?: string }> => {
    const limpio = dni.replace(/\D/g, '')
    const { data: titular } = await supabase.from('titulares').select('id').eq('dni', limpio).maybeSingle()
    if (!titular) return { ok: false, motivo: 'No existe ese afiliado.' }

    const { error } = await supabase.from('titulares').delete().eq('id', titular.id)
    if (error) {
      if (error.code === '23503') {
        return { ok: false, motivo: 'Tiene trámites cargados — el historial no se puede borrar.' }
      }
      return { ok: false, motivo: 'No se pudo eliminar. Probá de nuevo.' }
    }
    setLigeros((actuales) => actuales.filter((r) => r.dni !== limpio))
    return { ok: true }
  }, [])

  const listarEmpleadores = useCallback((): string[] => {
    return Array.from(new Set(ligeros.map((r) => r.empleador))).sort((a, b) => a.localeCompare(b, 'es'))
  }, [ligeros])

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
