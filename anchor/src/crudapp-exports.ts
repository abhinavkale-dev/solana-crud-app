import { AnchorProvider, Program } from '@coral-xyz/anchor'
import { Cluster, PublicKey } from '@solana/web3.js'
import CrudAppIDL from '../target/idl/crud_app.json'
import type { CrudApp } from '../target/types/crud_app'

export { CrudApp, CrudAppIDL }

export const CRUDAPP_PROGRAM_ID = new PublicKey(CrudAppIDL.address)

export function getCrudAppProgram(provider: AnchorProvider, address?: PublicKey): Program<CrudApp> {
  return new Program({ ...CrudAppIDL, address: address ? address.toBase58() : CrudAppIDL.address } as CrudApp, provider)
}

export function getCrudAppProgramId(cluster: Cluster) {
  switch (cluster) {
    case 'devnet':
    case 'testnet':
      return new PublicKey('Bfs5UjX5queZULKZbq8PiimwybgtyQ6Zw1TtDLssRWLo')
    case 'mainnet-beta':
    default:
      return CRUDAPP_PROGRAM_ID
  }
} 