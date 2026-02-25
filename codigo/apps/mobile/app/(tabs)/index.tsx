import { ScrollView, View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { LinearGradient } from 'expo-linear-gradient'
import { TrendingUp, ArrowUpCircle, ArrowDownCircle, Bell, ChevronRight } from 'lucide-react-native'
import { Colors, Fonts, Radius, Spacing } from '@/constants/theme'

const { width } = Dimensions.get('window')

const MOCK_ACCOUNTS = [
  { id: '1', name: 'BAC Corriente', balance: 820000, currency: 'CRC' },
  { id: '2', name: 'Scotiabank', balance: 350000, currency: 'CRC' },
  { id: '3', name: 'Visa BN', balance: -145000, currency: 'CRC' },
]

const MOCK_UPCOMING = [
  { id: '1', name: 'Netflix', amount: 9900, days: 2 },
  { id: '2', name: 'Spotify', amount: 7900, days: 5 },
  { id: '3', name: 'AWS Hosting', amount: 35000, days: 11 },
]

const fmt = (n: number) => `₡${Math.abs(n).toLocaleString('es-CR')}`

export default function DashboardScreen() {
  const netWorth = MOCK_ACCOUNTS.reduce((s, a) => s + a.balance, 0)
  const spent = 284000
  const budget = 500000
  const pct = Math.min((spent / budget) * 100, 100)

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
              <Text style={styles.netWorthStatText}>{fmt(1170000)} activos</Text>
            </View>
            <View style={styles.netWorthStat}>
              <ArrowDownCircle size={14} color="#FCA5A5" />
              <Text style={styles.netWorthStatText}>{fmt(145000)} deudas</Text>
            </View>
          </View>
        </LinearGradient>

        {/* Spending Plan */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Plan de Gastos</Text>
          <View style={styles.card}>
            <View style={styles.spendRow}>
              <Text style={styles.spendLabel}>Gastado</Text>
              <Text style={styles.spendLabel}>Presupuesto</Text>
            </View>
            <View style={styles.spendRow}>
              <Text style={styles.spendAmt}>{fmt(spent)}</Text>
              <Text style={styles.spendAmt}>{fmt(budget)}</Text>
            </View>
            <View style={styles.progressBg}>
              <View style={[styles.progressFill, { width: `${pct}%` as any }]} />
            </View>
            <Text style={styles.spendMeta}>{pct.toFixed(0)}% utilizado · quedan {fmt(budget - spent)}</Text>
          </View>
        </View>

        {/* Cuentas */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Mis Cuentas</Text>
            <TouchableOpacity style={styles.seeAll}>
              <Text style={styles.seeAllText}>Ver todas</Text>
              <ChevronRight size={14} color={Colors.primary} />
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.accountsScroll}>
            {MOCK_ACCOUNTS.map(a => (
              <View key={a.id} style={[styles.accountCard, a.balance < 0 && styles.accountCardRed]}>
                <Text style={styles.accountName} numberOfLines={1}>{a.name}</Text>
                <Text style={[styles.accountBalance, a.balance < 0 && { color: Colors.destructive }]}>
                  {a.balance < 0 ? '-' : ''}{fmt(a.balance)}
                </Text>
                <Text style={styles.accountCurrency}>{a.currency}</Text>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Próximos Pagos */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Próximos Pagos</Text>
          <View style={styles.card}>
            {MOCK_UPCOMING.map((p, i) => {
              const urgent = p.days <= 3
              return (
                <View key={p.id} style={[styles.payRow, i > 0 && styles.rowDivider]}>
                  <View style={[styles.dayBadge, urgent && styles.dayBadgeUrgent]}>
                    <Text style={[styles.dayNum, urgent && { color: Colors.destructive }]}>
                      {p.days === 0 ? 'HOY' : p.days}
                    </Text>
                    {p.days > 0 && <Text style={styles.dayLabel}>días</Text>}
                  </View>
                  <Text style={styles.payName}>{p.name}</Text>
                  <Text style={styles.payAmount}>{fmt(p.amount)}</Text>
                </View>
              )
            })}
          </View>
        </View>

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
  dayBadge: { width: 44, borderRadius: Radius.md, backgroundColor: Colors.surface, alignItems: 'center', paddingVertical: 6 },
  dayBadgeUrgent: { backgroundColor: Colors.destructiveMuted },
  dayNum: { fontSize: Fonts.sizes.md, fontWeight: Fonts.weights.black, color: Colors.foreground, lineHeight: 20 },
  dayLabel: { fontSize: 8, color: Colors.foregroundMuted, textTransform: 'uppercase' },
  payName: { flex: 1, fontSize: Fonts.sizes.sm, fontWeight: Fonts.weights.semibold, color: Colors.foreground },
  payAmount: { fontSize: Fonts.sizes.sm, fontWeight: Fonts.weights.bold, color: Colors.destructive },
})
