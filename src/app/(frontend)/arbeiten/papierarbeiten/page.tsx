import { getPayload } from 'payload'
import config from '@/../src/payload.config'
import type { Artwork } from '@/payload-types'
import { ArtworkGrid } from '@/components/ArtworkGrid/ArtworkGrid'
import '../kategorie.css'

export const dynamic = 'force-dynamic'

export default async function PapierarbeitenPage() {
  const payload = await getPayload({ config })

  const { docs } = await payload.find({
    collection: 'artworks',
    where: { category: { equals: 'Papierarbeiten' } },
    sort: 'sequenceNumber',
    limit: 500,
    depth: 1,
  })

  return (
    <div className="kategorie container">
      <h1 className="kategorie__heading">Papierarbeiten</h1>
      <ArtworkGrid artworks={docs as Artwork[]} />
    </div>
  )
}
