'use client'
import { useEffect, useState } from 'react'
import Sidebar from '@/components/Sidebar'
import { supabase } from '@/lib/supabase'
import type { Task, TaskStatus, TaskPriority } from '@/types'

const priorityConfig: Record<TaskPriority, { label: string; color: string; dot: string }> = {
  critical:  { label: 'Critical',  color: 'bg-red-50 text-red-700 border-red-200',    dot: 'bg-red-500' },
  high:      { label: 'High',      color: 'bg-amber-50 text-amber-700 border-amber-200', dot: 'bg-amber-500' },
  medium:    { label: 'Medium',    color: 'bg-blue-50 text-blue-700 border-blue-200',  dot: 'bg-blue-500' },
  quick_win: { label: 'Quick Win', color: 'bg-green-50 text-green-700 border-green-200', dot: 'bg-green-500' },
}

const statusConfig: Record<TaskStatus, { label: string; color: string }> = {
  todo:        { label: 'To Do',       color: 'bg-gray-100 text-gray-600' },
  in_progress: { label: 'In Progress', color: 'bg-blue-100 text-blue-700' },
  done:        { label: 'Done',        color: 'bg-green-100 text-green-700' },
  blocked:     { label: 'Blocked',     color: 'bg-red-100 text-red-700' },
}

const phases = ['All', 'Week 1 — Critical', 'Week 2 — High Priority', 'Month 1 — Medium', 'Quick Wins — Under 1hr']
const statuses: TaskStatus[] = ['todo', 'in_progress', 'done', 'blocked']

export default function SprintsPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [filterPhase, setFilterPhase] = useState('All')
  const [filterStatus, setFilterStatus] = useState('All')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [updating, setUpdating] = useState<string | null>(null)

  useEffect(() => { fetchTasks() }, [])

  async function fetchTasks() {
    setLoading(true)
    const { data } = await supabase.from('tasks').select('*').order('issue_number')
    if (data) setTasks(data as Task[])
    setLoading(false)
  }

  async function updateStatus(id: string, status: TaskStatus) {
    setUpdating(id)
    await supabase.from('tasks').update({ status }).eq('id', id)
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status } : t))
    setUpdating(null)
  }

  const filtered = tasks.filter(t => {
    const phaseOk = filterPhase === 'All' || t.phase_label === filterPhase
    const statusOk = filterStatus === 'All' || t.status === filterStatus
    return phaseOk && statusOk
  })

  const counts = {
    total: tasks.length,
    done: tasks.filter(t => t.status === 'done').length,
    in_progress: tasks.filter(t => t.status === 'in_progress').length,
    blocked: tasks.filter(t => t.status === 'blocked').length,
  }
  const pct = tasks.length ? Math.round((counts.done / tasks.length) * 100) : 0

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="ml-56 flex-1 p-8">
        <div className="max-w-5xl">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Sprint Board</h1>
              <p className="text-sm text-gray-500 mt-1">Website audit tasks — Dhruvi Axit</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-semibold text-gray-900">{pct}%</div>
              <div className="text-xs text-gray-500">{counts.done} of {counts.total} done</div>
            </div>
          </div>

          <div className="w-full bg-gray-100 rounded-full h-2 mb-6">
            <div className="bg-brand-500 h-2 rounded-full transition-all" style={{ width: `${pct}%` }} />
          </div>

          <div className="grid grid-cols-4 gap-3 mb-6">
            {[
              { label: 'Total', value: counts.total, color: 'text-gray-900' },
              { label: 'In Progress', value: counts.in_progress, color: 'text-blue-600' },
              { label: 'Done', value: counts.done, color: 'text-green-600' },
              { label: 'Blocked', value: counts.blocked, color: 'text-red-600' },
            ].map(s => (
              <div key={s.label} className="bg-white rounded-xl border border-gray-200 p-4">
                <div className={`text-2xl font-semibold ${s.color}`}>{s.value}</div>
                <div className="text-xs text-gray-500 mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>

          <div className="flex gap-3 mb-6 flex-wrap">
            <div className="flex gap-1 bg-white border border-gray-200 rounded-lg p-1">
              {phases.map(p => (
                <button key={p} onClick={() => setFilterPhase(p)}
                  className={`text-xs px-3 py-1.5 rounded-md transition-all ${filterPhase === p ? 'bg-brand-700 text-white' : 'text-gray-600 hover:bg-gray-100'}`}>
                  {p === 'All' ? 'All Phases' : p.split('—')[0].trim()}
                </button>
              ))}
            </div>
            <div className="flex gap-1 bg-white border border-gray-200 rounded-lg p-1">
              {['All', ...statuses].map(s => (
                <button key={s} onClick={() => setFilterStatus(s)}
                  className={`text-xs px-3 py-1.5 rounded-md transition-all ${filterStatus === s ? 'bg-brand-700 text-white' : 'text-gray-600 hover:bg-gray-100'}`}>
                  {s === 'All' ? 'All Status' : statusConfig[s as TaskStatus]?.label || s}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="text-center py-16 text-gray-400">Loading tasks...</div>
          ) : (
            <div className="space-y-2">
              {filtered.map(task => {
                const pri = priorityConfig[task.priority]
                const sta = statusConfig[task.status]
                const expanded = expandedId === task.id
                return (
                  <div key={task.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <div className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-gray-50 transition-all"
                      onClick={() => setExpandedId(expanded ? null : task.id)}>
                      <span className="text-xs font-mono text-gray-400 w-6 flex-shrink-0">#{task.issue_number}</span>
                      <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${pri.dot}`} />
                      <span className="text-sm font-medium text-gray-900 flex-1 min-w-0 truncate">{task.title}</span>
                      {task.is_mobile && (
                        <span className="text-xs bg-blue-50 text-blue-600 border border-blue-200 px-2 py-0.5 rounded-full flex-shrink-0">Mobile</span>
                      )}
                      <span className={`text-xs border px-2 py-0.5 rounded-full flex-shrink-0 ${pri.color}`}>{pri.label}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${sta.color}`}>{sta.label}</span>
                      <span className="text-gray-300 text-xs ml-1">{expanded ? '▲' : '▼'}</span>
                    </div>

                    {expanded && (
                      <div className="px-4 pb-4 border-t border-gray-100">
                        <p className="text-sm text-gray-600 mt-3 mb-3 leading-relaxed">{task.description}</p>
                        <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                          <div className="text-xs font-medium text-green-800 mb-1">Fix / Action</div>
                          <div className="text-xs text-green-700 leading-relaxed">{task.fix_summary}</div>
                        </div>
                        <div className="flex items-center gap-3 flex-wrap">
                          <div className="text-xs text-gray-500">Est. effort: <span className="text-gray-700 font-medium">{task.dev_effort}</span></div>
                          <div className="text-xs text-gray-500">Category: <span className="text-gray-700 font-medium">{task.category}</span></div>
                          <div className="text-xs text-gray-500">Phase: <span className="text-gray-700 font-medium">{task.phase_label}</span></div>
                        </div>
                        <div className="flex gap-2 mt-4">
                          {statuses.map(s => (
                            <button key={s} disabled={task.status === s || updating === task.id}
                              onClick={() => updateStatus(task.id, s)}
                              className={`text-xs px-3 py-1.5 rounded-lg border transition-all
                                ${task.status === s
                                  ? `${statusConfig[s].color} border-transparent font-medium`
                                  : 'bg-white border-gray-200 text-gray-500 hover:border-gray-400 hover:text-gray-700'}
                                disabled:opacity-50 disabled:cursor-not-allowed`}>
                              {statusConfig[s].label}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
