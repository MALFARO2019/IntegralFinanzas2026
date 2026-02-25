"use client"

import { useState, useMemo } from 'react'
import { AlertCircle, CalendarDays, ChevronLeft, ChevronRight, Plus } from 'lucide-react'
import { AddTxnModal } from '@/components/add-txn-modal'
import { usePreferences } from '@/lib/preferences-context'
import { SettingsSelector } from '@/components/settings-selector'

// Suscripciones de demo mientras no hay datos reales en BD
const MOCK_SUBS = [
    { id: 's1', payeeText: 'Netflix', amount: 8900, txnDate: addDays(1), direction: 'OUTFLOW', categoryName: 'Entretenimiento' },
    { id: 's2', payeeText: 'Spotify', amount: 4000, txnDate: addDays(1), direction: 'OUTFLOW', categoryName: 'Entretenimiento' },
    { id: 's3', payeeText: 'Disney+', amount: 6500, txnDate: addDays(3), direction: 'OUTFLOW', categoryName: 'Entretenimiento' },
    { id: 's4', payeeText: 'Gym Anual', amount: 15000, txnDate: addDays(5), direction: 'OUTFLOW', categoryName: 'Salud' },
    { id: 's5', payeeText: 'AWS Cloud', amount: 12000, txnDate: addDays(8), direction: 'OUTFLOW', categoryName: 'Trabajo' },
    { id: 's6', payeeText: 'Alquiler', amount: 180000, txnDate: addDays(12), direction: 'OUTFLOW', categoryName: 'Hogar' },
    { id: 's7', payeeText: 'Salario', amount: 650000, txnDate: addDays(15), direction: 'INFLOW', categoryName: 'Trabajo' },
]

function addDays(n: number) {
    const d = new Date()
    d.setDate(d.getDate() + n)
    return d.toISOString()
}

function daysUntil(dateStr: string) {
    const diff = new Date(dateStr).getTime() - Date.now()
    return Math.ceil(diff / 86400000)
}

interface Props {
    upcomingTxns: { id: string; payeeText: string; amount: number; txnDate: string; direction: string; categoryName?: string }[]
    allTxns?: { id: string; txnDate: string; direction: string; amount: number }[]
}

