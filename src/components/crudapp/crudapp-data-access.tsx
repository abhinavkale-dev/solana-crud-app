'use client'

import { getCrudAppProgram, getCrudAppProgramId } from '@project/anchor'
import { useConnection } from '@solana/wallet-adapter-react'
import { Cluster, PublicKey } from '@solana/web3.js'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { useCluster } from '../cluster/cluster-data-access'
import { useAnchorProvider } from '../solana/solana-provider'
import { useTransactionToast } from '../use-transaction-toast'
import { toast } from 'sonner'

export function useCrudAppProgram() {
  const { connection } = useConnection()
  const { cluster } = useCluster()
  const transactionToast = useTransactionToast()
  const provider = useAnchorProvider()
  const programId = useMemo(() => getCrudAppProgramId(cluster.network as Cluster), [cluster])
  const program = useMemo(() => getCrudAppProgram(provider, programId), [provider, programId])

  const accounts = useQuery({
    queryKey: ['crudapp', 'all', { cluster }],
    queryFn: () => program.account.journalEntry.all(),
  })

  const getProgramAccount = useQuery({
    queryKey: ['get-program-account', { cluster }],
    queryFn: () => connection.getParsedAccountInfo(programId),
  })

  const createJournalEntry = useMutation({
    mutationKey: ['crudapp', 'create', { cluster }],
    mutationFn: ({ title, description }: { title: string; description: string }) =>
      program.methods.journalEntryCreate(title, description).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx)
      return accounts.refetch()
    },
    onError: () => toast.error('Failed to create journal entry'),
  })

  return {
    program,
    programId,
    accounts,
    getProgramAccount,
    createJournalEntry,
  }
}

export function useCrudAppProgramAccount({ account }: { account: PublicKey }) {
  const { cluster } = useCluster()
  const transactionToast = useTransactionToast()
  const { program, accounts } = useCrudAppProgram()

  const accountQuery = useQuery({
    queryKey: ['crudapp', 'fetch', { cluster, account }],
    queryFn: () => program.account.journalEntry.fetch(account),
  })

  const updateJournalEntry = useMutation({
    mutationKey: ['crudapp', 'update', { cluster, account }],
    mutationFn: ({ title, description }: { title: string; description: string }) =>
      program.methods.journalEntryUpdate(title, description).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx)
      return accountQuery.refetch()
    },
    onError: () => toast.error('Failed to update journal entry'),
  })

  const deleteJournalEntry = useMutation({
    mutationKey: ['crudapp', 'delete', { cluster, account }],
    mutationFn: ({ title }: { title: string }) =>
      program.methods.journalEntryDelete(title).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx)
      return accounts.refetch()
    },
    onError: () => toast.error('Failed to delete journal entry'),
  })

  return {
    accountQuery,
    updateJournalEntry,
    deleteJournalEntry,
  }
} 