'use client'
import { useEffect, useState } from 'react'
import PageShell from '@/components/PageShell'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/lib/auth-context'
import type { UserProfile } from '@/types'

const PERMS = [
  { key: 'can_see_dashboard', label: 'Dashboard' },
  { key: 'can_see_sprints',   label: 'Sprints'   },
  { key: 'can_see_surveys',   label: 'Surveys'   },
] as const

export default function AdminUsersPage() {
  const { profile: me } = useAuth()
  const [users, setUsers] = useState<UserProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [showAdd, setShowAdd] = useState(false)
  const [saving, setSaving] = useState(false)
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  // New user form
  const [newName, setNewName] = useState('')
  const [newEmail, setNewEmail] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [newPerms, setNewPerms] = useState({ can_see_dashboard: true, can_see_sprints: false, can_see_surveys: false })
  const [addError, setAddError] = useState('')
  const [addSuccess, setAddSuccess] = useState('')

  useEffect(() => { fetchUsers() }, [])

  async function fetchUsers() {
    const { data } = await supabase.from('user_profiles').select('*').order('created_at')
    if (data) setUsers(data as UserProfile[])
    setLoading(false)
  }

  async function addUser() {
    if (!newName || !newEmail || !newPassword) return
    setSaving(true)
    setAddError('')
    setAddSuccess('')

    // Create auth user via admin API — requires service role key
    // Since we're using anon key, we use signUp instead
    const { data: authData, error: authErr } = await supabase.auth.signUp({
      email: newEmail,
      password: newPassword,
    })

    if (authErr || !authData.user) {
      setAddError(authErr?.message || 'Failed to create user. Email may already exist.')
      setSaving(false)
      return
    }

    const { error: profileErr } = await supabase.from('user_profiles').insert({
      id: authData.user.id,
      name: newName,
      email: newEmail,
      role: 'member',
      can_see_dashboard: newPerms.can_see_dashboard,
      can_see_sprints: newPerms.can_see_sprints,
      can_see_surveys: newPerms.can_see_surveys,
      is_active: true,
    })

    if (profileErr) {
      setAddError('User created in Auth but profile failed. Check Supabase manually.')
      setSaving(false)
      return
    }

    setAddSuccess(`${newName} added successfully. They can now log in.`)
    setNewName('')
    setNewEmail('')
    setNewPassword('')
    setNewPerms({ can_see_dashboard: true, can_see_sprints: false, can_see_surveys: false })
    setShowAdd(false)
    fetchUsers()
    setSaving(false)
  }

  async function togglePerm(userId: string, perm: string, current: boolean) {
    if (userId === me?.id) return // can't edit own perms
    setUpdatingId(userId)
    await supabase.from('user_profiles').update({ [perm]: !current }).eq('id', userId)
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, [perm]: !current } : u))
    setUpdatingId(null)
  }

  async function toggleActive(userId: string, current: boolean) {
    if (userId === me?.id) return
    setUpdatingId(userId)
    await supabase.from('user_profiles').update({ is_active: !current }).eq('id', userId)
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, is_active: !current } : u))
    setUpdatingId(null)
  }

  return (
    <PageShell>
      <div className="px-4 pt-6 max-w-2xl mx-auto">

        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-1">Admin</div>
            <h1 className="text-2xl font-semibold text-gray-900">Users</h1>
            <p className="text-sm text-gray-400 mt-1">Manage team access and permissions</p>
          </div>
          <button onClick={() => setShowAdd(!showAdd)}
            className="bg-brand-700 text-white text-sm font-medium px-4 py-2.5 rounded-xl active:bg-brand-900 transition-all mt-1">
            + Add User
          </button>
        </div>

        {/* Add user form */}
        {showAdd && (
          <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-6">
            <div className="text-sm font-semibold text-gray-900 mb-4">New user</div>

            <div className="flex flex-col gap-3 mb-4">
              <div>
                <label className="text-xs font-medium text-gray-500 block mb-1.5">Full name</label>
                <input value={newName} onChange={e => setNewName(e.target.value)}
                  placeholder="e.g. Dhruvi Axit"
                  className="w-full text-sm border border-gray-200 rounded-xl px-3 py-3 outline-none focus:border-brand-700" />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 block mb-1.5">Email</label>
                <input type="email" value={newEmail} onChange={e => setNewEmail(e.target.value)}
                  placeholder="dhruvi@example.com"
                  className="w-full text-sm border border-gray-200 rounded-xl px-3 py-3 outline-none focus:border-brand-700"
                  autoCapitalize="none" />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 block mb-1.5">Temporary password</label>
                <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)}
                  placeholder="Min 6 characters"
                  className="w-full text-sm border border-gray-200 rounded-xl px-3 py-3 outline-none focus:border-brand-700" />
              </div>
            </div>

            <div className="mb-5">
              <div className="text-xs font-medium text-gray-500 mb-3">What can this user see?</div>
              <div className="flex flex-col gap-2">
                {PERMS.map(p => (
                  <label key={p.key} className="flex items-center gap-3 cursor-pointer">
                    <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all flex-shrink-0
                      ${newPerms[p.key] ? 'bg-brand-700 border-brand-700' : 'border-gray-300 bg-white'}`}
                      onClick={() => setNewPerms(prev => ({ ...prev, [p.key]: !prev[p.key] }))}>
                      {newPerms[p.key] && <span className="text-white text-xs font-bold">✓</span>}
                    </div>
                    <span className="text-sm text-gray-700">{p.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {addError && (
              <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3 mb-3 text-sm text-red-600">{addError}</div>
            )}
            {addSuccess && (
              <div className="bg-green-50 border border-green-100 rounded-xl px-4 py-3 mb-3 text-sm text-green-700">{addSuccess}</div>
            )}

            <div className="flex gap-3">
              <button onClick={() => setShowAdd(false)}
                className="flex-1 py-3 rounded-xl text-sm text-gray-500 border border-gray-200 bg-white">
                Cancel
              </button>
              <button onClick={addUser} disabled={!newName || !newEmail || !newPassword || saving}
                className="flex-1 py-3 rounded-xl text-sm font-semibold bg-brand-700 text-white disabled:opacity-30">
                {saving ? 'Adding...' : 'Add User'}
              </button>
            </div>
          </div>
        )}

        {/* Users list */}
        {loading ? (
          <div className="text-center py-16 text-gray-400 text-sm">Loading users...</div>
        ) : (
          <div className="flex flex-col gap-3">
            {users.map(user => (
              <div key={user.id}
                className={`bg-white rounded-2xl border border-gray-100 p-4 transition-all ${!user.is_active ? 'opacity-50' : ''}`}>

                <div className="flex items-start gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-brand-700 flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
                    {user.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium text-gray-900 text-sm">{user.name}</span>
                      {user.id === me?.id && <span className="text-xs text-purple-600 font-medium">(you)</span>}
                      {user.role === 'admin' && (
                        <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-medium">Admin</span>
                      )}
                      {!user.is_active && (
                        <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">Inactive</span>
                      )}
                    </div>
                    <div className="text-xs text-gray-400 mt-0.5">{user.email}</div>
                  </div>
                  {user.id !== me?.id && (
                    <button onClick={() => toggleActive(user.id, user.is_active)}
                      disabled={updatingId === user.id}
                      className={`text-xs px-3 py-1.5 rounded-xl border transition-all flex-shrink-0
                        ${user.is_active
                          ? 'text-red-500 border-red-200 bg-red-50'
                          : 'text-green-600 border-green-200 bg-green-50'}`}>
                      {user.is_active ? 'Deactivate' : 'Activate'}
                    </button>
                  )}
                </div>

                {/* Permissions */}
                <div className="border-t border-gray-50 pt-3">
                  <div className="text-xs font-medium text-gray-400 mb-2">Page access</div>
                  <div className="flex gap-2 flex-wrap">
                    {PERMS.map(p => {
                      const enabled = user[p.key]
                      const isMe = user.id === me?.id
                      return (
                        <button key={p.key}
                          disabled={isMe || updatingId === user.id || user.role === 'admin'}
                          onClick={() => togglePerm(user.id, p.key, enabled)}
                          className={`text-xs px-3 py-1.5 rounded-xl border font-medium transition-all
                            ${enabled
                              ? 'bg-brand-700 text-white border-brand-700'
                              : 'bg-white text-gray-400 border-gray-200'}
                            ${(isMe || user.role === 'admin') ? 'opacity-50 cursor-not-allowed' : 'active:scale-95'}`}>
                          {enabled ? '✓ ' : ''}{p.label}
                        </button>
                      )
                    })}
                    {user.role === 'admin' && (
                      <span className="text-xs text-gray-400 px-2 py-1.5">All access (admin)</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </PageShell>
  )
}
