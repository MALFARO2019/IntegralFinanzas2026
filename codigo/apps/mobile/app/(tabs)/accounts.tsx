import { ScrollView, View, Text, TouchableOpacity, StyleSheet, SectionList, Alert } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Banknote, PiggyBank, CreditCard, Landmark, Plus, TrendingUp, TrendingDown } from 'lucide-react-native'
import * as Haptics from 'expo-haptics'
import { Colors, Fonts, Radius, Spacing } from '@/constants/theme'

const ACCOUNTS = [
    { id: '1', name: 'BAC Corriente', type: 'CHECKING', balance: 820000, institution: 'BAC Credomatic' },
    { id: '2', name: 'Scotiabank Ahorros', type: 'SAVINGS', balance: 350000, institution: 'Scotiabank' },
    { id: '3', name: 'Visa BN', type: 'CREDIT', balance: -145000, institution: 'Banco Nacional' },
    { id: '4', name: 'SAFI Popular', type: 'INVEST', balance: 550000, institution: 'BP Fondos' },
]

const SECTIONS = [
    { title: 'Corriente', type: 'CHECKING', Icon: Banknote },
    { title: 'Ahorros', type: 'SAVINGS', Icon: PiggyBank },
    { title: 'Crédito', type: 'CREDIT', Icon: CreditCard },
    { title: 'Inversión', type: 'INVEST', Icon: Landmark },
]

const fmt = (n: number) => `₡${Math.abs(n).toLocaleString('es-CR')}`

