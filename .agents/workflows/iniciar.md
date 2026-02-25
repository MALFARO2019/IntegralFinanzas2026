---
description: Iniciar todos los servicios de desarrollo de Integral Finanzas 2026
---

# Workflow: Iniciar Integral Finanzas

Arranca los servicios necesarios para desarrollo local del proyecto.

## Servicios disponibles

| Servicio | Puerto | Directorio |
|---|---|---|
| Web (Next.js) | 3010 | `codigo/apps/web` |
| Móvil (Expo) | 8081 | `codigo/apps/mobile` |

---

## Paso 1 — Iniciar la App Web

// turbo
Correr el servidor Next.js en el puerto 3010:

```bash
cd C:\AntiGravityDev\IntegralFinanzas2026\codigo\apps\web && npm run dev
```

Espera hasta ver: `▲ Next.js ready on http://localhost:3010`

Luego abre: http://localhost:3010

---

## Paso 2 — Iniciar la App Móvil (opcional)

Solo si vas a probar en Expo Go desde el teléfono:

// turbo  
```bash
cd C:\AntiGravityDev\IntegralFinanzas2026\codigo\apps\mobile && npx expo start
```

Escanea el QR con Expo Go (teléfono en la misma red Wi-Fi).

---

## Notas importantes

- **SIEMPRE** correr los comandos desde la subcarpeta correcta, **NO** desde la raíz del proyecto.
- Si el puerto 3010 está ocupado, matar el proceso anterior con `Ctrl+C`.
- El mismo usuario Supabase funciona en web y móvil simultáneamente.
- Para debug de Node.js (Server Components): usar `npm run debug` en vez de `npm run dev`.
