import Link from 'next/link'
import './arbeiten.css'

const categories = [
  { slug: 'tuecher', label: 'Tücher' },
  { slug: 'papierarbeiten', label: 'Papierarbeiten' },
  { slug: 'klingenschnitte', label: 'Klingenschnitte' },
]

export default function ArbeitenPage() {
  return (
    <div className="arbeiten container">
      <h1 className="arbeiten__heading">Arbeiten</h1>
      <ul className="arbeiten__categories">
        {categories.map(({ slug, label }) => (
          <li key={slug}>
            <Link href={`/arbeiten/${slug}`} className="arbeiten__category-link">
              <span className="arbeiten__category-label">{label}</span>
              <svg
                className="arbeiten__category-arrow"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
