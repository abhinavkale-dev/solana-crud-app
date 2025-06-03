'use client'

import { AppHero } from '../app-hero'
import { ExplorerLink } from '../cluster/cluster-ui'
import { useCrudAppProgram } from './crudapp-data-access'
import { CrudAppCreate, CrudAppList } from './crudapp-ui'

function ellipsify(str: string, len = 4) {
  if (str.length > 30) {
    const firstPart = str.substring(0, len)
    const lastPart = str.substring(str.length - len, str.length)
    return `${firstPart}...${lastPart}`
  }
  return str
}

export default function CrudAppFeature() {
  return (
    <div className="hero py-[64px]">
      <div className="hero-content text-center">
        <div className="max-w-4xl">
          <AppHero
            title="CRUD App"
            subtitle="Create, read, update, and delete journal entries on Solana"
          >
            <p className="mb-6">
              <ExplorerLink path={`account/${useCrudAppProgram().programId}`} label={ellipsify(useCrudAppProgram().programId.toString())} />
            </p>
            <CrudAppCreate />
          </AppHero>
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-center mb-6">Your Journal Entries</h2>
            <CrudAppList />
          </div>
        </div>
      </div>
    </div>
  )
}

export function CrudAppProgram() {
  const { getProgramAccount } = useCrudAppProgram()

  if (getProgramAccount.isLoading) {
    return <span className="loading loading-spinner loading-lg"></span>
  }
  if (!getProgramAccount.data?.value) {
    return (
      <div className="alert alert-info flex justify-center">
        <span>
          Program account not found. Make sure you have deployed the program and are on the correct cluster.
        </span>
      </div>
    )
  }
  return (
    <div className="space-y-6">
      <CrudAppCreate />
      <CrudAppList />
    </div>
  )
} 