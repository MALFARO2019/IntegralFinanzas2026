import { useEffect, useState } from 'react'
import { Stack, useRouter, useSegments } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { View, ActivityIndicator } from 'react-native'
import { supabase } from '@/lib/supabase'
import { getUserHousehold } from '@/lib/data'
import type { Session } from '@supabase/supabase-js'
import { Colors } from '@/constants/theme'

export const unstable_settings = {
  anchor: '(tabs)',
}

export default function RootLayout() {
  const [session, setSession] = useState<Session | null>(null)
  const [hasHousehold, setHasHousehold] = useState<boolean | null>(null)
  const [ready, setReady] = useState(false)
  const router = useRouter()
  const segments = useSegments()

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session)
      if (session) {
        // Verificar si el usuario ya tiene un Household configurado
        const household = await getUserHousehold()
        setHasHousehold(!!household?.householdId)
      } else {
        setHasHousehold(false)
      }
      setReady(true)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session)
      if (session) {
        const household = await getUserHousehold()
        setHasHousehold(!!household?.householdId)
      } else {
        setHasHousehold(false)
      }
    })
    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (!ready || hasHousehold === null) return

    const inAuth = segments[0] === '(auth)'
    const inOnboarding = segments[1] === 'onboarding'

    if (!session) {
      // Sin sesión → Login
      if (!inAuth) router.replace('/(auth)/login')
    } else if (!hasHousehold && !inOnboarding) {
      // Con sesión pero sin Household → Onboarding
      router.replace('/(auth)/onboarding')
    } else if (session && hasHousehold && inAuth) {
      // Con sesión y Household → Dashboard
      router.replace('/(tabs)')
    }
  }, [session, ready, hasHousehold, segments])

  if (!ready) {
    return (
      <View style={{ flex: 1, backgroundColor: Colors.background, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator color={Colors.primary} />
      </View>
    )
  }

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
      </Stack>
      <StatusBar style="light" backgroundColor={Colors.background} />
    </>
  )
}
