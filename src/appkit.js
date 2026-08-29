import { createAppKit } from '@reown/appkit'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { SolanaAdapter } from '@reown/appkit-adapter-solana'
import {
  mainnet,
  arbitrum,
  base,
  optimism,
  polygon,
  avalanche,
  bsc,
  solana
} from '@reown/appkit/networks'

export const projectId = 'b46112fce6b30df0b7dc273dce7f32e4'
export const appUrl = window.location.origin

// Redes principales para pagos stablecoin soportadas por la arquitectura EVM + Solana.
export const networks = [
  mainnet,
  arbitrum,
  base,
  optimism,
  polygon,
  avalanche,
  bsc,
  solana
]

export const wagmiAdapter = new WagmiAdapter({
  projectId,
  networks: [mainnet, arbitrum, base, optimism, polygon, avalanche, bsc]
})

export const solanaAdapter = new SolanaAdapter()

export const appKit = createAppKit({
  adapters: [wagmiAdapter, solanaAdapter],
  networks,
  projectId,
  metadata: {
    name: 'LIBRE Pay',
    description: 'Pago multired con stablecoins',
    url: appUrl,
    icons: []
  },
  features: {
    headless: true,
    analytics: true
  },
  allWallets: 'SHOW',
  themeMode: 'light',
  themeVariables: {
    '--w3m-accent': '#00B3A6'
  }
})
