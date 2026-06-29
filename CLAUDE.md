# CLAUDE.md – Andreas Junge Künstler-Website

## Stack

- **Next.js 15** (App Router, TypeScript strict)
- **Payload CMS 3.75** (Admin-Panel unter `/admin`)
- **SQLite** via `@payloadcms/db-sqlite` (Datei: `local.db`)
- **CSS** – selbst geschrieben, kein Tailwind

## Projektstruktur

```
src/
  app/
    (frontend)/         ← Öffentliche Seiten
    (payload)/          ← Admin-Panel + API-Routes (nicht anfassen)
  collections/          ← Payload Collections
  globals/              ← Payload Globals (Singletons)
  components/           ← Wiederverwendbare React-Komponenten
  payload.config.ts     ← Zentrale Payload-Konfiguration
  seed.ts               ← Seed-Script für Initialinhalte
```

## Collections & Globals

| Typ | Slug | Zweck |
|---|---|---|
| Collection | `users` | Admin-Benutzer |
| Collection | `media` | Bild-Uploads |
| Collection | `artworks` | Kunstwerke mit sequenceNumber |
| Collection | `exhibitions` | Ausstellungen (CRUD) |
| Global | `biography` | Biographie-Text (Singleton) |
| Global | `texts` | Texte-Seite (Singleton) |

## Bild-ID-Schema

`{category}/{subcategory?}/{sequenceNumber}`

- Beispiele: `Tücher/RAF/1`, `Papierarbeiten/3`, `Klingenschnitte/5`
- `sequenceNumber` wird automatisch via `beforeChange`-Hook gesetzt
- Das Feld ist nach Erstellung gesperrt (`access.update: false`)
- Nummern werden **nie** wiederverwendet (auch nicht nach Löschung)

## Kontakt-E-Mail

`gallerie@gallerieroy.de` – wird in `mailto:`-Links auf den Artwork-Kacheln als Betreff mit der Bild-ID vorausgefüllt.

## Kategorien

| Slug (URL) | Payload-Wert | Unterkategorien |
|---|---|---|
| `tuecher` | `Tücher` | RAF, Auschwitz, Diverse |
| `papierarbeiten` | `Papierarbeiten` | – |
| `klingenschnitte` | `Klingenschnitte` | – |

## Design-Prinzip

Form follows function. Schwarz/weiß, serifenlose Schrift (Helvetica Neue), maximale Reduktion. Keine dekorativen Elemente ohne Funktion.

## Commands

```bash
pnpm dev          # Dev-Server starten (http://localhost:3000)
pnpm build        # Produktions-Build
pnpm seed         # Seed-Daten einspielen (einmalig nach erstem Start)
pnpm generate:types  # payload-types.ts neu generieren
```

## Wichtige Konventionen

- TypeScript strict durchgehend
- Kein `any`, keine Magic Numbers
- Semantisches HTML, WCAG-konform
- CSS-Variablen aus `styles.css` verwenden (niemals Hardcode-Werte)
- `revalidate = 60` auf allen öffentlichen Seiten
- Bilder aus Payload immer mit `depth: 1` fetchen

## Deployment

Debian 13 + PM2 + Apache (Reverse Proxy). Vollständige Anleitung in [README.md](./README.md).
