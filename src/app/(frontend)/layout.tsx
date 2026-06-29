import type { Metadata } from 'next'
import { Nav } from '@/components/Nav/Nav'
import Link from 'next/link'
import './styles.css'
import './layout.css'

export const metadata: Metadata = {
  title: {
    default: 'Andreas Junge',
    template: '%s · Andreas Junge',
  },
  description: 'Bildender Künstler – Tücher, Papierarbeiten, Klingenschnitte',
}

export default function FrontendLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <body>
        <Nav />
        <main id="main-content">{children}</main>
        <footer className="site-footer">
          <div className="container site-footer__inner">
            <span className="site-footer__contact">
              <a href="mailto:gallerie@gallerieroy.de" className="site-footer__email">
                gallerie@gallerieroy.de
              </a>
            </span>
            <nav aria-label="Rechtliches" className="site-footer__legal">
              <Link href="/impressum" className="site-footer__legal-link">Impressum</Link>
              <Link href="/datenschutz" className="site-footer__legal-link">Datenschutz</Link>
            </nav>
          </div>
        </footer>
      </body>
    </html>
  )
}
