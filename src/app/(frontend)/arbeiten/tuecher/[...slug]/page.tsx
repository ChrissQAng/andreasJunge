import { notFound } from 'next/navigation'
import { ArtworkDetailPage } from '../../artwork-detail-page'

export const dynamic = 'force-dynamic'

const VALID_SUBCATEGORIES = ['RAF', 'Auschwitz', 'Diverse']

type Props = {
  params: Promise<{ slug: string[] }>
}

// Handles both:
//   /arbeiten/tuecher/5         → slug = ['5']
//   /arbeiten/tuecher/RAF/1     → slug = ['RAF', '1']
export default async function TuecherDetailPage({ params }: Props) {
  const { slug } = await params

  if (slug.length === 1) {
    const sequenceNumber = parseInt(slug[0], 10)
    if (isNaN(sequenceNumber)) notFound()

    return (
      <ArtworkDetailPage
        category="Tücher"
        categoryLabel="Tücher"
        categoryHref="/arbeiten/tuecher"
        sequenceNumber={sequenceNumber}
      />
    )
  }

  if (slug.length === 2) {
    const [subcategory, idStr] = slug
    if (!VALID_SUBCATEGORIES.includes(subcategory)) notFound()
    const sequenceNumber = parseInt(idStr, 10)
    if (isNaN(sequenceNumber)) notFound()

    return (
      <ArtworkDetailPage
        category="Tücher"
        categoryLabel="Tücher"
        categoryHref={`/arbeiten/tuecher?unterkategorie=${encodeURIComponent(subcategory)}`}
        sequenceNumber={sequenceNumber}
        subcategory={subcategory}
      />
    )
  }

  notFound()
}
