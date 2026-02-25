import { ScrollView, View, Text, TouchableOpacity, StyleSheet, Dimensions, ActivityIndicator } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { LinearGradient } from 'expo-linear-gradient'
import { TrendingUp, ArrowUpCircle, ArrowDownCircle, Bell, ChevronRight } from 'lucide-react-native'
import { Colors, Fonts, Radius, Spacing } from '@/constants/theme'
import { useDashboardData } from '@/lib/hooks'
import { useRouter } from 'expo-router'

const { width } = Dimensions.get('window')
const fmt = (n: number) => `₡${Math.abs(n).toLocaleString('es-CR')}`

export default function DashboardScreen() {
  const router = useRouter()
  const { accounts, netWorth, assets, debt, recentTxns, loading } = useDashboardData()

  // Calcular Spending Plan del mes actual desde transacciones reales
  const hoy = new Date()
  const esMes = (d: string) => {
    const dt = new Date(d)
    return dt.getMonth() === hoy.getMonth() && dt.getFullYear() === hoy.getFullYear()
  }
  const mesIngresos = recentTxns
    .filter(t => (t as any).direction === 'INFLOW' && esMes(t.txnDate as string))
    .reduce((s, t) => s + (t.amount ?? 0), 0)
  const mesGastos = recentTxns
    .filter(t => (t as any).direction === 'OUTFLOW' && esMes(t.txnDate as string))
    .reduce((s, t) => s + (t.amount ?? 0), 0)
  const pct = mesIngresos > 0 ? Math.min((mesGastos / mesIngresos) * 100, 100) : 0

  if (loading) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator color={Colors.primary} size="large" />
          <Text style={{ color: Colors.foregroundMuted, marginTop: 12, fontSize: Fonts.sizes.sm }}>
            Cargando tus finanzas...
          </Text>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Buenos días 👋</Text>
            <Text style={styles.headerTitle}>Mi Finanzas</Text>
          </View>
          <View style={styles.notifBtn}>
            <Bell size={20} color={Colors.foregroundMuted} />
          </View>
        </View>

        {/* Net Worth Card */}
        <LinearGradient
          colors={['#4C1D95', '#7C3AED', '#6D28D9']}
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
          style={styles.netWorthCard}
        >
          <Text style={styles.netWorthLabel}>Patrimonio Neto</Text>
          <Text style={styles.netWorthAmount}>{fmt(netWorth)}</Text>
          <View style={styles.netWorthRow}>
            <View style={styles.netWorthStat}>
              <ArrowUpCircle size={14} color="#6EE7B7" />
              <Text style={styles.netWorthStatText}>{fmt(assets)} activos</Text>
            </View>
            <View style={styles.netWorthStat}>
              <ArrowDownCircle size={14} color="#FCA5A5" />
              <Text style={styles.netWorthStatText}>{fmt(Math.abs(debt))} deudas</Text>
            </View>
          </View>
        </LinearGradient>

        {/* Spending Plan */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Plan de Gastos — {hoy.toLocaleString('es-CR', { month: 'long' })}</Text>
          <View style={styles.card}>
            <View style={styles.spendRow}>
              <Text style={styles.spendLabel}>Ingresos</Text>
              <Text style={styles.spendLabel}>Gastos</Text>
            </View>
            <View style={styles.spendRow}>
              <Text style={[styles.spendAmt, { color: Colors.accent }]}>{fmt(mesIngresos)}</Text>
              <Text style={[styles.spendAmt, { color: Colors.destructive }]}>{fmt(mesGastos)}</Text>
            </View>
            <View style={styles.progressBg}>
              <View style={[styles.progressFill, { width: `${pct}%` as any }]} />
            </View>
            <Text style={styles.spendMeta}>
              {pct.toFixed(0)}% gastado · queda {fmt(Math.max(mesIngresos - mesGastos, 0))}
            </Text>
            {mesIngresos === 0 && (
              <Text style={{ fontSize: Fonts.sizes.xs, color: Colors.foregroundSubtle, marginTop: 4, textAlign: 'center' }}>
                Agrega transacciones para ver tu Spending Plan
              </Text>
            )}
          </View>
        </View>

        {/* Cuentas */}
        {accounts.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Mis Cuentas</Text>
              <TouchableOpacity style={styles.seeAll} onPress={() => router.push('/(tabs)/accounts')}>
                <Text style={styles.seeAllText}>Ver todas</Text>
                <ChevronRight size={14} color={Colors.primary} />
              </TouchableOpacity>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.accountsScroll}>
              {accounts.map(a => (
                <View key={a.id} style={[styles.accountCard, (a.openingBalance ?? 0) < 0 && styles.accountCardRed]}>
                  <Text style={styles.accountName} numberOfLines={1}>{a.name}</Text>
                  <Text style={[styles.accountBalance, (a.openingBalance ?? 0) < 0 && { color: Colors.destructive }]}>
                    {(a.openingBalance ?? 0) < 0 ? '-' : ''}{fmt(a.openingBalance ?? 0)}
                  </Text>
                  <Text style={styles.accountCurrency}>{a.currencyCode}</Text>
                </View>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Estado vacío si no hay cuentas */}
        {accounts.length === 0 && (
          <View style={styles.section}>
            <View style={[styles.card, { alignItems: 'center', paddingVertical: 24 }]}>
              <Text style={{ fontSize: 36, marginBottom: 8 }}>🏦</Text>
              <Text style={{ color: Colors.foregroundMuted, fontSize: Fonts.sizes.sm, fontWeight: Fonts.weights.semibold }}>
                Sin cuentas registradas
              </Text>
              <TouchableOpacity
                style={{ marginTop: 12, paddingHorizontal: 20, paddingVertical: 8, backgroundColor: Colors.primary, borderRadius: Radius.lg }}
                onPress={() => router.push('/(tabs)/accounts')}
              >
                <Text style={{ color: '#fff', fontSize: Fonts.sizes.xs, fontWeight: Fonts.weights.bold }}>Agregar Cuenta</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Últimas Transacciones */}
        {recentTxns.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Últimas Transacciones</Text>
              <TouchableOpacity style={styles.seeAll} onPress={() => router.push('/(tabs)/transactions')}>
                <Text style={styles.seeAllText}>Ver todas</Text>
                <ChevronRight size={14} color={Colors.primary} />
              </TouchableOpacity>
            </View>
            <View style={styles.card}>
              {recentTxns.slice(0, 5).map((t, i) => (
                <View key={t.id} style={[styles.payRow, i > 0 && styles.rowDivider]}>
                  <View style={[styles.dayBadge, {
                    backgroundColor: (t as any).direction === 'INFLOW' ? Colors.accentMuted : Colors.destructiveMuted
                  }]}>
                    <Text style={{ fontSize: 10, fontWeight: '700', color: (t as any).direction === 'INFLOW' ? Colors.accent : Colors.destructive }}>
                      {(t as any).direction === 'INFLOW' ? 'IN' : 'OUT'}
                    </Text>
                  </View>
                  <Text style={styles.payName} numberOfLines={1}>{t.payeeText ?? 'Sin descripción'}</Text>
                  <Text style={[styles.payAmount, {
                    color: (t as any).direction === 'INFLOW' ? Colors.accent : Colors.destructive
                  }]}>
                    {(t as any).direction === 'INFLOW' ? '+' : '-'}{fmt(t.amount ?? 0)}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  scroll: { flex: 1 },

  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Spacing.lg, paddingTop: Spacing.sm, paddingBottom: Spacing.md },
  greeting: { fontSize: Fonts.sizes.sm, color: Colors.foregroundMuted },
  headerTitle: { fontSize: Fonts.sizes.xl, fontWeight: Fonts.weights.black, color: Colors.foreground, marginTop: 2 },
  notifBtn: { width: 40, height: 40, borderRadius: Radius.md, backgroundColor: Colors.surface, alignItems: 'center', justifyContent: 'center' },

  netWorthCard: {
    marginHorizontal: Spacing.lg, borderRadius: Radius['2xl'], padding: Spacing.xl, marginBottom: Spacing.lg,
    shadowColor: Colors.primary, shadowOpacity: 0.4, shadowRadius: 20, elevation: 10,
  },
  netWorthLabel: { fontSize: Fonts.sizes.xs, color: '#C4B5FD', fontWeight: Fonts.weights.semibold, letterSpacing: 0.8 },
  netWorthAmount: { fontSize: Fonts.sizes['3xl'], fontWeight: Fonts.weights.black, color: '#fff', marginTop: 6, marginBottom: 14 },
  netWorthRow: { flexDirection: 'row', gap: 16 },
  netWorthStat: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  netWorthStatText: { fontSize: Fonts.sizes.xs, color: '#E9D5FF' },

  section: { paddingHorizontal: Spacing.lg, marginBottom: Spacing.lg },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: Spacing.sm },
  sectionTitle: { fontSize: Fonts.sizes.sm, fontWeight: Fonts.weights.bold, color: Colors.foregroundMuted, textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: Spacing.sm },
  seeAll: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  seeAllText: { fontSize: Fonts.sizes.xs, color: Colors.primary, fontWeight: Fonts.weights.semibold },
  card: { backgroundColor: Colors.card, borderRadius: Radius.xl, borderWidth: 1, borderColor: Colors.cardBorder, padding: Spacing.lg },

  spendRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  spendLabel: { fontSize: Fonts.sizes.xs, color: Colors.foregroundMuted, fontWeight: Fonts.weights.semibold },
  spendAmt: { fontSize: Fonts.sizes.sm, color: Colors.foreground, fontWeight: Fonts.weights.bold },
  progressBg: { height: 8, backgroundColor: Colors.surface, borderRadius: Radius.full, marginVertical: Spacing.sm, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: Colors.primary, borderRadius: Radius.full },
  spendMeta: { fontSize: Fonts.sizes.xs, color: Colors.foregroundMuted, textAlign: 'right' },

  accountsScroll: { marginLeft: -Spacing.lg },
  accountCard: {
    backgroundColor: Colors.card, borderRadius: Radius.xl, borderWidth: 1,
    borderColor: Colors.cardBorder, padding: Spacing.md, marginLeft: Spacing.lg,
    width: 140, minHeight: 90, justifyContent: 'space-between',
  },
  accountCardRed: { borderColor: Colors.destructiveMuted },
  accountName: { fontSize: Fonts.sizes.xs, color: Colors.foregroundMuted, fontWeight: Fonts.weights.medium },
  accountBalance: { fontSize: Fonts.sizes.md, fontWeight: Fonts.weights.bold, color: Colors.foreground },
  accountCurrency: { fontSize: Fonts.sizes.xs, color: Colors.foregroundSubtle },

  payRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, paddingVertical: Spacing.sm },
  rowDivider: { borderTopWidth: 1, borderTopColor: Colors.cardBorder },
  dayBadge: { width: 36, height: 28, borderRadius: Radius.md, alignItems: 'center', justifyContent: 'center' },
  dayBadgeUrgent: { backgroundColor: Colors.destructiveMuted },
  dayNum: { fontSize: Fonts.sizes.md, fontWeight: Fonts.weights.black, color: Colors.foreground, lineHeight: 20 },
  dayLabel: { fontSize: 8, color: Colors.foregroundMuted, textTransform: 'uppercase' },
  payName: { flex: 1, fontSize: Fonts.sizes.sm, fontWeight: Fonts.weights.semibold, color: Colors.foreground },
  payAmount: { fontSize: Fonts.sizes.sm, fontWeight: Fonts.weights.bold, color: Colors.destructive },
})
