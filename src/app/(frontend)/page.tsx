import fs from 'fs'
import path from 'path'
import { getPayload } from 'payload'
import config from '@payload-config'
import type { Media } from '@/payload-types'
import './home.css'

export const revalidate = 60

const HERO_IMAGE_DIR = 'public/assets/images'
const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.avif', '.gif']

// Reads all hero images directly from the public folder so images can be
// swapped by replacing files – no code change needed.
function getStaticHeroImages(): { src: string; alt: string }[] {
  const dir = path.join(process.cwd(), HERO_IMAGE_DIR)
  let files: string[]
  try {
    files = fs.readdirSync(dir)
  } catch {
    return []
  }

  return files
    .filter((file) => IMAGE_EXTENSIONS.includes(path.extname(file).toLowerCase()))
    .sort((a, b) => a.localeCompare(b, 'de'))
    .map((file) => ({
      src: `/assets/images/${file}`,
      alt: 'Andreas Junge – Werk',
    }))
}

export default async function HomePage() {
  const payload = await getPayload({ config })
  const { docs: exhibitions } = await payload.find({
    collection: 'exhibitions',
    where: { showInSlideshow: { equals: true } },
    depth: 1,
    limit: 20,
  })

  const slideshowImages = [
    ...getStaticHeroImages(),
    ...exhibitions
      .map((ex) => {
        const img = ex.image as Media | null
        if (!img?.url) return null
        return { src: img.url, alt: ex.title }
      })
      .filter((img): img is { src: string; alt: string } => img !== null),
  ]

  return (
    <section className="hero" aria-label="Werkauswahl">
      <div
        className="hero__slideshow"
        style={{ '--slide-count': slideshowImages.length } as React.CSSProperties}
        role="img"
        aria-label="Diashow der Werke von Andreas Junge"
      >
        {slideshowImages.map((img, i) => (
          <div
            key={img.src}
            className="hero__slide"
            style={{ '--slide-index': i } as React.CSSProperties}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={img.src}
              alt={img.alt}
              className="hero__slide-img"
              loading={i === 0 ? 'eager' : 'lazy'}
            />
          </div>
        ))}
      </div>

      <div className="hero__overlay">
        <div className="hero__title-wrap">
          <h1 className="hero__name">Andreas<br />Junge</h1>
        </div>
      </div>
    </section>
  )
}
