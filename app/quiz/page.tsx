'use client'
import { useState } from 'react'
import Sidebar from '@/components/Sidebar'
import { supabase } from '@/lib/supabase'

const ANGLES = [
  { id: 1, name: 'The Animal',        color: '#1D9E75', emoji: '🐄', desc: 'Buyer searches by their specific animal type', examples: '"cattle semen tank" / "horse semen storage" / "equine vapor shipper"' },
  { id: 2, name: 'The Job',           color: '#185FA5', emoji: '🔧', desc: 'Buyer searches by what they need to accomplish', examples: '"how to store frozen bull semen" / "liquid nitrogen tank for AI"' },
  { id: 3, name: 'Buying Signal',     color: '#BA7517', emoji: '🛒', desc: 'Buyer is ready to purchase right now', examples: '"semen tank for sale" / "MVE tank price" / "buy liquid nitrogen tank"' },
  { id: 4, name: 'The Situation',     color: '#6B3FA0', emoji: '📦', desc: 'Buyer is in a specific circumstance (new, upgrading, replacing)', examples: '"beginner semen tank" / "replace old tank" / "upgrade semen storage"' },
  { id: 5, name: 'The Competitor',    color: '#C0392B', emoji: '🔄', desc: 'Buyer is comparing brands or looking for the best option', examples: '"best semen tank" / "MVE vs Taylor Wharton" / "top rated tank"' },
  { id: 6, name: 'The Geography',     color: '#0E7C6B', emoji: '📍', desc: 'Buyer specifically wants a USA-based supplier', examples: '"MVE tank USA" / "semen tank free shipping" / "made in USA tank"' },
  { id: 7, name: 'The Ecosystem',     color: '#854F0B', emoji: '🔩', desc: 'Repeat buyer or searching for accessories', examples: '"semen tank canes" / "MVE tank accessories" / "canekeeper"' },
  { id: 8, name: 'The Season',        color: '#3B6D11', emoji: '📅', desc: 'Buyer driven by breeding season urgency', examples: '"semen tank spring AI season" / "tank fast shipping in stock"' },
]

