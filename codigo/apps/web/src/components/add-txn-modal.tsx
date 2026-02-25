"use client"

import { useState } from 'react'
import { X, Check } from 'lucide-react'

const CATEGORIES = ['Alimentación', 'Hogar', 'Transporte', 'Trabajo', 'Inversiones', 'Supermercado', 'Salud', 'Entretenimiento', 'Otro']

interface AddTxnModalProps {
    open: boolean
    onClose: () => void
}

export function AddTxnModal({ open, onClose }: AddTxnModalProps) {
    const [type, setType] = useState<'OUTFLOW' | 'INFLOW' | 'TRANSFER'>('OUTFLOW')
    const [amount, setAmount] = useState('')
    const [payee, setPayee] = useState('')
    const [category, setCategory] = useState(CATEGORIES[0])
    const [date, setDate] = useState(new Date().toISOString().split('T')[0])
    const [notes, setNotes] = useState('')
    const [saved, setSaved] = useState(false)

    const handleSave = () => {
        // TODO: conectar con API / Prisma al implementar Auth
        setSaved(true)
        setTimeout(() => {
            setSaved(false)
            onClose()
        }, 800)
    }

    if (!open) return null

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Sheet */}
            <div className="fixed bottom-0 left-0 right-0 z-50 bg-card rounded-t-3xl border-t border-border/60 shadow-2xl p-5 pb-safe animate-in slide-in-from-bottom duration-300 max-h-[90vh] overflow-y-auto">

                {/* Handle */}
                <div className="w-10 h-1 bg-border rounded-full mx-auto mb-4" />

                {/* Header */}
                <div className="flex items-center justify-between mb-5">
                    <h2 className="text-lg font-bold">Nueva Transacción</h2>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-secondary transition-colors">
                        <X size={20} className="text-muted-foreground" />
                    </button>
                </div>

                {/* Tipo de Transacción */}
                <div className="flex gap-2 mb-5 bg-secondary/50 p-1 rounded-xl">
                    {(['OUTFLOW', 'INFLOW', 'TRANSFER'] as const).map((t) => (
                        <button
                            key={t}
                            onClick={() => setType(t)}
                            className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all ${type === t
                                    ? t === 'INFLOW' ? 'bg-accent text-accent-foreground shadow' :
                                        t === 'TRANSFER' ? 'bg-muted text-foreground shadow' :
                                            'bg-destructive text-destructive-foreground shadow'
                                    : 'text-muted-foreground hover:text-foreground'
                                }`}
                        >
                            {t === 'OUTFLOW' ? '💸 Gasto' : t === 'INFLOW' ? '💵 Ingreso' : '🔄 Transfer'}
                        </button>
                    ))}
                </div>

                <div className="space-y-4">
                    {/* Monto */}
                    <div>
                        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">Monto</label>
                        <div className="flex items-center gap-2 bg-secondary/50 rounded-xl px-4 py-3">
                            <span className="text-xl font-bold text-muted-foreground">₡</span>
                            <input
                                type="number"
                                placeholder="0"
                                value={amount}
                                onChange={e => setAmount(e.target.value)}
                                className="flex-1 bg-transparent text-2xl font-extrabold outline-none placeholder:text-muted-foreground/40"
                            />
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

                    {/* Botón Guardar */}
                    <button
                        onClick={handleSave}
                        disabled={!amount || !payee}
                        className={`w-full py-4 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${saved
                                ? 'bg-accent text-accent-foreground'
                                : 'bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed'
                            } shadow-lg`}
                    >
                        {saved ? <><Check size={18} /> Guardado</> : '💾 Guardar Transacción'}
                    </button>
                </div>
            </div>
        </>
    )
}
