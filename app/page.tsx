import PageShell from '@/components/PageShell'
import Link from 'next/link'

export default function Dashboard() {
  const team = [
    { initials: 'DA', name: 'Dhruvi Axit', role: 'Shopify Developer', focus: '29 website audit tasks', status: 'Active', color: 'bg-blue-100 text-blue-700' },
    { initials: 'DK', name: 'Deepak',      role: 'Google Ads Manager', focus: 'Campaign optimisation', status: 'Active', color: 'bg-green-100 text-green-700' },
    { initials: 'JN', name: 'Janey',       role: 'Client Stakeholder', focus: 'Buyer quiz pending',    status: 'Pending', color: 'bg-amber-100 text-amber-700' },
    { initials: 'SM', name: 'Smit',        role: 'Growth Manager',     focus: 'Strategy & direction',  status: 'Active', color: 'bg-purple-100 text-purple-700' },
  ]

  const quickLinks = [
    { href: '/sprints', label: 'Sprint Board', sub: 'Website audit — Sprint 1', color: 'border-blue-200', dot: 'bg-blue-500' },
    { href: '/questionnaires', label: 'Questionnaires', sub: 'Buyer quiz & more', color: 'border-purple-200', dot: 'bg-purple-500' },
  ]

  return (
    <PageShell>
      <div className="px-4 pt-6 max-w-2xl mx-auto">

        {/* Header */}
        <div className="mb-6">
          <div className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-1">GrowthDesk</div>
          <h1 className="text-2xl font-semibold text-gray-900">Good morning, Smit</h1>
          <p className="text-sm text-gray-500 mt-1">SemenTanks.com · April 2026</p>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {[
            { label: 'Active Tasks', value: '29', color: 'text-brand-700' },
            { label: 'Sprint',       value: '1',  color: 'text-blue-600'  },
            { label: 'Team Members', value: '4',  color: 'text-green-600' },
            { label: 'Surveys',      value: '1',  color: 'text-purple-600'},
          ].map(s => (
            <div key={s.label} className="bg-white rounded-2xl border border-gray-100 p-4">
              <div className={`text-3xl font-semibold ${s.color}`}>{s.value}</div>
              <div className="text-xs text-gray-500 mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Quick links */}
        <div className="mb-6">
          <div className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-3">Quick access</div>
          <div className="flex flex-col gap-3">
            {quickLinks.map(l => (
              <Link key={l.href} href={l.href}
                className={`bg-white rounded-2xl border ${l.color} p-4 flex items-center gap-4 active:scale-98 transition-all`}>
                <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${l.dot}`} />
                <div>
                  <div className="font-medium text-gray-900 text-sm">{l.label}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{l.sub}</div>
                </div>
                <span className="ml-auto text-gray-300 text-lg">›</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Team */}
        <div>
          <div className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-3">Team</div>
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            {team.map((m, i) => (
              <div key={m.name} className={`flex items-center gap-3 px-4 py-3.5 ${i < team.length - 1 ? 'border-b border-gray-50' : ''}`}>
                <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-xs font-semibold text-gray-500 flex-shrink-0">
                  {m.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900">{m.name}</div>
                  <div className="text-xs text-gray-400 truncate">{m.focus}</div>
                </div>
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full flex-shrink-0 ${m.color}`}>
                  {m.status}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </PageShell>
  )
}
