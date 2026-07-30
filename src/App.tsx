import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { Plus } from 'lucide-react'
import { Header } from '@/components/app/Header'
import { Login } from '@/components/app/Login'
import { BuscadorDni } from '@/components/app/BuscadorDni'
import { BusquedasRecientes } from '@/components/app/BusquedasRecientes'
import { FichaAfiliado } from '@/components/app/FichaAfiliado'
import { Modal } from '@/components/app/Modal'
import { FormularioNuevoAfiliado } from '@/components/app/FormularioNuevoAfiliado'
import { FormularioEditarAfiliado } from '@/components/app/FormularioEditarAfiliado'
import { Toast } from '@/components/app/Toast'
import { EstadoVacio, EstadoNoEncontrado, EstadoError, EstadoCargando } from '@/components/app/EstadoVacio'
import { useAuth } from '@/hooks/useAuth'
import { useBuscarAfiliado } from '@/hooks/useBuscarAfiliado'
import { useBusquedasRecientes } from '@/hooks/useBusquedasRecientes'
import { useTitularesDB } from '@/hooks/useTitularesDB'
import { useToast } from '@/hooks/useToast'
import type { Usuario } from '@/lib/mock-usuarios'

function App() {
  const { estado: authEstado, iniciarSesion, cerrarSesion } = useAuth()

  if (authEstado.fase !== 'con-sesion') {
    return (
      <Login
        cargando={authEstado.fase === 'validando'}
        credencialesInvalidas={authEstado.fase === 'credenciales-invalidas'}
        bloqueadoSegundos={authEstado.fase === 'bloqueado' ? authEstado.segundos : null}
        onIniciarSesion={iniciarSesion}
      />
    )
  }

  return <AppInterna usuario={authEstado.usuario} onCerrarSesion={cerrarSesion} />
}

