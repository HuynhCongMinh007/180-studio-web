import Link from "next/link";

const NAV_ITEMS = [
  { label: "Projects", href: "/projects" },
  { label: "About", href: "/about" },
];

// Logo falls back to text until GET /api/v1/site/logo is available.
export function SiteHeader() {
  return (
    <header className="absolute inset-x-0 top-0 z-10 bg-linear-to-b from-black/50 to-transparent text-white">
      <div className="mx-auto flex min-h-[90px] max-w-7xl flex-col items-center justify-center gap-2 px-6 py-4 md:grid md:grid-cols-3">
        <nav aria-label="Main" className="order-2 md:order-1">
          <ul className="flex gap-6 text-sm tracking-widest uppercase">
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="inline-block py-2 hover:opacity-70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <Link
          href="/"
          aria-label="180 Studio, home"
          className="order-1 text-center text-xl font-semibold tracking-[0.3em] md:order-2"
        >
          180 STUDIO
        </Link>
      </div>
    </header>
  );
}
