import Link from 'next/link'
import type { Artwork } from '@/payload-types'
import './ArtworkGrid.css'

export function buildArtworkId(artwork: Artwork): string {
  if (artwork.subcategory) {
    return `${artwork.category}/${artwork.subcategory}/${artwork.sequenceNumber}`
  }
  return `${artwork.category}/${artwork.sequenceNumber}`
}

export function buildArtworkSlug(artwork: Artwork): string {
  // Maps category names to URL slugs
  const categorySlug: Record<string, string> = {
    'Tücher': 'tuecher',
    'Papierarbeiten': 'papierarbeiten',
    'Klingenschnitte': 'klingenschnitte',
  }
  const cat = categorySlug[artwork.category] ?? artwork.category.toLowerCase()
  if (artwork.subcategory) {
    return `/arbeiten/${cat}/${artwork.subcategory}/${artwork.sequenceNumber}`
  }
  return `/arbeiten/${cat}/${artwork.sequenceNumber}`
}

function ArtworkTile({ artwork }: { artwork: Artwork }) {
  const imageUrl =
    artwork.image &&
      typeof artwork.image === 'object' &&
      'url' in artwork.image
      ? (artwork.image as { url?: string }).url
      : null

  const detailHref = buildArtworkSlug(artwork)

  return (
    <li className="artwork-tile">
      <Link href={detailHref} className="artwork-tile__link" aria-label={artwork.title}>
        <div className="artwork-tile__image-wrap">
          {imageUrl ? (
            <img src={imageUrl} alt={artwork.title} className="artwork-tile__image" />
          ) : (
            <div className="artwork-tile__placeholder" />
          )}
        </div>
        <div className="artwork-tile__info">
          <p className="artwork-tile__caption">
            <span className="artwork-tile__title">{artwork.title}</span>
          </p>
        </div>
      </Link>
    </li>
  )
}

type ArtworkGridProps = {
  artworks: Artwork[]
  activeSubcategory?: string
  subcategories?: string[]
}

export function ArtworkGrid({ artworks, activeSubcategory, subcategories }: ArtworkGridProps) {
  return (
    <div className="artwork-grid">
      {subcategories && subcategories.length > 0 && (
        <div className="artwork-grid__filters" role="group" aria-label="Unterkategorien">
          <span className="artwork-grid__filter-label">Filter:</span>
          {subcategories.map((sub) => (
            <a
              key={sub}
              href={`?unterkategorie=${encodeURIComponent(sub)}`}
              className={`artwork-grid__filter-btn${activeSubcategory === sub ? ' artwork-grid__filter-btn--active' : ''}`}
              aria-current={activeSubcategory === sub ? 'true' : undefined}
            >
              {sub}
            </a>
          ))}
          {activeSubcategory && (
            <a href="?" className="artwork-grid__filter-btn">
              Alle
            </a>
          )}
        </div>
      )}
      {artworks.length === 0 ? (
        <p className="artwork-grid__empty">Keine Bilder vorhanden.</p>
      ) : (
        <ul className="artwork-grid__list">
          {artworks.map((artwork) => (
            <ArtworkTile key={artwork.id} artwork={artwork} />
          ))}
        </ul>
      )}
    </div>
  )
}
