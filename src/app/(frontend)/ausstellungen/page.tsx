import { getPayload } from 'payload'
import config from '@payload-config'
import type { Exhibition } from '@/payload-types'
import './ausstellungen.css'

export const dynamic = 'force-dynamic'

export default async function AusstellungenPage() {
  const payload = await getPayload({ config })
  const { docs: exhibitions } = await payload.find({
    collection: 'exhibitions',
    sort: '-createdAt',
    limit: 100,
  })

  return (
    <div className="ausstellungen container">
      <h1 className="ausstellungen__heading">Ausstellungen</h1>
      {exhibitions.length === 0 ? (
        <p className="ausstellungen__empty">Keine Ausstellungen vorhanden.</p>
      ) : (
        <ul className="ausstellungen__list">
          {exhibitions.map((exhibition) => (
            <li key={exhibition.id}>
              <ExhibitionEntry exhibition={exhibition as Exhibition} />
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

function ExhibitionEntry({ exhibition }: { exhibition: Exhibition }) {
  const imageUrl =
    exhibition.image &&
    typeof exhibition.image === 'object' &&
    'url' in exhibition.image
      ? (exhibition.image as { url?: string }).url
      : null

  return (
    <article className="exhibition">
      <div className="exhibition__image-wrap">
        {imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={imageUrl} alt={exhibition.title} className="exhibition__image" />
        ) : (
          <div className="exhibition__image-placeholder" aria-hidden="true">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <path d="m21 15-5-5L5 21" />
            </svg>
          </div>
        )}
      </div>
      <div className="exhibition__info">
        <h2 className="exhibition__title">{exhibition.title}</h2>
        <p className="exhibition__period">{exhibition.period}</p>
        {exhibition.location && (
          <p className="exhibition__location">{exhibition.location}</p>
        )}
      </div>
    </article>
  )
}