export default function CalendarClient({ upcomingTxns, allTxns = [] }: Props) {
    const { formatMoney } = usePreferences()
    const [showModal, setShowModal] = useState(false)
    const [today] = useState(new Date())
    const [viewDate, setViewDate] = useState(new Date())

    const displayData = upcomingTxns.length > 0 ? upcomingTxns : MOCK_SUBS

    // Generar días del mes en vista
    const daysInMonth = useMemo(() => {
        const year = viewDate.getFullYear()
        const month = viewDate.getMonth()
        const firstDay = new Date(year, month, 1).getDay()
        const total = new Date(year, month + 1, 0).getDate()
        return { firstDay, total, year, month }
    }, [viewDate])

    // Usar allTxns para marcar días con movimientos, con fallback a displayData
    const txnSource = allTxns.length > 0 ? allTxns : displayData
    const txnDates = useMemo(() => new Set(
        txnSource
            .filter(t => {
                const d = new Date(t.txnDate)
                return d.getFullYear() === viewDate.getFullYear() && d.getMonth() === viewDate.getMonth()
            })
            .map(t => new Date(t.txnDate).getDate())
    ), [txnSource, viewDate])

    const prevMonth = () => setViewDate(d => new Date(d.getFullYear(), d.getMonth() - 1))
    const nextMonth = () => setViewDate(d => new Date(d.getFullYear(), d.getMonth() + 1))

    const monthLabel = viewDate.toLocaleDateString('es-CR', { month: 'long', year: 'numeric' })

    // Monto total próximos gastos
    const totalUpcomingExpenses = displayData
        .filter(t => t.direction === 'OUTFLOW')
        .reduce((s, t) => s + t.amount, 0)

    return (
        <div className="flex flex-col min-h-screen pb-24 lg:pb-0">

            {/* Header */}
            <div className="sticky top-0 z-30 bg-background/90 backdrop-blur-lg border-b border-border/50 px-4 pt-4 pb-3">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-extrabold">Calendario</h1>
                        <p className="text-xs text-muted-foreground">{displayData.length} pagos programados</p>
                    </div>
                    <SettingsSelector />
                </div>
            </div>

            <div className="px-4 py-4 space-y-4">

                {/* Resumen Próximos Gastos */}
                <div className="bg-card border border-border/40 rounded-2xl p-4 flex justify-between items-center">
                    <div>
                        <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Total próximas salidas</p>
                        <p className="text-2xl font-extrabold text-destructive mt-1">{formatMoney(totalUpcomingExpenses)}</p>
                    </div>
                    <CalendarDays size={36} className="text-primary opacity-30" />
                </div>

                {/* Mini Calendario */}
                <div className="bg-card border border-border/40 rounded-2xl p-4">
                    {/* Nav mes */}
                    <div className="flex items-center justify-between mb-4">
                        <button onClick={prevMonth} className="p-1 hover:bg-secondary rounded-lg transition-colors">
                            <ChevronLeft size={18} />
                        </button>
                        <span className="text-sm font-bold capitalize">{monthLabel}</span>
                        <button onClick={nextMonth} className="p-1 hover:bg-secondary rounded-lg transition-colors">
                            <ChevronRight size={18} />
                        </button>
                    </div>

                    {/* Días de la semana */}
                    <div className="grid grid-cols-7 mb-1">
                        {['D', 'L', 'M', 'X', 'J', 'V', 'S'].map(d => (
                            <div key={d} className="text-center text-[10px] font-bold text-muted-foreground py-1">{d}</div>
                        ))}
                    </div>

                    {/* Celdas de días */}
                    <div className="grid grid-cols-7 gap-y-1">
                        {/* espacios vacíos al inicio */}
                        {Array.from({ length: daysInMonth.firstDay }).map((_, i) => <div key={`e${i}`} />)}
                        {Array.from({ length: daysInMonth.total }, (_, i) => i + 1).map(day => {
                            const isToday = day === today.getDate() &&
                                daysInMonth.month === today.getMonth() &&
                                daysInMonth.year === today.getFullYear()
                            const hasTxn = txnDates.has(day)
                            return (
                                <div key={day} className="flex flex-col items-center py-1">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm relative ${isToday ? 'bg-primary text-primary-foreground font-bold' : 'hover:bg-secondary'
                                        }`}>
                                        {day}
                                        {hasTxn && (
                                            <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-destructive" />
                                        )}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* Lista de suscripciones */}
                <div>
                    <h2 className="text-sm font-bold mb-3 text-muted-foreground uppercase tracking-wider">Próximos Pagos</h2>
                    <div className="bg-card border border-border/40 rounded-2xl overflow-hidden divide-y divide-border/30">
                        {displayData.map(t => {
                            const days = daysUntil(t.txnDate)
                            const isUrgent = days <= 3
                            return (
                                <div key={t.id} className="flex items-center gap-3 px-4 py-3">
                                    {/* Badge de días */}
                                    <div className={`w-12 rounded-xl text-center shrink-0 py-1.5 ${isUrgent ? 'bg-destructive/15' : 'bg-secondary/50'
                                        }`}>
                                        <p className={`text-base font-extrabold leading-none ${isUrgent ? 'text-destructive' : 'text-foreground'}`}>
                                            {days === 0 ? 'HOY' : days}
                                        </p>
                                        {days > 0 && <p className="text-[9px] text-muted-foreground font-medium">días</p>}
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-1.5">
                                            <span className="text-sm font-semibold truncate">{t.payeeText}</span>
                                            {isUrgent && <AlertCircle size={12} className="text-destructive shrink-0" />}
                                        </div>
                                        {t.categoryName && (
                                            <span className="text-[10px] text-muted-foreground">{t.categoryName}</span>
                                        )}
                                    </div>

                                    {/* Monto */}
                                    <span className={`text-sm font-bold shrink-0 ${t.direction === 'INFLOW' ? 'text-accent' : 'text-destructive'
                                        }`}>
                                        {t.direction === 'INFLOW' ? '+' : '-'}{formatMoney(t.amount)}
                                    </span>
                                </div>
                            )
                        })}
                    </div>
                </div>

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
