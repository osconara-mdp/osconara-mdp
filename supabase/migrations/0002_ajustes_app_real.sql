-- OSCONARA Seccional MDP — ajustes para que el esquema coincida con la app ya construida
-- y probada en Sesiones 3-4 (nombre completo en un solo campo, empleador, y los permisos de
-- borrado que faltaban). No hay datos reales todavía (proyecto recién creado), así que se
-- ajusta directo sin migración de datos.

-- ============================================================================
-- TITULARES — nombre completo en un solo campo + empleador (la app no separa nombre/apellido)
-- ============================================================================
alter table public.titulares
  add column nombre_completo text,
  add column empleador text;

update public.titulares set nombre_completo = nombre || ' ' || apellido where nombre_completo is null;

alter table public.titulares
  alter column nombre_completo set not null,
  alter column empleador set not null,
  drop column nombre,
  drop column apellido;

-- Permitir borrar un titular cargado por error — el FK `on delete restrict` de tramites ya
-- protege el historial cuando existen trámites; esta política solo habilita el intento.
create policy "titulares_delete_staff" on public.titulares for delete
  using ( private.is_staff() );

-- ============================================================================
-- GRUPO_FAMILIAR — mismo ajuste de nombre + DNI opcional (la app no lo pide al cargar a mano)
-- ============================================================================
alter table public.grupo_familiar
  add column nombre_completo text;

update public.grupo_familiar set nombre_completo = nombre || ' ' || apellido where nombre_completo is null;

alter table public.grupo_familiar
  alter column nombre_completo set not null,
  alter column dni drop not null,
  drop column nombre,
  drop column apellido;

-- Faltaba la política de borrado (la app permite quitar un familiar cargado por error).
create policy "grupo_familiar_delete_staff" on public.grupo_familiar for delete
  using ( private.is_staff() );
