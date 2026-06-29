import type { Metadata } from 'next'
import './impressum.css'

export const metadata: Metadata = {
  title: 'Impressum',
}

export default function ImpressumPage() {
  return (
    <article className="legal container">
      <h1 className="legal__heading">Impressum</h1>

      <div className="legal__content">
        <section className="legal__section">
          <h2 className="legal__subheading">Angaben gemäß § 5 TMG</h2>
          <p>
            Galerie Marianne Roy<br />
            Nideggener Strasse 25<br />
            53909 Zülpich<br />
            Deutschland
          </p>
        </section>

        <section className="legal__section">
          <h2 className="legal__subheading">Kontakt</h2>
          <p>
            E-Mail:{' '}
            <a href="mailto:gallerie@gallerieroy.de" className="legal__link">
              gallerie@gallerieroy.de
            </a>
          </p>
        </section>

        <section className="legal__section">
          <h2 className="legal__subheading">Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV</h2>
          <p>
            Galerie Marianne Roy<br />
            Nideggener Strasse 25<br />
            53909 Zülpich
          </p>
        </section>

        <section className="legal__section">
          <h2 className="legal__subheading">Urheberrecht</h2>
          <p>
            Die auf dieser Website veröffentlichten Inhalte und Werke unterliegen dem deutschen
            Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der
            Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen
            Zustimmung des Autors.
          </p>
        </section>

        <section className="legal__section">
          <h2 className="legal__subheading">Haftungsausschluss</h2>
          <p>
            Trotz sorgfältiger inhaltlicher Kontrolle übernehmen wir keine Haftung für die
            Inhalte externer Links. Für den Inhalt der verlinkten Seiten sind ausschließlich
            deren Betreiber verantwortlich.
          </p>
        </section>
      </div>
    </article>
  )
}
