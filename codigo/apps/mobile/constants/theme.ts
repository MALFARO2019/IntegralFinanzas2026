// Sistema de colores y espaciado FinTech para Integral Finanzas
// Reutilizable en todas las pantallas de la app móvil

export const Colors = {
  // Fondos (dark mode)
  background: '#0D0D12',
  card: '#15151E',
  cardBorder: '#23233A',
  surface: '#1E1E2A',

  // Marca
  primary: '#7C3AED',   // Violeta primario
  primaryLight: '#9D5CF5',
  primaryMuted: '#7C3AED25',

  // Acento
  accent: '#10B981',   // Verde esmeralda
  accentMuted: '#10B98120',

  // Semántica
  destructive: '#EF4444',
  destructiveMuted: '#EF444415',
  warning: '#F59E0B',
  warningMuted: '#F59E0B20',

  // Texto
  foreground: '#F4F4F8',
  foregroundMuted: '#8E8EA0',
  foregroundSubtle: '#4B4B65',

  // Moneda
  income: '#10B981',
  expense: '#EF4444',
  transfer: '#8E8EA0',
}

export const Fonts = {
  sizes: {
    xs: 10,
    sm: 12,
    base: 14,
    md: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 28,
  },
  weights: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
    black: '900' as const,
  },
}

export const Radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  full: 9999,
}

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
}
