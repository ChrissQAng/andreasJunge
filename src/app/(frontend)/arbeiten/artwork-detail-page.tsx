import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@/../src/payload.config'
import type { Artwork } from '@/payload-types'
import './detail.css'

const CONTACT_EMAIL = 'gallerie@gallerieroy.de'

function buildArtworkId(artwork: Artwork): string {
  if (artwork.subcategory) {
    return `${artwork.category}/${artwork.subcategory}/${artwork.sequenceNumber}`
  }
  return `${artwork.category}/${artwork.sequenceNumber}`
}

type Props = {
  category: 'Tücher' | 'Papierarbeiten' | 'Klingenschnitte'
  categoryLabel: string
  categoryHref: string
  sequenceNumber: number
  subcategory?: string
}

function RichTextRenderer({ content }: { content: Record<string, unknown> }) {
  const root = content as {
    root?: { children?: Array<{ type: string; children?: Array<{ text?: string }> }> }
  }
  if (!root?.root?.children) return null

  return (
    <>
      {root.root.children.map((node, i) => {
        const text = node.children?.map((child) => child.text ?? '').join('') ?? ''
        if (node.type === 'paragraph') return <p key={i}>{text}</p>
        if (node.type === 'heading') return <strong key={i}>{text}</strong>
        return null
      })}
    </>
  )
}

export async function ArtworkDetailPage({
  category,
  categoryLabel,
  categoryHref,
  sequenceNumber,
  subcategory,
}: Props) {
  const payload = await getPayload({ config })

  // Fetch by category + sequenceNumber; subcategory disambiguates when present
  const whereBase = {
    category: { equals: category },
    sequenceNumber: { equals: sequenceNumber },
    ...(subcategory ? { subcategory: { equals: subcategory } } : {}),
  }

  const { docs } = await payload.find({
    collection: 'artworks',
    where: whereBase,
    limit: 1,
    depth: 1,
  })

  const artwork = docs[0] as Artwork | undefined
  if (!artwork) notFound()

  const imageUrl =
    artwork.image && typeof artwork.image === 'object' && 'url' in artwork.image
      ? (artwork.image as { url?: string }).url
      : null

  const artworkId = buildArtworkId(artwork)
  const mailtoHref = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(artworkId)}`

  return (
    <article className="artwork-detail container">
      <Link href={categoryHref} className="artwork-detail__back">
        <svg
          className="artwork-detail__back-arrow"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        {categoryLabel}
      </Link>

      <div className="artwork-detail__layout">
        <div className="artwork-detail__image-wrap">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={artwork.title}
              className="artwork-detail__image"
            />
          ) : (
            <div className="artwork-detail__placeholder" />
          )}
        </div>

        <div className="artwork-detail__info">
          <span className="artwork-detail__number">Nr. {artwork.sequenceNumber}</span>
          <h1 className="artwork-detail__heading">{artwork.title}</h1>

          {artwork.description && (
            <div className="artwork-detail__description">
              <RichTextRenderer content={artwork.description as Record<string, unknown>} />
            </div>
          )}

          <a
            href={mailtoHref}
            className="artwork-detail__contact"
            aria-label={`Kontakt zu Werk ${artworkId}`}
          >
            Kontakt
          </a>
        </div>
      </div>
    </article>
  )
}
