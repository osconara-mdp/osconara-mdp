# FICHA DE DIRECCIÓN DE ARTE — OSCONARA Seccional MDP

## Referencia del usuario (CONTRATO — ver 16, protocolo obligatorio)
- ¿Hay imagen(es) de referencia del usuario?: SÍ → 2 logos (escudo del gremio de Conductores
  Navales, en dorado/bronce y azul marino; wordmark "OSCONARA" de la obra social, en celeste-
  turquesa) + instrucción explícita: "armonía en celestes, dorados y azul, identidad fina
  distinguida y agradable". Es REFERENCIA-MANDATO de PALETA + logo, no de layout de UI (son
  logos, no una pantalla de app) — la paleta y el mood MANDAN; radio/sombras/layout se derivan
  con criterio profesional porque la imagen no los dicta.
- Extracción (mirada directamente en las dos imágenes):
  - Modo: claro (oficina de mostrador, uso todo el día, legibilidad bajo luz — y los logos viven
    sobre fondo blanco/crema en ambos casos)
  - Fondo: #FAF9F6 (crema cálido, no blanco puro) · Superficie: #FFFFFE
  - Texto 1º: #1B2A45 (casi-negro con tinte azul, tomado del azul marino del escudo, oscurecido
    para texto) · Texto 2º: #5B6472
  - Acento(s): **Azul marino #1B2A52** (del círculo del escudo del gremio — color institucional
    primario: header, nav, botón principal) · **Celeste/turquesa #2A9DBA** (del wordmark de la
    obra social, ajustado un poco más oscuro que el logo para cumplir contraste AA sobre blanco —
    acento de estado activo/foco/links) · **Dorado/bronce #A98B5D** (del sunburst del escudo —
    SOLO detalle: líneas divisorias, bordes de acento, iconografía distintiva; nunca como color
    de texto por su bajo contraste)
  - Display: geométrica de trazo fino, con carácter institucional pero no fría — candidatas:
    Fraunces (display, un toque editorial/distinguido) / Public Sans / Sora
  - Body: sans neutra muy legible en pantallas de mostrador — candidatas: Public Sans / Inter
    (DESCARTADA por regla anti-IA) / **Public Sans** (elegida)
  - Radio: 10px (moderado — ni cuadrado corporativo frío, ni redondeado consumer)
  - Espaciado: medio (base 16-24px)
  - Sombras: sutiles (elevación suave, fondo claro → la sombra hace el trabajo de profundidad)
  - Bordes: hairline 1px al 8-10% de opacidad, combinados con sombra sutil
  - Textura/gradiente: ninguno agresivo — como mucho un degradé tonal muy sutil del celeste en
    el header, ecoando el swirl del logo de la obra social
  - Layout: no dictado por la referencia (son logos, no pantallas) — se deriva por dominio:
    patrón "buscador protagonista + card de resultado" (natural para un CRM de mostrador)
  - Detalle firma a replicar: el escudo circular del gremio (anillo dorado con sol) como motivo
    de "sello oficial" — usarlo como marca de autenticidad del semáforo/estado, nunca como
    decoración vacía
  - Logo oficial real de la obra social (provisto por el usuario, NO generado):
    `public/brand/logo-obra-social.png` — ícono en espiral celeste/azul con corazón dorado y
    pulso. Va SIEMPRE como imagen tal cual, al lado del texto "OSCONARA · Seccional Mar del
    Plata" en el header — SIN encerrarlo en un círculo ni reemplazarlo por un emblema propio
    (corrección explícita del usuario sobre el placeholder de la Dirección A)
- Prohibiciones anti-IA que la referencia LEVANTA: ninguna — la paleta pedida (azul marino +
  celeste + dorado, modo claro) ya es anti-genérica por sí misma (nada de dark+neón+glow)

## Personalidad compilada
- 3 adjetivos: fino · confiable · sereno (pedido explícito del usuario: "fina, distinguida y
  agradable visualmente" — nada de urgencia agresiva pese a ser una herramienta de mostrador)
- Compilación: sin spring exagerado (nada de rebote infantil) · duración base 220ms ·
  exclamaciones/celebraciones: NO aplica (no es consumer app) · radio tendencial 10px

## Brand kit final (provisional — se confirma con el protocolo A/B/C antes de fijar en globals.css)
- Fondo: #FAF9F6 · Superficie: #FFFFFE · Hundido: #F2EFE8 · Texto 1º/2º: #1B2A45 / #5B6472
- Acento primario: #1B2A52 (azul marino, institucional) · Acento secundario: #2A9DBA (celeste,
  estado/foco) · Detalle: #A98B5D (dorado, SOLO adornos/bordes/iconos, nunca texto)
- Semánticos: éxito/activo #1E8E5A · error/dado de baja #C0392B · aviso #B8860B (ámbar, evita
  chocar con el dorado de marca)
- Display: Fraunces (peso 500-600) · Body: Public Sans (400/500/600) · Escala: display 28-32px /
  title 18-20px / body 15-16px / label 12-13px
- Radio: 10px · Profundidad: sombras suaves de 3 niveles (base/elevado/hundido) · Espaciado:
  escala 4·8·12·16·24·32·48·64
- Dispositivo ownable: el "sello" circular (anillo dorado, eco del escudo) para marcar el
  semáforo activo/inactivo
- Logo del header: `public/brand/logo-obra-social.png` tal cual (sin círculo ni contenedor
  propio), junto al texto "OSCONARA · Seccional Mar del Plata"
- Motion signature: ease-out 200-300ms, sin rebote — transiciones firmes y calmas, no juguetonas

## Trazabilidad y vetos
- Protocolo A/B/C: presentado — `direcciones-abc.html` (raíz del proyecto) — 3 interpretaciones
  fieles a la misma paleta/mood: A "Sello de mostrador", B "Ficha carnet", C "Panel de comando".
  **Elegida: A ("Sello de mostrador")**, con ajuste del usuario: el logo real de la obra social
  reemplaza el emblema-placeholder, sin círculo contenedor, junto al texto del wordmark.
- Paleta derivada de: referencia del usuario (2 logos de OSCONARA/gremio)
- Registro anti-repetición: azul marino + celeste + dorado + Fraunces/Public Sans quedan
  vetados para el próximo proyecto del SO (se anota en ESTADO.md al cerrar)
- Modo (claro) DERIVADO por: contexto de uso (oficina, mostrador, legibilidad) + los logos de
  referencia viven sobre fondo claro

## Idioma UI: Español (Argentina) · Fecha de cierre: 2026-07-29 · Aprobada por el usuario: SÍ (Dirección A + logo real)
