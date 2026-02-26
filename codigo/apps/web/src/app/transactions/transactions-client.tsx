"use client"

import { useState, useMemo } from 'react'
import { Search, Plus, AlertCircle } from 'lucide-react'
import { TxnRow, TxnRowData } from '@/components/txn-row'
import { AddTxnModal } from '@/components/add-txn-modal'
import { EditTxnModal, type TxnData } from '@/components/edit-txn-modal'
import { SettingsSelector } from '@/components/settings-selector'

// Datos mock para demostración visual mientras no hay datos reales
const MOCK_TRANSACTIONS: TxnRowData[] = [
    { id: '1', payeeText: 'Netflix', amount: 8900, direction: 'OUTFLOW', txnDate: new Date().toISOString(), categoryName: 'Entretenimiento', needsReview: false },
    { id: '2', payeeText: 'Salario Mensual', amount: 650000, direction: 'INFLOW', txnDate: new Date().toISOString(), categoryName: 'Trabajo', needsReview: false },
    { id: '3', payeeText: 'Walmart CR', amount: 42000, direction: 'OUTFLOW', txnDate: new Date().toISOString(), categoryName: 'Supermercado', needsReview: false },
    { id: '4', payeeText: 'Uber', amount: 5500, direction: 'OUTFLOW', txnDate: new Date(Date.now() - 86400000).toISOString(), categoryName: 'Transporte', needsReview: false },
    { id: '5', payeeText: 'Pago Desconocido', amount: 15000, direction: 'OUTFLOW', txnDate: new Date(Date.now() - 86400000).toISOString(), categoryName: undefined, needsReview: true },
    { id: '6', payeeText: 'Spotify', amount: 4000, direction: 'OUTFLOW', txnDate: new Date(Date.now() - 172800000).toISOString(), categoryName: 'Entretenimiento' },
    { id: '7', payeeText: 'Farmacia', amount: 12000, direction: 'OUTFLOW', txnDate: new Date(Date.now() - 172800000).toISOString(), categoryName: 'Salud' },
    { id: '8', payeeText: 'Transferencia Ahorros', amount: 50000, direction: 'TRANSFER', txnDate: new Date(Date.now() - 259200000).toISOString(), categoryName: 'Transferencia' },
]

interface Props {
    transactions: TxnRowData[]
}

function groupByDate(txns: TxnRowData[]): Record<string, TxnRowData[]> {
    const groups: Record<string, TxnRowData[]> = {}
    txns.forEach(t => {
        const dateKey = new Date(t.txnDate).toLocaleDateString('es-CR', {
            weekday: 'long', day: 'numeric', month: 'long'
        })
        if (!groups[dateKey]) groups[dateKey] = []
        groups[dateKey].push(t)
    })
    return groups
}

export default function TransactionsClient({ transactions }: Props) {
    const [showModal, setShowModal] = useState(false)
    const [selectedTxn, setSelectedTxn] = useState<TxnData | null>(null)
    const [search, setSearch] = useState('')

    // Usa datos reales si existen, sino mock
    const displayData = transactions.length > 0 ? transactions : MOCK_TRANSACTIONS

    const filtered = useMemo(() =>
        displayData.filter(t =>
            t.payeeText.toLowerCase().includes(search.toLowerCase())
        ), [displayData, search])

    const grouped = groupByDate(filtered)
    const needsReview = filtered.filter(t => t.needsReview).length

    return (
        <div className="flex flex-col min-h-screen pb-24 lg:pb-0">

            {/* Header sticky */}
            <div className="sticky top-0 z-30 bg-background/90 backdrop-blur-lg border-b border-border/50 px-4 pt-4 pb-3">
                <div className="flex items-center justify-between mb-3">
                    <div>
                        <h1 className="text-xl font-extrabold">Movimientos</h1>
                        <p className="text-xs text-muted-foreground">{filtered.length} transacciones</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <SettingsSelector />
                    </div>
                </div>

                {/* Barra de búsqueda */}
                <div className="flex items-center gap-2 bg-secondary/50 rounded-xl px-3 py-2.5">
                    <Search size={16} className="text-muted-foreground shrink-0" />
                    <input
                        type="text"
                        placeholder="Buscar transacción..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground/60"
                    />
                </div>

                {/* Alert de Needs Review */}
                {needsReview > 0 && (
                    <div className="mt-2 flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/30 rounded-lg px-3 py-2">
                        <AlertCircle size={14} className="text-yellow-400 shrink-0" />
                        <span className="text-xs text-yellow-400 font-medium">{needsReview} transacción{needsReview > 1 ? 'es' : ''} necesita{needsReview === 1 ? '' : 'n'} revisión</span>
                    </div>
                )}
            </div>

            {/* Lista de transacciones agrupadas por día */}
            <div className="flex-1 px-2 py-3">
                {Object.entries(grouped).map(([date, txns]) => (
                    <div key={date} className="mb-4">
                        {/* Separador de fecha */}
                        <div className="flex items-center gap-3 px-2 mb-1">
                            <span className="text-xs font-semibold text-muted-foreground capitalize">{date}</span>
                            <div className="flex-1 h-px bg-border/50" />
                            <span className="text-xs text-muted-foreground">
                                {txns.reduce((sum, t) =>
                                    t.direction === 'INFLOW' ? sum + t.amount :
                                        t.direction === 'OUTFLOW' ? sum - t.amount : sum, 0
                                ).toLocaleString('es-CR', { style: 'currency', currency: 'CRC', maximumFractionDigits: 0 })}
                            </span>
                        </div>

                        {/* Filas de transacción */}
                        <div className="bg-card border border-border/40 rounded-2xl overflow-hidden divide-y divide-border/30">
                            {txns.map(txn => (
                                <div key={txn.id} onClick={() => setSelectedTxn({
                                    id: txn.id,
                                    direction: txn.direction as any,
                                    amount: txn.amount,
                                    currencyCode: 'CRC',
                                    payeeText: txn.payeeText,
                                    category: txn.categoryName,
                                    txnDate: txn.txnDate.split('T')[0],
                                    notes: null,
                                })} className="cursor-pointer">
                                    <TxnRow txn={txn} />
                                </div>
                            ))}
                        </div>
                    </div>
                ))}

                {filtered.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-20 text-muted-foreground gap-3">
                        <Search size={40} className="opacity-30" />
                        <p className="text-sm">Sin resultados para "{search}"</p>
                    </div>
                )}
            </div>

            {/* FAB Agregar */}
            <button
                onClick={() => setShowModal(true)}
                className="fixed bottom-24 lg:bottom-8 right-6 w-14 h-14 bg-primary text-primary-foreground rounded-2xl shadow-lg shadow-primary/30 flex items-center justify-center hover:scale-105 active:scale-95 transition-all z-40"
            >
                <Plus size={26} />
            </button>

            <AddTxnModal open={showModal} onClose={() => setShowModal(false)} />
            <EditTxnModal txn={selectedTxn} onClose={() => setSelectedTxn(null)} />
        </div>
    )
}
