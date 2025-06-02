'use client'

import { PublicKey } from '@solana/web3.js'
import { useState } from 'react'
import { useCrudAppProgram, useCrudAppProgramAccount } from './crudapp-data-access'

export function CrudAppCreate() {
  const { createJournalEntry } = useCrudAppProgram()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  const isFormValid = title.trim().length > 0 && description.trim().length > 0

  const handleSubmit = async () => {
    if (isFormValid) {
      try {
        await createJournalEntry.mutateAsync({ title: title.trim(), description: description.trim() })
        setTitle('')
        setDescription('')
      } catch (error) {
        console.error('Failed to create journal entry:', error)
      }
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <input
          type="text"
          placeholder="Enter journal entry title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div>
        <textarea
          placeholder="Enter journal entry description..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <button
        className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={handleSubmit}
        disabled={createJournalEntry.isPending || !isFormValid}
      >
        {createJournalEntry.isPending ? 'Creating...' : 'Create Journal Entry'}
      </button>
    </div>
  )
}

export function CrudAppList() {
  const { accounts } = useCrudAppProgram()

  if (accounts.isLoading) {
    return <div className="text-center py-4">Loading journal entries...</div>
  }

  if (accounts.isError) {
    return <div className="text-center py-4 text-red-500">Failed to load journal entries</div>
  }

  if (!accounts.data || accounts.data.length === 0) {
    return <div className="text-center py-4 text-gray-500">No journal entries found</div>
  }

  return (
    <div className="space-y-4">
      {accounts.data.map((account) => (
        <CrudAppCard key={account.publicKey.toString()} account={account.publicKey} />
      ))}
    </div>
  )
}

export function CrudAppCard({ account }: { account: PublicKey }) {
  const { accountQuery, updateJournalEntry, deleteJournalEntry } = useCrudAppProgramAccount({ account })
  const [isEditing, setIsEditing] = useState(false)
  const [editDescription, setEditDescription] = useState('')

  if (accountQuery.isLoading) {
    return <div className="p-4 border rounded-md">Loading...</div>
  }

  if (accountQuery.isError || !accountQuery.data) {
    return <div className="p-4 border rounded-md text-red-500">Failed to load journal entry</div>
  }

  const { title, description, owner, createdAt } = accountQuery.data

  const handleEdit = () => {
    setEditDescription(description)
    setIsEditing(true)
  }

  const handleSave = async () => {
    if (editDescription.trim().length > 0) {
      try {
        await updateJournalEntry.mutateAsync({ 
          title: title, // Keep original title for account derivation
          description: editDescription.trim() 
        })
        setIsEditing(false)
      } catch (error) {
        console.error('Failed to update journal entry:', error)
      }
    }
  }

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this journal entry?')) {
      try {
        await deleteJournalEntry.mutateAsync({ title })
      } catch (error) {
        console.error('Failed to delete journal entry:', error)
      }
    }
  }

  const handleCancel = () => {
    setIsEditing(false)
    setEditDescription('')
  }

  return (
    <div className="p-4 border rounded-md space-y-3">
      {isEditing ? (
        <>
          <div>
            <h3 className="text-lg font-semibold">{title}</h3>
            <p className="text-sm text-gray-500 mb-2">Note: Title cannot be changed after creation</p>
          </div>
          <textarea
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="flex space-x-2">
            <button
              onClick={handleSave}
              disabled={updateJournalEntry.isPending}
              className="px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600 disabled:opacity-50"
            >
              {updateJournalEntry.isPending ? 'Saving...' : 'Save'}
            </button>
            <button
              onClick={handleCancel}
              className="px-3 py-1 bg-gray-500 text-white text-sm rounded hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        </>
      ) : (
        <>
          <div>
            <h3 className="text-lg font-semibold">{title}</h3>
            <p className="text-gray-600">{description}</p>
          </div>
          <div className="text-xs text-gray-500">
            <p>Owner: {owner.toString()}</p>
            <p>Created: {new Date(createdAt.toNumber() * 1000).toLocaleDateString()}</p>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={handleEdit}
              className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
            >
              Edit Description
            </button>
            <button
              onClick={handleDelete}
              disabled={deleteJournalEntry.isPending}
              className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600 disabled:opacity-50"
            >
              {deleteJournalEntry.isPending ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </>
      )}
    </div>
  )
} 