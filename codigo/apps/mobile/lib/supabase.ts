import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { Platform } from 'react-native'

const SUPABASE_URL = 'https://rvsvaptpejrpqifvnibp.supabase.co'
const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ2c3ZhcHRwZWpycHFpZnZuaWJwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE5OTA1NDAsImV4cCI6MjA4NzU2NjU0MH0.-6LMOOdccQVtWEBPuEvap0_vm80Ksy805CPc-5ZjXdU'

/**
 * Inicialización LAZY del cliente Supabase para Expo.
 *
 * Por qué lazy: AsyncStorage requiere que el módulo nativo esté completamente
 * montado antes de ser utilizado. Si creamos el cliente al nivel "import",
 * el módulo nativo puede no estar listo aún (especialmente en el arrange inicial
 * de la app o en Expo Web).
 *
 * Solución: crear el cliente la primera vez que se llama a `supabase` (getter).
 */
let _client: SupabaseClient | null = null

function getClient(): SupabaseClient {
    if (_client) return _client

    // Elegir el storage según la plataforma
    let storage: any

    if (Platform.OS === 'web') {
        // En Expo Web usamos localStorage del browser
        storage = typeof window !== 'undefined' ? window.localStorage : undefined
    } else {
        // En iOS/Android usamos AsyncStorage (debe estar montado en este punto)
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const { default: AsyncStorage } = require('@react-native-async-storage/async-storage')
        storage = AsyncStorage
    }

    _client = createClient(SUPABASE_URL, SUPABASE_ANON, {
        auth: {
            storage,
            autoRefreshToken: true,
            persistSession: true,
            detectSessionInUrl: false,
        },
    })

    return _client
}

// Proxy que se comporta exactamente como el cliente, pero lo instancia lazy
export const supabase = new Proxy({} as SupabaseClient, {
    get(_target, prop) {
        return (getClient() as any)[prop]
    },
})
