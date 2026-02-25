"use client"

import { ShoppingCart, Coffee, Home, Car, Briefcase, TrendingUp, ArrowLeftRight, HelpCircle } from 'lucide-react'
import { usePreferences } from '@/lib/preferences-context'

export type TxnDirection = 'INFLOW' | 'OUTFLOW' | 'TRANSFER'

export interface TxnRowData {
    id: string
    payeeText: string
    amount: number
    direction: TxnDirection
    txnDate: string
    categoryName?: string
    status?: string
    needsReview?: boolean
}

const categoryIcons: Record<string, React.ElementType> = {
    'Alimentación': Coffee,
    'Hogar': Home,
    'Transporte': Car,
    'Trabajo': Briefcase,
    'Inversiones': TrendingUp,
    'Transferencia': ArrowLeftRight,
    'Supermercado': ShoppingCart,
}

export function TxnRow({ txn }: { txn: TxnRowData }) {
    const { formatMoney } = usePreferences()

    const Icon = categoryIcons[txn.categoryName || ''] ?? HelpCircle
    const isInflow = txn.direction === 'INFLOW'
    const isTransfer = txn.direction === 'TRANSFER'

    return (
        <div className={`flex items-center gap-3 px-4 py-3 hover:bg-secondary/30 transition-colors rounded-xl ${txn.needsReview ? 'border-l-2 border-yellow-500/70' : ''}`}>

            {/* Ícono de categoría */}
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${isInflow ? 'bg-accent/15 text-accent' :
                    isTransfer ? 'bg-muted text-muted-foreground' :
                        'bg-destructive/10 text-destructive'
                }`}>
                <Icon size={18} />
            </div>

            {/* Texto central */}
            <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">{txn.payeeText}</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                    {txn.categoryName && (
                        <span className="text-[10px] text-muted-foreground">{txn.categoryName}</span>
                    )}
                    {txn.needsReview && (
                        <span className="text-[9px] uppercase font-bold bg-yellow-500/20 text-yellow-400 px-1.5 py-0.5 rounded-full">
                            Revisar
                        </span>
                    )}
                    {txn.status === 'PENDING' && (
                        <span className="text-[9px] uppercase font-bold bg-muted text-muted-foreground px-1.5 py-0.5 rounded-full">
                            Pendiente
                        </span>
                    )}
                </div>
            </div>

            {/* Monto */}
            <span className={`text-sm font-bold shrink-0 ${isInflow ? 'text-accent' :
                    isTransfer ? 'text-muted-foreground' :
                        'text-destructive'
                }`}>
                {isInflow ? '+' : isTransfer ? '' : '-'}{formatMoney(txn.amount)}
            </span>
        </div>
    )
}
