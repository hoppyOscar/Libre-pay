# LIBRE Pay V5 — Multired

## Redes activadas en AppKit

- Solana
- Ethereum
- Arbitrum One
- Base
- Optimism
- Polygon PoS
- Avalanche C-Chain
- BNB Smart Chain

La interfaz solo permite seleccionar un token cuando la combinación ha sido activada explícitamente.

### USDC
Activado en:
- Ethereum
- Arbitrum
- Base
- Optimism
- Polygon
- Avalanche
- Solana

### USDT
Activado en:
- Ethereum
- Avalanche
- Solana

BNB Smart Chain se incluye como red wallet-compatible, pero el token de pago queda desactivado hasta fijar y verificar explícitamente el contrato que se quiera aceptar.

## TRON y TON

Reown AppKit los soporta nativamente en web, pero requieren una integración/adaptador diferente de la actual pila Wagmi + Solana. Por ello no se simula soporte: serán la siguiente extensión para USDT.

## Configuración

Copia `.env.example` a `.env`:

VITE_REOWN_PROJECT_ID=...
VITE_APP_URL=https://pay.tudominio.com

Después:

npm install
npm run dev
