import { useState } from 'react'
import {
    View, Text, TextInput, TouchableOpacity, StyleSheet,
    KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator, Alert
} from 'react-native'
import { useRouter } from 'expo-router'
import * as Haptics from 'expo-haptics'
import { supabase } from '@/lib/supabase'
import { Colors, Fonts, Radius, Spacing } from '@/constants/theme'

export default function RegisterScreen() {
    const router = useRouter()
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirm, setConfirm] = useState('')
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)

    const handleRegister = async () => {
        if (password !== confirm) {
            Alert.alert('Error', 'Las contraseñas no coinciden.')
            return
        }
        if (password.length < 8) {
            Alert.alert('Error', 'La contraseña debe tener al menos 8 caracteres.')
            return
        }
        setLoading(true)
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: { data: { full_name: name } },
        })
        setLoading(false)
        if (error) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)
            Alert.alert('Error', error.message)
        } else {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
            setSuccess(true)
        }
    }

    if (success) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center', padding: Spacing.xl }]}>
                <Text style={{ fontSize: 48, marginBottom: Spacing.lg }}>✅</Text>
                <Text style={[styles.formTitle, { textAlign: 'center' }]}>¡Cuenta creada!</Text>
                <Text style={[styles.subtitle, { textAlign: 'center', marginBottom: Spacing['2xl'] }]}>
                    Revisa tu email para confirmar tu cuenta antes de iniciar sesión.
                </Text>
                <TouchableOpacity style={styles.btn} onPress={() => router.replace('/(auth)/login')}>
                    <Text style={styles.btnText}>Ir al Login</Text>
                </TouchableOpacity>
            </View>
        )
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
                        <Text style={{ fontSize: 28 }}>📈</Text>
                    </View>
                    <Text style={styles.title}>
                        <Text style={{ color: Colors.primary }}>Integral</Text> Finanzas
                    </Text>
                    <Text style={styles.subtitle}>Crea tu cuenta gratuita</Text>
                </View>

                <View style={styles.card}>
                    <Text style={styles.formTitle}>Crear Cuenta</Text>

                    {[
                        { label: 'NOMBRE', value: name, set: setName, placeholder: 'Tu nombre completo', type: 'default' as const },
                        { label: 'EMAIL', value: email, set: setEmail, placeholder: 'tu@email.com', type: 'email-address' as const },
                    ].map(f => (
                        <View key={f.label} style={styles.field}>
                            <Text style={styles.label}>{f.label}</Text>
                            <TextInput
                                style={styles.input}
                                placeholder={f.placeholder}
                                placeholderTextColor={Colors.foregroundSubtle}
                                value={f.value}
                                onChangeText={f.set}
                                keyboardType={f.type}
                                autoCapitalize="none"
                            />
                        </View>
                    ))}

                    <View style={styles.field}>
                        <Text style={styles.label}>CONTRASEÑA</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Mínimo 8 caracteres"
                            placeholderTextColor={Colors.foregroundSubtle}
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                        />
                    </View>

                    <View style={styles.field}>
                        <Text style={styles.label}>CONFIRMAR CONTRASEÑA</Text>
                        <TextInput
                            style={[styles.input, confirm && confirm !== password && { borderColor: Colors.destructive }]}
                            placeholder="Repite tu contraseña"
                            placeholderTextColor={Colors.foregroundSubtle}
                            value={confirm}
                            onChangeText={setConfirm}
                            secureTextEntry
                        />
                    </View>

                    <TouchableOpacity
                        style={[styles.btn, (!name || !email || !password) && styles.btnDisabled]}
                        onPress={handleRegister}
                        disabled={loading || !name || !email || !password}
                        activeOpacity={0.85}
                    >
                        {loading
                            ? <ActivityIndicator color="#fff" />
                            : <Text style={styles.btnText}>🚀 Crear Cuenta Gratis</Text>
                        }
                    </TouchableOpacity>
                </View>

                <View style={styles.footer}>
                    <Text style={styles.footerText}>¿Ya tienes cuenta? </Text>
                    <TouchableOpacity onPress={() => router.back()}>
                        <Text style={styles.footerLink}>Iniciar Sesión</Text>
                    </TouchableOpacity>
                </View>

            </ScrollView>
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.background },
    scroll: { flexGrow: 1, justifyContent: 'center', padding: Spacing.xl },
    brand: { alignItems: 'center', marginBottom: Spacing['3xl'] },
    logoBox: {
        width: 60, height: 60, borderRadius: Radius.xl,
        backgroundColor: Colors.primaryMuted,
        alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.md,
    },
    title: { fontSize: Fonts.sizes['2xl'], fontWeight: Fonts.weights.black, color: Colors.foreground },
    subtitle: { fontSize: Fonts.sizes.sm, color: Colors.foregroundMuted, marginTop: 4 },
    card: {
        backgroundColor: Colors.card, borderRadius: Radius['2xl'],
        borderWidth: 1, borderColor: Colors.cardBorder, padding: Spacing.xl, marginBottom: Spacing.lg,
    },
    formTitle: { fontSize: Fonts.sizes.lg, fontWeight: Fonts.weights.bold, color: Colors.foreground, marginBottom: Spacing.lg },
    field: { marginBottom: Spacing.md },
    label: { fontSize: Fonts.sizes.xs, fontWeight: Fonts.weights.bold, color: Colors.foregroundMuted, letterSpacing: 0.8, marginBottom: 6 },
    input: {
        backgroundColor: Colors.surface, borderRadius: Radius.lg,
        borderWidth: 1, borderColor: Colors.cardBorder,
        paddingHorizontal: Spacing.md, paddingVertical: 14,
        fontSize: Fonts.sizes.base, color: Colors.foreground,
    },
    btn: {
        backgroundColor: Colors.primary, borderRadius: Radius.xl, paddingVertical: 16,
        alignItems: 'center', marginTop: Spacing.sm,
        shadowColor: Colors.primary, shadowOpacity: 0.35, shadowRadius: 12, elevation: 6,
    },
    btnDisabled: { opacity: 0.45 },
    btnText: { color: '#fff', fontWeight: Fonts.weights.bold, fontSize: Fonts.sizes.base },
    footer: { flexDirection: 'row', justifyContent: 'center', marginTop: Spacing.sm },
    footerText: { color: Colors.foregroundMuted, fontSize: Fonts.sizes.sm },
    footerLink: { color: Colors.primary, fontWeight: Fonts.weights.bold, fontSize: Fonts.sizes.sm },
})
