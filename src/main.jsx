import React, { useState } from 'react'
import ReactDOM from 'react-dom/client'
import { WagmiProvider } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useAppKit, useAppKitAccount } from '@reown/appkit/react'
import { wagmiAdapter } from './appkit'
import './styles.css'

const queryClient = new QueryClient()

const NETWORKS = [
  ['solana', 'Solana', ['USDC', 'USDT']],
  ['arbitrum', 'Arbitrum', ['USDC']],
  ['base', 'Base', ['USDC']],
  ['optimism', 'Optimism', ['USDC']],
  ['polygon', 'Polygon', ['USDC']],
  ['avalanche', 'Avalanche', ['USDC', 'USDT']],
  ['ethereum', 'Ethereum', ['USDC', 'USDT']],
  ['bsc', 'BNB Chain', []]
]

function App() {
  const { open } = useAppKit()
  const { address, isConnected } = useAppKitAccount()

  const [amount, setAmount] = useState('18,00')
  const [network, setNetwork] = useState('solana')
  const [token, setToken] = useState('USDC')

  const selectedNetwork = NETWORKS.find(item => item[0] === network)

  function chooseNetwork(id) {
    const next = NETWORKS.find(item => item[0] === id)
    setNetwork(id)
    if (!next[2].includes(token)) {
      setToken(next[2][0] || '')
    }
  }

  return (
    <main>
      <section>
        <div className="top">
          <b>LIBRE <span>Pay</span></b>
          <em>Universal</em>
        </div>

        <label className="amountLabel">Importe</label>
        <div className="amountRow">
          <input
            className="amountInput"
            inputMode="decimal"
            value={amount}
            onChange={e => setAmount(e.target.value.replace(/[^0-9,.]/g, ''))}
            aria-label="Importe en euros"
          />
          <span>€</span>
        </div>

        <p>Elige red, stablecoin y wallet</p>

        <h2>1. Red de pago</h2>
        <div className="grid">
          {NETWORKS.map(item => (
            <button
              key={item[0]}
              className={network === item[0] ? 'sel' : ''}
              onClick={() => chooseNetwork(item[0])}
            >
              {item[1]}
            </button>
          ))}
        </div>

        <h2>2. Stablecoin</h2>
        <div className="grid">
          {['USDC', 'USDT'].map(item => (
            <button
              key={item}
              disabled={!selectedNetwork[2].includes(item)}
              className={token === item ? 'sel' : ''}
              onClick={() => setToken(item)}
            >
              {item}
            </button>
          ))}
        </div>

        <h2>3. Wallet</h2>
        {isConnected ? (
          <div className="ok">
            <b>Wallet conectada</b>
            <small>{address?.slice(0, 8)}…{address?.slice(-6)}</small>
            <button className="walletBtn" onClick={() => open({ view: 'Account' })}>
              Gestionar wallet
            </button>
          </div>
        ) : (
          <button className="walletBtn" onClick={() => open({ view: 'Connect' })}>
            Conectar wallet
          </button>
        )}

        <div className="summary">
          <b>Pago preparado</b>
          <span>{amount || '0'} € · {token || 'sin token'} · {selectedNetwork?.[1]}</span>
        </div>

        <footer>Reown AppKit · EVM + Solana · WalletConnect</footer>
      </section>
    </main>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <WagmiProvider config={wagmiAdapter.wagmiConfig}>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </WagmiProvider>
)

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {})
  })
}
