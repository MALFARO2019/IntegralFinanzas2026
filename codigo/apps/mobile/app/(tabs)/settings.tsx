import { ScrollView, View, Text, TouchableOpacity, Switch, StyleSheet, Alert } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Moon, Sun, Globe, DollarSign, Bell, Shield, ChevronRight, LogOut } from 'lucide-react-native'
import { useState } from 'react'
import * as Haptics from 'expo-haptics'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'expo-router'
import { Colors, Fonts, Radius, Spacing } from '@/constants/theme'

export default function SettingsScreen() {
    const router = useRouter()
    const [darkMode, setDarkMode] = useState(true)
    const [currency, setCurrency] = useState<'CRC' | 'USD' | 'EUR'>('CRC')
    const [lang, setLang] = useState<'es' | 'en'>('es')

    const toggleDark = (v: boolean) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
        setDarkMode(v)
    }

    const handleLogout = () => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning)
        Alert.alert(
            'Cerrar Sesión',
            '¿Estás seguro que deseas salir?',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Cerrar Sesión',
                    style: 'destructive',
                    onPress: async () => {
                        await supabase.auth.signOut()
                        router.replace('/(auth)/login')
                    },
                },
            ]
        )
    }

    return (
        <SafeAreaView style={styles.safe} edges={['top']}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

                <Text style={styles.headerTitle}>Ajustes</Text>
                <Text style={styles.headerSub}>Personaliza tu experiencia</Text>

                {/* Apariencia */}
                <Text style={styles.sectionLabel}>APARIENCIA</Text>
                <View style={styles.card}>
                    <View style={styles.row}>
                        <View style={styles.rowLeft}>
                            {darkMode ? <Moon size={18} color={Colors.primary} /> : <Sun size={18} color={Colors.warning} />}
                            <View>
                                <Text style={styles.rowTitle}>Tema Visual</Text>
                                <Text style={styles.rowSub}>{darkMode ? 'Modo oscuro' : 'Modo claro'}</Text>
                            </View>
                        </View>
                        <Switch value={darkMode} onValueChange={toggleDark} trackColor={{ true: Colors.primary, false: Colors.surface }} thumbColor="#fff" />
                    </View>
                </View>

                {/* Moneda */}
                <Text style={styles.sectionLabel}>PREFERENCIAS</Text>
                <View style={styles.card}>
                    <View style={[styles.row, styles.divider]}>
                        <View style={styles.rowLeft}>
                            <DollarSign size={18} color={Colors.accent} />
                            <View>
                                <Text style={styles.rowTitle}>Moneda</Text>
                                <Text style={styles.rowSub}>Formato de montos</Text>
                            </View>
                        </View>
                        <View style={styles.chips}>
                            {(['CRC', 'USD', 'EUR'] as const).map(c => (
                                <TouchableOpacity
                                    key={c}
                                    style={[styles.chip, currency === c && styles.chipActive]}
                                    onPress={() => { Haptics.selectionAsync(); setCurrency(c) }}
                                >
                                    <Text style={[styles.chipText, currency === c && styles.chipTextActive]}>{c}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    <View style={styles.row}>
                        <View style={styles.rowLeft}>
                            <Globe size={18} color={Colors.primary} />
                            <View>
                                <Text style={styles.rowTitle}>Idioma</Text>
                                <Text style={styles.rowSub}>Fechas y formato numérico</Text>
                            </View>
                        </View>
                        <View style={styles.chips}>
                            {(['es', 'en'] as const).map(l => (
                                <TouchableOpacity
                                    key={l}
                                    style={[styles.chip, lang === l && styles.chipActive]}
                                    onPress={() => { Haptics.selectionAsync(); setLang(l) }}
                                >
                                    <Text style={[styles.chipText, lang === l && styles.chipTextActive]}>{l.toUpperCase()}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                </View>

                {/* Sistema */}
                <Text style={styles.sectionLabel}>SISTEMA</Text>
                <View style={styles.card}>
                    {[
                        { icon: Bell, label: 'Notificaciones', sub: 'Alertas de pagos próximos' },
                        { icon: Shield, label: 'Privacidad', sub: 'Gestión de tu cuenta' },
                    ].map(({ icon: Icon, label, sub }, i) => (
                        <TouchableOpacity key={label} style={[styles.row, i > 0 && styles.divider]} activeOpacity={0.7}>
                            <View style={styles.rowLeft}>
                                <Icon size={18} color={Colors.foregroundMuted} />
                                <View>
                                    <Text style={styles.rowTitle}>{label}</Text>
                                    <Text style={styles.rowSub}>{sub}</Text>
                                </View>
                            </View>
                            <ChevronRight size={16} color={Colors.foregroundMuted} />
                        </TouchableOpacity>
                    ))}
                </View>

                {/* App info */}
                <View style={[styles.card, styles.infoCard]}>
                    <Text style={styles.appTitle}><Text style={{ color: Colors.primary }}>Integral</Text> Finanzas</Text>
                    <Text style={styles.appVersion}>v0.1.0 — MVP 2026</Text>
                </View>

                {/* Logout */}
                <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout} activeOpacity={0.85}>
                    <LogOut size={18} color={Colors.destructive} />
                    <Text style={styles.logoutText}>Cerrar Sesión</Text>
                </TouchableOpacity>

            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: Colors.background },
    scroll: { padding: Spacing.lg, paddingBottom: 100 },
    headerTitle: { fontSize: Fonts.sizes.xl, fontWeight: Fonts.weights.black, color: Colors.foreground },
    headerSub: { fontSize: Fonts.sizes.xs, color: Colors.foregroundMuted, marginTop: 2, marginBottom: Spacing.lg },
    sectionLabel: { fontSize: Fonts.sizes.xs, fontWeight: Fonts.weights.bold, color: Colors.foregroundMuted, letterSpacing: 0.8, marginBottom: Spacing.sm, marginTop: Spacing.md },
    card: { backgroundColor: Colors.card, borderRadius: Radius.xl, borderWidth: 1, borderColor: Colors.cardBorder, overflow: 'hidden' },
    row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Spacing.lg, paddingVertical: 14 },
    divider: { borderTopWidth: 1, borderTopColor: Colors.cardBorder },
    rowLeft: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, flex: 1 },
    rowTitle: { fontSize: Fonts.sizes.sm, fontWeight: Fonts.weights.semibold, color: Colors.foreground },
    rowSub: { fontSize: Fonts.sizes.xs, color: Colors.foregroundMuted, marginTop: 2 },
    chips: { flexDirection: 'row', gap: 6 },
    chip: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: Radius.full, backgroundColor: Colors.surface },
    chipActive: { backgroundColor: Colors.primary },
    chipText: { fontSize: Fonts.sizes.xs, fontWeight: Fonts.weights.bold, color: Colors.foregroundMuted },
    chipTextActive: { color: '#fff' },
    infoCard: { alignItems: 'center', padding: Spacing.lg, marginTop: Spacing.md },
    appTitle: { fontSize: Fonts.sizes.lg, fontWeight: Fonts.weights.black, color: Colors.foreground },
    appVersion: { fontSize: Fonts.sizes.xs, color: Colors.foregroundMuted, marginTop: 4 },
    logoutBtn: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.sm,
        backgroundColor: Colors.destructiveMuted, borderRadius: Radius.xl,
        borderWidth: 1, borderColor: `${Colors.destructive}25`,
        paddingVertical: 16, marginTop: Spacing.md,
    },
    logoutText: { fontSize: Fonts.sizes.sm, fontWeight: Fonts.weights.bold, color: Colors.destructive },
})
