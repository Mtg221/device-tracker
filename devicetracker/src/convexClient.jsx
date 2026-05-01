import { createClient } from '@supabase/supabase-js'
import { createContext, useContext } from 'react'

// Create a Supabase client
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)

export function useSupabase() {
  return supabase
}

export const SupabaseContext = createContext()

export function SupabaseProvider({ children }) {
  const supabase = useSupabase()
  return (
    <SupabaseContext.Provider value={supabase}>
      {children}
    </SupabaseContext.Provider>
  )
}