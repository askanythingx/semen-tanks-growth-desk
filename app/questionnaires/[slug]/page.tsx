'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

const ANGLES = [
  { id: 1, name: 'The Animal',     color: '#1D9E75', bg: '#E9F7EF', desc: 'How often do buyers mention their specific animal when they contact you?', sub: 'e.g. "I need a tank for my cattle" or "this is for my horses"', options: ['Cattle / Bull', 'Equine / Horse', 'Canine / Dog', 'Goat / Sheep', 'Mix of all'] },
  { id: 2, name: 'The Job',        color: '#185FA5', bg: '#E6F1FB', desc: 'How often do buyers describe what they need to DO rather than what they want to buy?', sub: 'e.g. "I need to store frozen semen" or "I need to ship genetics to a vet"', options: ['Store on-farm', 'Transport / Ship', 'Both equally'] },
  { id: 3, name: 'Buying Signal',  color: '#BA7517', bg: '#FEF3E2', desc: 'When buyers call or enquire, how ready are they to purchase?', sub: 'e.g. "What\'s the price?" vs "I\'m just looking around"', options: ['Very ready — just need price', 'Still researching', 'Mixed — depends on the person'] },
  { id: 4, name: 'The Situation',  color: '#6B3FA0', bg: '#F0EBF8', desc: 'What situation are most buyers in when they contact you?', sub: 'e.g. first time buyer, replacing an old tank, upgrading to bigger', options: ['First time buyer', 'Replacing old tank', 'Upgrading size', 'Adding a second tank', 'Mix of all'] },
  { id: 5, name: 'The Competitor', color: '#C0392B', bg: '#FDECEA', desc: 'Do buyers often mention they are comparing options or other brands?', sub: 'e.g. "I also looked at Taylor Wharton" or "what\'s the best tank?"', options: ['Yes — often comparing', 'Rarely — they know MVE', 'Sometimes'] },
  { id: 6, name: 'The Geography',  color: '#0E7C6B', bg: '#D4F0EB', desc: 'Do buyers mention wanting a USA-based supplier or ask about shipping?', sub: 'e.g. "Do you ship fast?" or "Is this made in the USA?"', options: ['Yes — often ask about shipping', 'Sometimes', 'Rarely'] },
  { id: 7, name: 'The Ecosystem',  color: '#854F0B', bg: '#FEF3E2', desc: 'What percentage of your buyers are repeat customers or buying accessories?', sub: 'e.g. coming back for canes, goblets, a second tank', options: ['Mostly repeat (60%+)', 'About half and half', 'Mostly new buyers'] },
  { id: 8, name: 'The Season',     color: '#3B6D11', bg: '#EAF3DE', desc: 'Do you see a clear spike in enquiries during spring (April–June) breeding season?', sub: 'e.g. a big rush in April vs quiet in December', options: ['Yes — very clear spike', 'Slight seasonal increase', 'Pretty steady year-round'] },
]