export default function AccountsScreen() {
    const net = ACCOUNTS.reduce((s, a) => s + a.balance, 0)
    const assets = ACCOUNTS.filter(a => a.balance > 0).reduce((s, a) => s + a.balance, 0)
    const debt = ACCOUNTS.filter(a => a.balance < 0).reduce((s, a) => s + a.balance, 0)

    const sections = SECTIONS
        .map(s => ({
            ...s,
            data: ACCOUNTS.filter(a => a.type === s.type),
        }))
        .filter(s => s.data.length > 0)

    return (
        <SafeAreaView style={styles.safe} edges={['top']}>
            <SectionList
                sections={sections}
                keyExtractor={a => a.id}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 100 }}
                ListHeaderComponent={() => (
                    <View style={styles.listHeader}>
                        <Text style={styles.headerTitle}>Cuentas</Text>
                        <Text style={styles.headerSub}>{ACCOUNTS.length} cuentas activas</Text>

                        {/* Summary */}
                        <View style={styles.summaryRow}>
                            <View style={[styles.card, { flex: 1 }]}>
                                <Text style={styles.netLabel}>Patrimonio Neto</Text>
                                <Text style={styles.netAmount}>{fmt(net)}</Text>
                            </View>
                        </View>
                        <View style={styles.miniRow}>
                            <View style={[styles.miniCard, { borderColor: Colors.accentMuted }]}>
                                <TrendingUp size={14} color={Colors.accent} />
                                <Text style={styles.miniLabel}>Activos</Text>
                                <Text style={[styles.miniAmt, { color: Colors.accent }]}>{fmt(assets)}</Text>
                            </View>
                            <View style={[styles.miniCard, { borderColor: Colors.destructiveMuted }]}>
                                <TrendingDown size={14} color={Colors.destructive} />
                                <Text style={styles.miniLabel}>Deudas</Text>
                                <Text style={[styles.miniAmt, { color: Colors.destructive }]}>{fmt(Math.abs(debt))}</Text>
                            </View>
                        </View>
                    </View>
                )}
                renderSectionHeader={({ section: { title, Icon, data } }) => {
                    const total = data.reduce((s, a) => s + a.balance, 0)
                    return (
                        <View style={styles.sectionHeader}>
                            <View style={styles.sectionLeft}>
                                <Icon size={14} color={Colors.foregroundMuted} />
                                <Text style={styles.sectionTitle}>{title.toUpperCase()}</Text>
                            </View>
                            <Text style={[styles.sectionTotal, total < 0 && { color: Colors.destructive }]}>{total < 0 ? '-' : ''}{fmt(total)}</Text>
                        </View>
                    )
                }}
                renderItem={({ item: a }) => (
                    <View style={styles.accountRow}>
                        <View style={styles.avatar}>
                            <Text style={styles.avatarText}>{a.name.substring(0, 2).toUpperCase()}</Text>
                        </View>
                        <View style={styles.accountInfo}>
                            <Text style={styles.accountName}>{a.name}</Text>
                            <Text style={styles.accountInst}>{a.institution}</Text>
                        </View>
                        <Text style={[styles.accountBalance, a.balance < 0 && { color: Colors.destructive }]}>
                            {a.balance < 0 ? '-' : ''}{fmt(a.balance)}
                        </Text>
                    </View>
                )}
            />

            <TouchableOpacity
                style={styles.fab}
                onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
                    Alert.alert('Nueva Cuenta', 'Próximamente.')
                }}
                activeOpacity={0.85}
            >
                <Plus size={26} color="#fff" />
            </TouchableOpacity>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: Colors.background },
    listHeader: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.sm },
    headerTitle: { fontSize: Fonts.sizes.xl, fontWeight: Fonts.weights.black, color: Colors.foreground },
    headerSub: { fontSize: Fonts.sizes.xs, color: Colors.foregroundMuted, marginTop: 2, marginBottom: Spacing.md },
    summaryRow: { marginBottom: Spacing.sm },
    card: { backgroundColor: Colors.card, borderRadius: Radius.xl, borderWidth: 1, borderColor: Colors.cardBorder, padding: Spacing.lg },
    netLabel: { fontSize: Fonts.sizes.xs, color: Colors.foregroundMuted, fontWeight: Fonts.weights.bold, textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 4 },
    netAmount: { fontSize: Fonts.sizes['2xl'], fontWeight: Fonts.weights.black, color: Colors.foreground },
    miniRow: { flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.lg },
    miniCard: { flex: 1, backgroundColor: Colors.card, borderRadius: Radius.xl, borderWidth: 1, padding: Spacing.md, gap: 4 },
    miniLabel: { fontSize: Fonts.sizes.xs, color: Colors.foregroundMuted, fontWeight: Fonts.weights.semibold },
    miniAmt: { fontSize: Fonts.sizes.sm, fontWeight: Fonts.weights.bold },
    sectionHeader: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        paddingHorizontal: Spacing.lg, paddingVertical: Spacing.sm, marginTop: Spacing.sm,
    },
    sectionLeft: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    sectionTitle: { fontSize: Fonts.sizes.xs, fontWeight: Fonts.weights.bold, color: Colors.foregroundMuted, letterSpacing: 0.5 },
    sectionTotal: { fontSize: Fonts.sizes.xs, fontWeight: Fonts.weights.bold, color: Colors.foregroundMuted },
    accountRow: {
        flexDirection: 'row', alignItems: 'center', gap: Spacing.md,
        backgroundColor: Colors.card, borderRadius: Radius.xl,
        borderWidth: 1, borderColor: Colors.cardBorder,
        marginHorizontal: Spacing.lg, marginBottom: 6,
        paddingHorizontal: Spacing.md, paddingVertical: Spacing.md,
    },
    avatar: {
        width: 42, height: 42, borderRadius: Radius.md,
        backgroundColor: Colors.surface, alignItems: 'center', justifyContent: 'center',
    },
    avatarText: { fontSize: Fonts.sizes.xs, fontWeight: Fonts.weights.black, color: Colors.primary },
    accountInfo: { flex: 1 },
    accountName: { fontSize: Fonts.sizes.sm, fontWeight: Fonts.weights.semibold, color: Colors.foreground },
    accountInst: { fontSize: Fonts.sizes.xs, color: Colors.foregroundMuted, marginTop: 2 },
    accountBalance: { fontSize: Fonts.sizes.sm, fontWeight: Fonts.weights.bold, color: Colors.foreground },
    fab: {
        position: 'absolute', bottom: 24, right: 24, width: 56, height: 56,
        borderRadius: Radius.xl, backgroundColor: Colors.primary,
        alignItems: 'center', justifyContent: 'center',
        shadowColor: Colors.primary, shadowOpacity: 0.5, shadowRadius: 16, elevation: 10,
    },
})
