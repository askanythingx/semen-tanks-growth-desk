'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const nav = [
  {
    href: '/',
    label: 'Home',
    icon: (
      <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z"/>
        <path d="M9 21V12h6v9"/>
      </svg>
    ),
  },
  {
    href: '/sprints',
    label: 'Sprints',
    icon: (
      <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
        <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
      </svg>
    ),
  },
  {
    href: '/questionnaires',
    label: 'Surveys',
    icon: (
      <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="9"/>
        <path d="M12 8v4l3 3"/>
      </svg>
    ),
  },
]

export default function Nav() {
  const path = usePathname()

  const isActive = (href: string) => {
    if (href === '/') return path === '/'
    return path.startsWith(href)
  }

  return (
    <>
      {/* ── DESKTOP SIDEBAR ── */}
      <aside className="hidden md:flex w-52 min-h-screen bg-brand-700 flex-col py-6 px-3 fixed left-0 top-0 z-30">
        <div className="mb-8 px-2">
          <div className="text-white font-semibold text-sm tracking-tight">GrowthDesk</div>
          <div className="text-blue-300 text-xs mt-0.5">SemenTanks.com</div>
        </div>
        <nav className="flex flex-col gap-1 flex-1">
          {nav.map(n => (
            <Link key={n.href} href={n.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all
                ${isActive(n.href) ? 'bg-white/15 text-white font-medium' : 'text-blue-200 hover:bg-white/10 hover:text-white'}`}>
              <span className="flex-shrink-0">{n.icon}</span>
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="mt-auto pt-4 border-t border-white/10 px-2">
          <div className="text-blue-300 text-xs">April 2026</div>
          <div className="text-blue-400 text-xs mt-0.5">by Smit</div>
        </div>
      </aside>

      {/* ── MOBILE BOTTOM NAV ── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 bottom-safe">
        <div className="flex">
          {nav.map(n => (
            <Link key={n.href} href={n.href}
              className={`flex-1 flex flex-col items-center justify-center py-2 gap-1 transition-all
                ${isActive(n.href) ? 'text-brand-700' : 'text-gray-400'}`}>
              <span className={`transition-all ${isActive(n.href) ? 'text-brand-700' : 'text-gray-400'}`}>
                {n.icon}
              </span>
              <span className={`text-xs font-medium ${isActive(n.href) ? 'text-brand-700' : 'text-gray-400'}`}>
                {n.label}
              </span>
            </Link>
          ))}
        </div>
      </nav>
    </>
  )
}
