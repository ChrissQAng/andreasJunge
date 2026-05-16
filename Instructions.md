# Künstler-Website: Andreas Junge

## Kontext & Referenzprojekt

Lies zunächst README, `package.json` und relevante Dokumentation des Referenzprojekts – **nur zur Orientierung, nie verändern**. Du hast **ausschließlich Leserecht**:

`/Users/christianangerer/DEVELOPER/projects/gesineGrundmannWS/gesineBackendSQLite_v0.2_testdeployment/`

---

## Stack

- **Frontend/Framework:** Next.js (App Router, TypeScript)
- **CMS/Backend:** Payload CMS ([Installationsdoku](https://payloadcms.com/docs/getting-started/installation))
- Gleiche Technologien wie im Referenzprojekt verwenden

---

## Aufgabe

Baue eine Künstler-Website für **Andreas Junge** mit integriertem Admin-Backend.

---

## Arbeitsweise (wichtig, bitte einhalten)

1. **Zuerst fragen**, was unklar ist – bevor du etwas baust.
2. **Dann einen Plan erstellen**, den ich begutachte.
3. **Erst nach explizitem „Go"** beginnst du mit der Implementierung.
4. Kein Gold-Plating, keine ungefragten Extras.
5. Effiziente Token-Nutzung: kurze, präzise Antworten.

---

## Frontend-Struktur

### Landingpage

- Name des Künstlers prominent
- Ein Hero-Bild (Platzhalter)
- Navigation: **Biographie · Arbeiten · Texte · Ausstellungen**

### Design-Prinzip

**Form follows function** – minimalistisch, klar, keine dekorativen Elemente ohne Funktion. Recherchiere das Prinzip kurz vor der Umsetzung.

---

### 1 · Biographie

Statische Seite mit biografischen Daten. Im CMS initial einen **Lorem-ipsum-Platzhaltertext** einfügen.

---

### 2 · Arbeiten

Drei Hauptkategorien, jede mit **100+ Bildern**:

| ID-Präfix | Kategorie | Unterkategorien |
|---|---|---|
| `Tücher` | 2.1 Tücher | A. RAF · B. Auschwitz · C. Diverse |
| `Papierarbeiten` | 2.2 Papierarbeiten | – |
| `Klingenschnitte` | 2.3 Klingenschnitte | – |

#### Bild-ID-Schema

Jedes Bild hat eine **eindeutige, unveränderliche ID**: `Kategorie/[Unterkategorie/]fortlaufendeNummer`

Beispiele:
- `Tücher/RAF/101`
- `Tücher/Auschwitz/23`
- `Papierarbeiten/22`
- `Klingenschnitte/5`

> **Wichtig:** Die ID darf **niemals verändert oder wiederverwendet werden** – auch nicht nach dem Löschen eines Bildes. Wird z. B. Bild `3` gelöscht, folgt auf Bild `2` direkt Bild `4`. Die Nummerierung ist dauerhaft und stabil.

#### Bildanzeige

- Sichtbar auf der Seite: **nur die fortlaufende Nummer**
- Bildunterschrift: Titel + Nummer
- Jedes Bild hat einen **Kontakt-Button** (`mailto:`), der das Mail-Programm des Users öffnet – mit der vollständigen Bild-ID in der **Betreffzeile** vorausgefüllt

#### Platzhalter

Für alle Bilder zunächst **Platzhalter-Bilder** verwenden.

---

### 3 · Texte

Statische Seite mit Texten über den Künstler (Platzhaltertext zunächst).

---

### 4 · Ausstellungen

Dynamische Seite (CRUD via Backend). Jeder Eintrag enthält:

| Feld | Beschreibung |
|---|---|
| Bild | (optional)|
| Titel | Ausstellungstitel |
| Zeitraum | z. B. „12.03.–05.05.2025" |
| Ort | Ortsangabe (optional)|
| Link | Externer Link (optional) |

---

## Backend (Payload CMS Admin)

CRUD-Operationen für:

- **Ausstellungen** – alle vier Felder
- **Bilder** – Titel, Kategorie, Unterkategorie (falls vorhanden), fortlaufende Nummer (manuell gesetzt, unveränderlich), Bild-Upload

---

## Qualitätsanforderungen

- **TypeScript** durchgehend, strikt typisiert
- **Clean Code** – aussagekräftige Namen, keine Magic Numbers
- **Accessibility** – WCAG-konform, semantisches HTML
- **Sicherheit** – keine sensiblen Daten im Frontend, sichere Admin-Route
- **Dokumentation** – README mit Setup-Anleitung, Kommentare wo sinnvoll

## Vor dem Start

Bevor du mit der Implementierung beginnst:

1. **Analysiere die Aufgabe vollständig** – lies das Referenzprojekt und alle relevanten Docs.
2. **Erstelle einen detaillierten Umsetzungsplan** – gegliedert nach Phasen (Setup → Backend → Frontend → Testing). Warte auf mein „Go" bevor du anfängst.
3. **Installiere hilfreiche Claude Code Skills** im **User-Scope** (nicht Projekt-Scope), damit sie auch in zukünftigen Projekten verfügbar sind:
   - Identifiziere selbst, welche Skills für dieses Projekt sinnvoll sind (z. B. für Next.js, Payload CMS, TypeScript, Accessibility-Checks, Deployment).
   - Installiere nur Skills, die sicher und vertrauenswürdig sind.
   - Dokumentiere kurz, welche Skills du installiert hast und warum.


Lies hier `INSTRUCTIONS.md` – dort sind deine Aufgaben definiert. **Verändere dieses Dokument nicht.**

Erstelle daraus deine eigene `CLAUDE.md`: Leite den Inhalt aus `INSTRUCTIONS.md` und den Erkenntnissen aus dem Referenzprojekt ab.