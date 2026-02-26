"use client"

import { useState, useTransition } from 'react'
import { X, Check, Loader2 } from 'lucide-react'
import { addAccount } from '@/lib/account-actions'

const ACCOUNT_TYPES = [
    { value: 'CHECKING', label: 'Corriente', desc: 'Uso diario', emoji: '🏦' },
    { value: 'SAVINGS', label: 'Ahorros', desc: 'Cuenta de ahorro', emoji: '🐷' },
    { value: 'CREDIT', label: 'Crédito', desc: 'Tarjeta / línea', emoji: '💳' },
    { value: 'INVEST', label: 'Inversión', desc: 'Fondos / acciones', emoji: '📈' },
    { value: 'CASH', label: 'Efectivo', desc: 'Dinero en mano', emoji: '💵' },
    { value: 'LOAN', label: 'Préstamo', desc: 'Deuda bancaria', emoji: '🏛️' },
]

const CURRENCIES = [
    { code: 'CRC', symbol: '₡' },
    { code: 'USD', symbol: '$' },
    { code: 'EUR', symbol: '€' },
]

interface Props {
    open: boolean
    onClose: () => void
}

export function AddAccountModal({ open, onClose }: Props) {
    const [name, setName] = useState('')
    const [type, setType] = useState('CHECKING')
    const [institution, setInstitution] = useState('')
    const [currency, setCurrency] = useState('CRC')
    const [balance, setBalance] = useState('0')
    const [netWorth, setNetWorth] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [saved, setSaved] = useState(false)
    const [isPending, startTransition] = useTransition()

    const reset = () => {
        setName(''); setType('CHECKING'); setInstitution('')
        setCurrency('CRC'); setBalance('0'); setNetWorth(true)
        setError(null); setSaved(false)
    }

    const handleSave = () => {
        if (!name.trim()) { setError('El nombre de la cuenta es requerido'); return }
        setError(null)

        const fd = new FormData()
        fd.set('name', name)
        fd.set('type', type)
        fd.set('institution', institution)
        fd.set('currency', currency)
        fd.set('balance', balance)
        fd.set('includeInNetWorth', String(netWorth))

        startTransition(async () => {
            try {
                await addAccount(fd)
                setSaved(true)
                setTimeout(() => { reset(); onClose() }, 800)
            } catch (e: any) {
                setError(e.message ?? 'Error al guardar')
            }
        })
    }

    if (!open) return null

    return (
        <>
            <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" onClick={onClose} />
            <div className="fixed z-50 bg-card border-border/60 shadow-2xl overflow-y-auto p-5
        bottom-0 left-0 right-0 rounded-t-3xl border-t max-h-[92vh]
        lg:bottom-auto lg:left-1/2 lg:top-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2
        lg:w-full lg:max-w-sm lg:rounded-3xl lg:border lg:max-h-[90vh]
        animate-in slide-in-from-bottom lg:zoom-in-95 duration-200">

                {/* Handle */}
                <div className="w-10 h-1 bg-border rounded-full mx-auto mb-4 lg:hidden" />

                {/* Header */}
                <div className="flex items-center justify-between mb-5">
                    <h2 className="text-lg font-bold">Nueva Cuenta</h2>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-secondary transition-colors">
                        <X size={20} className="text-muted-foreground" />
                    </button>
                </div>

                <div className="space-y-4">

                    {/* Tipo de Cuenta */}
                    <div>
                        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-2">
                            Tipo de Cuenta
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                            {ACCOUNT_TYPES.map(t => (
                                <button
                                    key={t.value}
                                    type="button"
                                    onClick={() => setType(t.value)}
                                    className={`p-2 rounded-xl border text-center transition-all ${type === t.value
                                            ? 'bg-primary/10 border-primary'
                                            : 'border-border/40 hover:bg-secondary/50'
                                        }`}
                                >
                                    <div className="text-xl mb-0.5">{t.emoji}</div>
                                    <p className="text-xs font-bold">{t.label}</p>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Nombre */}
                    <div>
                        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">
                            Nombre de la Cuenta
                        </label>
                        <input
                            type="text"
                            placeholder="Ej: BAC Corriente, Visa BN..."
                            value={name}
                            onChange={e => setName(e.target.value)}
                            autoFocus
                            className="w-full bg-secondary/50 rounded-xl px-4 py-3 text-sm outline-none focus:ring-1 focus:ring-primary/50"
                        />
                    </div>

                    {/* Institución */}
                    <div>
                        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">
                            Institución (opcional)
                        </label>
                        <input
                            type="text"
                            placeholder="Ej: BAC Credomatic, Banco Nacional..."
                            value={institution}
                            onChange={e => setInstitution(e.target.value)}
                            className="w-full bg-secondary/50 rounded-xl px-4 py-3 text-sm outline-none focus:ring-1 focus:ring-primary/50"
                        />
                    </div>

                    {/* Moneda + Saldo inicial */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">
                                Moneda
                            </label>
                            <div className="flex gap-1">
                                {CURRENCIES.map(c => (
                                    <button
                                        key={c.code}
                                        type="button"
                                        onClick={() => setCurrency(c.code)}
                                        className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all ${currency === c.code
                                                ? 'bg-primary text-primary-foreground border-primary'
                                                : 'bg-secondary/50 border-border/40 text-muted-foreground'
                                            }`}
                                    >
                                        {c.code}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">
                                Saldo Actual
                            </label>
                            <div className="flex items-center gap-1.5 bg-secondary/50 rounded-xl px-3 py-2.5">
                                <span className="text-sm font-bold text-muted-foreground">
                                    {CURRENCIES.find(c => c.code === currency)?.symbol}
                                </span>
                                <input
                                    type="number"
                                    value={balance}
                                    onChange={e => setBalance(e.target.value)}
                                    className="flex-1 bg-transparent text-sm font-bold outline-none"
                                    step="any"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Incluir en Patrimonio */}
                    <div className="flex items-center justify-between bg-secondary/30 rounded-xl px-4 py-3">
                        <div>
                            <p className="text-sm font-semibold">Incluir en Patrimonio Neto</p>
                            <p className="text-xs text-muted-foreground">Suma al cálculo total de Net Worth</p>
                        </div>
                        <button
                            type="button"
                            onClick={() => setNetWorth(!netWorth)}
                            className={`relative w-11 h-6 rounded-full transition-all ${netWorth ? 'bg-primary' : 'bg-secondary'}`}
                        >
                            <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${netWorth ? 'left-5.5' : 'left-0.5'}`} />
                        </button>
                    </div>

                    {/* Error */}
                    {error && (
                        <p className="text-destructive text-xs bg-destructive/10 border border-destructive/20 rounded-xl px-3 py-2">
                            {error}
                        </p>
                    )}

                    {/* Guardar */}
                    <button
                        onClick={handleSave}
                        disabled={!name.trim() || isPending}
                        className={`w-full py-4 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-lg ${saved
                                ? 'bg-accent text-accent-foreground'
                                : 'bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed'
                            }`}
                    >
                        {isPending ? <><Loader2 size={18} className="animate-spin" /> Guardando...</>
                            : saved ? <><Check size={18} /> ¡Cuenta agregada!</>
                                : '🏦 Agregar Cuenta'}
                    </button>
                </div>
            </div>
        </>
    )
}
