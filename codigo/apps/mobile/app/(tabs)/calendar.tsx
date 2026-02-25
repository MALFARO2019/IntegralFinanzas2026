import { useState } from 'react'
import { ScrollView, View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react-native'
import * as Haptics from 'expo-haptics'
import { Colors, Fonts, Radius, Spacing } from '@/constants/theme'

const MOCK_SUBS = [
    { id: '1', name: 'Netflix', amount: 9900, day: 2 },
    { id: '2', name: 'Spotify', amount: 7900, day: 5 },
    { id: '3', name: 'AWS Hosting', amount: 35000, day: 11 },
    { id: '4', name: 'Adobe CC', amount: 42000, day: 15 },
    { id: '5', name: 'iCloud+', amount: 1900, day: 20 },
]

const fmt = (n: number) => `₡${n.toLocaleString('es-CR')}`
const MONTHS = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
const DAYS_HEADER = ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa']

export default function CalendarScreen() {
    const today = new Date()
    const [month, setMonth] = useState(today.getMonth())
    const [year, setYear] = useState(today.getFullYear())
    const paymentDays = new Set(MOCK_SUBS.map(s => s.day))
    const totalPending = MOCK_SUBS.reduce((s, x) => s + x.amount, 0)

    const navigate = (dir: 1 | -1) => {
        Haptics.selectionAsync()
        const d = new Date(year, month + dir, 1)
        setMonth(d.getMonth())
        setYear(d.getFullYear())
    }

    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const startDay = new Date(year, month, 1).getDay()
    const cells: (number | null)[] = [...Array(startDay).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)]

    return (
        <SafeAreaView style={styles.safe} edges={['top']}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>

                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Calendario</Text>
                    <Text style={styles.headerSub}>Suscripciones y pagos</Text>
                </View>

                {/* Resumen */}
                <View style={[styles.card, styles.mx]}>
                    <Text style={styles.summaryLabel}>Total Próximos Pagos</Text>
                    <Text style={styles.summaryAmount}>{fmt(totalPending)}</Text>
                    <Text style={styles.summaryCount}>{MOCK_SUBS.length} pagos este mes</Text>
                </View>

                {/* Mini Calendario */}
                <View style={[styles.card, styles.mx]}>
                    {/* Nav */}
                    <View style={styles.calNav}>
                        <TouchableOpacity onPress={() => navigate(-1)} style={styles.navBtn}>
                            <ChevronLeft size={20} color={Colors.foregroundMuted} />
                        </TouchableOpacity>
                        <Text style={styles.calMonth}>{MONTHS[month]} {year}</Text>
                        <TouchableOpacity onPress={() => navigate(1)} style={styles.navBtn}>
                            <ChevronRight size={20} color={Colors.foregroundMuted} />
                        </TouchableOpacity>
                    </View>

                    {/* Days header */}
                    <View style={styles.calRow}>
                        {DAYS_HEADER.map(d => (
                            <Text key={d} style={styles.dayHeader}>{d}</Text>
                        ))}
                    </View>

                    {/* Cells */}
                    <View style={styles.calGrid}>
                        {cells.map((day, i) => {
                            const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear()
                            const hasPayment = day !== null && paymentDays.has(day)
                            return (
                                <View key={i} style={styles.calCell}>
                                    {day !== null && (
                                        <>
                                            <View style={[styles.dayCircle, isToday && styles.dayCircleToday]}>
                                                <Text style={[styles.dayNum, isToday && styles.dayNumToday]}>{day}</Text>
                                            </View>
                                            {hasPayment && <View style={[styles.dot, isToday && { backgroundColor: '#C4B5FD' }]} />}
                                        </>
                                    )}
                                </View>
                            )
                        })}
                    </View>
                </View>

                {/* Lista de suscripciones */}
                <View style={styles.mx}>
                    <Text style={styles.listTitle}>Próximos Pagos</Text>
                    <View style={styles.card}>
                        {MOCK_SUBS.map((s, i) => {
                            const daysLeft = s.day - today.getDate()
                            const urgent = daysLeft <= 3 && daysLeft >= 0
                            return (
                                <View key={s.id} style={[styles.subRow, i > 0 && styles.divider]}>
                                    <View style={[styles.dayBadge, urgent && styles.dayBadgeUrgent]}>
                                        <Text style={[styles.dayNum2, urgent && { color: Colors.destructive }]}>
                                            {daysLeft <= 0 ? 'HOY' : daysLeft}
                                        </Text>
                                        {daysLeft > 0 && <Text style={styles.dayLabel}>días</Text>}
                                    </View>
                                    <Text style={styles.subName}>{s.name}</Text>
                                    <Text style={styles.subAmount}>{fmt(s.amount)}</Text>
                                </View>
                            )
                        })}
                    </View>
                </View>

            </ScrollView>

            {/* FAB */}
            <TouchableOpacity
                style={styles.fab}
                onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)}
                activeOpacity={0.85}
            >
                <Plus size={26} color="#fff" />
            </TouchableOpacity>
        </SafeAreaView>
    )
}

