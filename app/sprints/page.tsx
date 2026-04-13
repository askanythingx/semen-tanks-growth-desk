'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import PageShell from '@/components/PageShell'
import { supabase } from '@/lib/supabase'
import type { Sprint, Task } from '@/types'

const sprintStatusColor: Record<string, string> = {
  active:    'bg-green-100 text-green-700',
  completed: 'bg-blue-100 text-blue-700',
  paused:    'bg-amber-100 text-amber-700',
}

export default function SprintsPage() {
  const [sprints, setSprints] = useState<Sprint[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    async function load() {
      const [{ data: sp }, { data: tk }] = await Promise.all([
        supabase.from('sprints').select('*').order('sprint_number'),
        supabase.from('tasks').select('id, sprint_id, status, not_required'),
      ])
      if (sp) setSprints(sp as Sprint[])
      if (tk) setTasks(tk as Task[])
      setLoading(false)
    }
    load()
  }, [])

  function sprintStats(sprintId: string) {
    const t = tasks.filter(x => x.sprint_id === sprintId && !x.not_required)
    const done = t.filter(x => x.status === 'done').length
    const inProgress = t.filter(x => x.status === 'in_progress').length
    const blocked = t.filter(x => x.status === 'blocked').length
    const skipped = tasks.filter(x => x.sprint_id === sprintId && x.not_required).length
    const pct = t.length ? Math.round((done / t.length) * 100) : 0
    return { total: t.length, done, inProgress, blocked, skipped, pct }
  }

  return (
    <PageShell>
      <div className="px-4 pt-6 max-w-2xl mx-auto">

        <div className="mb-6">
          <div className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-1">GrowthDesk</div>
          <h1 className="text-2xl font-semibold text-gray-900">Sprints</h1>
          <p className="text-sm text-gray-500 mt-1">Tap a sprint to view and manage tasks</p>
        </div>

        {loading ? (
          <div className="text-center py-16 text-gray-400 text-sm">Loading sprints...</div>
        ) : (
          <div className="flex flex-col gap-3">
            {sprints.map(sprint => {
              const s = sprintStats(sprint.id)
              return (
                <Link key={sprint.id} href={`/sprints/${sprint.id}`}
                  className="bg-white rounded-2xl border border-gray-100 p-5 active:scale-98 transition-all block">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-medium text-gray-400">Sprint {sprint.sprint_number}</span>
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${sprintStatusColor[sprint.status]}`}>
                          {sprint.status.charAt(0).toUpperCase() + sprint.status.slice(1)}
                        </span>
                      </div>
                      <div className="font-semibold text-gray-900 text-base leading-tight">{sprint.name}</div>
                      {sprint.description && (
                        <div className="text-xs text-gray-400 mt-1 leading-relaxed line-clamp-2">{sprint.description}</div>
                      )}
                    </div>
                    <div className="text-right ml-4 flex-shrink-0">
                      <div className="text-2xl font-bold text-brand-700">{s.pct}%</div>
                      <div className="text-xs text-gray-400">{s.done}/{s.total}</div>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full bg-gray-100 rounded-full h-1.5 mb-3">
                    <div className="bg-brand-700 h-1.5 rounded-full transition-all" style={{ width: `${s.pct}%` }} />
                  </div>

                  {/* Mini stats */}
                  <div className="flex gap-3">
                    {[
                      { label: 'To Do', val: s.total - s.done - s.inProgress - s.blocked, color: 'text-gray-500' },
                      { label: 'In Progress', val: s.inProgress, color: 'text-blue-600' },
                      { label: 'Done', val: s.done, color: 'text-green-600' },
                      { label: 'Blocked', val: s.blocked, color: 'text-red-500' },
                      ...(s.skipped > 0 ? [{ label: 'Skipped', val: s.skipped, color: 'text-gray-400' }] : []),
                    ].map(x => (
                      <div key={x.label} className="flex flex-col items-center">
                        <span className={`text-base font-semibold ${x.color}`}>{x.val}</span>
                        <span className="text-xs text-gray-400">{x.label}</span>
                      </div>
                    ))}
                  </div>
                </Link>
              )
            })}

            {sprints.length === 0 && (
              <div className="text-center py-16 text-gray-400 text-sm">No sprints yet. Run the Supabase migration to seed Sprint 1.</div>
            )}
          </div>
        )}
      </div>
    </PageShell>
  )
}
