'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'

const HomeIcon = () => (
  <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
    <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z"/>
    <path d="M9 21V12h6v9"/>
  </svg>
)
const SprintIcon = () => (
  <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
    <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
    <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
  </svg>
)
const SurveyIcon = () => (
  <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
    <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/>
    <rect x="9" y="3" width="6" height="4" rx="1"/>
    <path d="M9 12h6M9 16h4"/>
  </svg>
)
const AdminIcon = () => (
  <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
  </svg>
)
const SignOutIcon = () => (
  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
    <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/>
  </svg>
)

export default function Nav() {
  const path = usePathname()
  const { profile, signOut } = useAuth()
  const isAdmin = profile?.role === 'admin'

  const isActive = (href: string) => href === '/' ? path === '/' : path.startsWith(href)

  const allTabs = [
    { href: '/',                label: 'Home',    icon: <HomeIcon />,   show: profile?.can_see_dashboard || isAdmin },
    { href: '/sprints',         label: 'Sprints', icon: <SprintIcon />, show: profile?.can_see_sprints || isAdmin   },
    { href: '/questionnaires',  label: 'Surveys', icon: <SurveyIcon />, show: profile?.can_see_surveys || isAdmin   },
    { href: '/admin/users',     label: 'Admin',   icon: <AdminIcon />,  show: isAdmin                               },
  ]

  const tabs = allTabs.filter(t => t.show)

  return (
    <>
      {/* ── DESKTOP SIDEBAR ── */}
      <aside className="hidden md:flex w-52 min-h-screen bg-brand-700 flex-col py-6 px-3 fixed left-0 top-0 z-30">
        <div className="mb-8 px-2">
          <div className="text-white font-semibold text-sm">GrowthDesk</div>
          <div className="text-blue-300 text-xs mt-0.5">SemenTanks.com</div>
        </div>
        <nav className="flex flex-col gap-1 flex-1">
          {tabs.map(n => (
            <Link key={n.href} href={n.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all
                ${isActive(n.href) ? 'bg-white/15 text-white font-medium' : 'text-blue-200 hover:bg-white/10 hover:text-white'}`}>
              <span className="flex-shrink-0">{n.icon}</span>
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="mt-auto pt-4 border-t border-white/10 px-2">
          {profile && (
            <div className="mb-3">
              <div className="text-white text-xs font-medium">{profile.name}</div>
              <div className="text-blue-400 text-xs">{profile.role === 'admin' ? 'Admin' : 'Member'}</div>
            </div>
          )}
          <button onClick={signOut}
            className="flex items-center gap-2 text-blue-300 hover:text-white text-xs transition-all">
            <SignOutIcon />
            Sign out
          </button>
        </div>
      </aside>

      {/* ── MOBILE BOTTOM NAV ── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200"
        style={{ paddingBottom: 'max(12px, env(safe-area-inset-bottom))' }}>
        <div className="flex">
          {tabs.map(n => (
            <Link key={n.href} href={n.href}
              className={`flex-1 flex flex-col items-center justify-center py-2 gap-1 transition-all min-h-0
                ${isActive(n.href) ? 'text-brand-700' : 'text-gray-400'}`}>
              {n.icon}
              <span className="text-xs font-medium">{n.label}</span>
            </Link>
          ))}
        </div>
      </nav>
    </>
  )
}
