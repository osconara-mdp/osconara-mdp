-- OSCONARA Seccional MDP — datos de contacto del afiliado + alta real de trámites desde la ficha

alter table public.titulares
  add column email text,
  add column telefono text,
  add column direccion text;

-- La UI ya no distingue "tipo" de trámite (siempre fue un campo sin pantalla propia) — se le
-- da un default para poder cargar el trámite con un solo campo de texto (la descripción).
alter table public.tramites
  alter column tipo set default 'atencion';