function AppInterna({ usuario, onCerrarSesion }: { usuario: Usuario; onCerrarSesion: () => void }) {
  const db = useTitularesDB()
  const { estado, buscar, limpiar } = useBuscarAfiliado(db.buscarPorDni)
  const { recientes, agregar, borrarTodo } = useBusquedasRecientes()
  const { toast, mostrar, cerrar } = useToast()
  const reducedMotion = useReducedMotion()
  const [modalNuevoAbierto, setModalNuevoAbierto] = useState(false)
  const [modalEditarAbierto, setModalEditarAbierto] = useState(false)

  useEffect(() => {
    if (estado.fase === 'exito') {
      agregar({
        dni: estado.titular.dni.replace(/\D/g, ''),
        nombreCompleto: estado.titular.nombreCompleto,
        estado: estado.titular.estado,
      })
    }
  }, [estado, agregar])

  return (
    <div className="flex min-h-dvh flex-col bg-surface-base">
      <Toast toast={toast} onCerrar={cerrar} />
      <Header usuario={usuario} onCerrarSesion={onCerrarSesion} />
      <main className="mx-auto w-full max-w-2xl flex-1 px-8 py-8">
        <div className="mb-1 flex items-center justify-between">
          <h1 className="font-display text-xl font-semibold text-txt-primary">¿A quién atendemos?</h1>
          <button
            type="button"
            onClick={() => setModalNuevoAbierto(true)}
            className="flex h-8 items-center gap-1 text-xs font-semibold text-txt-tertiary hover:text-brand-secondary"
          >
            <Plus size={13} />
            Nuevo afiliado
          </button>
        </div>
        <p className="mb-6 text-sm text-txt-tertiary">
          Buscá por DNI para ver el estado de aportes, el grupo familiar y el historial.
        </p>

        <BuscadorDni onBuscar={buscar} onLimpiar={limpiar} cargando={estado.fase === 'cargando'} />
        <BusquedasRecientes
          recientes={recientes}
          dniActivo={estado.fase === 'exito' ? estado.titular.dni.replace(/\D/g, '') : undefined}
          onSeleccionar={buscar}
          onBorrarTodo={borrarTodo}
        />

        <div aria-live="polite" className="mt-6">
          <AnimatePresence mode="wait">
            {estado.fase === 'vacio' && (
              <motion.div
                key="vacio"
                initial={{ opacity: 0, y: reducedMotion ? 0 : 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              >
                <EstadoVacio />
              </motion.div>
            )}
            {estado.fase === 'cargando' && (
              <motion.div
                key="cargando"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
              >
                <EstadoCargando />
              </motion.div>
            )}
            {estado.fase === 'exito' && (
              <motion.div
                key={`exito-${estado.titular.dni}`}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
              >
                <FichaAfiliado
                  titular={estado.titular}
                  onCambiarEstado={async (dni, nuevoEstado) => {
                    const estadoAnterior = estado.fase === 'exito' ? estado.titular.estado : null
                    try {
                      await db.actualizarEstado(dni, nuevoEstado)
                      await buscar(dni)
                      mostrar(
                        nuevoEstado === 'activo' ? 'Estado actualizado a activo.' : 'Estado actualizado a dado de baja.',
                        estadoAnterior
                          ? async () => {
                              await db.actualizarEstado(dni, estadoAnterior)
                              buscar(dni)
                            }
                          : undefined,
                      )
                    } catch {
                      mostrar('No se pudo actualizar el estado. Probá de nuevo.')
                    }
                  }}
                  onAgregarFamiliar={async (dni, nombre, parentesco) => {
                    try {
                      await db.agregarFamiliar(dni, { nombre, parentesco })
                      await buscar(dni)
                      mostrar(`${nombre} agregado al grupo familiar.`)
                    } catch {
                      mostrar('No se pudo agregar al familiar. Probá de nuevo.')
                    }
                  }}
                  onQuitarFamiliar={async (dni, nombreFamiliar) => {
                    const familiarQuitado =
                      estado.fase === 'exito' ? estado.titular.familia.find((f) => f.nombre === nombreFamiliar) : null
                    try {
                      await db.quitarFamiliar(dni, nombreFamiliar)
                      await buscar(dni)
                      mostrar(
                        `${nombreFamiliar} quitado del grupo familiar.`,
                        familiarQuitado
                          ? async () => {
                              await db.agregarFamiliar(dni, familiarQuitado)
                              buscar(dni)
                            }
                          : undefined,
                      )
                    } catch {
                      mostrar('No se pudo quitar al familiar. Probá de nuevo.')
                    }
                  }}
                  onEditarDatos={() => setModalEditarAbierto(true)}
                />
              </motion.div>
            )}
            {estado.fase === 'no-encontrado' && (
              <motion.div
                key="no-encontrado"
                initial={{ opacity: 0, y: reducedMotion ? 0 : 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              >
                <EstadoNoEncontrado dni={estado.dni} />
              </motion.div>
            )}
            {estado.fase === 'error' && (
              <motion.div
                key="error"
                initial={{ opacity: 0, y: reducedMotion ? 0 : 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              >
                <EstadoError />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <Modal abierto={modalNuevoAbierto} titulo="Nuevo afiliado" onCerrar={() => setModalNuevoAbierto(false)}>
        <FormularioNuevoAfiliado
          existeDni={db.existeDni}
          empleadoresConocidos={db.listarEmpleadores()}
          onCancelar={() => setModalNuevoAbierto(false)}
          onGuardar={async (datos, opciones) => {
            try {
              await db.crear(datos)
              mostrar(`${datos.nombreCompleto} se guardó correctamente.`)
              if (!opciones.cargarOtro) {
                setModalNuevoAbierto(false)
                buscar(datos.dni)
              }
            } catch {
              mostrar('No se pudo guardar el afiliado. Probá de nuevo.')
            }
          }}
        />
      </Modal>

      {estado.fase === 'exito' && (
        <Modal abierto={modalEditarAbierto} titulo="Editar datos del afiliado" onCerrar={() => setModalEditarAbierto(false)}>
          <FormularioEditarAfiliado
            titular={estado.titular}
            empleadoresConocidos={db.listarEmpleadores()}
            onCancelar={() => setModalEditarAbierto(false)}
            onGuardar={async (datos) => {
              try {
                await db.editarDatos(estado.titular.dni, datos)
                setModalEditarAbierto(false)
                buscar(estado.titular.dni)
                mostrar('Datos actualizados correctamente.')
              } catch {
                mostrar('No se pudieron guardar los cambios. Probá de nuevo.')
              }
            }}
            onEliminar={async () => {
              const resultado = await db.eliminar(estado.titular.dni)
              if (resultado.ok) {
                setModalEditarAbierto(false)
                limpiar()
                mostrar('Afiliado eliminado.')
              } else {
                mostrar(resultado.motivo ?? 'No se pudo eliminar.')
              }
            }}
          />
        </Modal>
      )}
    </div>
  )
}

export default App
