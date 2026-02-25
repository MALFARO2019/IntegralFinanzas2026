import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { PreferencesProvider } from '@/lib/preferences-context'
import { AppShell } from '@/components/app-shell'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Integral Finanzas 2026',
  description: 'Proyección y Control Financiero Avanzado',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es-CR" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen bg-background font-sans antialiased text-foreground`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <PreferencesProvider>
            <AppShell>
              {children}
            </AppShell>
          </PreferencesProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
