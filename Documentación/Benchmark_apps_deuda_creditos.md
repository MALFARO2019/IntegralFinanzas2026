# Benchmark de aplicaciones para manejo de créditos, tarjetas y reducción de deuda

**Alcance:** investigación y lista de funcionalidades/cálculos recomendados para una app enfocada en **tarjetas de crédito**, préstamos y estrategias de pago para **reducción de deuda**.

---

## 1) Apps líderes (benchmark)

### 1.1 Planificación y seguimiento de pago de deudas (snowball/avalanche)

**Debt Payoff Planner (web/app)**
- Consolida deudas, compara **snowball vs avalanche**, permite simular **pagos extra**, muestra **fecha "debt-free"** y gráficos de avance.
- Precio publicado: desde **≈ US$2/mes** (plan Pro).
- Fuente oficial: https://www.debtpayoffplanner.com/

**Undebt.it (web)**
- Calculadora/gestor de plan de pagos con **snowball/avalanche**.
- En "Plus" añade: **cuentas ilimitadas**, **exportar a Excel**, **tasas promocionales (APR 0% por X meses)**, recordatorios por **SMS**, etc.
- Fuente oficial: https://undebt.it/

**Debt Snowball / Debt Free (iOS)**
- Registra múltiples deudas, define frecuencia de pago, separa **principal vs interés** por pago y compara estrategias (incluye snowball/avalanche) con fechas y ahorro estimado.
- Fuente oficial (App Store): https://apps.apple.com/

### 1.2 Presupuesto + tarjetas + metas de "pay down"

**Monarch Money (web/app)**
- Integra préstamos y **tarjetas** en metas de "paydown", con **APR**, **pago mínimo** y **pago planificado**; permite **escenarios**.
- Fuente oficial (help center): https://help.monarch.com/

**Rocket Money (web/app)**
- Control de gasto, suscripciones y cuentas conectadas; incluye presupuesto, net worth y monitoreo (según ficha oficial).
- Fuente oficial (App Store): https://apps.apple.com/us/app/rocket-money-bills-budgets/id1130616675

**YNAB (web/app)**
- Manejo específico de tarjetas: categoría automática de **Credit Card Payment** para reservar el pago futuro y objetivos de **debt payoff** para saldos arrastrados.
- Fuente oficial: https://www.ynab.com/blog/how-to-do-credit-cards-in-ynab

### 1.3 Monitoreo de crédito (score/reportes/alertas)

> Nota: estos productos y burós varían mucho por país. En varios mercados (incluido Costa Rica) el acceso a burós/alertas puede requerir proveedores locales.

**Experian App**
- Acceso a reporte, alertas por cambios y herramientas adicionales (según el sitio oficial).
- Fuente oficial: https://www.experian.com/credit/experian-app/

**Intuit Credit Karma**
- Monitoreo de Equifax y TransUnion con alertas por cambios (inquiries, cuentas nuevas, etc.).
- Fuente oficial: https://www.creditkarma.com/credit-monitoring

### 1.4 Riesgo de dependencia: cierre de servicios

- **Tally** anunció su cierre (riesgo típico de depender de un único proveedor "automático").
- Referencia pública: https://www.linkedin.com/company/meettally/

**Implicación para tu diseño:** soportar siempre modo **manual + importación/exportación (CSV/Excel)**, no depender 100% de integraciones bancarias.

---

## 2) Funcionalidad "completa" recomendada (para tu app)

### A) Catálogo de productos de deuda (modelo de datos)

**Por cuenta (tarjeta o préstamo):**
- Tipo: tarjeta revolutiva, préstamo cuota fija, línea de crédito, BNPL, etc.
- Moneda, entidad, número enmascarado, estado (activa/cerrada).
- **APR/TEA**, tasa moratoria, comisiones (anualidad, mantenimiento, seguros).
- **Pago mínimo** (monto o fórmula), fecha de corte, fecha de pago, día de débito automático.
- Límite de crédito (tarjetas) y **utilización**.
- Promociones: **APR 0% por X meses**, balance transfer (fee %), "grace period".

### B) Plan de ataque (payoff)

