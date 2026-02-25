# Manual de referencia (resumen) – Mobills
Fecha: 2026-02-25

> Guía resumida basada en el Mobills Help Center (Zendesk).

## 1) Exportación de datos (reportes)
- Ruta (según guía oficial): Manage → Export report.
- Permite filtrar: Categories, Accounts, Type, Period, y elegir formato.
- Formatos mencionados: PDF / XLS / CSV.
- Nota oficial: el reporte considera solo gastos/ingresos **pagados**; no exporta pendientes ni transferencias.

## 2) Importar estado de cuenta / tarjetas vía OFX
- OFX es un formato que bancos/operadores permiten descargar y contiene estado de cuenta.
- Mobills permite importar transacciones bancarias y facturas de tarjeta vía OFX.
- Flujo típico:
  1) More Options → Manage → Import data
  2) Import OFX
  3) Seleccionar archivo
  4) Revisar lista antes de confirmar (editar Description/Category/Accounts o excluir items)
- Web: import desde pantalla de Transactions → importar y asociar a “Debit” o “Credit card”, cuenta y/o factura.

## 3) Importar Excel (XLSX) – plantilla obligatoria
- Mobills requiere un **template** específico (no sirve el Excel “tal cual” del banco).
- Columnas requeridas (desde A1): DATE, DESCRIPTION, VALUE, ACCOUNT, CATEGORY.
- Reglas relevantes:
  - Fecha en formato dd/mm/yyyy como texto.
  - Ingresos positivos; gastos negativos.
  - Separador decimal con punto; sin fórmulas.
  - En Android: el archivo debe estar en memoria interna (no en nube) para seleccionarlo.
- Importación disponible en iOS, Android y Web con rutas específicas (Manage → Import data).

## 4) Importar gastos desde SMS / notificaciones
- iOS: implementado para SMS (copiar contenido del SMS y abrir Mobills para importarlo).
- Android: requiere permiso de acceso a notificaciones (Settings → Read notification).
- Una vez activo: Mobills notifica cuando lee un SMS o notificación; al tocar la notificación se ingresa el gasto.

## 5) Índice oficial (enlaces)
- Data export section: https://mobills.zendesk.com/hc/en-us/sections/360012089353-Data-export
- Export data: https://mobills.zendesk.com/hc/en-us/articles/360051811854-How-to-export-my-data-on-Mobills
- Import OFX: https://mobills.zendesk.com/hc/en-us/articles/360051606394-How-to-import-my-bank-account-data-OFX-on-Mobills
- Import Excel troubleshooting / template: https://mobills.zendesk.com/hc/en-us/articles/360051619453-I-can-t-import-excel-spreadsheets
- Import from SMS/notifications: https://mobills.zendesk.com/hc/en-us/articles/360051695074-How-to-import-expenses-using-notifications-or-SMS-to-Mobills
