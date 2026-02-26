"use client"

import { useState, useTransition } from 'react'
import { Plus, Trash2, Loader2, Tag } from 'lucide-react'
import { addCategory, deleteCategory } from '@/lib/category-actions'
import { SettingsSelector } from '@/components/settings-selector'

const EMOJI_SUGGESTIONS = ['🛒', '🏠', '🚗', '💊', '🎬', '📚', '✈️', '🍔', '☕', '💪', '🐾', '🎮', '💅', '🛠️', '🎁', '💼', '📱', '🎵', '🏋️', '🌿']
const COLORS = ['#8B5CF6', '#EC4899', '#F59E0B', '#10B981', '#3B82F6', '#EF4444', '#6366F1', '#14B8A6', '#F97316', '#84CC16']

interface Category {
    id: string
    name: string
    emoji: string
    type: string
    color: string
    isSystem: boolean
}

interface Props {
    categories: Category[]
}

export default function CategoriesClient({ categories }: Props) {
    const [showAdd, setShowAdd] = useState(false)
    const [name, setName] = useState('')
    const [emoji, setEmoji] = useState('📦')
    const [type, setType] = useState('EXPENSE')
    const [color, setColor] = useState('#8B5CF6')
    const [error, setError] = useState<string | null>(null)
    const [isPending, startTransition] = useTransition()

    const reset = () => { setName(''); setEmoji('📦'); setType('EXPENSE'); setColor('#8B5CF6'); setError(null) }

    const handleAdd = () => {
        if (!name.trim()) { setError('El nombre es requerido'); return }
        const fd = new FormData()
        fd.set('name', name); fd.set('emoji', emoji); fd.set('type', type); fd.set('color', color)
        startTransition(async () => {
            try { await addCategory(fd); reset(); setShowAdd(false) }
            catch (e: any) { setError(e.message) }
        })
    }

    const handleDelete = (id: string) => {
        startTransition(async () => {
            try { await deleteCategory(id) }
            catch (e: any) { setError(e.message) }
        })
    }

    const expense = categories.filter(c => c.type === 'EXPENSE' || c.type === 'BOTH')
    const income = categories.filter(c => c.type === 'INCOME')

    return (
        <div className="flex flex-col min-h-screen pb-24 lg:pb-0">

            {/* Header */}
            <div className="sticky top-0 z-30 bg-background/90 backdrop-blur-lg border-b border-border/50 px-4 pt-4 pb-3 flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-extrabold">Categorías</h1>
                    <p className="text-xs text-muted-foreground">{categories.length} categorías</p>
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={() => setShowAdd(true)} className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-primary-foreground rounded-xl text-xs font-bold hover:bg-primary/90 transition-all">
                        <Plus size={14} /> Nueva
                    </button>
                    <SettingsSelector />
                </div>
            </div>

            <div className="px-4 py-4 space-y-5">

                {/* Gastos */}
                {expense.length > 0 && (
                    <div>
                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 px-1">💸 Gastos</p>
                        <div className="bg-card border border-border/40 rounded-2xl overflow-hidden divide-y divide-border/30">
                            {expense.map(cat => (
                                <div key={cat.id} className="flex items-center gap-3 px-4 py-3.5 hover:bg-secondary/20 transition-colors">
                                    <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg shrink-0" style={{ backgroundColor: `${cat.color}20` }}>
                                        {cat.emoji}
                                    </div>
                                    <span className="flex-1 text-sm font-semibold">{cat.name}</span>
                                    <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: cat.color }} />
                                    {!cat.isSystem && (
                                        <button onClick={() => handleDelete(cat.id)} disabled={isPending} className="p-1.5 rounded-lg hover:bg-destructive/10 hover:text-destructive text-muted-foreground transition-colors">
                                            <Trash2 size={14} />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Ingresos */}
                {income.length > 0 && (
                    <div>
                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 px-1">💵 Ingresos</p>
                        <div className="bg-card border border-border/40 rounded-2xl overflow-hidden divide-y divide-border/30">
                            {income.map(cat => (
                                <div key={cat.id} className="flex items-center gap-3 px-4 py-3.5 hover:bg-secondary/20 transition-colors">
                                    <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg shrink-0" style={{ backgroundColor: `${cat.color}20` }}>
                                        {cat.emoji}
                                    </div>
                                    <span className="flex-1 text-sm font-semibold">{cat.name}</span>
                                    <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: cat.color }} />
                                    {!cat.isSystem && (
                                        <button onClick={() => handleDelete(cat.id)} disabled={isPending} className="p-1.5 rounded-lg hover:bg-destructive/10 hover:text-destructive text-muted-foreground transition-colors">
                                            <Trash2 size={14} />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {categories.length === 0 && (
                    <div className="text-center py-12">
                        <Tag size={40} className="mx-auto text-muted-foreground/30 mb-3" />
                        <p className="text-muted-foreground text-sm font-semibold">Sin categorías aún</p>
                        <p className="text-muted-foreground text-xs mt-1">Crea tus propias categorías de gasto e ingreso</p>
                    </div>
                )}
            </div>

            {/* FAB móvil */}
            <button onClick={() => setShowAdd(true)} className="fixed bottom-24 right-6 w-14 h-14 bg-primary text-primary-foreground rounded-2xl shadow-lg shadow-primary/30 flex items-center justify-center hover:scale-105 active:scale-95 transition-all z-40 lg:hidden">
                <Plus size={26} />
            </button>

            {/* Modal agregar categoría */}
            {showAdd && (
                <>
                    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" onClick={() => { setShowAdd(false); reset() }} />
                    <div className="fixed z-50 bg-card border-border/60 shadow-2xl overflow-y-auto p-5
            bottom-0 left-0 right-0 rounded-t-3xl border-t max-h-[88vh]
            lg:bottom-auto lg:left-1/2 lg:top-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2
            lg:w-full lg:max-w-sm lg:rounded-3xl lg:border
            animate-in slide-in-from-bottom lg:zoom-in-95 duration-200">

                        <div className="w-10 h-1 bg-border rounded-full mx-auto mb-4 lg:hidden" />
                        <h2 className="text-lg font-bold mb-5">Nueva Categoría</h2>

                        <div className="space-y-4">

                            {/* Tipo */}
                            <div className="flex gap-2 bg-secondary/50 p-1 rounded-xl">
                                {[['EXPENSE', '💸 Gasto'], ['INCOME', '💵 Ingreso'], ['BOTH', '🔄 Ambos']].map(([v, l]) => (
                                    <button key={v} onClick={() => setType(v)}
                                        className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all ${type === v ? 'bg-primary text-primary-foreground shadow' : 'text-muted-foreground'}`}>
                                        {l}
                                    </button>
                                ))}
                            </div>

                            {/* Nombre */}
                            <div>
                                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">Nombre</label>
                                <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Ej: Mascota, Gym, Suscripciones..."
                                    autoFocus className="w-full bg-secondary/50 rounded-xl px-4 py-3 text-sm outline-none focus:ring-1 focus:ring-primary/50" />
                            </div>

                            {/* Emoji */}
                            <div>
                                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">
                                    Emoji <span className="text-2xl ml-2">{emoji}</span>
                                </label>
                                <div className="grid grid-cols-10 gap-1">
                                    {EMOJI_SUGGESTIONS.map(e => (
                                        <button key={e} onClick={() => setEmoji(e)}
                                            className={`p-1.5 rounded-lg text-lg transition-all ${emoji === e ? 'bg-primary/20 ring-1 ring-primary' : 'hover:bg-secondary/70'}`}>
                                            {e}
                                        </button>
                                    ))}
                                </div>
                                <input type="text" value={emoji} onChange={e => setEmoji(e.target.value)} maxLength={2} placeholder="o escribe tu emoji..."
                                    className="mt-2 w-full bg-secondary/50 rounded-xl px-4 py-2 text-sm outline-none" />
                            </div>

                            {/* Color */}
                            <div>
                                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">Color</label>
                                <div className="flex gap-2 flex-wrap">
                                    {COLORS.map(c => (
                                        <button key={c} onClick={() => setColor(c)}
                                            className={`w-8 h-8 rounded-xl transition-all ${color === c ? 'ring-2 ring-offset-2 ring-offset-background scale-110' : 'hover:scale-105'}`}
                                            style={{ backgroundColor: c }} />
                                    ))}
                                </div>
                            </div>

                            {error && <p className="text-destructive text-xs bg-destructive/10 border border-destructive/20 rounded-xl px-3 py-2">{error}</p>}

                            <button onClick={handleAdd} disabled={!name.trim() || isPending}
                                className="w-full py-4 rounded-2xl font-bold text-sm bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-40 flex items-center justify-center gap-2">
                                {isPending ? <><Loader2 size={18} className="animate-spin" /> Guardando...</> : `${emoji} Crear Categoría`}
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}
