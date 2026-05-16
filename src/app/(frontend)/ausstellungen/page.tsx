import { getPayload } from 'payload'
import config from '@/../src/payload.config'
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
            <ExhibitionEntry key={exhibition.id} exhibition={exhibition as Exhibition} />
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
    <li className="exhibition">
      {imageUrl && (
        <div className="exhibition__image-wrap">
          <img
            src={imageUrl}
            alt={exhibition.title}
            className="exhibition__image"
          />
        </div>
      )}
      <div className="exhibition__info">
        <h2 className="exhibition__title">{exhibition.title}</h2>
        <p className="exhibition__period">{exhibition.period}</p>
        {exhibition.location && (
          <p className="exhibition__location">{exhibition.location}</p>
        )}
        {exhibition.link && (
          <a
            href={exhibition.link}
            className="exhibition__link"
            target="_blank"
            rel="noopener noreferrer"
          >
            Zur Ausstellung →
          </a>
        )}
      </div>
    </li>
  )
}
