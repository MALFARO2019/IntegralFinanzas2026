"use client"

import { useState, useTransition } from 'react'
import { Plus, Loader2, Target, AlertTriangle, CheckCircle2 } from 'lucide-react'
import { usePreferences } from '@/lib/preferences-context'
import { SettingsSelector } from '@/components/settings-selector'

interface Budget {
    id: string
    categoryId: string
    amount: number
    spent: number
    pct: number
    category: { name: string; emoji: string; color: string } | null
}

interface Props {
    budgets: Budget[]
    yearMonth: string
}

const MONTH_NAMES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']

export default function BudgetClient({ budgets, yearMonth }: Props) {
    const { formatMoney } = usePreferences()
    const [yearMonthNum] = yearMonth.split('-')
    const monthName = MONTH_NAMES[parseInt(yearMonth.split('-')[1]) - 1]

    const totalBudgeted = budgets.reduce((s, b) => s + b.amount, 0)
    const totalSpent = budgets.reduce((s, b) => s + b.spent, 0)
    const overBudget = budgets.filter(b => b.pct >= 100).length
    const nearLimit = budgets.filter(b => b.pct >= 80 && b.pct < 100).length

    return (
        <div className="flex flex-col min-h-screen pb-24 lg:pb-0">

            {/* Header */}
            <div className="sticky top-0 z-30 bg-background/90 backdrop-blur-lg border-b border-border/50 px-4 pt-4 pb-3 flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-extrabold">Presupuestos</h1>
                    <p className="text-xs text-muted-foreground">{monthName} {yearMonthNum}</p>
                </div>
                <SettingsSelector />
            </div>

            <div className="px-4 py-4 space-y-4">

                {/* Resumen del mes */}
                {budgets.length > 0 && (
                    <div className="grid grid-cols-2 gap-3">
                        <div className="bg-card border border-border/40 rounded-2xl p-4 col-span-2">
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Gasto Total vs Presupuesto</p>
                                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${totalSpent > totalBudgeted ? 'bg-destructive/10 text-destructive' : 'bg-accent/10 text-accent'}`}>
                                    {totalBudgeted > 0 ? `${Math.round((totalSpent / totalBudgeted) * 100)}%` : '—'}
                                </span>
                            </div>
                            <div className="h-2 bg-secondary rounded-full overflow-hidden">
                                <div
                                    className={`h-full rounded-full transition-all ${totalSpent > totalBudgeted ? 'bg-destructive' : 'bg-accent'}`}
                                    style={{ width: `${Math.min(100, totalBudgeted > 0 ? (totalSpent / totalBudgeted) * 100 : 0)}%` }}
                                />
                            </div>
                            <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                                <span>Gastado: <strong className="text-foreground">{formatMoney(totalSpent)}</strong></span>
                                <span>Límite: <strong className="text-foreground">{formatMoney(totalBudgeted)}</strong></span>
                            </div>
                        </div>

                        {overBudget > 0 && (
                            <div className="bg-destructive/10 border border-destructive/20 rounded-2xl p-3 flex items-center gap-2">
                                <AlertTriangle size={18} className="text-destructive shrink-0" />
                                <div>
                                    <p className="text-xs font-bold text-destructive">{overBudget} sobre límite</p>
                                    <p className="text-[10px] text-muted-foreground">Categorías excedidas</p>
                                </div>
                            </div>
                        )}
                        {nearLimit > 0 && (
                            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-2xl p-3 flex items-center gap-2">
                                <AlertTriangle size={18} className="text-yellow-400 shrink-0" />
                                <div>
                                    <p className="text-xs font-bold text-yellow-400">{nearLimit} cerca del límite</p>
                                    <p className="text-[10px] text-muted-foreground">Más del 80% usado</p>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Lista de presupuestos */}
                {budgets.length > 0 ? (
                    <div className="space-y-3">
                        {budgets.map(b => (
                            <div key={b.id} className="bg-card border border-border/40 rounded-2xl p-4">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <span className="text-xl">{b.category?.emoji ?? '📦'}</span>
                                        <span className="text-sm font-semibold">{b.category?.name ?? 'Sin categoría'}</span>
                                    </div>
                                    <span className={`text-xs font-bold ${b.pct >= 100 ? 'text-destructive' : b.pct >= 80 ? 'text-yellow-400' : 'text-muted-foreground'}`}>
                                        {b.pct}%
                                    </span>
                                </div>
                                <div className="h-2 bg-secondary rounded-full overflow-hidden mb-2">
                                    <div
                                        className={`h-full rounded-full transition-all ${b.pct >= 100 ? 'bg-destructive' : b.pct >= 80 ? 'bg-yellow-400' : 'bg-accent'}`}
                                        style={{ width: `${Math.min(100, b.pct)}%`, backgroundColor: b.pct < 80 ? (b.category?.color ?? undefined) : undefined }}
                                    />
                                </div>
                                <div className="flex justify-between text-xs text-muted-foreground">
                                    <span>{formatMoney(b.spent)} gastado</span>
                                    <span>Límite: {formatMoney(b.amount)}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16">
                        <Target size={40} className="mx-auto text-muted-foreground/30 mb-3" />
                        <p className="text-muted-foreground text-sm font-semibold">Sin presupuestos para {monthName}</p>
                        <p className="text-muted-foreground text-xs mt-1">Los presupuestos se configuran por categoría desde el panel de Ajustes o aquí.</p>
                    </div>
                )}

                {/* Info */}
                <div className="bg-primary/5 border border-primary/10 rounded-2xl p-4">
                    <p className="text-xs text-muted-foreground">
                        💡 Los presupuestos se configuran por categoría. Crea tus categorías en <strong className="text-foreground">/categories</strong> y luego agrega límites aquí. Esta funcionalidad estará completamente disponible próximamente desde la gestión de categorías.
                    </p>
                </div>
            </div>
        </div>
    )
}
