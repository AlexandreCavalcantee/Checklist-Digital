// @ts-nocheck
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env['NEXT_PUBLIC_SUPABASE_URL'] || ''
const supabaseAnonKey = process.env['NEXT_PUBLIC_SUPABASE_ANON_KEY'] || ''
const supabaseServiceKey = process.env['SUPABASE_SERVICE_ROLE_KEY'] || supabaseAnonKey

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("Atenção: Variáveis do Supabase não encontradas no .env.local")
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)