import { notFound } from 'next/navigation'
import { ArtworkDetailPage } from '../../artwork-detail-page'

export const dynamic = 'force-dynamic'

type Props = {
  params: Promise<{ id: string }>
}

export default async function PapierarbeitenDetailPage({ params }: Props) {
  const { id } = await params
  const sequenceNumber = parseInt(id, 10)
  if (isNaN(sequenceNumber)) notFound()

  return (
    <ArtworkDetailPage
      category="Papierarbeiten"
      categoryLabel="Papierarbeiten"
      categoryHref="/arbeiten/papierarbeiten"
      sequenceNumber={sequenceNumber}
    />
  )
}
