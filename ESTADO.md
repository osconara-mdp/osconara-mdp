# ESTADO — OSCONARA Seccional MDP
Última actualización: 2026-07-30 | Sesión actual: 5 (pausada para decisión del usuario)

⏸️ CHECKPOINT — Sesión 5 (login), 6 rondas de revisor-visual: usabilidad 27→30→30→34→29→(pendiente
7ma lectura) · craft 12→13→15→15→14→(pendiente). El propio revisor recomendó en la ronda 6 PARAR
de iterar: los defectos que quedan son o bien ya corregidos (recién arreglados: contradicción
visual al bloquear el borrado de un afiliado con trámites, texto de bloqueo sin salida) o rozan
"pulir por pulir" para una herramienta interna de 4 usuarios capacitados (atajos de teclado,
conteo animado sin dato que contar). Funciona todo lo importante: login, error de credenciales,
bloqueo con cuenta regresiva tras 3 intentos, header con usuario/rol, eliminar afiliado (con la
misma restricción `on delete restrict` que tendrá la base de datos real). tsc ✓ build ✓ dev ✓.
Login SIMULADO (`useAuth.ts` + `mock-usuarios.ts`) — se reemplaza por Supabase Auth real en Sesión 6.
> Siguiente acción exacta: presentarle al usuario el estado real (funcional, con el detalle de qué
> quedó pendiente y por qué no se sigue iterando) y esperar su decisión: dar por cerrada la Sesión
> 5 y pasar a Sesión 6, o pedir alguna corrección puntual más.

## Pendiente del usuario (nuevo)
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
  `useTitularesDB.ts` (store en memoria, useRef) permite crear afiliado, editar nombre/empleador,
  agregar/quitar familiares y cambiar estado activo↔baja a mano, con confirmación y toasts. Se
  reemplaza por Supabase real en Sesión 6, sin cambiar la forma en que las pantallas lo usan.
  El importador de archivo SAAS/SSS queda PENDIENTE (opcional, para cuando puedan exportar).

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

## Sesión en progreso 🔧
(ninguna — pendiente el OK del usuario para arrancar Sesión 5)

## Próximas sesiones 📋
- Sesión 5: Login/acceso seguro para los 4 usuarios.
- Sesión 6: Conexión real a Supabase (aplicar migración 0001), Vercel, certificado de seguridad.
- Opcional (cuando el usuario pueda exportar el padrón): importador de archivo SAAS/SSS.

## Problemas conocidos ⚠️
- Sin internet en la oficina, la app no funciona (no se promete modo offline en el MVP).

## Pendientes del usuario (acciones que el usuario debe hacer)
- [ ] Ninguna acción pendiente ahora mismo — se avisará cuando haga falta crear cuentas de
      Supabase/Vercel (Sesión 6).

## Notas para la próxima sesión
- Proyecto B2B interno a medida, NO consumer SaaS LATAM: módulos de venta masiva del SO
  (Hotmart, landing, paywall, gamificación) no aplican — adaptación consciente y documentada.
- Dato sensible (salud + identidad + familia): seguridad no negociable, ya definida desde Sesión 1.
- El dorado (#A98B5D) es SOLO detalle/borde, nunca texto — error ya cometido una vez en Sesión 3,
  corregido; no repetirlo en pantallas futuras.
