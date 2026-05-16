import type { Artwork } from '@/payload-types'
import './ArtworkGrid.css'

const CONTACT_EMAIL = 'goodomen@outlook.de'

function buildArtworkId(artwork: Artwork): string {
  if (artwork.subcategory) {
    return `${artwork.category}/${artwork.subcategory}/${artwork.sequenceNumber}`
  }
  return `${artwork.category}/${artwork.sequenceNumber}`
}

function ArtworkTile({ artwork }: { artwork: Artwork }) {
  const artworkId = buildArtworkId(artwork)
  const imageUrl =
    artwork.image &&
    typeof artwork.image === 'object' &&
    'url' in artwork.image
      ? (artwork.image as { url?: string }).url
      : null

  const mailtoHref = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(artworkId)}`

  return (
    <li className="artwork-tile">
      <div className="artwork-tile__image-wrap" aria-hidden="true">
        {imageUrl ? (
          <img src={imageUrl} alt={artwork.title} className="artwork-tile__image" />
        ) : (
          <div className="artwork-tile__placeholder" />
        )}
      </div>
      <div className="artwork-tile__info">
        <p className="artwork-tile__caption">
          <span className="artwork-tile__title">{artwork.title}</span>
          <span className="artwork-tile__number">Nr. {artwork.sequenceNumber}</span>
        </p>
        <a href={mailtoHref} className="artwork-tile__contact" aria-label={`Kontakt zu Werk ${artworkId}`}>
          Kontakt
        </a>
      </div>
    </li>
  )
}

type ArtworkGridProps = {
  artworks: Artwork[]
  activeSubcategory?: string
  subcategories?: string[]
  onSubcategoryChange?: (value: string) => void
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
