import 'dotenv/config'
import { getPayload } from 'payload'
import config from './payload.config.js'

const LOREM = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.`

function makeLexical(text: string) {
  const paragraphs = text.split('\n\n').filter(Boolean)
  return {
    root: {
      type: 'root',
      children: paragraphs.map((p) => ({
        type: 'paragraph',
        children: [{ type: 'text', text: p, version: 1 }],
        direction: 'ltr' as const,
        format: '' as const,
        indent: 0,
        version: 1,
      })),
      direction: 'ltr' as const,
      format: '' as const,
      indent: 0,
      version: 1,
    },
  }
}

async function seed() {
  const payload = await getPayload({ config })

  console.log('Seeding biography...')
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await payload.updateGlobal({ slug: 'biography', data: { content: makeLexical(LOREM) as any } })

  console.log('Seeding texts...')
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await payload.updateGlobal({ slug: 'texts', data: { content: makeLexical(LOREM) as any } })

  console.log('Seeding artworks...')

  type ArtworkInput = {
    title: string
    category: 'Tücher' | 'Papierarbeiten' | 'Klingenschnitte'
    subcategory?: 'RAF' | 'Auschwitz' | 'Diverse'
  }

  const artworkSeeds: ArtworkInput[] = [
    { title: 'Ohne Titel (Tücher RAF)', category: 'Tücher', subcategory: 'RAF' },
    { title: 'Ohne Titel (Tücher RAF)', category: 'Tücher', subcategory: 'RAF' },
    { title: 'Ohne Titel (Tücher Auschwitz)', category: 'Tücher', subcategory: 'Auschwitz' },
    { title: 'Ohne Titel (Tücher Auschwitz)', category: 'Tücher', subcategory: 'Auschwitz' },
    { title: 'Ohne Titel (Tücher Diverse)', category: 'Tücher', subcategory: 'Diverse' },
    { title: 'Ohne Titel (Papierarbeiten)', category: 'Papierarbeiten' },
    { title: 'Ohne Titel (Papierarbeiten)', category: 'Papierarbeiten' },
    { title: 'Ohne Titel (Papierarbeiten)', category: 'Papierarbeiten' },
    { title: 'Ohne Titel (Klingenschnitte)', category: 'Klingenschnitte' },
    { title: 'Ohne Titel (Klingenschnitte)', category: 'Klingenschnitte' },
  ]

  for (const artwork of artworkSeeds) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await payload.create({ collection: 'artworks', data: artwork as any })
    console.log(`  Created: ${artwork.title} [${artwork.category}${artwork.subcategory ? '/' + artwork.subcategory : ''}]`)
  }

  console.log('Seeding exhibitions...')

  type ExhibitionInput = {
    title: string
    period: string
    location?: string
    link?: string
  }

  const exhibitionSeeds: ExhibitionInput[] = [
    { title: 'Zwischenräume', period: '12.03.–05.05.2025', location: 'Galerie Nord, Berlin' },
    { title: 'Schnitte durch die Zeit', period: '01.06.–30.08.2024', location: 'Kunstverein Hamburg' },
    { title: 'Stille Zeugen', period: '10.09.–20.11.2023', location: 'Museum für Gegenwartskunst, Frankfurt' },
  ]

  for (const exhibition of exhibitionSeeds) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await payload.create({ collection: 'exhibitions', data: exhibition as any })
    console.log(`  Created: ${exhibition.title}`)
  }

  console.log('Done.')
  process.exit(0)
}

seed().catch((err) => {
  console.error(err)
  process.exit(1)
})