const CELL = 44
const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: Colors.background },
    header: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.sm, paddingBottom: Spacing.md },
    headerTitle: { fontSize: Fonts.sizes.xl, fontWeight: Fonts.weights.black, color: Colors.foreground },
    headerSub: { fontSize: Fonts.sizes.xs, color: Colors.foregroundMuted, marginTop: 2 },
    mx: { marginHorizontal: Spacing.lg, marginBottom: Spacing.md },
    card: { backgroundColor: Colors.card, borderRadius: Radius.xl, borderWidth: 1, borderColor: Colors.cardBorder, padding: Spacing.lg },
    summaryLabel: { fontSize: Fonts.sizes.xs, color: Colors.foregroundMuted, fontWeight: Fonts.weights.bold, textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 4 },
    summaryAmount: { fontSize: Fonts.sizes['2xl'], fontWeight: Fonts.weights.black, color: Colors.foreground },
    summaryCount: { fontSize: Fonts.sizes.xs, color: Colors.foregroundMuted, marginTop: 2 },
    calNav: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: Spacing.md },
    navBtn: { padding: 4 },
    calMonth: { fontSize: Fonts.sizes.base, fontWeight: Fonts.weights.bold, color: Colors.foreground },
    calRow: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 6 },
    dayHeader: { width: CELL, textAlign: 'center', fontSize: Fonts.sizes.xs, fontWeight: Fonts.weights.bold, color: Colors.foregroundMuted },
    calGrid: { flexDirection: 'row', flexWrap: 'wrap' },
    calCell: { width: `${100 / 7}%`, alignItems: 'center', height: 48, justifyContent: 'flex-start', paddingTop: 2 },
    dayCircle: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
    dayCircleToday: { backgroundColor: Colors.primary },
    dayNum: { fontSize: Fonts.sizes.sm, color: Colors.foreground },
    dayNumToday: { color: '#fff', fontWeight: Fonts.weights.bold },
    dot: { width: 4, height: 4, borderRadius: 2, backgroundColor: Colors.destructive, marginTop: 2 },
    listTitle: { fontSize: Fonts.sizes.sm, fontWeight: Fonts.weights.bold, color: Colors.foregroundMuted, textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: Spacing.sm },
    subRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, paddingVertical: Spacing.sm },
    divider: { borderTopWidth: 1, borderTopColor: Colors.cardBorder },
    dayBadge: { width: 44, borderRadius: Radius.md, backgroundColor: Colors.surface, alignItems: 'center', paddingVertical: 6 },
    dayBadgeUrgent: { backgroundColor: Colors.destructiveMuted },
    dayNum2: { fontSize: Fonts.sizes.md, fontWeight: Fonts.weights.black, color: Colors.foreground, lineHeight: 20 },
    dayLabel: { fontSize: 8, color: Colors.foregroundMuted, textTransform: 'uppercase' },
    subName: { flex: 1, fontSize: Fonts.sizes.sm, fontWeight: Fonts.weights.semibold, color: Colors.foreground },
    subAmount: { fontSize: Fonts.sizes.sm, fontWeight: Fonts.weights.bold, color: Colors.destructive },
    fab: {
        position: 'absolute', bottom: 24, right: 24, width: 56, height: 56,
        borderRadius: Radius.xl, backgroundColor: Colors.primary,
        alignItems: 'center', justifyContent: 'center',
        shadowColor: Colors.primary, shadowOpacity: 0.5, shadowRadius: 16, elevation: 10,
    },
})
