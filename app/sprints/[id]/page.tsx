'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import PageShell from '@/components/PageShell'
import { supabase } from '@/lib/supabase'
import type { Task, Sprint, TaskStatus } from '@/types'

const priorityDot: Record<string, string> = {
  critical:  'bg-red-500',
  high:      'bg-amber-500',
  medium:    'bg-blue-400',
  quick_win: 'bg-green-500',
}

const priorityLabel: Record<string, string> = {
  critical:  'Critical',
  high:      'High',
  medium:    'Medium',
  quick_win: 'Quick Win',
}

const statusConfig: Record<TaskStatus, { label: string; color: string; bg: string }> = {
  todo:        { label: 'To Do',       color: 'text-gray-600',  bg: 'bg-gray-100'  },
  in_progress: { label: 'In Progress', color: 'text-blue-700',  bg: 'bg-blue-100'  },
  done:        { label: 'Done',        color: 'text-green-700', bg: 'bg-green-100' },
  blocked:     { label: 'Blocked',     color: 'text-red-700',   bg: 'bg-red-100'   },
}

const STATUSES: TaskStatus[] = ['todo', 'in_progress', 'done', 'blocked']
const PHASES = ['All', 'Week 1 — Critical', 'Week 2 — High Priority', 'Month 1 — Medium', 'Quick Wins — Under 1hr']

