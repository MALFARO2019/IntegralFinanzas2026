import { createClient } from '@supabase/supabase-js'
import AsyncStorage from '@react-native-async-storage/async-storage'

const SUPABASE_URL = 'https://rvsvaptpejrpqifvnibp.supabase.co'
const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ2c3ZhcHRwZWpycHFpZnZuaWJwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE5OTA1NDAsImV4cCI6MjA4NzU2NjU0MH0.-6LMOOdccQVtWEBPuEvap0_vm80Ksy805CPc-5ZjXdU'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON, {
    auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
    },
})