export default function QuizPage() {
  const [vals, setVals] = useState<Record<number, number>>({1:0,2:0,3:0,4:0,5:0,6:0,7:0,8:0})
  const [notes, setNotes] = useState<Record<number, string>>({1:'',2:'',3:'',4:'',5:'',6:'',7:'',8:''})
  const [submittedBy, setSubmittedBy] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [saving, setSaving] = useState(false)
  const [results, setResults] = useState<{id:number;name:string;pct:number;color:string}[]>([])

  const total = Object.values(vals).reduce((a,b)=>a+b,0)
  const canSubmit = total === 100 && submittedBy.trim().length > 0

  async function handleSubmit() {
    if (!canSubmit) return
    setSaving(true)
    const payload = {
      submitted_by: submittedBy,
      angle_1_pct: vals[1], angle_2_pct: vals[2], angle_3_pct: vals[3], angle_4_pct: vals[4],
      angle_5_pct: vals[5], angle_6_pct: vals[6], angle_7_pct: vals[7], angle_8_pct: vals[8],
      angle_1_note: notes[1], angle_2_note: notes[2], angle_3_note: notes[3], angle_4_note: notes[4],
      angle_5_note: notes[5], angle_6_note: notes[6], angle_7_note: notes[7], angle_8_note: notes[8],
    }
    await supabase.from('quiz_results').insert(payload)
    const sorted = ANGLES.map(a => ({ ...a, pct: vals[a.id] })).sort((a,b) => b.pct - a.pct)
    setResults(sorted)
    setSubmitted(true)
    setSaving(false)
  }

  if (submitted) {
    return (
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="ml-56 flex-1 p-8">
          <div className="max-w-2xl">
            <div className="bg-brand-700 rounded-2xl p-6 text-white mb-6">
              <h1 className="text-xl font-semibold mb-1">Priority report saved</h1>
              <p className="text-blue-200 text-sm">Submitted by {submittedBy} — April 13, 2026</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-5 mb-4">
              <h2 className="text-sm font-medium text-gray-700 mb-4">Buyer angle priorities — ranked</h2>
              <div className="space-y-3">
                {results.map((r, i) => (
                  <div key={r.id} className="flex items-center gap-3">
                    <span className="text-xs text-gray-400 w-5 text-center font-mono">#{i+1}</span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-gray-700">{r.name}</span>
                        <span className="text-sm font-medium text-gray-900">{r.pct}%</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-2 rounded-full" style={{ width: `${r.pct}%`, background: r.color }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
              Results saved to database. Smit will use these priorities to allocate campaign budget and write angle-specific ad copy for Deepak.
            </div>
            <button onClick={() => { setSubmitted(false); setVals({1:0,2:0,3:0,4:0,5:0,6:0,7:0,8:0}); setNotes({1:'',2:'',3:'',4:'',5:'',6:'',7:'',8:''}); setSubmittedBy('') }}
              className="mt-4 text-sm text-gray-500 hover:text-gray-700 underline">
              Submit another response
            </button>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="ml-56 flex-1 p-8">
        <div className="max-w-2xl">
          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-gray-900">Buyer Priority Quiz</h1>
            <p className="text-sm text-gray-500 mt-1">For Janey & Mark — assign % priority to each buyer angle. Total must equal 100%.</p>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
            <label className="text-sm font-medium text-gray-700 block mb-2">Your name</label>
            <input value={submittedBy} onChange={e => setSubmittedBy(e.target.value)}
              placeholder="e.g. Janey or Mark"
              className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-brand-500" />
          </div>

          <div className="sticky top-4 z-10 bg-white border border-gray-200 rounded-xl px-4 py-3 mb-6 flex items-center justify-between shadow-sm">
            <span className="text-sm text-gray-600">Total assigned</span>
            <span className={`text-lg font-semibold ${total === 100 ? 'text-green-600' : total > 100 ? 'text-red-600' : 'text-amber-600'}`}>
              {total}% / 100%
            </span>
          </div>

          <div className="space-y-4 mb-6">
            {ANGLES.map(a => (
              <div key={a.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="h-1" style={{ background: a.color }} />
                <div className="p-4">
                  <div className="flex items-start justify-between mb-1">
                    <div>
                      <span className="text-xs text-gray-400 font-mono">Angle {a.id}</span>
                      <h3 className="text-sm font-medium text-gray-900">{a.name}</h3>
                    </div>
                    <span className="text-2xl font-semibold" style={{ color: a.color }}>{vals[a.id]}%</span>
                  </div>
                  <p className="text-xs text-gray-500 mb-2">{a.desc}</p>
                  <p className="text-xs text-gray-400 italic mb-3">{a.examples}</p>
                  <input type="range" min={0} max={60} step={1} value={vals[a.id]}
                    onChange={e => setVals(prev => ({ ...prev, [a.id]: parseInt(e.target.value) }))}
                    className="w-full mb-3" />
                  <textarea value={notes[a.id]}
                    onChange={e => setNotes(prev => ({ ...prev, [a.id]: e.target.value }))}
                    placeholder="Optional notes — e.g. which animals, what buyer type you see most..."
                    rows={2}
                    className="w-full text-xs border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-brand-500 resize-none text-gray-600" />
                </div>
              </div>
            ))}
          </div>

          <button onClick={handleSubmit} disabled={!canSubmit || saving}
            className={`w-full py-3 rounded-xl text-sm font-medium transition-all
              ${canSubmit ? 'bg-brand-700 text-white hover:bg-brand-900' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}>
            {saving ? 'Saving...' : canSubmit ? 'Submit priority report' : total > 100 ? `Over by ${total - 100}% — please adjust` : `${100 - total}% remaining to assign`}
          </button>
        </div>
      </main>
    </div>
  )
}
