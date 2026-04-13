'use client'
import { useEffect, useState } from 'react'
import Sidebar from '@/components/Sidebar'
import { supabase } from '@/lib/supabase'

type KWStatus = 'pending' | 'approved' | 'rejected'

interface Keyword {
  id: string
  campaign: string
  keyword: string
  match_type: string
  angle: string
  intent: string
  monthly_volume: string
  status: KWStatus
  notes: string
}

const statusStyle: Record<KWStatus, string> = {
  pending:  'bg-amber-50 text-amber-700 border border-amber-200',
  approved: 'bg-green-50 text-green-700 border border-green-200',
  rejected: 'bg-red-50 text-red-700 border border-red-200',
}

const intentStyle: Record<string, string> = {
  'Very High': 'text-green-700 font-medium',
  'High':      'text-blue-700',
  'Medium':    'text-amber-700',
  'Low':       'text-red-600',
}

export default function KeywordsPage() {
  const [keywords, setKeywords] = useState<Keyword[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'xc20' | 'vapor'>('xc20')
  const [updating, setUpdating] = useState<string | null>(null)
  const [filterAngle, setFilterAngle] = useState('All')
  const [filterStatus, setFilterStatus] = useState('All')

  useEffect(() => { fetchKeywords() }, [])

  async function fetchKeywords() {
    setLoading(true)
    const { data } = await supabase.from('keywords').select('*').order('campaign').order('angle')
    if (data) setKeywords(data as Keyword[])
    setLoading(false)
  }

  async function updateStatus(id: string, status: KWStatus) {
    setUpdating(id)
    await supabase.from('keywords').update({ status }).eq('id', id)
    setKeywords(prev => prev.map(k => k.id === id ? { ...k, status } : k))
    setUpdating(null)
  }

  const campaignData = keywords.filter(k => k.campaign === activeTab)
  const angles = ['All', ...Array.from(new Set(campaignData.map(k => k.angle)))]
  const filtered = campaignData.filter(k => {
    const angleOk = filterAngle === 'All' || k.angle === filterAngle
    const statusOk = filterStatus === 'All' || k.status === filterStatus
    return angleOk && statusOk
  })

  const approved = campaignData.filter(k => k.status === 'approved').length
  const rejected = campaignData.filter(k => k.status === 'rejected').length
  const pending  = campaignData.filter(k => k.status === 'pending').length
  const approvedPct = campaignData.length ? Math.round((approved / campaignData.length) * 100) : 0

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="ml-56 flex-1 p-8">
        <div className="max-w-5xl">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Keyword Tracker</h1>
              <p className="text-sm text-gray-500 mt-1">8-Angle keyword lists — review and approve for Deepak</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-semibold text-gray-900">{approvedPct}%</div>
              <div className="text-xs text-gray-500">{approved} of {campaignData.length} approved</div>
            </div>
          </div>

          <div className="w-full bg-gray-100 rounded-full h-2 mb-6">
            <div className="bg-green-500 h-2 rounded-full transition-all" style={{ width: `${approvedPct}%` }} />
          </div>

          <div className="flex gap-2 mb-6">
            {(['xc20', 'vapor'] as const).map(tab => (
              <button key={tab} onClick={() => { setActiveTab(tab); setFilterAngle('All'); setFilterStatus('All') }}
                className={`px-5 py-2 rounded-lg text-sm font-medium transition-all border
                  ${activeTab === tab ? 'bg-brand-700 text-white border-brand-700' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'}`}>
                {tab === 'xc20' ? 'XC 20 Signature' : 'Vapor SC 4/2V'}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-3 mb-6">
            {[
              { label: 'Pending review', val: pending,   key: 'pending',  bg: 'bg-amber-50 border-amber-200 hover:border-amber-400', txt: 'text-amber-700', sub: 'text-amber-600' },
              { label: 'Approved',       val: approved,  key: 'approved', bg: 'bg-green-50 border-green-200 hover:border-green-400',  txt: 'text-green-700', sub: 'text-green-600' },
              { label: 'Rejected',       val: rejected,  key: 'rejected', bg: 'bg-red-50 border-red-200 hover:border-red-400',        txt: 'text-red-700',   sub: 'text-red-600'   },
            ].map(s => (
              <div key={s.key} onClick={() => setFilterStatus(filterStatus === s.key ? 'All' : s.key)}
                className={`border rounded-xl p-4 cursor-pointer transition-all ${s.bg}`}>
                <div className={`text-2xl font-semibold ${s.txt}`}>{s.val}</div>
                <div className={`text-xs mt-0.5 ${s.sub}`}>{s.label} {filterStatus === s.key && '← filtering'}</div>
              </div>
            ))}
          </div>

          <div className="flex gap-2 mb-4 flex-wrap">
            {angles.map(a => (
              <button key={a} onClick={() => setFilterAngle(a)}
                className={`text-xs px-3 py-1.5 rounded-lg border transition-all
                  ${filterAngle === a ? 'bg-brand-700 text-white border-brand-700' : 'bg-white text-gray-500 border-gray-200 hover:border-gray-400'}`}>
                {a}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="text-center py-16 text-gray-400 text-sm">Loading keywords...</div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <table className="w-full text-sm table-fixed">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 w-64">Keyword</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 w-20">Match</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 w-28">Angle</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 w-24">Intent</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 w-20">Volume</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 w-24">Status</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 w-28">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((k, i) => (
                    <tr key={k.id}
                      className={`border-b border-gray-50 transition-all
                        ${k.status === 'rejected' ? 'opacity-40' : ''}
                        ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/40'}`}>
                      <td className="px-4 py-3 font-medium text-gray-900 text-xs truncate">{k.keyword}</td>
                      <td className="px-4 py-3 text-xs text-gray-500">{k.match_type}</td>
                      <td className="px-4 py-3 text-xs text-gray-600">{k.angle}</td>
                      <td className={`px-4 py-3 text-xs ${intentStyle[k.intent] || 'text-gray-600'}`}>{k.intent}</td>
                      <td className="px-4 py-3 text-xs text-gray-500">{k.monthly_volume}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${statusStyle[k.status]}`}>
                          {k.status.charAt(0).toUpperCase() + k.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1">
                          {(['approved', 'rejected', 'pending'] as KWStatus[]).map(s => (
                            <button key={s}
                              disabled={k.status === s || updating === k.id}
                              onClick={() => updateStatus(k.id, s)}
                              className={`text-xs px-2 py-1 rounded border transition-all disabled:opacity-30 disabled:cursor-not-allowed
                                ${s === 'approved' ? 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100' :
                                  s === 'rejected' ? 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100' :
                                  'bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100'}`}>
                              {s === 'approved' ? '✓' : s === 'rejected' ? '✕' : '↺'}
                            </button>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filtered.length === 0 && (
                <div className="text-center py-10 text-gray-400 text-sm">No keywords match this filter.</div>
              )}
            </div>
          )}

          {approved > 0 && (
            <div className="mt-6 bg-green-50 border border-green-200 rounded-xl p-4">
              <div className="text-sm font-medium text-green-800 mb-1">
                {approved} keyword{approved !== 1 ? 's' : ''} approved and ready for Deepak
              </div>
              <div className="text-xs text-green-700">
                Share approved keywords with Deepak to add to the campaign ad groups in Google Ads console.
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
