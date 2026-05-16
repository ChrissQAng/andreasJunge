import { getPayload } from 'payload'
import config from '@/../src/payload.config'
import type { Artwork } from '@/payload-types'
import { ArtworkGrid } from '@/components/ArtworkGrid/ArtworkGrid'
import '../kategorie.css'

export const dynamic = 'force-dynamic'

export default async function KlingenschnittePage() {
  const payload = await getPayload({ config })

  const { docs } = await payload.find({
    collection: 'artworks',
    where: { category: { equals: 'Klingenschnitte' } },
    sort: 'sequenceNumber',
    limit: 500,
    depth: 1,
  })

  return (
    <div className="kategorie container">
      <h1 className="kategorie__heading">Klingenschnitte</h1>
      <ArtworkGrid artworks={docs as Artwork[]} />
    </div>
  )
}
