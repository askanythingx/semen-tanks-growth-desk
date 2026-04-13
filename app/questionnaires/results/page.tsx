'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import PageShell from '@/components/PageShell'
import { supabase } from '@/lib/supabase'
import type { QuizResult } from '@/types'

const ANGLES = [
  { id: 1, name: 'The Animal',     color: '#1D9E75' },
  { id: 2, name: 'The Job',        color: '#185FA5' },
  { id: 3, name: 'Buying Signal',  color: '#BA7517' },
  { id: 4, name: 'The Situation',  color: '#6B3FA0' },
  { id: 5, name: 'The Competitor', color: '#C0392B' },
  { id: 6, name: 'The Geography',  color: '#0E7C6B' },
  { id: 7, name: 'The Ecosystem',  color: '#854F0B' },
  { id: 8, name: 'The Season',     color: '#3B6D11' },
]

function getPct(r: QuizResult, id: number): number {
  return (r[`angle_${id}_pct`] as number) || 0
}
function getNote(r: QuizResult, id: number): string {
  return (r[`angle_${id}_note`] as string) || ''
}

function avgPct(results: QuizResult[], id: number) {
  if (!results.length) return 0
  return Math.round(results.reduce((sum, r) => sum + getPct(r, id), 0) / results.length)
}

export default function QuizResultsPage() {
  const [results, setResults] = useState<QuizResult[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedId, setExpandedId] = useState<string | null>(null)

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    supabase.from('quiz_results').select('*').order('submitted_at', { ascending: false })
      .then(({ data }) => {
        if (data) setResults(data as QuizResult[])
        setLoading(false)
      })
  }, [])

  const avgRanked = ANGLES.map(a => ({ ...a, avg: avgPct(results, a.id) }))
    .sort((a, b) => b.avg - a.avg)

  return (
    <PageShell>
      <div className="px-4 pt-6 max-w-2xl mx-auto">

        <div className="mb-2">
          <Link href="/questionnaires" className="text-sm text-gray-400 flex items-center gap-1 mb-4">
            <span className="text-lg">‹</span> Questionnaires
          </Link>
          <div className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-1">Results</div>
          <h1 className="text-2xl font-semibold text-gray-900">Buyer Priority Quiz</h1>
          <p className="text-sm text-gray-400 mt-1">{results.length} response{results.length !== 1 ? 's' : ''} submitted</p>
        </div>

        {loading ? (
          <div className="text-center py-16 text-gray-400 text-sm">Loading results...</div>
        ) : results.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-gray-300 text-4xl mb-3">○</div>
            <div className="text-gray-500 text-sm">No responses yet.</div>
            <div className="text-gray-400 text-xs mt-1">Share the quiz link with Janey & Mark.</div>
          </div>
        ) : (
          <>
            {/* Average priority ranking */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-4">
              <div className="text-sm font-semibold text-gray-900 mb-4">
                Average priority ranking
                <span className="text-xs font-normal text-gray-400 ml-2">across all {results.length} response{results.length !== 1 ? 's' : ''}</span>
              </div>
              <div className="flex flex-col gap-3">
                {avgRanked.map((a, i) => (
                  <div key={a.id} className="flex items-center gap-3">
                    <span className="text-xs text-gray-400 w-4 font-mono flex-shrink-0">#{i + 1}</span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-gray-700">{a.name}</span>
                        <span className="text-sm font-semibold text-gray-900">{a.avg}%</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-2 rounded-full transition-all"
                          style={{ width: `${Math.max(a.avg, 1)}%`, background: a.color }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Individual responses */}
            <div className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-3">Individual responses</div>
            <div className="flex flex-col gap-3 mb-8">
              {results.map(r => {
                const expanded = expandedId === r.id
                const sorted = ANGLES.map(a => ({ ...a, pct: getPct(r, a.id) }))
                  .sort((a, b) => b.pct - a.pct)
                const top = sorted[0]
                const date = new Date(r.submitted_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

                return (
                  <div key={r.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                    <div className="flex items-center gap-3 px-4 py-4 cursor-pointer"
                      onClick={() => setExpandedId(expanded ? null : r.id)}>
                      <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-xs font-semibold text-gray-500 flex-shrink-0">
                        {r.submitted_by.slice(0, 2).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-gray-900">{r.submitted_by}</div>
                        <div className="text-xs text-gray-400 mt-0.5">
                          Top: <span style={{ color: top.color }} className="font-medium">{top.name} ({top.pct}%)</span>
                          <span className="text-gray-300 mx-1">·</span>{date}
                        </div>
                      </div>
                      <span className="text-gray-300">{expanded ? '▲' : '▼'}</span>
                    </div>

                    {expanded && (
                      <div className="px-4 pb-4 border-t border-gray-50">
                        <div className="flex flex-col gap-2.5 mt-3">
                          {sorted.map(a => (
                            <div key={a.id}>
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-xs text-gray-600">{a.name}</span>
                                <span className="text-xs font-semibold text-gray-900">{a.pct}%</span>
                              </div>
                              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                <div className="h-1.5 rounded-full"
                                  style={{ width: `${Math.max(a.pct, 1)}%`, background: a.color }} />
                              </div>
                              {getNote(r, a.id) && (
                                <div className="text-xs text-gray-400 mt-1 italic">&ldquo;{getNote(r, a.id)}&rdquo;</div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </>
        )}
      </div>
    </PageShell>
  )
}
