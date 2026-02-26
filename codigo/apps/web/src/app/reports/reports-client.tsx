"use client"

import {
    PieChart, Pie, Cell, BarChart, Bar,
    XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, Legend
} from 'recharts'
import { usePreferences } from '@/lib/preferences-context'
import { SettingsSelector } from '@/components/settings-selector'

interface CatData { name: string; color: string; emoji: string; amount: number }
interface MonthData { label: string; ingresos: number; gastos: number }
interface TopGasto { payeeText: string; amount: number; category: { name: string; emoji: string } | null }

interface Props {
    byCategory: CatData[]
    byMonth: MonthData[]
    topGastos: TopGasto[]
    currentMonthLabel: string
}

const FALLBACK_COLORS = ['#8B5CF6', '#EC4899', '#F59E0B', '#10B981', '#3B82F6', '#EF4444', '#6366F1', '#14B8A6']

function CurrencyTooltip({ active, payload, formatMoney }: any) {
    if (!active || !payload?.length) return null
    return (
        <div className="bg-card border border-border/60 rounded-xl px-3 py-2 shadow-lg text-xs">
            {payload.map((p: any) => (
                <div key={p.name} className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
                    <span className="text-muted-foreground">{p.name}:</span>
                    <span className="font-bold">{formatMoney(p.value)}</span>
                </div>
            ))}
        </div>
    )
}

export default function ReportsClient({ byCategory, byMonth, topGastos, currentMonthLabel }: Props) {
    const { formatMoney } = usePreferences()
    const totalGastoMes = byCategory.reduce((s, c) => s + c.amount, 0)

    const hasData = byCategory.length > 0 || byMonth.some(m => m.gastos > 0 || m.ingresos > 0)

    return (
        <div className="flex flex-col min-h-screen pb-24 lg:pb-0">
            {/* Header */}
            <div className="sticky top-0 z-30 bg-background/90 backdrop-blur-lg border-b border-border/50 px-4 pt-4 pb-3 flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-extrabold">Reportes</h1>
                    <p className="text-xs text-muted-foreground capitalize">{currentMonthLabel}</p>
                </div>
                <SettingsSelector />
            </div>

            <div className="px-4 py-4 space-y-5">
                {!hasData && (
                    <div className="text-center py-16">
                        <p className="text-5xl mb-4">📊</p>
                        <p className="text-muted-foreground text-sm font-semibold">Sin datos para reportes</p>
                        <p className="text-muted-foreground text-xs mt-1">Agrega transacciones para ver tus gráficas</p>
                    </div>
                )}

                {/* Gráfica de dona — Gastos por categoría */}
                {byCategory.length > 0 && (
                    <div className="bg-card border border-border/40 rounded-2xl p-4">
                        <p className="text-sm font-bold mb-1">Gastos por Categoría</p>
                        <p className="text-xs text-muted-foreground mb-4">Total: <strong>{formatMoney(totalGastoMes)}</strong></p>

                        <div className="flex flex-col lg:flex-row items-center gap-4">
                            <ResponsiveContainer width="100%" height={200}>
                                <PieChart>
                                    <Pie
                                        data={byCategory}
                                        dataKey="amount"
                                        nameKey="name"
                                        cx="50%" cy="50%"
                                        innerRadius={55}
                                        outerRadius={90}
                                        paddingAngle={2}
                                    >
                                        {byCategory.map((c, i) => (
                                            <Cell key={c.name} fill={c.color || FALLBACK_COLORS[i % FALLBACK_COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip formatter={(v: number) => formatMoney(v)} />
                                </PieChart>
                            </ResponsiveContainer>

                            {/* Leyenda */}
                            <div className="w-full lg:w-auto space-y-1.5">
                                {byCategory.slice(0, 6).map((c, i) => (
                                    <div key={c.name} className="flex items-center gap-2 text-xs">
                                        <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: c.color || FALLBACK_COLORS[i % FALLBACK_COLORS.length] }} />
                                        <span className="flex-1 truncate">{c.emoji} {c.name}</span>
                                        <span className="font-bold shrink-0">{formatMoney(c.amount)}</span>
                                        <span className="text-muted-foreground shrink-0">{Math.round((c.amount / totalGastoMes) * 100)}%</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Gráfica de barras — Ingresos vs Gastos 6 meses */}
                {byMonth.some(m => m.gastos > 0 || m.ingresos > 0) && (
                    <div className="bg-card border border-border/40 rounded-2xl p-4">
                        <p className="text-sm font-bold mb-4">Ingresos vs Gastos — Últimos 6 Meses</p>
                        <ResponsiveContainer width="100%" height={200}>
                            <BarChart data={byMonth} barSize={18} barGap={4}>
                                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                                <XAxis dataKey="label" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
                                <YAxis hide />
                                <Tooltip content={<CurrencyTooltip formatMoney={formatMoney} />} />
                                <Legend wrapperStyle={{ fontSize: 11 }} />
                                <Bar dataKey="ingresos" name="Ingresos" fill="#10B981" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="gastos" name="Gastos" fill="#EF4444" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                )}

                {/* Top 10 gastos del mes */}
                {topGastos.length > 0 && (
                    <div className="bg-card border border-border/40 rounded-2xl overflow-hidden">
                        <div className="px-4 py-3 border-b border-border/30">
                            <p className="text-sm font-bold">Top Gastos del Mes</p>
                        </div>
                        <div className="divide-y divide-border/30">
                            {topGastos.map((t, i) => (
                                <div key={i} className="flex items-center gap-3 px-4 py-3">
                                    <span className="text-xs font-bold text-muted-foreground w-4 shrink-0">#{i + 1}</span>
                                    <span className="text-lg shrink-0">{(t.category as any)?.emoji ?? '📦'}</span>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold truncate">{t.payeeText}</p>
                                        <p className="text-[10px] text-muted-foreground">{(t.category as any)?.name ?? 'Sin categoría'}</p>
                                    </div>
                                    <span className="text-sm font-bold text-destructive shrink-0">{formatMoney(t.amount)}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
