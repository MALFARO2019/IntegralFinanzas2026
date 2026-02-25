"use client"

import * as React from "react"
import { Moon, Sun, Settings } from "lucide-react"
import { useTheme } from "next-themes"
import { usePreferences } from "@/lib/preferences-context"

export function SettingsSelector() {
    const { theme, setTheme } = useTheme()
    const { currency, setCurrency, language, setLanguage } = usePreferences()
    const [open, setOpen] = React.useState(false)

    const toggleTheme = () => {
        setTheme(theme === "dark" ? "light" : "dark")
    }

    return (
        <div className="relative">
            <button
                onClick={() => setOpen(!open)}
                className="p-2 rounded-full bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors"
            >
                <Settings size={20} />
            </button>

            {open && (
                <div className="absolute top-12 right-0 w-64 p-4 bg-card border border-border/50 shadow-xl rounded-xl z-50 flex flex-col gap-4">

                    <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold">Tema Visual</span>
                        <button onClick={toggleTheme} className="p-2 rounded-md bg-secondary flex gap-2 items-center">
                            {theme === "dark" ? <Moon size={16} /> : <Sun size={16} />}
                            <span className="text-xs uppercase">{theme}</span>
                        </button>
                    </div>

                    <div className="flex items-center justify-between border-t border-border/50 pt-3">
                        <span className="text-sm font-semibold">Moneda</span>
                        <select
                            value={currency}
                            onChange={(e) => setCurrency(e.target.value as any)}
                            className="bg-secondary text-xs p-1 rounded-md border-none outline-none"
                        >
                            <option value="CRC">CRC (₡)</option>
                            <option value="USD">USD ($)</option>
                            <option value="EUR">EUR (€)</option>
                        </select>
                    </div>

                    <div className="flex items-center justify-between border-t border-border/50 pt-3">
                        <span className="text-sm font-semibold">Idioma</span>
                        <select
                            value={language}
                            onChange={(e) => setLanguage(e.target.value as any)}
                            className="bg-secondary text-xs p-1 rounded-md border-none outline-none"
                        >
                            <option value="es-CR">Español (CR)</option>
                            <option value="en-US">English (US)</option>
                        </select>
                    </div>

                </div>
            )}
        </div>
    )
}
