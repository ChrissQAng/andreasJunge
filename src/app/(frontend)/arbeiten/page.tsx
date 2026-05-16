import Link from 'next/link'
import './arbeiten.css'

const categories = [
  { slug: 'tuecher', label: 'Tücher', number: '2.1' },
  { slug: 'papierarbeiten', label: 'Papierarbeiten', number: '2.2' },
  { slug: 'klingenschnitte', label: 'Klingenschnitte', number: '2.3' },
]

export default function ArbeitenPage() {
  return (
    <div className="arbeiten container">
      <h1 className="arbeiten__heading">Arbeiten</h1>
      <ul className="arbeiten__categories">
        {categories.map(({ slug, label, number }) => (
          <li key={slug}>
            <Link href={`/arbeiten/${slug}`} className="arbeiten__category-link">
              <span className="arbeiten__category-number">{number}</span>
              <span className="arbeiten__category-label">{label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
