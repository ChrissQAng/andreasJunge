# Umsetzungsplan: Andreas Junge Künstler-Website

> Dieses Dokument ist der verbindliche Arbeitsplan. Checkboxen werden beim Abarbeiten gesetzt.

---

## Phase 1 – Projekt-Setup

- [x] Payload CMS + Next.js mit `create-payload-app` initialisieren (App Router, TypeScript, SQLite)
- [x] `.env.example` anlegen (`DATABASE_URL`, `PAYLOAD_SECRET`)
- [x] `.npmrc` mit SQLite-Hoist-Patterns anlegen
- [x] `CLAUDE.md` erstellen

---

## Phase 2 – Backend (Payload Collections & Globals)

### Collections

- [x] `Media` – Standard Upload-Collection
- [x] `Artworks` – Bilder der Arbeiten
  - `sequenceNumber` (number, auto via `beforeChange`-Hook, danach gesperrt via `access.update: false`)
  - `title` (text, required)
  - `category` (select: `Tücher` | `Papierarbeiten` | `Klingenschnitte`)
  - `subcategory` (select: `RAF` | `Auschwitz` | `Diverse`, nur wenn Kategorie = Tücher)
  - `image` (upload → Media)
  - Computed `artworkId` = `{category}/{subcategory?}/{sequenceNumber}` (im Frontend berechnet)
- [x] `Exhibitions` – Ausstellungen (vollständiges CRUD)
  - `title` (text, required)
  - `period` (text, required)
  - `location` (text, optional)
  - `link` (text, optional)
  - `image` (upload → Media, optional)
- [x] `Users` – Admin-Benutzer

### Globals (Singletons)

- [x] `Biography` – Rich Text
- [x] `Texts` – Rich Text

---

## Phase 3 – Frontend (Next.js App Router)

### Routen

- [x] `/` – Landingpage: Künstlername prominent, Hero-Platzhalter (grauer div), Navigation
- [x] `/biographie` – Inhalt aus Global `Biography`
- [x] `/arbeiten` – Kategorieübersicht (3 Kacheln)
- [x] `/arbeiten/tuecher` – Grid mit Unterkategorien-Filter (RAF / Auschwitz / Diverse)
- [x] `/arbeiten/papierarbeiten` – Bildergrid
- [x] `/arbeiten/klingenschnitte` – Bildergrid
- [x] `/texte` – Inhalt aus Global `Texts`
- [x] `/ausstellungen` – Liste aus `Exhibitions`-Collection

### Komponenten

- [x] Navigation (Links: Biographie · Arbeiten · Texte · Ausstellungen)
- [x] Artwork-Kachel: Platzhalter-Bild, Bildunterschrift (Titel + Nummer), Kontakt-Button
  - Kontakt-Button: `mailto:goodomen@outlook.de?subject={artworkId}`
- [x] Ausstellungs-Eintrag: Bild (optional), Titel, Zeitraum, Ort, Link

### Design

- [x] Reines CSS (kein Tailwind), schwarz/weiß, serifenlose Schrift, minimalistisch
- [x] WCAG-konformes, semantisches HTML

---

## Phase 4 – Seed-Daten

- [x] Biographie: Lorem-ipsum-Platzhaltertext via Seed-Script
- [x] Texte: Lorem-ipsum-Platzhaltertext via Seed-Script
- [x] Artworks: Je 5 Platzhalter-Einträge pro Kategorie (inkl. Tücher-Unterkategorien)
- [x] Exhibitions: 2–3 Beispiel-Ausstellungen

---

## Phase 5 – Deployment-Vorbereitung

- [x] `ecosystem.config.cjs` für PM2
- [x] `nginx.conf`-Template (Reverse Proxy → Port 3000)
- [x] README mit Setup-Anleitung (lokal + Debian-Deployment)

---

## Entscheidungen & Konventionen

| Thema | Entscheidung |
|---|---|
| Datenbank | SQLite via `@payloadcms/db-sqlite` |
| Sequence-Nummer | Auto via `beforeChange`-Hook, danach gesperrt |
| Kontakt-E-Mail | goodomen@outlook.de |
| CSS | Selbst geschrieben, kein Tailwind |
| Seitensprache | Deutsch |
| Deployment | Debian + PM2 + Nginx |
| Biographie/Texte | Payload Globals (Singletons) |
| Platzhalter-Bilder | Grauer `<div>` (kein externes Service) |
