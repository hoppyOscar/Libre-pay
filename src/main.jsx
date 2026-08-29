import React, { useMemo, useState } from 'react'
import ReactDOM from 'react-dom/client'
import { WagmiProvider } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {
  useAppKitAccount,
  useAppKitWallets,
  useAppKitNetwork
} from '@reown/appkit/react'
import { wagmiAdapter, projectId } from './appkit'
import './styles.css'

const queryClient = new QueryClient()

const PAYMENT_NETWORKS = [
  { id:'solana', name:'Solana', short:'SOL', family:'Solana', tokens:['USDC','USDT'], recommended:true, note:'Muy rápida · coste muy bajo' },
  { id:'arbitrum', name:'Arbitrum One', short:'ARB', family:'EVM', tokens:['USDC'], recommended:true, note:'L2 · comisiones bajas' },
  { id:'base', name:'Base', short:'BASE', family:'EVM', tokens:['USDC'], recommended:true, note:'L2 · USDC nativo' },
  { id:'optimism', name:'Optimism', short:'OP', family:'EVM', tokens:['USDC'], note:'L2 · USDC nativo' },
  { id:'polygon', name:'Polygon PoS', short:'POL', family:'EVM', tokens:['USDC'], note:'Coste bajo · USDC nativo' },
  { id:'avalanche', name:'Avalanche C-Chain', short:'AVAX', family:'EVM', tokens:['USDC','USDT'], note:'USDC y USDT oficiales' },
  { id:'ethereum', name:'Ethereum', short:'ETH', family:'EVM', tokens:['USDC','USDT'], note:'Máxima compatibilidad · gas superior' },
  { id:'bsc', name:'BNB Smart Chain', short:'BNB', family:'EVM', tokens:[], note:'Wallet compatible; token de cobro pendiente de activación verificada' }
]

function WalletCard({ wallet, onConnect, busy }) {
  const name = wallet?.name || 'Wallet'
  const image = wallet?.imageUrl || wallet?.image_url || wallet?.icon
  const injected = Boolean(wallet?.isInjected || wallet?.type === 'INJECTED' || wallet?.rdns)
  return (
    <button className="walletCard" disabled={busy} onClick={() => onConnect(wallet)}>
      <div className="walletIcon">
        {image ? <img src={image} alt="" /> : <span>{name.slice(0,1)}</span>}
      </div>
      <div className="walletText">
        <strong>{name}</strong>
        <small>{injected ? 'Instalada en este dispositivo' : 'Conectar wallet'}</small>
      </div>
      {injected && <span className="installed">INSTALADA</span>}
      <span className="arrow">›</span>
    </button>
  )
}

