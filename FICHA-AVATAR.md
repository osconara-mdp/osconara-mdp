# FICHA DE AVATAR — OSCONARA Seccional MDP

## Usuarios reales (roles del sistema)
- **Karina Godoy** — empleada administrativa de mostrador. Es "Marcela" del brief original: la
  usuaria principal, la que vive el dolor del día a día. Rol: `administrativa`.
- **Yesica Viladomat** — empleada administrativa de mostrador. Mismo rol y mismo dolor que
  Karina. Rol: `administrativa`.
- **Jorge Daniel Flores** — secretario gremial. Rol: `supervisor`. Usa la app para ver reportes
  y el historial completo de la seccional, no atiende el mostrador día a día.
- **Marcelo Torres** — secretario gremial adjunto. Mismo rol que Jorge. Rol: `supervisor`.

## El avatar (cliente ideal — UNA persona concreta)
- Nombre/arquetipo: Karina Godoy (rol administrativa) · Edad: ~45 · Situación: Empleada administrativa / recepción de mostrador · País: Argentina (Mar del Plata)
- Poder adquisitivo: N/A — no es ella quien paga, la app la paga la seccional (contrato B2B directo con la comisión directiva/delegado)
- Dispositivo: PC de escritorio en el mostrador, conexión de oficina (no es mobile-first como un consumer app)
- IDENTIDAD (cómo se describe a sí mismo, literal): "Soy la que pone la cara en el mostrador cuando el sistema de la central se cuelga"
- MOMENTO DEL DÍA en que el problema duele (escena): 8:00 AM, fila de afiliados (marineros y familias) esperando autorización, teléfono sonando, carpetas físicas + 3 planillas Excel abiertas
- Ya intentó: armar "súper planillas" de Excel → las abandonó porque se corrompen, no auditan quién hizo qué y no cruzan bajas automáticamente
- Dónde pasa tiempo online: N/A — no aplica adquisición digital, el canal es venta directa a la comisión directiva

## El problema urgente y diario (escena, no categoría)
- Problema: pierde horas cruzando a mano el padrón de Excel contra los reportes de altas/bajas de SAAS/AFIP, con terror constante de autorizar una práctica cara a alguien que ya no tiene cobertura
- Test de urgencia: ¿le pasó esta semana? SÍ · ¿le costó tiempo/estrés esta semana? SÍ (horas por día + reclamos de auditoría) · ¿ya intentó resolverlo? SÍ (Excel, ERP nacional, portal SAAS/Evweb directo)
- COSTO DE LA INACCIÓN: por día pierde horas cruzando datos a ojo · el riesgo real es autorizar una prestación a un afiliado dado de baja (costo económico + sanción/auditoría de la central) · costo emocional: termina la jornada "con la cabeza quemada", sin certeza de no haberse equivocado

## Dolores que no lo dejan dormir
1. ★ "Tengo terror de autorizarle una cobertura a un tipo sin aportes y que me coman la cabeza desde auditoría"
2. "Pierdo 15 minutos por persona buscando si el chico que traen es realmente el hijo del titular"
3. "Si se me corrompe el Excel de padrones de este mes, se paraliza la seccional entera"
4. "Me da terror que nos auditen y vean los DNI y diagnósticos en un Excel suelto que cualquiera se roba en un pendrive"
5. (identidad) "Entra un reemplazo al mostrador y hace cagadas porque no entiende cómo cruzo yo los datos a ojo" — teme ser el punto único de falla, irreemplazable por caos, no por valor

## Deseos que lo mueven
1. ★ "Quiero poner el DNI y que salte la ficha completa del titular y su familia de una sola vez, sin hacer 20 clics"
2. "Sueño con un cartel gigante que me diga 'ACTIVO' o 'DADO DE BAJA' sin tener que pensar"
3. "Quiero subir el archivo de SAAS y que el sistema actualice solo quién aporta y quién no en segundos"
4. "Necesito un sistema a prueba de balas que ande rápido con 10 personas en la sala de espera"
5. (identidad) "Quiero irme a mi casa a las 17:00 sabiendo que no dejé ninguna bomba armada por un error de carga manual" — se convierte en la secretaria que tiene el control, no la que sufre el caos

## Voice of customer (frases literales del PDF de validación)
- "Me vino rechazado por falta de aportes" · "Saltó en SAAS que lo dieron de baja de AFIP"
- "¿Me pasás el DNI del titular para buscar a tu pibe?" · "Tengo que cruzar los datos a mano"
- "Se nos colgó el sistema de la central, vas a tener que esperar" · "Es un bardo encontrar la ficha vieja de esta familia"

## Consciencia y sofisticación
- Nivel de consciencia dominante: Consciencia de Solución (sabe exactamente qué necesita — automatizar el cruce de datos — pero no encuentra quién se lo construya a medida)
- Etapa de sofisticación: N/A — no hay mercado competitivo de anuncios; el "ángulo" se usa para convencer a la comisión directiva, no a Marcela directamente
- Nota: esta ficha reemplaza su función de venta-consumer por función de "brief de producto" — no habrá landing pública ni paywall (ver ESTADO.md, sección de secuencia adaptada)

## Objeciones reales
1. "¿Me vas a hacer cargar a los miles de afiliados a mano de vuelta?" → respuesta: la carga inicial se hace importando el padrón existente en Excel/CSV, no a mano → vive en: onboarding de setup inicial
2. "¿Qué pasa si subo el archivo de SAAS mal y le doy de baja a toda la seccional?" → respuesta: el importador muestra una vista previa de los cambios (altas/bajas detectadas) antes de confirmar, y nunca borra el historial de trámites anterior → vive en: módulo de importación
3. "¿Si se cae el internet, me quedo ciega en el mostrador?" → respuesta: se avisa como riesgo real (app requiere conexión); se documenta como limitación conocida, no se promete offline en el MVP → vive en: ESTADO.md (problemas conocidos)
4. "Seguro es otro sistema complejo armado por ingenieros que nunca atendieron un mostrador" → respuesta: pantalla única con buscador de DNI como acción principal, sin módulos de facturación/contabilidad que no usa → vive en: diseño de la pantalla principal
5. "¿Es seguro tener la base de nuestros afiliados en la nube?" → respuesta: cifrado + acceso por usuario y contraseña única + backups automáticos diarios inaccesibles para el usuario final → vive en: seguridad (09/26/27)

## Lenguaje (léxico real de mostrador, usar en toda la UI)
- Palabras que la app SIEMPRE debe usar: "aportes al día" / "dado de baja" / "grupo familiar" / "titular" / "padrón" / "trámite"
- Prohibidas (corporativas/genéricas): "dashboard", "workflow", "onboarding", "stakeholder" — usar "pantalla principal", "primeros pasos", "encargados"
- Ancla emocional: caos de cruzar datos a ojo (dolor #1) → certeza instantánea del semáforo verde/rojo (deseo #1)

## Cierre
- ¿Hubo entrevistas del 44?: NO — el brief ya viene de investigación previa del propio usuario (documento PDF de validación entregado)
- Fecha de cierre: 2026-07-29 · Aprobada por el usuario: PENDIENTE (a confirmar en esta sesión)
