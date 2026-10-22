import Link from 'next/link'

const NAV_ITEMS = [
  { label: 'Projects', href: '/projects' },
  { label: 'About', href: '/about' },
]

// Logo falls back to text until GET /api/v1/site/logo is available.
export function SiteHeader() {
  return (
    <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex h-11 max-w-5xl items-center justify-between px-4 text-xs">
        <Link
          href="/home"
          aria-label="180 Studio, home"
          className="text-sm font-semibold"
        >
          180 Studio
        </Link>
        <nav aria-label="Main">
          <ul className="flex gap-8">
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <Link href={item.href}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  )
}
