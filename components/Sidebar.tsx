'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const nav = [
  { href: '/',          label: 'Dashboard',    icon: '▦' },
  { href: '/sprints',   label: 'Sprint Board', icon: '◈' },
  { href: '/quiz',      label: 'Buyer Quiz',   icon: '◎' },
  { href: '/keywords',  label: 'Keywords',     icon: '◇' },
]

export default function Sidebar() {
  const path = usePathname()
  return (
    <aside className="w-56 min-h-screen bg-brand-700 flex flex-col py-6 px-4 fixed left-0 top-0">
      <div className="mb-8">
        <div className="text-white font-semibold text-base tracking-tight">GrowthDesk</div>
        <div className="text-blue-300 text-xs mt-0.5">SemenTanks.com</div>
      </div>
      <nav className="flex flex-col gap-1 flex-1">
        {nav.map(n => {
          const active = path === n.href
          return (
            <Link key={n.href} href={n.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all
                ${active ? 'bg-white/15 text-white font-medium' : 'text-blue-200 hover:bg-white/10 hover:text-white'}`}>
              <span className="text-base">{n.icon}</span>
              {n.label}
            </Link>
          )
        })}
      </nav>
      <div className="mt-auto pt-4 border-t border-white/10">
        <div className="text-blue-300 text-xs">April 13, 2026</div>
        <div className="text-blue-400 text-xs mt-0.5">Prepared by Smit</div>
      </div>
    </aside>
  )
}