export default function BuyerQuizPage() {
  const router = useRouter()
  const [step, setStep] = useState<'name' | 'quiz' | 'done'>('name')
  const [submittedBy, setSubmittedBy] = useState('')
  const [currentAngle, setCurrentAngle] = useState(0)
  const [vals, setVals] = useState<Record<number, number>>({ 1:0,2:0,3:0,4:0,5:0,6:0,7:0,8:0 })
  const [notes, setNotes] = useState<Record<number, string>>({ 1:'',2:'',3:'',4:'',5:'',6:'',7:'',8:'' })
  const [selected, setSelected] = useState<Record<number, string[]>>({ 1:[],2:[],3:[],4:[],5:[],6:[],7:[],8:[] })
  const [saving, setSaving] = useState(false)
  const [results, setResults] = useState<{ name: string; pct: number; color: string }[]>([])

  const total = Object.values(vals).reduce((a, b) => a + b, 0)
  const angle = ANGLES[currentAngle]
  const isLast = currentAngle === ANGLES.length - 1

  function toggleOption(angleId: number, option: string) {
    setSelected(prev => {
      const curr = prev[angleId] || []
      return {
        ...prev,
        [angleId]: curr.includes(option) ? curr.filter(o => o !== option) : [...curr, option]
      }
    })
  }

  async function handleSubmit() {
    if (total !== 100) return
    setSaving(true)
    const payload = {
      submitted_by: submittedBy,
      angle_1_pct: vals[1], angle_2_pct: vals[2], angle_3_pct: vals[3], angle_4_pct: vals[4],
      angle_5_pct: vals[5], angle_6_pct: vals[6], angle_7_pct: vals[7], angle_8_pct: vals[8],
      angle_1_note: [selected[1].join(', '), notes[1]].filter(Boolean).join(' — '),
      angle_2_note: [selected[2].join(', '), notes[2]].filter(Boolean).join(' — '),
      angle_3_note: [selected[3].join(', '), notes[3]].filter(Boolean).join(' — '),
      angle_4_note: [selected[4].join(', '), notes[4]].filter(Boolean).join(' — '),
      angle_5_note: [selected[5].join(', '), notes[5]].filter(Boolean).join(' — '),
      angle_6_note: [selected[6].join(', '), notes[6]].filter(Boolean).join(' — '),
      angle_7_note: [selected[7].join(', '), notes[7]].filter(Boolean).join(' — '),
      angle_8_note: [selected[8].join(', '), notes[8]].filter(Boolean).join(' — '),
    }
    await supabase.from('quiz_results').insert(payload)
    const sorted = ANGLES.map(a => ({ name: a.name, pct: vals[a.id], color: a.color }))
      .sort((a, b) => b.pct - a.pct)
    setResults(sorted)
    setSaving(false)
    setStep('done')
  }

  /* ── NAME STEP ── */
  if (step === 'name') return (
    <div className="min-h-screen bg-gray-50 flex flex-col px-5 pt-12 max-w-md mx-auto">
      <div className="mb-10">
        <div className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-2">GrowthDesk</div>
        <h1 className="text-2xl font-semibold text-gray-900 leading-tight">Buyer Priority Quiz</h1>
        <p className="text-sm text-gray-500 mt-2 leading-relaxed">
          Hi Janey & Mark — this takes about 3 minutes. Your answers will shape how we allocate the Google Ads budget.
        </p>
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-6">
        <label className="text-sm font-medium text-gray-700 block mb-3">Your name</label>
        <input
          value={submittedBy}
          onChange={e => setSubmittedBy(e.target.value)}
          placeholder="e.g. Janey or Mark"
          className="w-full text-base border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-brand-700"
          autoFocus
        />
      </div>
      <button
        disabled={!submittedBy.trim()}
        onClick={() => setStep('quiz')}
        className="w-full py-4 rounded-2xl text-base font-semibold bg-brand-700 text-white disabled:opacity-30 active:bg-brand-900 transition-all">
        Start Quiz →
      </button>
    </div>
  )

  /* ── DONE STEP ── */
  if (step === 'done') return (
    <div className="min-h-screen bg-gray-50 flex flex-col px-5 pt-12 max-w-md mx-auto">
      <div className="mb-8">
        <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center mb-4">
          <span className="text-2xl">✓</span>
        </div>
        <h1 className="text-2xl font-semibold text-gray-900">Thank you, {submittedBy}!</h1>
        <p className="text-sm text-gray-500 mt-2">Your priorities have been saved. Smit will use these to plan the campaigns.</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-4">
        <div className="text-sm font-medium text-gray-700 mb-4">Your priority ranking</div>
        <div className="flex flex-col gap-3">
          {results.map((r, i) => (
            <div key={r.name} className="flex items-center gap-3">
              <span className="text-xs text-gray-400 w-4 font-mono">#{i + 1}</span>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-700">{r.name}</span>
                  <span className="text-sm font-semibold text-gray-900">{r.pct}%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-2 rounded-full transition-all" style={{ width: `${Math.max(r.pct, 2)}%`, background: r.color }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button onClick={() => router.push('/')}
        className="w-full py-4 rounded-2xl text-base font-medium bg-white border border-gray-200 text-gray-600">
        Back to Home
      </button>
    </div>
  )

  /* ── QUIZ STEP ── */
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col max-w-md mx-auto">

      {/* Top bar */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-100 px-5 pt-4 pb-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-gray-400">{currentAngle + 1} of {ANGLES.length}</span>
          <span className={`text-sm font-semibold ${total === 100 ? 'text-green-600' : total > 100 ? 'text-red-500' : 'text-gray-400'}`}>
            {total}% / 100%
          </span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-1.5">
          <div className="h-1.5 rounded-full transition-all" style={{ width: `${((currentAngle) / ANGLES.length) * 100}%`, background: angle.color }} />
        </div>
      </div>

      {/* Question */}
      <div className="flex-1 px-5 pt-6 pb-4">
        <div className="h-1 rounded-full mb-6" style={{ background: angle.color }} />

        <div className="text-xs font-medium uppercase tracking-widest mb-2" style={{ color: angle.color }}>
          Angle {angle.id} — {angle.name}
        </div>
        <h2 className="text-lg font-semibold text-gray-900 leading-snug mb-2">{angle.desc}</h2>
        <p className="text-sm text-gray-400 mb-6 leading-relaxed italic">{angle.sub}</p>

        {/* Quick-pick options */}
        <div className="text-xs font-medium text-gray-500 mb-3">What do you observe most? (tap all that apply)</div>
        <div className="flex flex-wrap gap-2 mb-6">
          {angle.options.map(opt => (
            <button key={opt}
              onClick={() => toggleOption(angle.id, opt)}
              className={`text-sm px-4 py-2.5 rounded-xl border font-medium transition-all
                ${(selected[angle.id] || []).includes(opt)
                  ? 'text-white border-transparent'
                  : 'bg-white text-gray-600 border-gray-200'}`}
              style={(selected[angle.id] || []).includes(opt) ? { background: angle.color, borderColor: angle.color } : {}}>
              {opt}
            </button>
          ))}
        </div>

        {/* Slider */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-4">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-gray-700">Priority percentage</span>
            <span className="text-3xl font-bold" style={{ color: angle.color }}>{vals[angle.id]}%</span>
          </div>
          <input type="range" min={0} max={60} step={1} value={vals[angle.id]}
            onChange={e => setVals(prev => ({ ...prev, [angle.id]: parseInt(e.target.value) }))} />
          <div className="flex justify-between text-xs text-gray-300 mt-1">
            <span>0% — not common</span>
            <span>60% — very common</span>
          </div>
        </div>

        {/* Notes */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4 mb-6">
          <label className="text-xs font-medium text-gray-500 block mb-2">Any notes? (optional)</label>
          <textarea
            value={notes[angle.id]}
            onChange={e => setNotes(prev => ({ ...prev, [angle.id]: e.target.value }))}
            placeholder="e.g. mostly cattle breeders, equine growing fast lately..."
            rows={2}
            className="w-full text-sm text-gray-700 outline-none resize-none placeholder-gray-300"
          />
        </div>

        {/* Remaining hint */}
        {total > 0 && total !== 100 && (
          <div className={`text-center text-sm mb-4 font-medium ${total > 100 ? 'text-red-500' : 'text-amber-500'}`}>
            {total > 100 ? `${total - 100}% over — please reduce some angles` : `${100 - total}% left to assign across all angles`}
          </div>
        )}
      </div>

      {/* Bottom navigation */}
      <div className="px-5 pb-8 pt-2 bg-white border-t border-gray-100">
        <div className="flex gap-3">
          {currentAngle > 0 && (
            <button onClick={() => setCurrentAngle(prev => prev - 1)}
              className="flex-1 py-4 rounded-2xl text-base font-medium bg-gray-100 text-gray-600">
              ← Back
            </button>
          )}
          {!isLast ? (
            <button onClick={() => setCurrentAngle(prev => prev + 1)}
              className="flex-1 py-4 rounded-2xl text-base font-semibold text-white transition-all"
              style={{ background: angle.color }}>
              Next →
            </button>
          ) : (
            <button
              disabled={total !== 100 || saving}
              onClick={handleSubmit}
              className="flex-1 py-4 rounded-2xl text-base font-semibold bg-brand-700 text-white disabled:opacity-30 active:bg-brand-900 transition-all">
              {saving ? 'Saving...' : total !== 100 ? `${total > 100 ? 'Over' : 100 - total + '% remaining'}` : 'Submit →'}
            </button>
          )}
        </div>
      </div>

    </div>
  )
}
