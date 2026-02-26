"use client"

import { useState, useTransition } from 'react'
import { X, Check, Loader2, Trash2 } from 'lucide-react'
import { updateTransaction, deleteTransaction } from '@/lib/transaction-actions'

const CATEGORIES = [
    'Alimentación', 'Hogar', 'Transporte', 'Trabajo',
    'Inversiones', 'Supermercado', 'Salud', 'Entretenimiento', 'Suscripciones', 'Otro'
]
const CURRENCIES = [
    { code: 'CRC', symbol: '₡' },
    { code: 'USD', symbol: '$' },
    { code: 'EUR', symbol: '€' },
]

export interface TxnData {
    id: string
    direction: 'OUTFLOW' | 'INFLOW' | 'TRANSFER'
    amount: number
    currencyCode: string
    payeeText: string
    category?: string
    txnDate: string
    notes?: string | null
}

interface Props {
    txn: TxnData | null
    onClose: () => void
}

export function EditTxnModal({ txn, onClose }: Props) {
    const [type, setType] = useState<'OUTFLOW' | 'INFLOW' | 'TRANSFER'>(txn?.direction ?? 'OUTFLOW')
    const [amount, setAmount] = useState(String(txn?.amount ?? ''))
    const [currency, setCurrency] = useState(txn?.currencyCode ?? 'CRC')
    const [payee, setPayee] = useState(txn?.payeeText ?? '')
    const [category, setCategory] = useState(txn?.category ?? CATEGORIES[0])
    const [date, setDate] = useState(txn?.txnDate ?? new Date().toISOString().split('T')[0])
    const [notes, setNotes] = useState(txn?.notes ?? '')
    const [saved, setSaved] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [confirmDelete, setConfirmDelete] = useState(false)
    const [isPending, startTransition] = useTransition()

    const currencySymbol = CURRENCIES.find(c => c.code === currency)?.symbol ?? '₡'

    const handleSave = () => {
        if (!txn || !amount || !payee) return
        setError(null)
        const fd = new FormData()
        fd.set('direction', type); fd.set('amount', amount); fd.set('currency', currency)
        fd.set('payee', payee); fd.set('category', category); fd.set('date', date); fd.set('notes', notes ?? '')

        startTransition(async () => {
            try {
                await updateTransaction(txn.id, fd)
                setSaved(true)
                setTimeout(() => { setSaved(false); onClose() }, 800)
            } catch (e: any) { setError(e.message ?? 'Error al guardar') }
        })
    }

    const handleDelete = () => {
        if (!txn) return
        startTransition(async () => {
            try {
                await deleteTransaction(txn.id)
                onClose()
            } catch (e: any) { setError(e.message ?? 'Error al eliminar') }
        })
    }

    if (!txn) return null

    return (
        <>
            <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" onClick={onClose} />
            <div className="fixed z-50 bg-card border-border/60 shadow-2xl overflow-y-auto p-5
        bottom-0 left-0 right-0 rounded-t-3xl border-t max-h-[92vh]
        lg:bottom-auto lg:left-1/2 lg:top-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2
        lg:w-full lg:max-w-sm lg:rounded-3xl lg:border lg:max-h-[85vh]
        animate-in slide-in-from-bottom lg:zoom-in-95 duration-200">

                <div className="w-10 h-1 bg-border rounded-full mx-auto mb-4 lg:hidden" />

                {/* Header */}
                <div className="flex items-center justify-between mb-5">
                    <h2 className="text-lg font-bold">Editar Transacción</h2>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setConfirmDelete(true)}
                            className="p-2 rounded-full hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                        >
                            <Trash2 size={18} />
                        </button>
                        <button onClick={onClose} className="p-2 rounded-full hover:bg-secondary transition-colors">
                            <X size={20} className="text-muted-foreground" />
                        </button>
                    </div>
                </div>

                {/* Confirm Delete */}
                {confirmDelete && (
                    <div className="mb-4 bg-destructive/10 border border-destructive/30 rounded-2xl p-4">
                        <p className="text-sm font-semibold text-destructive mb-3">¿Eliminar esta transacción?</p>
                        <div className="flex gap-2">
                            <button onClick={() => setConfirmDelete(false)} className="flex-1 py-2 bg-secondary rounded-xl text-sm font-semibold hover:bg-secondary/70 transition-all">
                                Cancelar
                            </button>
                            <button onClick={handleDelete} disabled={isPending} className="flex-1 py-2 bg-destructive text-white rounded-xl text-sm font-bold hover:bg-destructive/90 disabled:opacity-50 transition-all flex items-center justify-center gap-1">
                                {isPending ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                                Eliminar
                            </button>
                        </div>
                    </div>
                )}

                <div className="space-y-4">
                    {/* Tipo */}
                    <div className="flex gap-2 bg-secondary/50 p-1 rounded-xl">
                        {(['OUTFLOW', 'INFLOW', 'TRANSFER'] as const).map(t => (
                            <button key={t} onClick={() => setType(t)} className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all ${type === t
                                ? t === 'INFLOW' ? 'bg-accent text-accent-foreground shadow' : t === 'TRANSFER' ? 'bg-muted text-foreground shadow' : 'bg-destructive text-destructive-foreground shadow'
                                : 'text-muted-foreground'}`}>
                                {t === 'OUTFLOW' ? '💸 Gasto' : t === 'INFLOW' ? '💵 Ingreso' : '🔄 Transfer'}
                            </button>
                        ))}
                    </div>

                    {/* Monto + Moneda */}
                    <div>
                        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">Monto</label>
                        <div className="flex gap-2">
                            <div className="flex gap-1 bg-secondary/50 rounded-xl p-1 shrink-0">
                                {CURRENCIES.map(c => (
                                    <button key={c.code} type="button" onClick={() => setCurrency(c.code)}
                                        className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all ${currency === c.code ? 'bg-primary text-primary-foreground shadow' : 'text-muted-foreground'}`}>
                                        {c.code}
                                    </button>
                                ))}
                            </div>
                            <div className="flex flex-1 items-center gap-2 bg-secondary/50 rounded-xl px-4 py-3">
                                <span className="text-xl font-bold text-muted-foreground">{currencySymbol}</span>
                                <input type="number" value={amount} onChange={e => setAmount(e.target.value)}
                                    className="flex-1 bg-transparent text-2xl font-extrabold outline-none" autoFocus />
                            </div>
                        </div>
                    </div>

                    {/* Payee */}
                    <div>
                        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">Beneficiario</label>
                        <input type="text" value={payee} onChange={e => setPayee(e.target.value)}
                            className="w-full bg-secondary/50 rounded-xl px-4 py-3 text-sm outline-none focus:ring-1 focus:ring-primary/50" />
                    </div>

                    {/* Categoría */}
                    <div>
                        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">Categoría</label>
                        <select value={category} onChange={e => setCategory(e.target.value)}
                            className="w-full bg-secondary/50 rounded-xl px-4 py-3 text-sm outline-none">
                            {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                        </select>
                    </div>

                    {/* Fecha */}
                    <div>
                        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">Fecha</label>
                        <input type="date" value={date} onChange={e => setDate(e.target.value)}
                            className="w-full bg-secondary/50 rounded-xl px-4 py-3 text-sm outline-none" />
                    </div>

                    {/* Notas */}
                    <div>
                        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">Notas</label>
                        <textarea value={notes ?? ''} onChange={e => setNotes(e.target.value)} rows={2}
                            className="w-full bg-secondary/50 rounded-xl px-4 py-3 text-sm outline-none resize-none" />
                    </div>

                    {error && <p className="text-destructive text-xs bg-destructive/10 border border-destructive/20 rounded-xl px-3 py-2">{error}</p>}

                    <button onClick={handleSave} disabled={!amount || !payee || isPending}
                        className={`w-full py-4 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${saved ? 'bg-accent text-accent-foreground' : 'bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-40'}`}>
                        {isPending ? <><Loader2 size={18} className="animate-spin" /> Guardando...</> : saved ? <><Check size={18} /> Guardado</> : '💾 Guardar Cambios'}
                    </button>
                </div>
            </div>
        </>
    )
}
