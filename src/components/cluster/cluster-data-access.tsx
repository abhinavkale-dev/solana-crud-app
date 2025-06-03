'use client'

import { clusterApiUrl, Connection } from '@solana/web3.js'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { StateCreator } from 'zustand'
import { createContext, ReactNode, useContext } from 'react'

export interface SolanaCluster {
  name: string
  endpoint: string
  network?: ClusterNetwork
  active?: boolean
}

export enum ClusterNetwork {
  Mainnet = 'mainnet-beta',
  Testnet = 'testnet',
  Devnet = 'devnet',
  Custom = 'custom',
}

// By default, we don't configure the mainnet-beta cluster
// The endpoint provided by clusterApiUrl('mainnet-beta') does not allow access from the browser due to CORS restrictions
// To use the mainnet-beta cluster, provide a custom endpoint
export const defaultClusters: SolanaCluster[] = [
  {
    name: 'devnet',
    endpoint: clusterApiUrl('devnet'),
    network: ClusterNetwork.Devnet,
  },
  { name: 'local', endpoint: 'http://localhost:8899' },
  {
    name: 'testnet',
    endpoint: clusterApiUrl('testnet'),
    network: ClusterNetwork.Testnet,
  },
]

interface ClusterStore {
  cluster: SolanaCluster
  clusters: SolanaCluster[]
  setCluster: (cluster: SolanaCluster) => void
  setClusters: (clusters: SolanaCluster[]) => void
  addCluster: (cluster: SolanaCluster) => void
  deleteCluster: (cluster: SolanaCluster) => void
}

const useClusterStore = create<ClusterStore>()(
  persist(
    (set, get): ClusterStore => ({
      cluster: defaultClusters[0],
      clusters: defaultClusters,
      setCluster: (cluster: SolanaCluster) => set({ cluster }),
      setClusters: (clusters: SolanaCluster[]) => set({ clusters }),
      addCluster: (cluster: SolanaCluster) => {
        try {
          new Connection(cluster.endpoint)
          const { clusters } = get()
          set({ clusters: [...clusters, cluster] })
        } catch (err) {
          console.error(`${err}`)
        }
      },
      deleteCluster: (cluster: SolanaCluster) => {
        const { clusters } = get()
        set({ clusters: clusters.filter((item: SolanaCluster) => item.name !== cluster.name) })
      },
    }),
    {
      name: 'solana-cluster-storage',
    }
  )
)

export interface ClusterProviderContext {
  cluster: SolanaCluster
  clusters: SolanaCluster[]
  addCluster: (cluster: SolanaCluster) => void
  deleteCluster: (cluster: SolanaCluster) => void
  setCluster: (cluster: SolanaCluster) => void

  getExplorerUrl(path: string): string
}

const Context = createContext<ClusterProviderContext>({} as ClusterProviderContext)

export function ClusterProvider({ children }: { children: ReactNode }) {
  const { cluster, clusters, setCluster, addCluster, deleteCluster } = useClusterStore()

  const activeClusters = clusters.map((item: SolanaCluster) => ({
    ...item,
    active: item.name === cluster.name,
  })).sort((a: SolanaCluster, b: SolanaCluster) => (a.name > b.name ? 1 : -1))

  const value: ClusterProviderContext = {
    cluster,
    clusters: activeClusters,
    addCluster,
    deleteCluster,
    setCluster,
    getExplorerUrl: (path: string) => `https://explorer.solana.com/${path}${getClusterUrlParam(cluster)}`,
  }
  return <Context.Provider value={value}>{children}</Context.Provider>
}

export function useCluster() {
  return useContext(Context)
}

function getClusterUrlParam(cluster: SolanaCluster): string {
  let suffix = ''
  switch (cluster.network) {
    case ClusterNetwork.Devnet:
      suffix = 'devnet'
      break
    case ClusterNetwork.Mainnet:
      suffix = ''
      break
    case ClusterNetwork.Testnet:
      suffix = 'testnet'
      break
    default:
      suffix = `custom&customUrl=${encodeURIComponent(cluster.endpoint)}`
      break
  }

  return suffix.length ? `?cluster=${suffix}` : ''
}
