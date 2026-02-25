"use client"

import { useState } from 'react'
import { Wallet, TrendingUp, Calendar, CreditCard, PiggyBank, Banknote, Plus, ArrowRight, Landmark, AlertCircle } from 'lucide-react'
import { SettingsSelector } from '@/components/settings-selector'
import { usePreferences } from '@/lib/preferences-context'
import { AddTxnModal } from '@/components/add-txn-modal'
import Link from 'next/link'
import type { Account, Transaction } from '@/lib/data'

interface DashboardClientProps {
    accounts: Account[]
    netWorth: number
    assets: number
    debt: number
    recentTxns: Transaction[]
    hasHousehold: boolean
}

const TYPE_STYLES: Record<string, { icon: typeof Banknote; color: string }> = {
    CHECKING: { icon: Banknote, color: 'text-accent' },
    SAVINGS: { icon: PiggyBank, color: 'text-primary' },
    CREDIT: { icon: CreditCard, color: 'text-destructive' },
    INVEST: { icon: Landmark, color: 'text-primary' },
}

export default function DashboardClient({
    accounts, netWorth, assets, debt, recentTxns, hasHousehold
}: DashboardClientProps) {
    const { formatMoney } = usePreferences()
    const [showModal, setShowModal] = useState(false)

    // Calcular Spending Plan a partir de transacciones reales del mes actual
    const hoy = new Date()
    const isMes = (d: string) => {
        const dt = new Date(d)
        return dt.getMonth() === hoy.getMonth() && dt.getFullYear() === hoy.getFullYear()
    }
    const mesIngresos = recentTxns
        .filter(t => t.direction === 'INFLOW' && isMes(t.txnDate as string))
        .reduce((s, t) => s + (t.amount ?? 0), 0)
    const mesGastos = recentTxns
        .filter(t => t.direction === 'OUTFLOW' && isMes(t.txnDate as string))
        .reduce((s, t) => s + (t.amount ?? 0), 0)
    const libre = Math.max(mesIngresos - mesGastos, 0)
    const gastoPct = mesIngresos > 0 ? Math.min((mesGastos / mesIngresos) * 100, 100) : 0

    return (
        <div className="flex flex-col min-h-screen pb-24 lg:pb-0">

            {/* Header */}
            <div className="sticky top-0 z-30 bg-background/90 backdrop-blur-lg border-b border-border/50 px-4 pt-4 pb-3 flex items-center justify-between">
                <div>
                    <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Hola 👋</p>
                    <h1 className="text-lg font-extrabold">Tu Resumen Financiero</h1>
                </div>
                <SettingsSelector />
            </div>

            <div className="px-4 py-4 space-y-4">

                {/* Banner si no hay Household configurado */}
                {!hasHousehold && (
                    <div className="flex items-start gap-3 bg-warning/10 border border-warning/30 rounded-2xl p-4">
                        <AlertCircle size={18} className="text-warning shrink-0 mt-0.5" />
                        <div>
                            <p className="text-sm font-bold text-warning">Sin Hogar Financiero</p>
                            <p className="text-xs text-muted-foreground mt-0.5">
                                Crea un Hogar para comenzar a registrar cuentas y transacciones.
                            </p>
                            <Link href="/settings" className="text-xs text-primary font-semibold mt-1 inline-block hover:underline">
                                Configure su Perfil →
                            </Link>
                        </div>
                    </div>
                )}

                {/* ─── Net Worth Card ─── */}
                <div className="bg-gradient-to-br from-primary/20 via-card to-card border border-primary/20 rounded-2xl p-5 text-center">
                    <p className="text-xs text-muted-foreground font-semibold uppercase tracking-widest mb-1">NET WORTH</p>
                    <h2 className="text-4xl font-black tracking-tight">{formatMoney(netWorth)}</h2>
                    <div className="flex justify-center gap-4 mt-3">
                        <div className="flex items-center gap-1 text-xs text-accent font-semibold">
                            <TrendingUp size={12} /> {formatMoney(assets)} activos
                        </div>
                        <div className="flex items-center gap-1 text-xs text-destructive font-semibold">
                            <TrendingUp size={12} className="rotate-180" /> {formatMoney(Math.abs(debt))} deudas
                        </div>
                    </div>
                </div>

                {/* ─── Spending Plan Card ─── */}
                <div className="bg-card border border-border/40 rounded-2xl p-5">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold flex items-center gap-2">
                            <Wallet size={16} className="text-primary" /> Spending Plan
                        </h3>
                        <Link href="/transactions" className="text-xs text-primary font-semibold flex items-center gap-0.5 hover:underline">
                            Ver todo <ArrowRight size={12} />
                        </Link>
                    </div>
                    <div className="space-y-2.5">
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Ingresos este mes</span>
                            <span className="font-semibold text-accent">+{formatMoney(mesIngresos)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Gastos este mes</span>
                            <span className="text-destructive">-{formatMoney(mesGastos)}</span>
                        </div>
                        <div className="flex justify-between items-center pt-2 border-t border-border/40">
                            <span className="text-sm font-semibold">Libre para Gastar</span>
                            <span className="text-xl font-black text-accent">{formatMoney(libre)}</span>
                        </div>
                    </div>
                    <div className="mt-3 space-y-1">
                        <div className="w-full h-2.5 bg-secondary rounded-full overflow-hidden">
                            <div className="h-full bg-destructive/80 rounded-full transition-all" style={{ width: `${gastoPct}%` }} />
                        </div>
                        <div className="flex justify-between text-[10px] text-muted-foreground">
                            <span>Gastado {gastoPct.toFixed(0)}%</span>
                            <span className="text-accent font-semibold">Libre {(100 - gastoPct).toFixed(0)}%</span>
                        </div>
                    </div>
                </div>

                {/* ─── Cuentas ─── */}
                {accounts.length > 0 && (
                    <div className="bg-card border border-border/40 rounded-2xl p-5">
                        <div className="flex justify-between items-center mb-3">
                            <h3 className="font-bold flex items-center gap-2">
                                <Banknote size={16} className="text-primary" /> Mis Cuentas
                            </h3>
                            <Link href="/accounts" className="text-xs text-primary font-semibold flex items-center gap-0.5 hover:underline">
                                Ver todas <ArrowRight size={12} />
                            </Link>
                        </div>
                        <div className="space-y-2">
                            {accounts.slice(0, 4).map(acc => {
                                const s = TYPE_STYLES[acc.type] ?? TYPE_STYLES.CHECKING
                                const Icon = s.icon
                                return (
                                    <div key={acc.id} className="flex items-center gap-3 py-1.5">
                                        <div className="w-8 h-8 rounded-xl bg-secondary/60 flex items-center justify-center shrink-0">
                                            <Icon size={16} className={s.color} />
                                        </div>
                                        <span className="text-sm text-muted-foreground flex-1 truncate">{acc.name}</span>
                                        <span className={`text-sm font-bold ${acc.openingBalance < 0 ? 'text-destructive' : s.color}`}>
                                            {formatMoney(acc.openingBalance ?? 0)}
                                        </span>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                )}

                {/* ─── Últimas Transacciones ─── */}
                {recentTxns.length > 0 && (
                    <div className="bg-card border border-border/40 rounded-2xl p-5">
                        <div className="flex justify-between items-center mb-3">
                            <h3 className="font-bold flex items-center gap-2">
                                <Calendar size={16} className="text-primary" /> Últimas Transacciones
                            </h3>
                            <Link href="/transactions" className="text-xs text-primary font-semibold flex items-center gap-0.5 hover:underline">
                                Ver todo <ArrowRight size={12} />
                            </Link>
                        </div>
                        <div className="space-y-2">
                            {recentTxns.slice(0, 5).map(t => (
                                <div key={t.id} className="flex items-center gap-3">
                                    <div className={`w-8 text-center shrink-0 rounded-lg py-1 text-[10px] font-bold ${t.direction === 'INFLOW' ? 'bg-accent/15 text-accent' : 'bg-destructive/15 text-destructive'}`}>
                                        {t.direction === 'INFLOW' ? 'IN' : 'OUT'}
                                    </div>
                                    <span className="flex-1 text-sm truncate">{t.payeeText ?? 'Sin descripción'}</span>
                                    <span className={`text-sm font-semibold ${t.direction === 'INFLOW' ? 'text-accent' : 'text-destructive'}`}>
                                        {t.direction === 'INFLOW' ? '+' : '-'}{formatMoney(t.amount ?? 0)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Estado vacío si no hay datos */}
                {hasHousehold && accounts.length === 0 && recentTxns.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-4xl mb-3">💼</p>
                        <p className="text-muted-foreground text-sm">Aún no hay cuentas ni transacciones.</p>
                        <Link href="/accounts" className="text-primary text-sm font-semibold mt-2 inline-block hover:underline">
                            Agrega tu primera cuenta →
                        </Link>
                    </div>
                )}

            </div>

            {/* FAB */}
            <button
                onClick={() => setShowModal(true)}
                className="fixed bottom-24 lg:bottom-8 right-6 w-14 h-14 bg-primary text-primary-foreground rounded-2xl shadow-lg shadow-primary/30 flex items-center justify-center hover:scale-105 active:scale-95 transition-all z-40"
            >
                <Plus size={26} />
            </button>

            <AddTxnModal open={showModal} onClose={() => setShowModal(false)} />
        </div>
    )
}
