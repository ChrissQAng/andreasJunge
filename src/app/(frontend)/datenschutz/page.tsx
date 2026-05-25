import type { Metadata } from 'next'
import './datenschutz.css'

export const metadata: Metadata = {
  title: 'Datenschutz',
}

export default function DatenschutzPage() {
  return (
    <article className="legal container">
      <h1 className="legal__heading">Datenschutzerklärung</h1>

      <div className="legal__content">
        <section className="legal__section">
          <h2 className="legal__subheading">1. Verantwortlicher</h2>
          <p>
            Verantwortlicher im Sinne der DSGVO ist:<br />
            Gundolf Roy<br />
            E-Mail:{' '}
            <a href="mailto:goodomen@outlook.de" className="legal__link">
              goodomen@outlook.de
            </a>
          </p>
        </section>

        <section className="legal__section">
          <h2 className="legal__subheading">2. Erhebung und Speicherung personenbezogener Daten</h2>
          <p>
            Beim Besuch dieser Website werden durch den Hosting-Provider automatisch Informationen
            in sogenannten Server-Log-Dateien gespeichert, die Ihr Browser automatisch übermittelt.
            Dies sind: Browsertyp und -version, verwendetes Betriebssystem, Referrer-URL,
            Hostname des zugreifenden Rechners, Uhrzeit der Serveranfrage und IP-Adresse.
          </p>
          <p>
            Diese Daten sind nicht bestimmten Personen zuordenbar und werden nicht mit anderen
            Datenquellen zusammengeführt. Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO
            (berechtigtes Interesse am sicheren Betrieb der Website).
          </p>
        </section>

        <section className="legal__section">
          <h2 className="legal__subheading">3. Schriftarten (lokal gehostet)</h2>
          <p>
            Diese Website verwendet ausschließlich lokal gespeicherte Schriftarten. Es werden
            keine Schriftarten von externen Servern (z. B. Google Fonts CDN) geladen. Es findet
            daher keine Übertragung personenbezogener Daten an Dritte statt.
          </p>
        </section>

        <section className="legal__section">
          <h2 className="legal__subheading">4. Kontaktaufnahme per E-Mail</h2>
          <p>
            Wenn Sie uns per E-Mail kontaktieren, werden Ihre Angaben zur Bearbeitung der
            Anfrage und für mögliche Anschlussfragen gespeichert. Diese Daten werden nicht
            ohne Ihre Einwilligung weitergegeben. Rechtsgrundlage ist Art. 6 Abs. 1 lit. b
            DSGVO (Vertragserfüllung/vorvertragliche Maßnahmen).
          </p>
        </section>

        <section className="legal__section">
          <h2 className="legal__subheading">5. Ihre Rechte</h2>
          <p>
            Sie haben jederzeit das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung
            der Verarbeitung, Datenübertragbarkeit und Widerspruch. Bitte wenden Sie sich dazu
            an:{' '}
            <a href="mailto:goodomen@outlook.de" className="legal__link">
              goodomen@outlook.de
            </a>
          </p>
          <p>
            Außerdem haben Sie das Recht, sich bei einer Datenschutz-Aufsichtsbehörde zu
            beschweren. Die zuständige Aufsichtsbehörde richtet sich nach Ihrem Wohnort.
          </p>
        </section>

        <section className="legal__section">
          <h2 className="legal__subheading">6. Cookies</h2>
          <p>
            Diese Website verwendet keine Tracking-Cookies und keine Analyse-Dienste von
            Drittanbietern. Es werden ausschließlich technisch notwendige Daten verarbeitet.
          </p>
        </section>
      </div>
    </article>
  )
}
