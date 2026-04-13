import Sidebar from '@/components/Sidebar'
import Link from 'next/link'

const stats = [
  { label: 'Total Tasks',     value: '29',  sub: 'Dhruvi\'s sprint',   color: 'bg-blue-50 text-blue-700' },
  { label: 'Critical Issues', value: '7',   sub: 'Fix immediately',     color: 'bg-red-50 text-red-700' },
  { label: 'In Progress',     value: '0',   sub: 'Currently active',    color: 'bg-amber-50 text-amber-700' },
  { label: 'Completed',       value: '0',   sub: 'Done so far',         color: 'bg-green-50 text-green-700' },
]

const quickLinks = [
  { href: '/sprints',  label: 'View Sprint Board',   desc: '29 website audit tasks for Dhruvi', color: 'border-blue-200 hover:border-blue-400' },
  { href: '/quiz',     label: 'Buyer Priority Quiz',  desc: 'Janey & Mark — 8 angle priorities', color: 'border-purple-200 hover:border-purple-400' },
  { href: '/keywords', label: 'Keyword Tracker',      desc: 'XC 20 + Vapor 4/2V campaigns',      color: 'border-green-200 hover:border-green-400' },
]

export default function Dashboard() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="ml-56 flex-1 p-8">
        <div className="max-w-4xl">
          <div className="mb-8">
            <h1 className="text-2xl font-semibold text-gray-900">Good morning</h1>
            <p className="text-gray-500 text-sm mt-1">SemenTanks.com growth operations — April 13, 2026</p>
          </div>

          <div className="grid grid-cols-4 gap-4 mb-8">
            {stats.map(s => (
              <div key={s.label} className={`rounded-xl p-4 ${s.color.split(' ')[0]}`}>
                <div className={`text-3xl font-semibold ${s.color.split(' ')[1]}`}>{s.value}</div>
                <div className="text-sm font-medium text-gray-700 mt-1">{s.label}</div>
                <div className="text-xs text-gray-500 mt-0.5">{s.sub}</div>
              </div>
            ))}
          </div>

          <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">Quick access</h2>
          <div className="grid grid-cols-3 gap-4 mb-8">
            {quickLinks.map(l => (
              <Link key={l.href} href={l.href}
                className={`bg-white rounded-xl border p-5 transition-all ${l.color}`}>
                <div className="font-medium text-gray-900 text-sm mb-1">{l.label}</div>
                <div className="text-xs text-gray-500">{l.desc}</div>
              </Link>
            ))}
          </div>

          <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">Team</h2>
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            {[
              { name: 'Dhruvi Axit', role: 'Shopify Developer', focus: '29 website audit fixes', status: 'Active', color: 'bg-blue-100 text-blue-700' },
              { name: 'Deepak',      role: 'Google Ads Manager', focus: 'Campaign optimisation — IS & tCPA fixes', status: 'Active', color: 'bg-green-100 text-green-700' },
              { name: 'Janey',       role: 'Client Stakeholder', focus: 'Buyer quiz — 8 angle priorities', status: 'Pending', color: 'bg-amber-100 text-amber-700' },
              { name: 'Smit',        role: 'Growth Manager',     focus: 'Strategy, reports, team direction', status: 'Active', color: 'bg-purple-100 text-purple-700' },
            ].map((m, i) => (
              <div key={m.name} className={`flex items-center gap-4 px-5 py-4 ${i !== 3 ? 'border-b border-gray-100' : ''}`}>
                <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-sm font-medium text-gray-600 flex-shrink-0">
                  {m.name.slice(0, 2).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900">{m.name}</div>
                  <div className="text-xs text-gray-500">{m.role}</div>
                </div>
                <div className="text-xs text-gray-500 flex-1 hidden md:block">{m.focus}</div>
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${m.color}`}>{m.status}</span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
