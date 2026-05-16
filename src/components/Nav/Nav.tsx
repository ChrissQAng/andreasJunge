import Link from 'next/link'
import './Nav.css'

const navLinks = [
  { href: '/biographie', label: 'Biographie' },
  { href: '/arbeiten', label: 'Arbeiten' },
  { href: '/texte', label: 'Texte' },
  { href: '/ausstellungen', label: 'Ausstellungen' },
]

export function Nav() {
  return (
    <header className="nav">
      <div className="container nav__inner">
        <Link href="/" className="nav__home" aria-label="Startseite Andreas Junge">
          Andreas Junge
        </Link>
        <nav aria-label="Hauptnavigation">
          <ul className="nav__list">
            {navLinks.map(({ href, label }) => (
              <li key={href}>
                <Link href={href} className="nav__link">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  )
}