export default function SprintDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [sprint, setSprint] = useState<Sprint | null>(null)
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [updating, setUpdating] = useState<string | null>(null)
  const [filterPhase, setFilterPhase] = useState('All')
  const [filterStatus, setFilterStatus] = useState('All')
  const [showSkipped, setShowSkipped] = useState(false)

  useEffect(() => {
    async function load() {
      const [{ data: sp }, { data: tk }] = await Promise.all([
        supabase.from('sprints').select('*').eq('id', id).single(),
        supabase.from('tasks').select('*').eq('sprint_id', id).order('issue_number'),
      ])
      if (sp) setSprint(sp as Sprint)
      if (tk) setTasks(tk as Task[])
      setLoading(false)
    }
    load()
  }, [id])

  async function updateStatus(taskId: string, status: TaskStatus) {
    setUpdating(taskId)
    await supabase.from('tasks').update({ status }).eq('id', taskId)
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status } : t))
    setUpdating(null)
  }

  async function toggleNotRequired(taskId: string, current: boolean) {
    setUpdating(taskId)
    await supabase.from('tasks').update({ not_required: !current }).eq('id', taskId)
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, not_required: !current } : t))
    setUpdating(null)
  }

  const activeTasks = tasks.filter(t => !t.not_required)
  const skippedTasks = tasks.filter(t => t.not_required)
  const done = activeTasks.filter(t => t.status === 'done').length
  const pct = activeTasks.length ? Math.round((done / activeTasks.length) * 100) : 0

  const filtered = activeTasks.filter(t => {
    const phaseOk = filterPhase === 'All' || t.phase_label === filterPhase
    const statusOk = filterStatus === 'All' || t.status === filterStatus
    return phaseOk && statusOk
  })

  if (loading) return (
    <PageShell>
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-400 text-sm">Loading sprint...</div>
      </div>
    </PageShell>
  )

  if (!sprint) return (
    <PageShell>
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-400 text-sm">Sprint not found.</div>
      </div>
    </PageShell>
  )

  return (
    <PageShell>
      <div className="px-4 pt-6 max-w-2xl mx-auto">

        {/* Back + header */}
        <button onClick={() => router.push('/sprints')}
          className="flex items-center gap-2 text-sm text-gray-400 mb-4 -ml-1 min-h-0 py-0">
          <span className="text-lg leading-none">‹</span> All Sprints
        </button>

        <div className="mb-4">
          <div className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-1">Sprint {sprint.sprint_number}</div>
          <h1 className="text-xl font-semibold text-gray-900 leading-tight">{sprint.name}</h1>
          {sprint.description && <p className="text-sm text-gray-400 mt-1">{sprint.description}</p>}
        </div>

        {/* Progress */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4 mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">{done} of {activeTasks.length} tasks done</span>
            <span className="text-xl font-bold text-brand-700">{pct}%</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2">
            <div className="bg-brand-700 h-2 rounded-full transition-all" style={{ width: `${pct}%` }} />
          </div>
          <div className="flex gap-4 mt-3">
            {[
              { label: 'In Progress', val: activeTasks.filter(t=>t.status==='in_progress').length, color: 'text-blue-600' },
              { label: 'Blocked', val: activeTasks.filter(t=>t.status==='blocked').length, color: 'text-red-500' },
              { label: 'Skipped', val: skippedTasks.length, color: 'text-gray-400' },
            ].map(x => (
              <div key={x.label} className="flex items-center gap-1.5">
                <span className={`text-sm font-semibold ${x.color}`}>{x.val}</span>
                <span className="text-xs text-gray-400">{x.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Filters */}
        <div className="mb-4 overflow-x-auto -mx-4 px-4">
          <div className="flex gap-2 pb-1" style={{ width: 'max-content' }}>
            {['All', 'todo', 'in_progress', 'done', 'blocked'].map(s => (
              <button key={s} onClick={() => setFilterStatus(s)}
                className={`text-xs px-3 py-2 rounded-xl border whitespace-nowrap transition-all
                  ${filterStatus === s ? 'bg-brand-700 text-white border-brand-700' : 'bg-white text-gray-500 border-gray-200'}`}>
                {s === 'All' ? 'All Status' : statusConfig[s as TaskStatus].label}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-4 overflow-x-auto -mx-4 px-4">
          <div className="flex gap-2 pb-1" style={{ width: 'max-content' }}>
            {PHASES.map(p => (
              <button key={p} onClick={() => setFilterPhase(p)}
                className={`text-xs px-3 py-2 rounded-xl border whitespace-nowrap transition-all
                  ${filterPhase === p ? 'bg-gray-800 text-white border-gray-800' : 'bg-white text-gray-500 border-gray-200'}`}>
                {p === 'All' ? 'All Phases' : p.split('—')[0].trim()}
              </button>
            ))}
          </div>
        </div>

        {/* Tasks */}
        <div className="flex flex-col gap-2 mb-6">
          {filtered.map(task => {
            const expanded = expandedId === task.id
            const sc = statusConfig[task.status]
            return (
              <div key={task.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                <div className="flex items-center gap-3 px-4 py-3.5 cursor-pointer"
                  onClick={() => setExpandedId(expanded ? null : task.id)}>
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${priorityDot[task.priority]}`} />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900 leading-snug line-clamp-2">{task.title}</div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${sc.bg} ${sc.color}`}>
                        {sc.label}
                      </span>
                      {task.is_mobile && (
                        <span className="text-xs text-blue-500 font-medium">Mobile</span>
                      )}
                    </div>
                  </div>
                  <span className="text-gray-300 text-base flex-shrink-0">{expanded ? '▲' : '▼'}</span>
                </div>

                {expanded && (
                  <div className="px-4 pb-4 border-t border-gray-50">
                    <p className="text-sm text-gray-500 mt-3 mb-3 leading-relaxed">{task.description}</p>

                    <div className="bg-green-50 border border-green-100 rounded-xl p-3 mb-4">
                      <div className="text-xs font-semibold text-green-800 mb-1">Fix / Action</div>
                      <div className="text-xs text-green-700 leading-relaxed">{task.fix_summary}</div>
                    </div>

                    <div className="flex flex-wrap gap-3 mb-4 text-xs text-gray-500">
                      <span>Effort: <strong className="text-gray-700">{task.dev_effort}</strong></span>
                      <span>Phase: <strong className="text-gray-700">{task.phase_label}</strong></span>
                      <span>Priority: <strong className="text-gray-700">{priorityLabel[task.priority]}</strong></span>
                    </div>

                    {/* Status buttons */}
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      {STATUSES.map(s => (
                        <button key={s}
                          disabled={task.status === s || updating === task.id}
                          onClick={() => updateStatus(task.id, s)}
                          className={`py-2.5 px-3 rounded-xl text-xs font-medium border transition-all
                            ${task.status === s
                              ? `${statusConfig[s].bg} ${statusConfig[s].color} border-transparent`
                              : 'bg-white border-gray-200 text-gray-500 active:bg-gray-50'}
                            disabled:opacity-40`}>
                          {statusConfig[s].label}
                        </button>
                      ))}
                    </div>

                    {/* Not Required toggle */}
                    <button
                      disabled={updating === task.id}
                      onClick={() => toggleNotRequired(task.id, task.not_required)}
                      className={`w-full py-2.5 rounded-xl text-xs font-medium border transition-all
                        ${task.not_required
                          ? 'bg-gray-800 text-white border-gray-800'
                          : 'bg-white text-gray-400 border-gray-200 active:bg-gray-50'}`}>
                      {task.not_required ? '↩ Mark as Required' : 'Mark as Not Required (Skip)'}
                    </button>
                  </div>
                )}
              </div>
            )
          })}

          {filtered.length === 0 && (
            <div className="text-center py-10 text-gray-400 text-sm">No tasks match this filter.</div>
          )}
        </div>

        {/* Skipped tasks */}
        {skippedTasks.length > 0 && (
          <div className="mb-6">
            <button onClick={() => setShowSkipped(!showSkipped)}
              className="w-full flex items-center justify-between py-3 px-4 bg-gray-100 rounded-2xl text-sm text-gray-500 mb-2">
              <span>Skipped tasks ({skippedTasks.length})</span>
              <span>{showSkipped ? '▲' : '▼'}</span>
            </button>
            {showSkipped && skippedTasks.map(task => (
              <div key={task.id} className="bg-white rounded-2xl border border-gray-100 p-4 mb-2 opacity-50">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${priorityDot[task.priority]}`} />
                  <div className="flex-1 text-sm text-gray-500 line-through">{task.title}</div>
                  <button onClick={() => toggleNotRequired(task.id, task.not_required)}
                    className="text-xs text-blue-500 underline flex-shrink-0">
                    Restore
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </PageShell>
  )
}
