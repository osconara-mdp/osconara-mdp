-- OSCONARA Seccional MDP — esquema inicial
-- Equipo de 4 cuentas conocidas (2 administrativas + 2 supervisores), sin registro público.
-- Todas las tablas: RLS activo, deny-by-default, solo personal autenticado de la seccional.

create schema if not exists private;

-- ============================================================================
-- PROFILES — 1 fila por usuario de auth.users, con su rol
-- ============================================================================
create table public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  full_name   text not null,
  role        text not null check (role in ('administrativa', 'supervisor')),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create or replace function private.set_updated_at() returns trigger
language plpgsql as $$
begin new.updated_at = now(); return new; end; $$;

create trigger profiles_set_updated_at before update on public.profiles
  for each row execute function private.set_updated_at();

-- Helper: ¿el usuario actual tiene un perfil válido? (cualquier fila autenticada del equipo)
create or replace function private.is_staff() returns boolean
language sql security definer set search_path = '' stable
as $$
  select exists (select 1 from public.profiles where id = (select auth.uid()));
$$;
revoke execute on function private.is_staff() from anon;

alter table public.profiles enable row level security;

create policy "profiles_select_own" on public.profiles for select
  using ( (select auth.uid()) = id );

-- ============================================================================
-- TITULARES — el afiliado principal
-- ============================================================================
create table public.titulares (
  id                  uuid primary key default gen_random_uuid(),
  dni                 text not null unique check (dni ~ '^[0-9]{7,8}$'),
  nombre              text not null,
  apellido            text not null,
  estado_aportes      text not null default 'desconocido'
                        check (estado_aportes in ('activo', 'inactivo', 'desconocido')),
  fecha_ultimo_cruce   timestamptz,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

create index titulares_dni_idx on public.titulares(dni);
create index titulares_estado_idx on public.titulares(estado_aportes);

create trigger titulares_set_updated_at before update on public.titulares
  for each row execute function private.set_updated_at();

alter table public.titulares enable row level security;

create policy "titulares_select_staff" on public.titulares for select
  using ( private.is_staff() );
create policy "titulares_insert_staff" on public.titulares for insert
  with check ( private.is_staff() );
create policy "titulares_update_staff" on public.titulares for update
  using ( private.is_staff() ) with check ( private.is_staff() );
-- Sin policy de delete: un titular no se borra, solo cambia de estado (histórico).

-- ============================================================================
-- GRUPO_FAMILIAR — personas a cargo de un titular
-- ============================================================================
create table public.grupo_familiar (
  id            uuid primary key default gen_random_uuid(),
  titular_id    uuid not null references public.titulares(id) on delete cascade,
  dni           text not null check (dni ~ '^[0-9]{7,8}$'),
  nombre        text not null,
  apellido      text not null,
  parentesco    text not null check (parentesco in ('conyuge', 'hijo', 'hija', 'otro')),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index grupo_familiar_titular_idx on public.grupo_familiar(titular_id);
create index grupo_familiar_dni_idx on public.grupo_familiar(dni);

create trigger grupo_familiar_set_updated_at before update on public.grupo_familiar
  for each row execute function private.set_updated_at();

alter table public.grupo_familiar enable row level security;

create policy "grupo_familiar_select_staff" on public.grupo_familiar for select
  using ( private.is_staff() );
create policy "grupo_familiar_insert_staff" on public.grupo_familiar for insert
  with check ( private.is_staff() );
create policy "grupo_familiar_update_staff" on public.grupo_familiar for update
  using ( private.is_staff() ) with check ( private.is_staff() );

-- ============================================================================
-- TRAMITES — historial INMUTABLE (solo INSERT, nunca UPDATE/DELETE)
-- ============================================================================
create table public.tramites (
  id            uuid primary key default gen_random_uuid(),
  titular_id    uuid not null references public.titulares(id) on delete restrict,
  usuario_id    uuid not null references public.profiles(id),
  tipo          text not null,
  descripcion   text not null check (length(descripcion) between 1 and 500),
  created_at    timestamptz not null default now()
  -- sin updated_at a propósito: este registro no se edita, es historial.
);

create index tramites_titular_created_idx on public.tramites (titular_id, created_at desc);
create index tramites_usuario_idx on public.tramites(usuario_id);

alter table public.tramites enable row level security;

create policy "tramites_select_staff" on public.tramites for select
  using ( private.is_staff() );
create policy "tramites_insert_staff" on public.tramites for insert
  with check ( private.is_staff() and usuario_id = (select auth.uid()) );
-- Sin policy de update/delete: nadie puede modificar ni borrar un trámite ya cargado (Regla 5 del PDF de validación).

-- ============================================================================
-- IMPORTACIONES_PADRON — log de cada archivo SAAS/SSS subido
-- ============================================================================
create table public.importaciones_padron (
  id                  uuid primary key default gen_random_uuid(),
  usuario_id          uuid not null references public.profiles(id),
  nombre_archivo      text not null,
  cantidad_altas      integer not null default 0 check (cantidad_altas >= 0),
  cantidad_bajas      integer not null default 0 check (cantidad_bajas >= 0),
  cantidad_sin_cambio integer not null default 0 check (cantidad_sin_cambio >= 0),
  estado              text not null default 'procesando'
                        check (estado in ('procesando', 'completado', 'error')),
  detalle_error       text,
  created_at          timestamptz not null default now()
);

create index importaciones_padron_usuario_idx on public.importaciones_padron(usuario_id);
create index importaciones_padron_created_idx on public.importaciones_padron(created_at desc);

alter table public.importaciones_padron enable row level security;

create policy "importaciones_select_staff" on public.importaciones_padron for select
  using ( private.is_staff() );
create policy "importaciones_insert_staff" on public.importaciones_padron for insert
  with check ( private.is_staff() and usuario_id = (select auth.uid()) );
create policy "importaciones_update_staff" on public.importaciones_padron for update
  using ( private.is_staff() ) with check ( private.is_staff() );
-- Update permitido solo para que el propio importador marque 'completado'/'error' al terminar
-- el procesamiento asincrónico del archivo (no para editar los números a mano).
