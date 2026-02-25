"use client"

import { useState } from 'react'
import { CheckCircle2, ArrowRight, Landmark, Home, DollarSign, Building2 } from 'lucide-react'
import { createHousehold, createFirstAccount } from '@/lib/actions'
import { useRouter } from 'next/navigation'

const STEPS = ['Hogar', 'Primera Cuenta', '¡Listo!'] as const
const CURRENCIES = ['CRC', 'USD', 'EUR'] as const
const ACCOUNT_TYPES = [
    { value: 'CHECKING', label: 'Corriente', desc: 'Cuenta de uso diario' },
    { value: 'SAVINGS', label: 'Ahorros', desc: 'Cuenta de ahorro' },
    { value: 'CREDIT', label: 'Crédito', desc: 'Tarjeta o línea de crédito' },
    { value: 'INVEST', label: 'Inversión', desc: 'Fondos o acciones' },
]

export default function OnboardingClient() {
    const router = useRouter()
    const [step, setStep] = useState<0 | 1 | 2>(0)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    // Paso 0
    const handleHousehold = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true); setError(null)
        try {
            await createHousehold(new FormData(e.currentTarget))
            setStep(1)
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    // Paso 1
    const handleAccount = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true); setError(null)
        try {
            await createFirstAccount(new FormData(e.currentTarget))
            setStep(2)
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <div className="w-full max-w-md">

                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/15 mb-3">
                        <span className="text-3xl">📈</span>
                    </div>
                    <h1 className="text-2xl font-black">
                        <span className="text-primary">Integral</span> Finanzas
                    </h1>
                    <p className="text-muted-foreground text-sm mt-1">Configura tu perfil financiero</p>
                </div>

                {/* Progress */}
                <div className="flex items-center justify-center gap-2 mb-8">
                    {STEPS.map((s, i) => (
                        <div key={s} className="flex items-center gap-2">
                            <div className={`flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold transition-all ${i < step ? 'bg-accent text-white' : i === step ? 'bg-primary text-white' : 'bg-secondary text-muted-foreground'
                                }`}>
                                {i < step ? <CheckCircle2 size={14} /> : i + 1}
                            </div>
                            {i < STEPS.length - 1 && (
                                <div className={`h-px w-8 transition-all ${i < step ? 'bg-accent' : 'bg-border'}`} />
                            )}
                        </div>
                    ))}
                </div>

                {/* Card */}
                <div className="bg-card border border-border/40 rounded-3xl p-6">

                    {/* Paso 0: Crear Household */}
                    {step === 0 && (
                        <form onSubmit={handleHousehold} className="space-y-5">
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <Home size={18} className="text-primary" />
                                    <h2 className="text-lg font-bold">Tu Hogar Financiero</h2>
                                </div>
                                <p className="text-sm text-muted-foreground">Es el espacio donde se guardan tus cuentas y transacciones.</p>
                            </div>

                            <div>
                                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-1.5">NOMBRE DEL HOGAR</label>
                                <input
                                    name="name"
                                    defaultValue="Mi Hogar Financiero"
                                    className="w-full bg-secondary/50 rounded-xl border border-border/40 px-3 py-3 text-sm outline-none focus:border-primary transition-colors"
                                    required
                                />
                            </div>

                            <div>
                                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-1.5">MONEDA BASE</label>
                                <div className="flex gap-2">
                                    {CURRENCIES.map(c => (
                                        <label key={c} className="flex-1">
                                            <input type="radio" name="currency" value={c} defaultChecked={c === 'CRC'} className="peer sr-only" />
                                            <div className="text-center py-2.5 rounded-xl border border-border/40 text-sm font-bold cursor-pointer transition-all peer-checked:bg-primary peer-checked:text-white peer-checked:border-primary">
                                                {c}
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {error && <p className="text-destructive text-sm">{error}</p>}

                            <button type="submit" disabled={loading} className="w-full py-3 bg-primary text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-primary/90 disabled:opacity-50 transition-all">
                                {loading ? <span className="animate-spin">◌</span> : null}
                                Continuar <ArrowRight size={16} />
                            </button>
                        </form>
                    )}

                    {/* Paso 1: Primera Cuenta */}
                    {step === 1 && (
                        <form onSubmit={handleAccount} className="space-y-5">
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <Landmark size={18} className="text-primary" />
                                    <h2 className="text-lg font-bold">Tu Primera Cuenta</h2>
                                </div>
                                <p className="text-sm text-muted-foreground">Agrega tu cuenta bancaria principal para comenzar.</p>
                            </div>

                            <div>
                                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-1.5">TIPO DE CUENTA</label>
                                <div className="grid grid-cols-2 gap-2">
                                    {ACCOUNT_TYPES.map((t, i) => (
                                        <label key={t.value}>
                                            <input type="radio" name="type" value={t.value} defaultChecked={i === 0} className="peer sr-only" />
                                            <div className="p-3 rounded-xl border border-border/40 cursor-pointer transition-all peer-checked:bg-primary/10 peer-checked:border-primary">
                                                <p className="text-sm font-bold">{t.label}</p>
                                                <p className="text-xs text-muted-foreground">{t.desc}</p>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-1.5">NOMBRE DE LA CUENTA</label>
                                <input name="name" placeholder="Ej: BAC Corriente" className="w-full bg-secondary/50 rounded-xl border border-border/40 px-3 py-3 text-sm outline-none focus:border-primary transition-colors" required />
                            </div>

                            <div>
                                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-1.5">INSTITUCIÓN</label>
                                <input name="institution" placeholder="Ej: BAC Credomatic" className="w-full bg-secondary/50 rounded-xl border border-border/40 px-3 py-3 text-sm outline-none focus:border-primary transition-colors" />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-1.5">MONEDA</label>
                                    <div className="flex gap-1">
                                        {CURRENCIES.map(c => (
                                            <label key={c} className="flex-1">
                                                <input type="radio" name="currency" value={c} defaultChecked={c === 'CRC'} className="peer sr-only" />
                                                <div className="text-center py-2 rounded-lg border border-border/40 text-xs font-bold cursor-pointer transition-all peer-checked:bg-primary peer-checked:text-white">
                                                    {c}
                                                </div>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-1.5">SALDO INICIAL</label>
                                    <input name="balance" type="number" defaultValue="0" step="any" className="w-full bg-secondary/50 rounded-xl border border-border/40 px-3 py-3 text-sm outline-none focus:border-primary transition-colors" />
                                </div>
                            </div>

                            {error && <p className="text-destructive text-sm">{error}</p>}

                            <div className="flex gap-3">
                                <button type="button" onClick={() => { setError(null); setStep(2) }} className="flex-1 py-3 bg-secondary rounded-xl text-sm font-semibold text-muted-foreground hover:bg-secondary/70 transition-all">
                                    Omitir
                                </button>
                                <button type="submit" disabled={loading} className="flex-1 py-3 bg-primary text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-primary/90 disabled:opacity-50 transition-all">
                                    {loading ? <span className="animate-spin">◌</span> : null}
                                    Agregar <ArrowRight size={16} />
                                </button>
                            </div>
                        </form>
                    )}

                    {/* Paso 2: Éxito */}
                    {step === 2 && (
                        <div className="text-center py-6 space-y-4">
                            <div className="text-5xl mb-2">🎉</div>
                            <h2 className="text-2xl font-black">¡Todo listo!</h2>
                            <p className="text-muted-foreground text-sm">Tu perfil financiero está configurado. Ahora puedes comenzar a registrar tus transacciones y ver tu patrimonio neto.</p>
                            <button
                                onClick={() => router.push('/')}
                                className="w-full py-3 bg-primary text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-primary/90 transition-all mt-4"
                            >
                                Ir al Dashboard <ArrowRight size={16} />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