- Estrategias: **Avalanche (APR mayor primero)**, **Snowball (saldo menor primero)** y **Custom** (orden manual).
- Reglas: pagos mínimos + **pago extra** global o por cuenta; **rollover** automático cuando una deuda se liquida.
- Simulación "What-if": cambiar pago extra, tasa, promo, fee, consolidación; comparar escenarios.
- Visual: fecha "debt-free", interés total, ahorro vs escenario base.

### C) Operación diaria (tarjetas)

- Registro de transacciones (manual/sincronizado), categoría, comercio.
- Gestión de ciclo: **corte**, **pago**, recordatorios, autopay.
- Alertas: pago próximo, pago atrasado, variación de saldo, exceso de utilización, comisión inesperada.

### D) Integraciones / portabilidad

- Conectores bancarios (donde aplique) y, siempre:
  - Alta manual rápida.
  - Importación CSV.
  - Exportación CSV/Excel.

### E) Seguridad

- MFA/biometría, cifrado en reposo y tránsito.
- Acceso "read-only" cuando sea posible.
- Bitácora/auditoría de cambios.

---

## 3) Cálculos requeridos (incluye tarjetas de crédito)

### 3.1 Conversión de tasas

- **Tasa diaria:** `r_d = APR / base_días` (base 365 o 360, parametrizable).
- **Tasa mensual nominal (aprox):** `r_m ≈ APR/12` (para estimaciones).
- **Tasa efectiva anual (si normalizas):** `TEA = (1 + r_d)^(base_días) - 1`.

### 3.2 Interés en tarjetas (revolutivo)

Soporte para método común **Average Daily Balance (ADB)**:
- `Interés_periodo = ADB × r_d × días_del_ciclo`.

**Ejemplo:**
- APR 24% con base 365 -> `r_d = 0.24/365 = 0.0006575`.
- ADB = 1,000,000 y ciclo 30 días -> interés ≈ `1,000,000 × 0.0006575 × 30 = 19,725`.

Casos a soportar:
- **Grace period** (si se paga 100% antes de vencimiento, interés 0 en compras elegibles).
- Compras vs adelantos de efectivo (tasas distintas + fee).
- Interés promocional por rango de fechas (APR 0% por X meses).

### 3.3 Pago mínimo (tarjetas)

No existe una única fórmula universal; soportar plantillas configurables, por ejemplo:
- `min = max(monto_fijo, %saldo)`.
- `min = interés + %principal (+ fees)`.
- `min = max(min_fijo, interés + 1% del saldo)`.

### 3.4 Amortización (préstamos cuota fija)

- Pago mensual (tasa fija):
  - `PMT = P × r_m / (1 - (1+r_m)^(-n))`
- Interés por periodo: `I_t = saldo_t × r_m`
- Principal: `A_t = PMT - I_t`

### 3.5 Simulación de payoff (snowball/avalanche/custom)

Algoritmo por periodo:
1. Calcular interés y sumar fees.
2. Aplicar **mínimos** a todas las deudas.
3. Aplicar **pago extra** a la deuda objetivo según estrategia.
4. Cuando una deuda llega a 0: liberar su pago y **rolarlo** a la siguiente.
5. Resultados: cronograma, fecha debt-free, interés total, ahorro vs baseline.

### 3.6 Indicadores clave

- **Utilización:** `saldo_revolutivo_total / límite_total` (por tarjeta y global).
- **DTI (opcional):** `pagos_mensuales_deuda / ingreso_mensual_bruto`.
- Interés pagado a la fecha, interés proyectado, costo total, net worth.

---

## 4) Referencias (fuentes oficiales / páginas de producto)

- Debt Payoff Planner: https://www.debtpayoffplanner.com/
- Undebt.it: https://undebt.it/
- Monarch Money Help: https://help.monarch.com/
- YNAB (tarjetas): https://www.ynab.com/blog/how-to-do-credit-cards-in-ynab
- Experian App: https://www.experian.com/credit/experian-app/
- Credit Karma monitoring: https://www.creditkarma.com/credit-monitoring
- Rocket Money (App Store): https://apps.apple.com/us/app/rocket-money-bills-budgets/id1130616675
- Tally (referencia pública en LinkedIn): https://www.linkedin.com/company/meettally/
