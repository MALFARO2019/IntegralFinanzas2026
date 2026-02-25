"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'

type Currency = 'CRC' | 'USD' | 'EUR'
type Language = 'es-CR' | 'en-US'

interface PreferencesContextType {
    currency: Currency
    setCurrency: (c: Currency) => void
    language: Language
    setLanguage: (l: Language) => void
    formatMoney: (amount: number) => string
}

const PreferencesContext = createContext<PreferencesContextType | undefined>(undefined)

export function PreferencesProvider({ children }: { children: React.ReactNode }) {
    const [currency, setCurrency] = useState<Currency>('CRC')
    const [language, setLanguage] = useState<Language>('es-CR')

    // Cargar de localStorage si existe
    useEffect(() => {
        const savedL = localStorage.getItem('integral_lang') as Language
        const savedC = localStorage.getItem('integral_curr') as Currency
        if (savedL) setLanguage(savedL)
        if (savedC) setCurrency(savedC)
    }, [])

    useEffect(() => {
        localStorage.setItem('integral_lang', language)
        localStorage.setItem('integral_curr', currency)
    }, [language, currency])

    const formatMoney = (amount: number) => {
        return new Intl.NumberFormat(language, {
            style: 'currency',
            currency: currency,
            maximumFractionDigits: 0
        }).format(amount)
    }

    return (
        <PreferencesContext.Provider value={{ currency, setCurrency, language, setLanguage, formatMoney }}>
            {children}
        </PreferencesContext.Provider>
    )
}

export function usePreferences() {
    const context = useContext(PreferencesContext)
    if (context === undefined) {
        throw new Error('usePreferences must be used within a PreferencesProvider')
    }
    return context
}
