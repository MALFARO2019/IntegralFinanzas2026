"use client"

import { useState, useTransition } from 'react'
import { X, Check, Loader2 } from 'lucide-react'
import { addTransaction } from '@/lib/transaction-actions'

const CATEGORIES = [
    'Alimentación', 'Hogar', 'Transporte', 'Trabajo',
    'Inversiones', 'Supermercado', 'Salud', 'Entretenimiento', 'Suscripciones', 'Otro'
]

const CURRENCIES = [
    { code: 'CRC', symbol: '₡' },
    { code: 'USD', symbol: '$' },
    { code: 'EUR', symbol: '€' },
]

interface AddTxnModalProps {
    open: boolean
    onClose: () => void
}

export function AddTxnModal({ open, onClose }: AddTxnModalProps) {
    const [type, setType] = useState<'OUTFLOW' | 'INFLOW' | 'TRANSFER'>('OUTFLOW')
    const [amount, setAmount] = useState('')
    const [currency, setCurrency] = useState('CRC')
    const [payee, setPayee] = useState('')
    const [category, setCategory] = useState(CATEGORIES[0])
    const [date, setDate] = useState(new Date().toISOString().split('T')[0])
    const [notes, setNotes] = useState('')
    const [isRecurring, setIsRecurring] = useState(false)
    const [saved, setSaved] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [isPending, startTransition] = useTransition()

    const currencySymbol = CURRENCIES.find(c => c.code === currency)?.symbol ?? '₡'

    const handleSave = () => {
        if (!amount || !payee) return
        setError(null)

        const formData = new FormData()
        formData.set('direction', type)
        formData.set('amount', amount)
        formData.set('currency', currency)
        formData.set('payee', payee)
        formData.set('category', category)
        formData.set('date', date)
        formData.set('notes', notes)
        formData.set('isRecurring', String(isRecurring))

        startTransition(async () => {
            try {
                await addTransaction(formData)
                setSaved(true)
                setTimeout(() => {
                    setSaved(false)
                    setAmount(''); setPayee(''); setNotes(''); setCurrency('CRC')
                    onClose()
                }, 800)
            } catch (e: any) {
                setError(e.message ?? 'Error al guardar. Intenta de nuevo.')
            }
        })
    }

    if (!open) return null

    return (
        <>
            {/* Backdrop */}
            <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" onClick={onClose} />

            {/* Sheet (móvil) / Modal centrado angosto (desktop) */}
            <div className="fixed z-50 bg-card border-border/60 shadow-2xl overflow-y-auto p-5
              bottom-0 left-0 right-0 rounded-t-3xl border-t max-h-[92vh]
              lg:bottom-auto lg:left-1/2 lg:top-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2
              lg:w-full lg:max-w-sm lg:rounded-3xl lg:border lg:max-h-[85vh]
              animate-in slide-in-from-bottom lg:zoom-in-95 duration-200">

                {/* Handle */}
                <div className="w-10 h-1 bg-border rounded-full mx-auto mb-4" />

                {/* Header */}
                <div className="flex items-center justify-between mb-5">
                    <h2 className="text-lg font-bold">Nueva Transacción</h2>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-secondary transition-colors">
                        <X size={20} className="text-muted-foreground" />
                    </button>
                </div>

                {/* Tipo */}
                <div className="flex gap-2 mb-5 bg-secondary/50 p-1 rounded-xl">
                    {(['OUTFLOW', 'INFLOW', 'TRANSFER'] as const).map((t) => (
                        <button
                            key={t}
                            onClick={() => setType(t)}
                            className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all ${type === t
                                ? t === 'INFLOW' ? 'bg-accent text-accent-foreground shadow'
                                    : t === 'TRANSFER' ? 'bg-muted text-foreground shadow'
                                        : 'bg-destructive text-destructive-foreground shadow'
                                : 'text-muted-foreground hover:text-foreground'}`}
                        >
                            {t === 'OUTFLOW' ? '💸 Gasto' : t === 'INFLOW' ? '💵 Ingreso' : '🔄 Transfer'}
                        </button>
                    ))}
                </div>

                <div className="space-y-4">

                    {/* Monto + Moneda */}
                    <div>
                        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">
                            Monto
                        </label>
                        <div className="flex gap-2">
                            {/* Selector moneda */}
                            <div className="flex gap-1 bg-secondary/50 rounded-xl p-1 shrink-0">
                                {CURRENCIES.map(c => (
                                    <button
                                        key={c.code}
                                        type="button"
                                        onClick={() => setCurrency(c.code)}
                                        className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all ${currency === c.code
                                            ? 'bg-primary text-primary-foreground shadow'
                                            : 'text-muted-foreground hover:text-foreground'
                                            }`}
                                    >
                                        {c.code}
                                    </button>
                                ))}
                            </div>
                            {/* Campo monto */}
                            <div className="flex flex-1 items-center gap-2 bg-secondary/50 rounded-xl px-4 py-3">
                                <span className="text-xl font-bold text-muted-foreground">{currencySymbol}</span>
                                <input
                                    type="number"
                                    placeholder="0"
                                    value={amount}
                                    onChange={e => setAmount(e.target.value)}
                                    className="flex-1 bg-transparent text-2xl font-extrabold outline-none placeholder:text-muted-foreground/40"
                                    autoFocus
                                />
                            </div>
                        </div>
                    </div>

                    {/* Beneficiario */}
                    <div>
                        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">Beneficiario / Descripción</label>
                        <input
                            type="text"
                            placeholder="ej. Netflix, Supermercado..."
                            value={payee}
                            onChange={e => setPayee(e.target.value)}
                            className="w-full bg-secondary/50 rounded-xl px-4 py-3 text-sm outline-none placeholder:text-muted-foreground/50 focus:ring-1 focus:ring-primary/50"
                        />
                    </div>

                    {/* Categoría */}
                    <div>
                        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">Categoría</label>
                        <select
                            value={category}
                            onChange={e => setCategory(e.target.value)}
                            className="w-full bg-secondary/50 rounded-xl px-4 py-3 text-sm outline-none appearance-none"
                        >
                            {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                        </select>
                    </div>

                    {/* Fecha */}
                    <div>
                        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">Fecha</label>
                        <input
                            type="date"
                            value={date}
                            onChange={e => setDate(e.target.value)}
                            className="w-full bg-secondary/50 rounded-xl px-4 py-3 text-sm outline-none"
                        />
                    </div>

                    {/* Notas */}
                    <div>
                        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">Notas (opcional)</label>
                        <textarea
                            placeholder="Algún detalle adicional..."
                            value={notes}
                            onChange={e => setNotes(e.target.value)}
                            rows={2}
                            className="w-full bg-secondary/50 rounded-xl px-4 py-3 text-sm outline-none resize-none placeholder:text-muted-foreground/50"
                        />
                    </div>

                    {/* Toggle Recurrente */}
                    <div className="flex items-center justify-between bg-secondary/30 rounded-xl px-4 py-3">
                        <div>
                            <p className="text-sm font-semibold">Transacción Recurrente</p>
                            <p className="text-xs text-muted-foreground">Se repite mensualmente</p>
                        </div>
                        <button
                            type="button"
                            onClick={() => setIsRecurring(!isRecurring)}
                            className={`relative w-11 h-6 rounded-full transition-all ${isRecurring ? 'bg-primary' : 'bg-secondary'}`}
                        >
                            <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${isRecurring ? 'left-[22px]' : 'left-0.5'}`} />
                        </button>
                    </div>

                    {/* Error */}
                    {error && (
                        <p className="text-destructive text-xs bg-destructive/10 border border-destructive/20 rounded-xl px-3 py-2">{error}</p>
                    )}

                    {/* Botón Guardar */}
                    <button
                        onClick={handleSave}
                        disabled={!amount || !payee || isPending}
                        className={`w-full py-4 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-lg ${saved
                            ? 'bg-accent text-accent-foreground'
                            : 'bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed'
                            }`}
                    >
                        {isPending ? <><Loader2 size={18} className="animate-spin" /> Guardando...</>
                            : saved ? <><Check size={18} /> Guardado</>
                                : '💾 Guardar Transacción'}
                    </button>

                </div>
            </div>
        </>
    )
}
