import { createClient } from '@supabase/supabase-js'
import { env } from '@/lib/env'

// Cliente de navegador — usa la publishable key (pública por diseño, protegida por RLS).
// No hay clave secreta en este archivo ni en ningún archivo que se sirva al navegador.
export const supabase = createClient(
  env.VITE_SUPABASE_URL,
  env.VITE_SUPABASE_PUBLISHABLE_KEY,
)
