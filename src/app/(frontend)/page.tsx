import './home.css'

const HERO_IMAGES = [
  { src: '/assets/images/Andreas Junge-0001C-d1feb3ce.jpg', alt: 'Andreas Junge – Werk' },
  { src: '/assets/images/Junge6-7ef0d4e1.jpg', alt: 'Andreas Junge – Werk' },
  { src: '/assets/images/94P093-f9f7bf02.jpg', alt: 'Andreas Junge – Werk' },
  { src: '/assets/images/Andreas Junge-0003C-e8163eb5.jpg', alt: 'Andreas Junge – Werk' },
  { src: '/assets/images/Andreas Junge-0047C.jpg', alt: 'Andreas Junge – Werk' },
  { src: '/assets/images/Andreas Junge-0061C.jpg', alt: 'Andreas Junge – Werk' },
  { src: '/assets/images/1996-0078-61555f79.jpg', alt: 'Andreas Junge – Werk' },
  { src: '/assets/images/Junge11-c2a5af5b.jpg', alt: 'Andreas Junge – Werk' },
]

export default function HomePage() {
  return (
    <section className="hero" aria-label="Werkauswahl">
      <div
        className="hero__slideshow"
        style={{ '--slide-count': HERO_IMAGES.length } as React.CSSProperties}
        role="img"
        aria-label="Diashow der Werke von Andreas Junge"
      >
        {HERO_IMAGES.map((img, i) => (
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
          <p className="hero__subtitle">Bildender Künstler</p>
        </div>
      </div>
    </section>
  )
}
