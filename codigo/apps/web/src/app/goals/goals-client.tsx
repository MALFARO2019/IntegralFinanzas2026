"use client"

import { useState, useTransition } from 'react'
import { Plus, Loader2, Check, Trash2, PlusCircle } from 'lucide-react'
import { createGoal, contributeToGoal, deleteGoal } from '@/lib/goal-actions'
import { usePreferences } from '@/lib/preferences-context'
import { SettingsSelector } from '@/components/settings-selector'
import type { Goal } from '@/lib/goal-actions'

const GOAL_EMOJIS = ['🎯', '🏖️', '🏠', '✈️', '🚗', '💎', '📱', '🎓', '💊', '🐾', '🛡️', '🏋️', '🎵', '💰', '🌴']

interface Props { goals: Goal[] }

function GoalCard({ goal, formatMoney }: { goal: Goal; formatMoney: (n: number) => string }) {
    const [addAmount, setAddAmount] = useState('')
    const [showAdd, setShowAdd] = useState(false)
    const [isPending, startTransition] = useTransition()
    const pct = Math.min(100, goal.targetAmount > 0 ? Math.round((goal.currentAmount / goal.targetAmount) * 100) : 0)
    const remaining = Math.max(0, goal.targetAmount - goal.currentAmount)
    const isComplete = pct >= 100
    const daysLeft = goal.deadline
        ? Math.ceil((new Date(goal.deadline).getTime() - Date.now()) / 86400000)
        : null

    const handleContribute = () => {
        const amt = parseFloat(addAmount)
        if (!amt || amt <= 0) return
        startTransition(async () => {
            await contributeToGoal(goal.id, amt)
            setAddAmount(''); setShowAdd(false)
        })
    }

    const handleDelete = () => {
        startTransition(async () => { await deleteGoal(goal.id) })
    }

    return (
        <div className={`bg-card border rounded-2xl p-4 ${isComplete ? 'border-accent/50 bg-accent/5' : 'border-border/40'}`}>
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                    <span className="text-2xl">{goal.emoji}</span>
                    <div>
                        <p className="font-semibold text-sm">{goal.name}</p>
                        {daysLeft !== null && (
                            <p className={`text-[10px] ${daysLeft < 0 ? 'text-destructive' : daysLeft < 30 ? 'text-yellow-400' : 'text-muted-foreground'}`}>
                                {daysLeft < 0 ? `Venció hace ${Math.abs(daysLeft)} días` : `${daysLeft} días restantes`}
                            </p>
                        )}
                    </div>
                </div>
                <div className="flex items-center gap-1">
                    {isComplete && <Check size={16} className="text-accent" />}
                    <button onClick={handleDelete} disabled={isPending} className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors">
                        <Trash2 size={14} />
                    </button>
                </div>
            </div>

            {/* Barra de progreso */}
            <div className="h-3 bg-secondary rounded-full overflow-hidden mb-2">
                <div
                    className={`h-full rounded-full transition-all duration-500 ${isComplete ? 'bg-accent' : 'bg-primary'}`}
                    style={{ width: `${pct}%` }}
                />
            </div>

            <div className="flex justify-between text-xs text-muted-foreground mb-3">
                <span><strong className="text-foreground">{formatMoney(goal.currentAmount)}</strong> ahorrado</span>
                <span className={`font-bold ${isComplete ? 'text-accent' : ''}`}>{pct}%</span>
                <span>Meta: <strong className="text-foreground">{formatMoney(goal.targetAmount)}</strong></span>
            </div>

            {!isComplete && (
                <div>
                    {showAdd ? (
                        <div className="flex gap-2">
                            <input
                                type="number"
                                value={addAmount}
                                onChange={e => setAddAmount(e.target.value)}
                                placeholder="Monto a agregar"
                                autoFocus
                                className="flex-1 bg-secondary/50 rounded-xl px-3 py-2 text-sm outline-none"
                            />
                            <button onClick={handleContribute} disabled={isPending} className="px-3 py-2 bg-primary text-primary-foreground rounded-xl text-xs font-bold hover:bg-primary/90 disabled:opacity-50">
                                {isPending ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                            </button>
                            <button onClick={() => setShowAdd(false)} className="px-2 py-2 bg-secondary rounded-xl text-xs text-muted-foreground">✕</button>
                        </div>
                    ) : (
                        <button onClick={() => setShowAdd(true)} className="w-full py-2 border border-dashed border-border/60 rounded-xl text-xs text-muted-foreground hover:border-primary hover:text-primary transition-all flex items-center justify-center gap-1.5">
                            <PlusCircle size={14} /> Agregar {formatMoney(remaining)} restantes
                        </button>
                    )}
                </div>
            )}
            {isComplete && (
                <div className="text-center text-xs text-accent font-bold">🎉 ¡Meta alcanzada!</div>
            )}
        </div>
    )
}

export default function GoalsClient({ goals }: Props) {
    const { formatMoney } = usePreferences()
    const [showAdd, setShowAdd] = useState(false)
    const [name, setName] = useState('')
    const [emoji, setEmoji] = useState('🎯')
    const [target, setTarget] = useState('')
    const [current, setCurrent] = useState('0')
    const [deadline, setDeadline] = useState('')
    const [error, setError] = useState<string | null>(null)
    const [isPending, startTransition] = useTransition()

    const reset = () => { setName(''); setEmoji('🎯'); setTarget(''); setCurrent('0'); setDeadline(''); setError(null) }

    const handleCreate = () => {
        if (!name.trim() || !target) { setError('Nombre y monto objetivo son requeridos'); return }
        const fd = new FormData()
        fd.set('name', name); fd.set('emoji', emoji); fd.set('targetAmount', target)
        fd.set('currentAmount', current); fd.set('deadline', deadline)
        startTransition(async () => {
            try { await createGoal(fd); reset(); setShowAdd(false) }
            catch (e: any) { setError(e.message) }
        })
    }

    const active = goals.filter(g => (g.currentAmount / g.targetAmount) < 1)
    const completed = goals.filter(g => (g.currentAmount / g.targetAmount) >= 1)

    return (
        <div className="flex flex-col min-h-screen pb-24 lg:pb-0">
            {/* Header */}
            <div className="sticky top-0 z-30 bg-background/90 backdrop-blur-lg border-b border-border/50 px-4 pt-4 pb-3 flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-extrabold">Metas Financieras</h1>
                    <p className="text-xs text-muted-foreground">{goals.length} meta{goals.length !== 1 ? 's' : ''} activa{goals.length !== 1 ? 's' : ''}</p>
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={() => setShowAdd(true)} className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-primary-foreground rounded-xl text-xs font-bold hover:bg-primary/90 transition-all">
                        <Plus size={14} /> Nueva Meta
                    </button>
                    <SettingsSelector />
                </div>
            </div>

            <div className="px-4 py-4 space-y-4">
                {active.length > 0 && (
                    <div className="space-y-3">
                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider px-1">🎯 En progreso</p>
                        {active.map(g => <GoalCard key={g.id} goal={g} formatMoney={formatMoney} />)}
                    </div>
                )}
                {completed.length > 0 && (
                    <div className="space-y-3">
                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider px-1">✅ Completadas</p>
                        {completed.map(g => <GoalCard key={g.id} goal={g} formatMoney={formatMoney} />)}
                    </div>
                )}
                {goals.length === 0 && (
                    <div className="text-center py-16">
                        <p className="text-5xl mb-4">🎯</p>
                        <p className="text-muted-foreground text-sm font-semibold">Sin metas aún</p>
                        <p className="text-muted-foreground text-xs mt-1 mb-4">Define tus objetivos financieros y rastrea tu progreso</p>
                        <button onClick={() => setShowAdd(true)} className="px-6 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-bold hover:bg-primary/90">
                            + Crear Primera Meta
                        </button>
                    </div>
                )}
            </div>

            {/* FAB */}
            <button onClick={() => setShowAdd(true)} className="fixed bottom-24 right-6 w-14 h-14 bg-primary text-primary-foreground rounded-2xl shadow-lg shadow-primary/30 flex items-center justify-center hover:scale-105 active:scale-95 transition-all z-40 lg:hidden">
                <Plus size={26} />
            </button>

            {/* Modal crear meta */}
            {showAdd && (
                <>
                    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" onClick={() => { setShowAdd(false); reset() }} />
                    <div className="fixed z-50 bg-card border-border/60 shadow-2xl overflow-y-auto p-5
            bottom-0 left-0 right-0 rounded-t-3xl border-t max-h-[88vh]
            lg:bottom-auto lg:left-1/2 lg:top-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2
            lg:w-full lg:max-w-sm lg:rounded-3xl lg:border
            animate-in slide-in-from-bottom lg:zoom-in-95 duration-200">
                        <div className="w-10 h-1 bg-border rounded-full mx-auto mb-4 lg:hidden" />
                        <h2 className="text-lg font-bold mb-5">Nueva Meta</h2>

                        <div className="space-y-4">
                            {/* Emoji selector */}
                            <div>
                                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">Emoji <span className="text-2xl ml-1">{emoji}</span></label>
                                <div className="flex flex-wrap gap-1.5">
                                    {GOAL_EMOJIS.map(e => (
                                        <button key={e} onClick={() => setEmoji(e)} className={`p-2 rounded-xl text-lg transition-all ${emoji === e ? 'bg-primary/20 ring-1 ring-primary' : 'hover:bg-secondary/70'}`}>{e}</button>
                                    ))}
                                </div>
                            </div>

                            {/* Nombre */}
                            <div>
                                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">Nombre de la Meta</label>
                                <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Ej: Fondo de emergencia, Vacaciones..."
                                    autoFocus className="w-full bg-secondary/50 rounded-xl px-4 py-3 text-sm outline-none focus:ring-1 focus:ring-primary/50" />
                            </div>

                            {/* Montos */}
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">Monto Objetivo</label>
                                    <input type="number" value={target} onChange={e => setTarget(e.target.value)} placeholder="0"
                                        className="w-full bg-secondary/50 rounded-xl px-4 py-3 text-sm outline-none font-bold" />
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">Ya tengo</label>
                                    <input type="number" value={current} onChange={e => setCurrent(e.target.value)}
                                        className="w-full bg-secondary/50 rounded-xl px-4 py-3 text-sm outline-none" />
                                </div>
                            </div>

                            {/* Fecha límite */}
                            <div>
                                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">Fecha Límite (opcional)</label>
                                <input type="date" value={deadline} onChange={e => setDeadline(e.target.value)}
                                    className="w-full bg-secondary/50 rounded-xl px-4 py-3 text-sm outline-none" />
                            </div>

                            {error && <p className="text-destructive text-xs bg-destructive/10 border border-destructive/20 rounded-xl px-3 py-2">{error}</p>}

                            <button onClick={handleCreate} disabled={!name.trim() || !target || isPending}
                                className="w-full py-4 rounded-2xl font-bold text-sm bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-40 flex items-center justify-center gap-2">
                                {isPending ? <><Loader2 size={18} className="animate-spin" /> Creando...</> : `${emoji} Crear Meta`}
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}
