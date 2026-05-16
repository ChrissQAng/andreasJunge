import { getPayload } from 'payload'
import type { Where } from 'payload'
import config from '@/../src/payload.config'
import type { Artwork } from '@/payload-types'
import { ArtworkGrid } from '@/components/ArtworkGrid/ArtworkGrid'
import '../kategorie.css'

export const dynamic = 'force-dynamic'

const SUBCATEGORIES = ['RAF', 'Auschwitz', 'Diverse']

type Props = {
  searchParams: Promise<{ unterkategorie?: string }>
}

export default async function TuecherPage({ searchParams }: Props) {
  const { unterkategorie } = await searchParams
  const payload = await getPayload({ config })

  const where: Where = { category: { equals: 'Tücher' } }
  if (unterkategorie && SUBCATEGORIES.includes(unterkategorie)) {
    where['subcategory'] = { equals: unterkategorie }
  }

  const { docs } = await payload.find({
    collection: 'artworks',
    where,
    sort: 'sequenceNumber',
    limit: 500,
    depth: 1,
  })

  return (
    <div className="kategorie container">
      <h1 className="kategorie__heading">Tücher</h1>
      <ArtworkGrid
        artworks={docs as Artwork[]}
        activeSubcategory={unterkategorie}
        subcategories={SUBCATEGORIES}
      />
    </div>
  )
}
