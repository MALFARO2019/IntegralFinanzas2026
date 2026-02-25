import { useState, useMemo } from 'react'
import {
    SectionList, View, Text, TextInput, TouchableOpacity, StyleSheet, Alert
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Search, Plus, TrendingDown, TrendingUp, ArrowLeftRight } from 'lucide-react-native'
import * as Haptics from 'expo-haptics'
import { Colors, Fonts, Radius, Spacing } from '@/constants/theme'

const MOCK_TXN = [
    { id: '1', payee: 'Supermercado Buen Precio', amount: 45000, direction: 'OUTFLOW', date: '2026-02-25', category: 'Alimentación' },
    { id: '2', payee: 'Salario Enero 2026', amount: 850000, direction: 'INFLOW', date: '2026-02-24', category: 'Ingresos' },
    { id: '3', payee: 'Netflix', amount: 9900, direction: 'OUTFLOW', date: '2026-02-24', category: 'Suscripciones' },
    { id: '4', payee: 'Gasolina Shell', amount: 22000, direction: 'OUTFLOW', date: '2026-02-22', category: 'Transporte' },
    { id: '5', payee: 'Transferencia a Ahorros', amount: 100000, direction: 'TRANSFER', date: '2026-02-21', category: 'Transferencia' },
]

const fmt = (n: number) => `₡${n.toLocaleString('es-CR')}`
const groupByDate = (txns: typeof MOCK_TXN) => {
    const map = new Map<string, typeof MOCK_TXN>()
    txns.forEach(t => { if (!map.has(t.date)) map.set(t.date, []); map.get(t.date)!.push(t) })
    return Array.from(map.entries()).map(([date, data]) => ({ title: date, data }))
}

export default function TransactionsScreen() {
    const [search, setSearch] = useState('')

    const filtered = useMemo(() =>
        MOCK_TXN.filter(t => t.payee.toLowerCase().includes(search.toLowerCase()))
        , [search])

    const sections = groupByDate(filtered)

    const handleFAB = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
        Alert.alert('Nueva Transacción', 'Modal de agregar próximamente.')
    }

    return (
        <SafeAreaView style={styles.safe} edges={['top']}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Movimientos</Text>
                <Text style={styles.headerSub}>{filtered.length} transacciones</Text>
            </View>

            {/* Search */}
            <View style={styles.searchRow}>
                <Search size={16} color={Colors.foregroundMuted} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Buscar transacción..."
                    placeholderTextColor={Colors.foregroundSubtle}
                    value={search}
                    onChangeText={setSearch}
                />
            </View>

            {/* Lista */}
            <SectionList
                sections={sections}
                keyExtractor={t => t.id}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 100, paddingHorizontal: Spacing.md }}
                renderSectionHeader={({ section: { title, data } }) => {
                    const balance = data.reduce((s, t) =>
                        s + (t.direction === 'INFLOW' ? t.amount : t.direction === 'OUTFLOW' ? -t.amount : 0), 0)
                    return (
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>{new Date(title).toLocaleDateString('es-CR', { weekday: 'short', day: 'numeric', month: 'short' })}</Text>
                            <Text style={[styles.sectionBalance, { color: balance >= 0 ? Colors.accent : Colors.destructive }]}>
                                {balance >= 0 ? '+' : ''}{fmt(balance)}
                            </Text>
                        </View>
                    )
                }}
                renderItem={({ item: t }) => {
                    const isIn = t.direction === 'INFLOW'
                    const isTr = t.direction === 'TRANSFER'
                    const Icon = isIn ? TrendingUp : isTr ? ArrowLeftRight : TrendingDown
                    const iconColor = isIn ? Colors.accent : isTr ? Colors.foregroundMuted : Colors.destructive
                    return (
                        <View style={styles.txnRow}>
                            <View style={[styles.txnIcon, { backgroundColor: isIn ? Colors.accentMuted : isTr ? Colors.surface : Colors.destructiveMuted }]}>
                                <Icon size={18} color={iconColor} />
                            </View>
                            <View style={styles.txnInfo}>
                                <Text style={styles.txnPayee} numberOfLines={1}>{t.payee}</Text>
                                <Text style={styles.txnCategory}>{t.category}</Text>
                            </View>
                            <Text style={[styles.txnAmount, { color: isIn ? Colors.accent : isTr ? Colors.foregroundMuted : Colors.destructive }]}>
                                {isIn ? '+' : isTr ? '' : '-'}{fmt(t.amount)}
                            </Text>
                        </View>
                    )
                }}
            />

            {/* FAB */}
            <TouchableOpacity style={styles.fab} onPress={handleFAB} activeOpacity={0.85}>
                <Plus size={26} color="#fff" />
            </TouchableOpacity>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: Colors.background },
    header: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.sm, paddingBottom: Spacing.md },
    headerTitle: { fontSize: Fonts.sizes.xl, fontWeight: Fonts.weights.black, color: Colors.foreground },
    headerSub: { fontSize: Fonts.sizes.xs, color: Colors.foregroundMuted, marginTop: 2 },
    searchRow: {
        flexDirection: 'row', alignItems: 'center', gap: Spacing.sm,
        backgroundColor: Colors.surface, marginHorizontal: Spacing.lg,
        borderRadius: Radius.xl, paddingHorizontal: Spacing.md, paddingVertical: 12,
        marginBottom: Spacing.sm, borderWidth: 1, borderColor: Colors.cardBorder,
    },
    searchInput: { flex: 1, fontSize: Fonts.sizes.sm, color: Colors.foreground },
    sectionHeader: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        paddingVertical: Spacing.sm, paddingHorizontal: Spacing.sm, marginTop: Spacing.sm,
    },
    sectionTitle: { fontSize: Fonts.sizes.xs, fontWeight: Fonts.weights.bold, color: Colors.foregroundMuted, textTransform: 'uppercase', letterSpacing: 0.5 },
    sectionBalance: { fontSize: Fonts.sizes.xs, fontWeight: Fonts.weights.bold },
    txnRow: {
        flexDirection: 'row', alignItems: 'center', gap: Spacing.md,
        backgroundColor: Colors.card, borderRadius: Radius.xl,
        borderWidth: 1, borderColor: Colors.cardBorder,
        paddingHorizontal: Spacing.md, paddingVertical: Spacing.md, marginBottom: 6,
    },
    txnIcon: { width: 42, height: 42, borderRadius: Radius.md, alignItems: 'center', justifyContent: 'center' },
    txnInfo: { flex: 1 },
    txnPayee: { fontSize: Fonts.sizes.sm, fontWeight: Fonts.weights.semibold, color: Colors.foreground },
    txnCategory: { fontSize: Fonts.sizes.xs, color: Colors.foregroundMuted, marginTop: 2 },
    txnAmount: { fontSize: Fonts.sizes.sm, fontWeight: Fonts.weights.bold },
    fab: {
        position: 'absolute', bottom: 24, right: 24, width: 56, height: 56,
        borderRadius: Radius.xl, backgroundColor: Colors.primary,
        alignItems: 'center', justifyContent: 'center',
        shadowColor: Colors.primary, shadowOpacity: 0.5, shadowRadius: 16, elevation: 10,
    },
})
