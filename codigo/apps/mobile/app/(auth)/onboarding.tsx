import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Alert, ActivityIndicator } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useState } from 'react'
import { useRouter } from 'expo-router'
import * as Haptics from 'expo-haptics'
import { supabase } from '@/lib/supabase'
import { Colors, Fonts, Radius, Spacing } from '@/constants/theme'
import { Home, Landmark, ArrowRight, CheckCircle } from 'lucide-react-native'
// UUID v4 inline — sin dependencias externas
const randomUUID = () => 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = Math.random() * 16 | 0
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16)
})

const CURRENCIES = ['CRC', 'USD', 'EUR'] as const
const ACCOUNT_TYPES = [
    { value: 'CHECKING', label: 'Corriente', emoji: '🏦' },
    { value: 'SAVINGS', label: 'Ahorros', emoji: '💰' },
    { value: 'CREDIT', label: 'Crédito', emoji: '💳' },
    { value: 'INVEST', label: 'Inversión', emoji: '📈' },
]

export default function OnboardingScreen() {
    const router = useRouter()
    const [step, setStep] = useState<0 | 1 | 2>(0)
    const [loading, setLoading] = useState(false)

    // Paso 0: Hogar
    const [hhName, setHhName] = useState('Mi Hogar Financiero')
    const [hhCurrency, setHhCurrency] = useState<'CRC' | 'USD' | 'EUR'>('CRC')
    const [householdId, setHouseholdId] = useState<string | null>(null)

    // Paso 1: Cuenta
    const [accName, setAccName] = useState('')
    const [accType, setAccType] = useState('CHECKING')
    const [accInst, setAccInst] = useState('')
    const [accBalance, setAccBalance] = useState('0')
    const [accCurrency, setAccCurrency] = useState<'CRC' | 'USD' | 'EUR'>('CRC')

    const createHousehold = async () => {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const hid = randomUUID()
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
        setLoading(true)
        try {
            await supabase.from('Household').insert({
                id: hid, name: hhName, ownerUserId: user.id,
                baseCurrency: hhCurrency, planTier: 'FREE', status: 'ACTIVE',
                createdAt: new Date().toISOString(),
            })
            await supabase.from('HouseholdMember').insert({
                id: randomUUID(), householdId: hid, userId: user.id,
                role: 'OWNER', status: 'ACTIVE', joinedAt: new Date().toISOString(),
            })
            await supabase.from('User').upsert({
                id: user.id, email: user.email,
                name: user.user_metadata?.full_name ?? user.email?.split('@')[0],
                locale: 'es-CR', timezone: 'America/Costa_Rica',
                status: 'ACTIVE', createdAt: new Date().toISOString(), lastLoginAt: new Date().toISOString(),
            }, { onConflict: 'id' })
            setHouseholdId(hid)
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
            setStep(1)
        } catch (e) {
            Alert.alert('Error', 'No se pudo crear el Hogar. Intenta de nuevo.')
        } finally {
            setLoading(false)
        }
    }

    const createAccount = async () => {
        if (!householdId || !accName.trim()) return
        setLoading(true)
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
        try {
            await supabase.from('Account').insert({
                id: randomUUID(), householdId,
                name: accName.trim(), type: accType,
                institution: accInst.trim(), currencyCode: accCurrency,
                openingBalance: parseFloat(accBalance) || 0,
                status: 'ACTIVE', includeInBudget: true, includeInNetWorth: true,
            })
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
            setStep(2)
        } catch (e) {
            Alert.alert('Error', 'No se pudo crear la cuenta. Intenta de nuevo.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <SafeAreaView style={styles.safe} edges={['top']}>
            <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

                {/* Brand */}
                <View style={styles.brand}>
                    <Text style={{ fontSize: 36, marginBottom: 8 }}>📈</Text>
                    <Text style={styles.title}><Text style={{ color: Colors.primary }}>Integral</Text> Finanzas</Text>
                    <Text style={styles.subtitle}>Configura tu perfil financiero</Text>
                </View>

                {/* Progreso */}
                <View style={styles.progress}>
                    {['Hogar', 'Cuenta', '¡Listo!'].map((s, i) => (
                        <View key={s} style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <View style={[styles.step, i < step ? styles.stepDone : i === step ? styles.stepActive : styles.stepInactive]}>
                                {i < step
                                    ? <CheckCircle size={14} color="#fff" />
                                    : <Text style={{ color: i === step ? '#fff' : Colors.foregroundMuted, fontSize: 11, fontWeight: '700' }}>{i + 1}</Text>
                                }
                            </View>
                            {i < 2 && <View style={[styles.connector, i < step && { backgroundColor: Colors.accent }]} />}
                        </View>
                    ))}
                </View>

                {/* Paso 0 */}
                {step === 0 && (
                    <View style={styles.card}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                            <Home size={18} color={Colors.primary} />
                            <Text style={styles.cardTitle}>Tu Hogar Financiero</Text>
                        </View>
                        <Text style={styles.cardSub}>Espacio donde viven tus cuentas y transacciones.</Text>

                        <Text style={styles.label}>NOMBRE</Text>
                        <TextInput style={styles.input} value={hhName} onChangeText={setHhName} placeholderTextColor={Colors.foregroundSubtle} />

                        <Text style={styles.label}>MONEDA BASE</Text>
                        <View style={{ flexDirection: 'row', gap: 8, marginBottom: Spacing.lg }}>
                            {CURRENCIES.map(c => (
                                <TouchableOpacity key={c} style={[styles.chip, hhCurrency === c && styles.chipActive]} onPress={() => setHhCurrency(c)} activeOpacity={0.8}>
                                    <Text style={[styles.chipText, hhCurrency === c && { color: '#fff' }]}>{c}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        <TouchableOpacity style={styles.btn} onPress={createHousehold} disabled={loading} activeOpacity={0.85}>
                            {loading ? <ActivityIndicator color="#fff" /> : <>
                                <Text style={styles.btnText}>Continuar</Text>
                                <ArrowRight size={16} color="#fff" />
                            </>}
                        </TouchableOpacity>
                    </View>
                )}

                {/* Paso 1 */}
                {step === 1 && (
                    <View style={styles.card}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                            <Landmark size={18} color={Colors.primary} />
                            <Text style={styles.cardTitle}>Primera Cuenta</Text>
                        </View>
                        <Text style={styles.cardSub}>Agrega tu cuenta bancaria principal.</Text>

                        <Text style={styles.label}>TIPO</Text>
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: Spacing.md }}>
                            {ACCOUNT_TYPES.map(t => (
                                <TouchableOpacity key={t.value} style={[styles.typeChip, accType === t.value && styles.typeChipActive]} onPress={() => setAccType(t.value)} activeOpacity={0.8}>
                                    <Text style={{ fontSize: 18 }}>{t.emoji}</Text>
                                    <Text style={[styles.chipText, accType === t.value && { color: '#fff' }]}>{t.label}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        <Text style={styles.label}>NOMBRE</Text>
                        <TextInput style={styles.input} value={accName} onChangeText={setAccName} placeholder="Ej: BAC Corriente" placeholderTextColor={Colors.foregroundSubtle} />

                        <Text style={styles.label}>INSTITUCIÓN</Text>
                        <TextInput style={styles.input} value={accInst} onChangeText={setAccInst} placeholder="Ej: BAC Credomatic" placeholderTextColor={Colors.foregroundSubtle} />

                        <View style={{ flexDirection: 'row', gap: 12, marginBottom: Spacing['2xl'] }}>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.label}>MONEDA</Text>
                                <View style={{ flexDirection: 'row', gap: 4 }}>
                                    {CURRENCIES.map(c => (
                                        <TouchableOpacity key={c} style={[styles.chip, { flex: 1 }, accCurrency === c && styles.chipActive]} onPress={() => setAccCurrency(c)}>
                                            <Text style={[styles.chipText, accCurrency === c && { color: '#fff' }]}>{c}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.label}>SALDO INICIAL</Text>
                                <TextInput style={styles.input} value={accBalance} onChangeText={setAccBalance} keyboardType="decimal-pad" placeholderTextColor={Colors.foregroundSubtle} />
                            </View>
                        </View>

                        <View style={{ flexDirection: 'row', gap: 12 }}>
                            <TouchableOpacity style={[styles.btn, { flex: 1, backgroundColor: Colors.surface }]} onPress={() => setStep(2)} activeOpacity={0.8}>
                                <Text style={[styles.btnText, { color: Colors.foregroundMuted }]}>Omitir</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.btn, { flex: 1 }]} onPress={createAccount} disabled={loading || !accName.trim()} activeOpacity={0.85}>
                                {loading ? <ActivityIndicator color="#fff" /> : <>
                                    <Text style={styles.btnText}>Agregar</Text>
                                    <ArrowRight size={16} color="#fff" />
                                </>}
                            </TouchableOpacity>
                        </View>
                    </View>
                )}

                {/* Paso 2 */}
                {step === 2 && (
                    <View style={[styles.card, { alignItems: 'center', paddingVertical: Spacing['3xl'] }]}>
                        <Text style={{ fontSize: 52, marginBottom: Spacing.md }}>🎉</Text>
                        <Text style={[styles.cardTitle, { fontSize: 22, marginBottom: 8 }]}>¡Todo listo!</Text>
                        <Text style={[styles.cardSub, { textAlign: 'center', marginBottom: Spacing['2xl'] }]}>
                            Tu perfil financiero está configurado. ¡Empieza a trackear tus finanzas!
                        </Text>
                        <TouchableOpacity style={styles.btn} onPress={() => {
                            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
                            router.replace('/(tabs)')
                        }} activeOpacity={0.85}>
                            <Text style={styles.btnText}>Ir al Dashboard</Text>
                            <ArrowRight size={16} color="#fff" />
                        </TouchableOpacity>
                    </View>
                )}

            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: Colors.background },
    scroll: { flexGrow: 1, padding: Spacing.xl, paddingBottom: 40 },
    brand: { alignItems: 'center', marginBottom: Spacing['2xl'] },
    title: { fontSize: Fonts.sizes['2xl'], fontWeight: Fonts.weights.black, color: Colors.foreground },
    subtitle: { fontSize: Fonts.sizes.xs, color: Colors.foregroundMuted, marginTop: 4 },
    progress: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: Spacing['2xl'] },
    step: { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
    stepActive: { backgroundColor: Colors.primary },
    stepDone: { backgroundColor: Colors.accent },
    stepInactive: { backgroundColor: Colors.surface },
    connector: { width: 32, height: 2, backgroundColor: Colors.cardBorder, marginHorizontal: 4 },
    card: { backgroundColor: Colors.card, borderRadius: Radius['2xl'], borderWidth: 1, borderColor: Colors.cardBorder, padding: Spacing.xl },
    cardTitle: { fontSize: Fonts.sizes.lg, fontWeight: Fonts.weights.bold, color: Colors.foreground },
    cardSub: { fontSize: Fonts.sizes.xs, color: Colors.foregroundMuted, marginBottom: Spacing.lg },
    label: { fontSize: Fonts.sizes.xs, fontWeight: Fonts.weights.bold, color: Colors.foregroundMuted, letterSpacing: 0.8, marginBottom: 6 },
    input: {
        backgroundColor: Colors.surface, borderRadius: Radius.lg, borderWidth: 1, borderColor: Colors.cardBorder,
        paddingHorizontal: Spacing.md, paddingVertical: 13, fontSize: Fonts.sizes.sm, color: Colors.foreground, marginBottom: Spacing.md,
    },
    chip: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 10, borderRadius: Radius.lg, backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.cardBorder },
    chipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
    chipText: { fontSize: Fonts.sizes.xs, fontWeight: Fonts.weights.bold, color: Colors.foregroundMuted },
    typeChip: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 10, borderRadius: Radius.lg, backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.cardBorder },
    typeChipActive: { backgroundColor: Colors.primaryMuted, borderColor: Colors.primary },
    btn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: Colors.primary, borderRadius: Radius.xl, paddingVertical: 14, shadowColor: Colors.primary, shadowOpacity: 0.3, shadowRadius: 10, elevation: 5 },
    btnText: { fontSize: Fonts.sizes.sm, fontWeight: Fonts.weights.bold, color: '#fff' },
})
