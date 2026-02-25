# Plan de Funcionalidad Básica (MVP Mejorado) - Integral Finanzas 2026

## 1. Objetivo Principal
Desarrollar la base de una aplicación financiera **súper segura** (cifrado bancario AES, HMAC, SHA256) orientada principalmente al control presupuestario, proyección futura (Projected Cash Flow tipo Simplifi) y trabajo colaborativo. Soporte "Mobile-First" (y web) con modo offline-first (CashOrganizer).

## 2. Módulos del MVP (Funcionalidad Básica)

### A. Gestión de Cuentas, Ingreso y Revisión
- **Cuentas Soportadas:** Efectivo, Bancos, Tarjetas y Préstamos. Unificación de saldos en moneda base, pero soportando cuentas multi-moneda (Spendee).
- **Entrada Rápida y Reconciliación:** Modo manual ultra-rápido, importación OFX/Excel (Mobills/YNAB) con deduplicación.
- **Cola de Revisión y Flags:** Transacciones pueden marcarse como "Needs Review" (Monarch) para ser revisadas por el usuario o su socio en el hogar, usar "Flags" de colores (YNAB) y realizar "Splits" (dividirlas).

### B. Proyección y Simulador de Escenarios (Core Diferenciador)
- **Projected Cash Flow (Simplifi):** Gráfico que proyecte el saldo bancario a futuro (1 año) inyectando los "Scheduled Transactions", "Bills" y compras planificadas.
- **Calendario Recurrente (Monarch):** Visibilidad de "Próximos cobros de suscripciones" que disminuyen la liquidez automáticamente.
- **Rules Engine (Reglas):** Creación condicional (IF/THEN) para auto-categorizar y asignar tags a transacciones importadas.

### C. Tres Métodos de Presupuesto Coexistentes
- **Spending Plan (Simplifi - MVP Principal):** Basado en ingresos reales menos bills y suscripciones, calculando exactamente "lo que queda para gastar hoy".
- **Zero-Based Budget (YNAB):** Asignación obligatoria ("Auto-Assign") de cada unidad monetaria disponible a los sobres ("Targets") antes de gastar.
- **Budgets Tradicionales con Alertas (Spendee):** Avisos proactivos al 75% y 90% de consumo por categoría.

### D. Metas Financieras, Ahorro y Deuda
- **Targets (Metas YNAB):** Definir monto y fecha límite; la app calcula automáticamente el aporte mensual y lo inyecta en el Spending Plan.
- **Simulador Snowball/Avalanche:** Para pagos de tarjeta de crédito, calcular fechas de libertad financiera proyectando pagos mínimos vs aportes extra.

### E. Hogares Compartidos (Shared Wallets / Households)
- **Colaboración Nativa:** Permitir invitar a familiares con roles (Viewer, Editor) para gestionar un presupuesto central, manteniendo una "Auditoría de Cambios" para saber quién pagó qué (Spendee/Monarch).

## 3. Arquitectura y Stack
- **Frontend App:** React Native o Flutter para iOS / Android asegurando fluidez (UI/UX Pro Max, dark themes).
- **Frontend Web:** Next.js o Vite para administración detallada e importaciones de Excel que en móvil son incómodas.
- **Backend/BD:** Node.js (Nest.js/Express) + PostgreSQL (vía Supabase o Neon para rápido Auth, RLS y seguridad).

## 4. Hoja de Ruta Inmediata (Siguientes Pasos)
1. **Fase 1:** Diseño de UI visual en código (Layouts del Spending Plan y Projected Cash Flow).
2. **Fase 2:** Implementar base de datos PostgreSQL, Auth biométrico y JWT.
3. **Fase 3:** CRUD de Transacciones, Categorías y "Rules Engine" (Reglas automáticas).
4. **Fase 4:** Motor de proyecciones y calendario recurrente. Pruebas de usabilidad.
