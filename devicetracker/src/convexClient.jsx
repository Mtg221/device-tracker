import { createClient } from '@supabase/supabase-js'
import { useState, useEffect } from 'react'

// Create a Supabase client instead of Convex client
const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_ANON_KEY)

export function useSupabaseClient() {
  return supabase
}

export function useConvexClient() {
  return useContext(ConvexReactClient.Context);
}