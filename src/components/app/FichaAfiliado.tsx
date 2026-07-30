import { motion, useReducedMotion, type Variants } from 'motion/react'
import { Pencil, Printer, X } from 'lucide-react'
import type { EstadoAportes, Parentesco, Titular } from '@/lib/mock-data'
import { SelloEstado } from '@/components/app/SelloEstado'
import { InfoNota } from '@/components/app/InfoNota'
import { CambiarEstado } from '@/components/app/CambiarEstado'
import { AgregarFamiliar } from '@/components/app/AgregarFamiliar'
import { RegistrarTramite } from '@/components/app/RegistrarTramite'

interface FichaAfiliadoProps {
  titular: Titular
  onCambiarEstado: (dni: string, nuevoEstado: EstadoAportes) => void
  onAgregarFamiliar: (dni: string, nombre: string, parentesco: Parentesco) => void
  onQuitarFamiliar: (dni: string, nombreFamiliar: string) => void
  onRegistrarTramite: (dni: string, descripcion: string) => void
  onEditarDatos: () => void
}

export function FichaAfiliado({
  titular,
  onCambiarEstado,
  onAgregarFamiliar,
  onQuitarFamiliar,
  onRegistrarTramite,
  onEditarDatos,
}: FichaAfiliadoProps) {
  const reducedMotion = useReducedMotion()

  const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: reducedMotion ? 0 : 0.06 } },
  }
  const item: Variants = {
    hidden: { opacity: 0, y: reducedMotion ? 0 : 6 },
    show: { opacity: 1, y: 0, transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] } },
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: reducedMotion ? 0 : 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className="imprimir-area rounded-lg border border-border-default bg-surface-primary p-6 shadow-md"
    >
      <div className="flex items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-display text-2xl font-semibold text-txt-primary">{titular.nombreCompleto}</h2>
            <button
              type="button"
              onClick={onEditarDatos}
              aria-label="Editar datos del afiliado"
              className="no-imprimir -m-2 flex items-center justify-center p-2 text-txt-tertiary hover:text-brand-secondary"
            >
              <Pencil size={14} />
            </button>
          </div>
          <p className="mt-1 text-sm text-txt-tertiary tabular">DNI {titular.dni} · Titular</p>
          <div className="mt-2 no-imprimir">
            <CambiarEstado estado={titular.estado} onConfirmar={(nuevo) => onCambiarEstado(titular.dni, nuevo)} />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <SelloEstado estado={titular.estado} />
          <button
            type="button"
            onClick={() => window.print()}
            className="no-imprimir flex h-9 items-center gap-1.5 rounded-lg border border-border-default px-3 text-xs font-semibold text-txt-secondary hover:border-brand-secondary hover:text-brand-secondary"
          >
            <Printer size={14} />
            Imprimir historial
          </button>
        </div>
      </div>

      <dl className="mt-5 grid grid-cols-1 gap-4 rounded-lg bg-surface-tertiary p-4 sm:grid-cols-2">
        <div>
          <dt className="flex items-center text-xs font-medium uppercase tracking-wide text-txt-tertiary">
            Último cruce de aportes (SAAS)
            <InfoNota texto="SAAS: Sistema de Administración de Aportes de Salud — la plataforma oficial que informa altas y bajas." />
          </dt>
          <dd className="mt-1 text-sm font-medium text-txt-primary tabular">{titular.fechaUltimoCruce}</dd>
        </div>
        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-txt-tertiary">Empleador</dt>
          <dd className="mt-1 text-sm font-medium text-txt-primary">{titular.empleador}</dd>
        </div>
        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-txt-tertiary">Correo electrónico</dt>
          <dd className="mt-1 text-sm font-medium text-txt-primary">
            {titular.email || <span className="font-normal text-txt-tertiary">Sin cargar</span>}
          </dd>
        </div>
        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-txt-tertiary">Teléfono</dt>
          <dd className="mt-1 text-sm font-medium text-txt-primary tabular">
            {titular.telefono || <span className="font-normal text-txt-tertiary">Sin cargar</span>}
          </dd>
        </div>
        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-txt-tertiary">Dirección</dt>
          <dd className="mt-1 text-sm font-medium text-txt-primary">
            {titular.direccion || <span className="font-normal text-txt-tertiary">Sin cargar</span>}
          </dd>
        </div>
      </dl>

      <div className="mt-6">
        <h3 className="font-display mb-3 inline-block border-b-2 border-brand-detail pb-1 text-lg font-semibold text-txt-primary">
          Grupo familiar
        </h3>
        <div className="flex flex-wrap items-center gap-2 rounded-lg bg-surface-secondary p-3">
          {titular.familia.length === 0 ? (
            <p className="text-sm text-txt-tertiary">Sin integrantes vinculados todavía.</p>
          ) : (
            <motion.div variants={container} initial="hidden" animate="show" className="contents">
              {titular.familia.map((f) => (
                <motion.span
                  key={f.nombre}
                  variants={item}
                  className="flex w-fit items-center gap-1.5 rounded-full bg-surface-primary py-1.5 pl-3 pr-1.5 text-xs text-txt-secondary shadow-sm"
                >
                  {f.nombre} · {f.parentesco}
                  <button
                    type="button"
                    aria-label={`Quitar a ${f.nombre} del grupo familiar`}
                    onClick={() => onQuitarFamiliar(titular.dni, f.nombre)}
                    className="no-imprimir -m-2 flex items-center justify-center p-2 text-txt-tertiary hover:text-status-error"
                  >
                    <X size={12} />
                  </button>
                </motion.span>
              ))}
            </motion.div>
          )}
          <div className="no-imprimir">
            <AgregarFamiliar onAgregar={(nombre, parentesco) => onAgregarFamiliar(titular.dni, nombre, parentesco)} />
          </div>
        </div>
      </div>

      <div className="mt-6 border-t border-border-default pt-4">
        <h3 className="font-display mb-3 inline-block border-b-2 border-brand-detail pb-1 text-lg font-semibold text-txt-primary">
          Historial de trámites
        </h3>
        {titular.tramites.length === 0 ? (
          <p className="mb-3 text-sm text-txt-tertiary">Todavía no se cargó ningún trámite para este afiliado.</p>
        ) : (
          <motion.ul variants={container} initial="hidden" animate="show" className="mb-3">
            {titular.tramites.map((t, i) => (
              <motion.li
                key={i}
                variants={item}
                className="flex flex-col gap-1 border-border-default py-2 text-sm sm:flex-row sm:items-start sm:justify-between sm:gap-4 [&:not(:last-child)]:border-b"
              >
                <span className="text-txt-primary">{t.descripcion}</span>
                <span className="shrink-0 text-xs text-txt-tertiary tabular sm:pt-0.5">
                  {t.fecha} · {t.usuario}
                </span>
              </motion.li>
            ))}
          </motion.ul>
        )}
        <div className="no-imprimir">
          <RegistrarTramite onRegistrar={(descripcion) => onRegistrarTramite(titular.dni, descripcion)} />
        </div>
      </div>
    </motion.div>
  )
}
