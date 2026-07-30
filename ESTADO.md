# ESTADO — OSCONARA Seccional MDP
Última actualización: 2026-07-30 | Sesión actual: 6 (conectando backend real, en progreso)

⏸️ CHECKPOINT — Sesión 6: infraestructura real conectada y verificada (GitHub, Supabase, Vercel
con auto-deploy confirmado por commit canario). Se resolvió un proyecto Vercel duplicado
(`osconara-mdp-k8pm`, eliminado) y un incidente de exposición accidental de las claves legacy
JWT de Supabase (`anon`/`service_role`), remediado desactivando esas claves legacy desde el
dashboard — el proyecto usa solo `sb_publishable_...` de ahora en más.
Se aplicó la migración `0002_ajustes_app_real.sql` (agrega `nombre_completo`+`empleador` a
`titulares`, `nombre_completo` a `grupo_familiar`, DNI de familiar ahora opcional, y las
políticas RLS de DELETE que faltaban en ambas tablas) para que el esquema real coincida con lo
que la UI ya aprobada necesita. `useTitularesDB.ts` y `useAuth.ts` fueron reescritos para usar
Supabase real (consultas async + `supabase.auth.signInWithPassword`), manteniendo exactamente
la misma interfaz externa — `App.tsx` solo se ajustó para `await` esas llamadas ahora asíncronas.
tsc ✓ build ✓ dev ✓ · verificado en el navegador contra la base real: login con credenciales
inexistentes hace el viaje real a Supabase y devuelve el error esperado. `mock-data.ts` y
`mock-usuarios.ts` ahora solo exportan tipos (sin datos de prueba ni credenciales hardcodeadas).
> Siguiente acción exacta: pedirle al usuario los 4 emails reales (Karina, Yesica, Jorge,
> Marcelo) — todavía no los mandó — para crear las 4 cuentas reales en Supabase Auth + su fila
> en `profiles`, y recién ahí probar el login de punta a punta con una cuenta real.

## Pendiente del usuario (nuevo)
- [ ] Los 4 emails reales del personal (Karina Godoy, Yesica Viladomat, Jorge Daniel Flores,
      Marcelo Torres) — pedidos, todavía no recibidos. Sin esto no se pueden crear las cuentas
      reales de acceso.
- [ ] Contacto real de soporte/sistemas (email o teléfono) para el link "¿Olvidaste tu
      contraseña?" del login — hoy solo dice "contactá al encargado de sistemas" sin datos,
      porque no se puede inventar un contacto real.

## Usuarios reales del sistema (roles)
- **Karina Godoy** y **Yesica Viladomat** — administrativas de mostrador. Rol: `administrativa`.
- **Jorge Daniel Flores** y **Marcelo Torres** — secretario gremial (titular/adjunto). Rol: `supervisor`.
- `administrativa`: buscar por DNI, ver ficha/semáforo/historial, cargar trámites, subir padrón.
- `supervisor`: todo lo anterior + reportes/actividad de la seccional. Gestión de altas/bajas de
  usuarios del sistema: fuera del MVP.
- 4 cuentas, 2 roles, RLS por rol en Supabase (decisión técnica, no se repregunta).

## Qué es esta app (3 líneas máximo)
Sistema interno a medida para la secretaría de OSCONARA Mar del Plata: centraliza afiliados y
grupos familiares, registra el historial inmutable de trámites, y valida el estado de aportes
importando los reportes oficiales de SAAS/SSS. Modelo: contrato a medida + fee mensual fijo.

## Promesa central
"Esta app ayuda a la secretaria de OSCONARA MDP a saber en 3 segundos si un afiliado está al
día y quién es su grupo familiar, sin cruzar datos a mano ni arriesgarse a autorizar un trámite
a alguien dado de baja."

## Reporte de validación (Sesión 1) — ADAPTADO: no es un consumer app de mercado masivo
- Veredicto: Viable — el usuario trajo el documento de validación con avatar/dolores/deseos/
  competidores ya investigados. Desarrollo B2B a medida para UN cliente conocido: no aplica
  arbitraje LATAM ni validación de App Store/Play Store.
- Competencia real: Excel/Sheets (sin auditoría), ERP nacional (lento), portales SAAS/Evweb
  (mucha info irrelevante para el mostrador).
- Diferenciador: única herramienta para el mostrador local que cruza datos de SAAS con una
  interfaz simple de "sí/no puedo atender".

## Dirección de Arte (Sesión 2 — CERRADA, cosa juzgada)
- FICHA-ARTE.md: existe y aprobada. Referencia visual real: 2 logos del usuario (escudo del
  gremio + wordmark OSCONARA) + logo oficial en el header tal cual, sin círculo.
- Fondo #FAF9F6 · azul marino #1B2A52 (primario) · celeste #2A9DBA (secundario/foco) · dorado
  #A98B5D (SOLO detalle/borde — NUNCA texto, error real cometido y corregido en Sesión 3) ·
  Display "Fraunces" · Body "Public Sans" · radio 10px.
- Personalidad: fino · confiable · sereno. Dirección elegida: A "Sello de mostrador".
- REGISTRO ANTI-REPETICIÓN: esta paleta + par tipográfico, vetados para el próximo proyecto del SO.

## Avatar y venta (Sesión 1)
- FICHA-AVATAR.md existe (Marcela/Karina, secretaria de mostrador). Dolor #1: terror de
  autorizar a alguien dado de baja. Deseo #1: DNI → ficha + semáforo al instante.
- Landing/venta: N/A — no hay venta pública, es contrato directo con la comisión directiva.

