import { useState } from 'react'
import {
    View, Text, TextInput, TouchableOpacity, StyleSheet,
    KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator, Alert
} from 'react-native'
import { useRouter } from 'expo-router'
import * as Haptics from 'expo-haptics'
import { supabase } from '@/lib/supabase'
import { Colors, Fonts, Radius, Spacing } from '@/constants/theme'

export default function LoginScreen() {
    const router = useRouter()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)

    const handleLogin = async () => {
        if (!email || !password) return
        setLoading(true)
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        setLoading(false)
        if (error) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)
            Alert.alert('Error al iniciar sesión', 'Verifica tu email y contraseña.')
        } else {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
            // La redirección la maneja el root layout
        }
    }

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView
                contentContainerStyle={styles.scroll}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                {/* Brand */}
                <View style={styles.brand}>
                    <View style={styles.logoBox}>
                        <Text style={styles.logoIcon}>📈</Text>
                    </View>
                    <Text style={styles.title}>
                        <Text style={{ color: Colors.primary }}>Integral</Text> Finanzas
                    </Text>
                    <Text style={styles.subtitle}>Tu control financiero personal</Text>
                </View>

                {/* Card */}
                <View style={styles.card}>
                    <Text style={styles.formTitle}>Iniciar Sesión</Text>

                    <View style={styles.field}>
                        <Text style={styles.label}>EMAIL</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="tu@email.com"
                            placeholderTextColor={Colors.foregroundSubtle}
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            autoComplete="email"
                            returnKeyType="next"
                        />
                    </View>

                    <View style={styles.field}>
                        <Text style={styles.label}>CONTRASEÑA</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Mínimo 8 caracteres"
                            placeholderTextColor={Colors.foregroundSubtle}
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                            returnKeyType="done"
                            onSubmitEditing={handleLogin}
                        />
                    </View>

                    <TouchableOpacity
                        style={[styles.btn, (!email || !password) && styles.btnDisabled]}
                        onPress={handleLogin}
                        disabled={loading || !email || !password}
                        activeOpacity={0.85}
                    >
                        {loading
                            ? <ActivityIndicator color="#fff" />
                            : <Text style={styles.btnText}>Iniciar Sesión</Text>
                        }
                    </TouchableOpacity>
                </View>

                {/* Registro */}
                <View style={styles.footer}>
                    <Text style={styles.footerText}>¿No tienes cuenta? </Text>
                    <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
                        <Text style={styles.footerLink}>Regístrate gratis</Text>
                    </TouchableOpacity>
                </View>

            </ScrollView>
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.background },
    scroll: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: Spacing.xl,
    },
    brand: { alignItems: 'center', marginBottom: Spacing['3xl'] },
    logoBox: {
        width: 60, height: 60,
        borderRadius: Radius.xl,
        backgroundColor: Colors.primaryMuted,
        alignItems: 'center', justifyContent: 'center',
        marginBottom: Spacing.md,
    },
    logoIcon: { fontSize: 28 },
    title: {
        fontSize: Fonts.sizes['2xl'],
        fontWeight: Fonts.weights.black,
        color: Colors.foreground,
        letterSpacing: -0.5,
    },
    subtitle: {
        fontSize: Fonts.sizes.sm,
        color: Colors.foregroundMuted,
        marginTop: 4,
    },
    card: {
        backgroundColor: Colors.card,
        borderRadius: Radius['2xl'],
        borderWidth: 1,
        borderColor: Colors.cardBorder,
        padding: Spacing.xl,
        marginBottom: Spacing.lg,
    },
    formTitle: {
        fontSize: Fonts.sizes.lg,
        fontWeight: Fonts.weights.bold,
        color: Colors.foreground,
        marginBottom: Spacing.lg,
    },
    field: { marginBottom: Spacing.md },
    label: {
        fontSize: Fonts.sizes.xs,
        fontWeight: Fonts.weights.bold,
        color: Colors.foregroundMuted,
        letterSpacing: 0.8,
        marginBottom: 6,
    },
    input: {
        backgroundColor: Colors.surface,
        borderRadius: Radius.lg,
        borderWidth: 1,
        borderColor: Colors.cardBorder,
        paddingHorizontal: Spacing.md,
        paddingVertical: 14,
        fontSize: Fonts.sizes.base,
        color: Colors.foreground,
    },
    btn: {
        backgroundColor: Colors.primary,
        borderRadius: Radius.xl,
        paddingVertical: 16,
        alignItems: 'center',
        marginTop: Spacing.sm,
        shadowColor: Colors.primary,
        shadowOpacity: 0.35,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 6 },
        elevation: 6,
    },
    btnDisabled: { opacity: 0.45 },
    btnText: {
        color: '#fff',
        fontWeight: Fonts.weights.bold,
        fontSize: Fonts.sizes.base,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: Spacing.sm,
    },
    footerText: { color: Colors.foregroundMuted, fontSize: Fonts.sizes.sm },
    footerLink: {
        color: Colors.primary,
        fontWeight: Fonts.weights.bold,
        fontSize: Fonts.sizes.sm,
    },
})
