"use client"

import { Wallet, Plus, ArrowUpCircle, ArrowDownCircle, CreditCard, PiggyBank, Banknote, Landmark } from 'lucide-react'
import { usePreferences } from '@/lib/preferences-context'
import { SettingsSelector } from '@/components/settings-selector'
import { useState } from 'react'

const ACCOUNT_TYPES = [
    { key: 'CHECKING', label: 'Cuenta Corriente', icon: Banknote },
    { key: 'SAVINGS', label: 'Ahorros', icon: PiggyBank },
    { key: 'CREDIT', label: 'Tarjeta Crédito', icon: CreditCard },
    { key: 'INVEST', label: 'Inversiones', icon: Landmark },
]

// Mock mientras no haya datos reales
const MOCK_ACCOUNTS = [
    { id: '1', name: 'BAC Corriente', type: 'CHECKING', currency: 'CRC', balance: 820000, institution: 'BAC Credomatic' },
    { id: '2', name: 'Scotiabank Ahorros', type: 'SAVINGS', currency: 'CRC', balance: 350000, institution: 'Scotiabank' },
    { id: '3', name: 'Visa BN', type: 'CREDIT', currency: 'CRC', balance: -145000, institution: 'Banco Nacional' },
    { id: '4', name: 'SAFI Popular', type: 'INVEST', currency: 'CRC', balance: 550000, institution: 'BP Fondos' },
    { id: '5', name: 'Cuenta USD', type: 'SAVINGS', currency: 'USD', balance: 1240, institution: 'BAC Credomatic' },
]

export default function AccountsPage() {
    const { formatMoney } = usePreferences()
    const [showAdd, setShowAdd] = useState(false)

    const netWorth = MOCK_ACCOUNTS.reduce((s, a) => s + a.balance, 0)
    const totalAssets = MOCK_ACCOUNTS.filter(a => a.balance > 0).reduce((s, a) => s + a.balance, 0)
    const totalDebt = Math.abs(MOCK_ACCOUNTS.filter(a => a.balance < 0).reduce((s, a) => s + a.balance, 0))

    return (
        <div className="flex flex-col min-h-screen pb-24 lg:pb-0">

            {/* Header */}
            <div className="sticky top-0 z-30 bg-background/90 backdrop-blur-lg border-b border-border/50 px-4 pt-4 pb-3 flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-extrabold">Cuentas</h1>
                    <p className="text-xs text-muted-foreground">{MOCK_ACCOUNTS.length} cuentas activas</p>
                </div>
                <div className="flex items-center gap-2">
                    <SettingsSelector />
                </div>
            </div>

            <div className="px-4 py-4 space-y-4">

                {/* Resumen */}
                <div className="grid grid-cols-3 gap-3">
                    <div className="bg-card border border-border/40 rounded-2xl p-3 col-span-3 flex items-center justify-between">
                        <div>
                            <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Patrimonio Neto</p>
                            <p className={`text-2xl font-black mt-0.5 ${netWorth >= 0 ? 'text-foreground' : 'text-destructive'}`}>
                                {formatMoney(netWorth)}
                            </p>
                        </div>
                        <Wallet size={36} className="text-primary opacity-25" />
                    </div>

                    <div className="bg-accent/10 border border-accent/20 rounded-2xl p-3">
                        <ArrowUpCircle size={16} className="text-accent mb-1" />
                        <p className="text-[10px] text-muted-foreground font-semibold uppercase">Activos</p>
                        <p className="text-sm font-bold text-accent">{formatMoney(totalAssets)}</p>
                    </div>

                    <div className="bg-destructive/10 border border-destructive/20 rounded-2xl p-3">
                        <ArrowDownCircle size={16} className="text-destructive mb-1" />
                        <p className="text-[10px] text-muted-foreground font-semibold uppercase">Deudas</p>
                        <p className="text-sm font-bold text-destructive">{formatMoney(totalDebt)}</p>
                    </div>

                    <div className="bg-primary/10 border border-primary/20 rounded-2xl p-3">
                        <Landmark size={16} className="text-primary mb-1" />
                        <p className="text-[10px] text-muted-foreground font-semibold uppercase">Cuentas</p>
                        <p className="text-sm font-bold text-primary">{MOCK_ACCOUNTS.length}</p>
                    </div>
                </div>

                {/* Lista por tipo */}
                {ACCOUNT_TYPES.map(({ key, label, icon: Icon }) => {
                    const group = MOCK_ACCOUNTS.filter(a => a.type === key)
                    if (group.length === 0) return null

                    const groupTotal = group.reduce((s, a) => s + a.balance, 0)
                    return (
                        <div key={key}>
                            <div className="flex items-center justify-between mb-2 px-1">
                                <div className="flex items-center gap-2">
                                    <Icon size={14} className="text-muted-foreground" />
                                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{label}</span>
                                </div>
                                <span className={`text-xs font-bold ${groupTotal < 0 ? 'text-destructive' : 'text-muted-foreground'}`}>
                                    {formatMoney(groupTotal)}
                                </span>
                            </div>

                            <div className="bg-card border border-border/40 rounded-2xl overflow-hidden divide-y divide-border/30">
                                {group.map(acc => (
                                    <div key={acc.id} className="flex items-center gap-3 px-4 py-3.5 hover:bg-secondary/20 transition-colors">
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-xs font-extrabold ${key === 'CREDIT' ? 'bg-destructive/15 text-destructive' :
                                                key === 'INVEST' ? 'bg-primary/15 text-primary' :
                                                    key === 'SAVINGS' ? 'bg-accent/15 text-accent' :
                                                        'bg-secondary text-foreground'
                                            }`}>
                                            {acc.name.substring(0, 2).toUpperCase()}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-semibold truncate">{acc.name}</p>
                                            <p className="text-[10px] text-muted-foreground">{acc.institution} · {acc.currency}</p>
                                        </div>
                                        <span className={`text-sm font-bold shrink-0 ${acc.balance < 0 ? 'text-destructive' : 'text-foreground'}`}>
                                            {formatMoney(acc.balance)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )
                })}

            </div>

            {/* FAB agregar cuenta */}
            <button
                onClick={() => setShowAdd(true)}
                className="fixed bottom-24 lg:bottom-8 right-6 w-14 h-14 bg-primary text-primary-foreground rounded-2xl shadow-lg shadow-primary/30 flex items-center justify-center hover:scale-105 active:scale-95 transition-all z-40"
            >
                <Plus size={26} />
            </button>

            {/* Mini modal agregar cuenta (placeholder) */}
            {showAdd && (
                <>
                    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" onClick={() => setShowAdd(false)} />
                    <div className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border/50 rounded-t-3xl p-6 pb-8">
                        <div className="w-10 h-1 bg-border rounded-full mx-auto mb-5" />
                        <h2 className="text-lg font-bold mb-4">Nueva Cuenta</h2>
                        <div className="grid grid-cols-2 gap-3">
                            {ACCOUNT_TYPES.map(({ key, label, icon: Icon }) => (
                                <button key={key} className="flex items-center gap-3 p-4 bg-secondary/50 rounded-2xl hover:bg-secondary transition-colors text-left">
                                    <Icon size={20} className="text-primary shrink-0" />
                                    <span className="text-sm font-semibold">{label}</span>
                                </button>
                            ))}
                        </div>
                        <p className="text-xs text-muted-foreground text-center mt-4">Conecta tus cuentas bancarias reales en la siguiente fase.</p>
                    </div>
                </>
            )}
        </div>
    )
}