## Estrategia de monetización (ADAPTADA) y secuencia de construcción (ADAPTADA)
- Contrato de desarrollo a medida + fee mensual — NO Hotmart/paywall/trial consumer.
- Secuencia real: login seguro → app interna (ficha+semáforo+historial) → importador SAAS/SSS →
  seguridad/auditoría → despliegue. Sin landing/onboarding/paywall consumer (N/A justificado).

## Decisiones técnicas (NO re-discutir sin pedirlo el usuario)
- Framework: **Vite + React + TypeScript** (herramienta interna sin SEO).
- Auth: **Supabase Auth con email + contraseña**, sin registro público, 4 cuentas creadas a mano.
  2 roles (`administrativa`, `supervisor`) vía `profiles` + RLS.
- Modelo de datos: `titulares`, `grupo_familiar`, `tramites` (inmutable: solo INSERT),
  `importaciones_padron` (log de archivos SAAS subidos). RLS deny-by-default en todas.
- Loop de retención / Arquitectura de IA: **N/A** — herramienta de trabajo obligatoria, sin IA
  generativa en el MVP (solo cruce/importación de datos estructurados).
- NO construir todavía: integraciones API directas con AFIP/SSS/Evweb (solo archivos exportados).
- Dato sensible (DNI, salud, familia) → Ley 25.326 (Argentina): cifrado + RLS + control de acceso
  desde el día uno.
- Búsquedas recientes (Sesión 3, pedido del usuario): localStorage, máx 5, `useBusquedasRecientes.ts`
  — comodidad de navegador, no dato de negocio (no reemplaza el historial de tramites en DB).
- Carga manual (Sesión 4, PRINCIPAL — el usuario no tiene forma de exportar el padrón todavía):
  `useTitularesDB.ts` permite crear afiliado, editar nombre/empleador, agregar/quitar familiares
  y cambiar estado activo↔baja a mano, con confirmación y toasts. Desde Sesión 6 corre contra
  Supabase real (antes usaba un store en memoria), sin cambiar la forma en que las pantallas lo
  usan. El importador de archivo SAAS/SSS queda PENDIENTE (opcional, para cuando puedan exportar).

## Sesiones completadas ✅
- Sesión 1 — Base y seguridad (2026-07-29): scaffold Vite+React+TS+Tailwind v4, esquema SQL
  completo con RLS, cliente Supabase + env con zod. tsc/build/dev ✓.
- Sesión 2 — Identidad visual (2026-07-29): FICHA-ARTE.md aprobada (Dirección A + logo real),
  tokens en src/index.css, Header.tsx. tsc/build/dev ✓.
- Sesión 3 — Pantalla principal (2026-07-30): buscador de DNI, ficha con sello de estado, grupo
  familiar, historial de trámites, y búsquedas recientes (localStorage, pedido del usuario).
  11 rondas de revisor-visual independiente hasta cerrar el gate: **usabilidad 37/40 · craft
  16/20 · LISTA**. tsc ✓ build ✓ dev ✓. Evidencia: osconara-buscador-375.png.
- Sesión 4 — Carga manual (2026-07-30): crear afiliado, editar sus datos, agregar/quitar
  familiares, cambiar estado activo↔baja a mano (con confirmación y toasts). 3 rondas de
  revisor-visual: **usabilidad 37/40 · craft 17/20 · LISTA**. tsc ✓ build ✓ dev ✓. Evidencia:
  osconara-ficha-editar.png, osconara-editado.png. Importador de archivo SAAS: pendiente/opcional.
- Sesión 5 — Login/acceso (2026-07-30): pantalla de login con validación, bloqueo tras 3
  intentos con cuenta regresiva, mensajes de error. 6 rondas de revisor-visual: **usabilidad
  34/40 · craft 15/20**, el propio revisor recomendó parar de iterar (lo que quedaba era
  pulido menor para una herramienta de 4 usuarios capacitados). tsc ✓ build ✓ dev ✓. En esa
  sesión el login todavía era simulado (mock-usuarios.ts) — reemplazado en Sesión 6.

## Sesión en progreso 🔧
Sesión 6 — Backend real: infraestructura conectada (GitHub/Supabase/Vercel), migración 0002
aplicada, hooks reescritos contra Supabase real. Falta: crear las 4 cuentas reales (esperando
los emails) y probar el flujo completo logueado con datos reales (hoy la base está vacía).

## Próximas sesiones 📋
- Terminar Sesión 6: crear las 4 cuentas reales en Supabase Auth + `profiles` en cuanto lleguen
  los emails, probar login real de punta a punta, cargar el primer afiliado real de prueba.
- Auditoría de seguridad (27) y certificado de integridad (61) antes de dar la app por lista
  para uso diario del personal.
- Opcional (cuando el usuario pueda exportar el padrón): importador de archivo SAAS/SSS.

## Problemas conocidos ⚠️
- Sin internet en la oficina, la app no funciona (no se promete modo offline en el MVP).
- La base de datos real está vacía todavía — no hay afiliados de prueba cargados en Supabase
  (a diferencia de las Sesiones 3-4, que usaban datos semilla en memoria).

## Pendientes del usuario (acciones que el usuario debe hacer)
- [ ] Mandar los 4 emails reales del personal para poder crear sus cuentas de acceso.

## Notas para la próxima sesión
- Proyecto B2B interno a medida, NO consumer SaaS LATAM: módulos de venta masiva del SO
  (Hotmart, landing, paywall, gamificación) no aplican — adaptación consciente y documentada.
- Dato sensible (salud + identidad + familia): seguridad no negociable, ya definida desde Sesión 1.
- El dorado (#A98B5D) es SOLO detalle/borde, nunca texto — error ya cometido una vez en Sesión 3,
  corregido; no repetirlo en pantallas futuras.
