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

export const projectId =
  'b46112fce6b30df0b7dc273dce7f32e4'

export const wagmiAdapter = new WagmiAdapter({
  projectId,
  networks: [
    mainnet,
    arbitrum,
    base,
    optimism,
    polygon,
    avalanche,
    bsc
  ]
})

export const appKit = createAppKit({
  adapters: [
    wagmiAdapter,
    new SolanaAdapter()
  ],

  networks: [
    mainnet,
    arbitrum,
    base,
    optimism,
    polygon,
    avalanche,
    bsc,
    solana
  ],

  projectId,

  metadata: {
    name: 'LIBRE Pay',
    description: 'Pago multired con stablecoins',
    url: window.location.origin,
    icons: []
  },

  allWallets: 'SHOW',

  themeMode: 'light',

  themeVariables: {
    '--w3m-accent': '#00B3A6'
  }
})
