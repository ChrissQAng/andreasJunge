import type { Metadata } from 'next'
import { Nav } from '@/components/Nav/Nav'
import './styles.css'

export const metadata: Metadata = {
  title: 'Andreas Junge',
  description: 'Künstler-Website Andreas Junge',
}

export default function FrontendLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <body>
        <Nav />
        <main>{children}</main>
      </body>
    </html>
  )
}
