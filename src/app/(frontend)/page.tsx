import './home.css'

export default function HomePage() {
  return (
    <div className="home">
      <section className="home__hero" aria-label="Hero">
        <div className="home__hero-image" role="img" aria-label="Platzhalter Künstlerbild" />
      </section>
      <section className="home__title">
        <h1 className="home__name">Andreas Junge</h1>
        <p className="home__subtitle">Bildender Künstler</p>
      </section>
    </div>
  )
}
