import Nav from './Nav'

export default function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <Nav />
      {/* Desktop: offset for sidebar. Mobile: offset for bottom nav */}
      <main className="md:ml-52 pb-24 md:pb-8">
        {children}
      </main>
    </div>
  )
}