function App() {
  const {
    wallets, wcWallets, isFetchingWallets, isInitialized,
    connectingWallet, connect, fetchWallets
  } = useAppKitWallets()

  const { address, isConnected } = useAppKitAccount()
  const { caipNetwork, switchNetwork } = useAppKitNetwork()

  const [selectedNetwork, setSelectedNetwork] = useState('solana')
  const [selectedToken, setSelectedToken] = useState('USDC')
  const [showAllNetworks, setShowAllNetworks] = useState(false)
  const [showAllWallets, setShowAllWallets] = useState(false)
  const [search, setSearch] = useState('')
  const [error, setError] = useState('')

  const network = PAYMENT_NETWORKS.find(n => n.id === selectedNetwork)

  const orderedWallets = useMemo(() => {
    const list = [...(wallets || [])]
    const installed = w => Boolean(w?.isInjected || w?.type === 'INJECTED' || w?.rdns)
    return list.sort((a,b) => Number(installed(b)) - Number(installed(a)))
  }, [wallets])

  function chooseNetwork(id) {
    const n = PAYMENT_NETWORKS.find(x => x.id === id)
    if (!n) return
    setSelectedNetwork(id)
    if (!n.tokens.includes(selectedToken)) {
      setSelectedToken(n.tokens[0] || '')
    }
  }

  async function handleConnect(wallet) {
    setError('')
    try {
      await connect(wallet)
    } catch {
      setError('No se pudo abrir esta wallet. Prueba otra wallet o WalletConnect.')
    }
  }

  async function searchWallets(value) {
    setSearch(value)
    try {
      await fetchWallets({ search: value || undefined, entries: 50 })
    } catch {}
  }

  function continuePayment() {
    if (!selectedToken) {
      setError('Esta red todavía no tiene un token de cobro activado en LIBRE Pay.')
      return
    }
    window.dispatchEvent(new CustomEvent('librepay:wallet-ready', {
      detail: {
        address,
        network: selectedNetwork,
        token: selectedToken,
        caipNetwork: caipNetwork?.name
      }
    }))
  }

  if (!projectId) {
    return (
      <main className="page">
        <section className="panel">
          <div className="brand">LIBRE <span>Pay</span></div>
          <h1>Falta activar Reown</h1>
          <p className="muted">Añade tu Project ID en <code>VITE_REOWN_PROJECT_ID</code>.</p>
        </section>
      </main>
    )
  }

  return (
    <main className="page">
      <section className="panel">
        <div className="top">
          <div className="brand">LIBRE <span>Pay</span></div>
          <div className="pill">Multired</div>
        </div>

        <div className="amount">18,00 €</div>
        <div className="token">Elige red, stablecoin y wallet</div>

        <div className="divider" />

        <h1>1. Red de pago</h1>
        <p className="muted">Mostramos primero las redes más prácticas para pagos en stablecoins.</p>

        <div className="networkGrid">
          {PAYMENT_NETWORKS.slice(0, showAllNetworks ? PAYMENT_NETWORKS.length : 4).map(n => (
            <button
              key={n.id}
              className={`networkCard ${selectedNetwork===n.id ? 'selected' : ''}`}
              onClick={() => chooseNetwork(n.id)}
            >
              <div className="networkBadge">{n.short}</div>
              <div>
                <strong>{n.name}</strong>
                <small>{n.note}</small>
              </div>
              {n.recommended && <span className="recommended">RECOMENDADA</span>}
            </button>
          ))}
        </div>

        <button className="secondary" onClick={() => setShowAllNetworks(v => !v)}>
          {showAllNetworks ? 'Mostrar redes principales' : 'Ver todas las redes'}
        </button>

        <h1 className="sectionTitle">2. Stablecoin</h1>
        <div className="tokenGrid">
          {['USDC','USDT'].map(t => {
            const enabled = network?.tokens.includes(t)
            return (
              <button
                key={t}
                disabled={!enabled}
                className={`tokenChoice ${selectedToken===t ? 'selected' : ''} ${!enabled ? 'disabled' : ''}`}
                onClick={() => enabled && setSelectedToken(t)}
              >
                <strong>{t}</strong>
                <small>{enabled ? `Disponible en ${network.name}` : 'No activado en esta red'}</small>
              </button>
            )
          })}
        </div>

        <h1 className="sectionTitle">3. Wallet</h1>
        <p className="muted">
          LIBRE Pay detecta primero las wallets instaladas. Si no aparece la tuya,
          búscala entre las compatibles con WalletConnect.
        </p>

        {isConnected ? (
          <div className="connectedBox">
            <div className="successMini">✓</div>
            <div>
              <strong>Wallet conectada</strong>
              <small>{address?.slice(0,8)}…{address?.slice(-6)} · {caipNetwork?.name || 'red detectada'}</small>
            </div>
            <button className="primary compact" onClick={continuePayment}>
              Continuar con {selectedToken || 'pago'}
            </button>
          </div>
        ) : (!isInitialized || isFetchingWallets) ? (
          <div className="loading">Detectando wallets instaladas…</div>
        ) : (
          <>
            <div className="walletList">
              {orderedWallets.slice(0, showAllWallets ? orderedWallets.length : 5).map((wallet,i) => (
                <WalletCard
                  key={wallet?.id || wallet?.name || i}
                  wallet={wallet}
                  onConnect={handleConnect}
                  busy={Boolean(connectingWallet)}
                />
              ))}
            </div>

            {orderedWallets.length > 5 &&
              <button className="secondary" onClick={() => setShowAllWallets(v => !v)}>
                {showAllWallets ? 'Mostrar menos wallets' : 'Ver más wallets detectadas'}
              </button>
            }

            <div className="or"><span>o</span></div>
            <input
              className="search"
              value={search}
              onChange={e => searchWallets(e.target.value)}
              placeholder="Buscar MetaMask, Phantom, Trust, OKX…"
            />

            {search && (
              <div className="walletList searchResults">
                {(wcWallets || []).slice(0,10).map((wallet,i) => (
                  <WalletCard
                    key={wallet?.id || wallet?.name || i}
                    wallet={wallet}
                    onConnect={handleConnect}
                    busy={Boolean(connectingWallet)}
                  />
                ))}
              </div>
            )}
          </>
        )}

        {error && <div className="error">{error}</div>}

        <div className="supported">
          <b>Red seleccionada:</b> {network?.name}<br/>
          <b>Stablecoin:</b> {selectedToken || 'pendiente de activar'}<br/>
          <b>Arquitectura:</b> Reown AppKit · EVM + Solana · WalletConnect
        </div>

        <div className="future">
          <strong>Siguiente extensión multichain</strong>
          <small>TRON y TON se incorporarán mediante sus adaptadores nativos de AppKit, especialmente para ampliar USDT sin mezclar representaciones bridgeadas.</small>
        </div>
      </section>
    </main>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <WagmiProvider config={wagmiAdapter.wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </WagmiProvider>
  </React.StrictMode>
)

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => navigator.serviceWorker.register('/sw.js').catch(() => {}))
}
