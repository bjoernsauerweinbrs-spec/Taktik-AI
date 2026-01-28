# Toni 2.0 — Elite Taktik Board

**Kurz**  
Interaktives Taktik‑Board mit KI‑Unterstützung. Deep‑Dark UI, deterministische Startsequenz (Blackout → Voice → Auswahl → SVG‑Konstruktion), zentrale Aktentasche (Chat, Kader, Matchplan, Video) und persistente Event‑Pipeline.

## Features
- **Ginga Startsequenz**: Blackout, Promise‑basierte TTS, Altersklassen‑Auswahl, SVG‑Konstruktion.
- **Aktentasche**: Single DOM Sidebar mit Tabs: Toni (Chat), Kader (Player DB + BMI + Nutrition), Matchplan, Video‑Analyse.
- **Player DB**: IndexedDB mit Player‑CRUD, Ginga‑Scores, optionalen physischen Daten (Größe, Gewicht) und BMI‑Berechnung.
- **Arena**: SVG‑basierte Spielfeldkonstruktion, animierte Linien, player rendering, drag & drop.
- **Video**: Dropzone → WebWorker Analyse → Events persistiert und mit PlayerIDs verknüpft.
- **EventBus**: Pub/Sub mit persistenten Events, idempotenz und tracing.
- **Performance**: LowPower Mode, WebWorker Offload, Lazy Mounting.

## Architektur Übersicht
- `app.html` — Shell und Bootstrapping
- `css/` — `style.css`, `animations.css`
- `js/app.js` — Bootstrap, Sequencer, Sidebar API
- `js/modules/` — `eventbus.js`, `voice.js`, `database.js`, `roster.js`, `arena.js`, `video-bridge.js`, `video-worker.js`
- `assets/` — Sounds, optional images

## No‑Gos (Kurz)
- Keine doppelten Sidebars; nur ein Sidebar DOM Element.  
- Keine Inline‑JS Layout Overrides.  
- TTS immer Promise‑basiert; Sequenz wartet auf `onend`.  
- Spielfeldlinien als SVG `<path>` mit stroke‑dashoffset Animation.  
- Atomare IndexedDB Writes für kritische Events.

## Dev Setup
1. `git clone ...`
2. `npm install` (falls Build-Tooling benötigt)
3. `npm run dev` oder `serve` statisch
4. Öffne `app.html` im Browser (lokaler Server empfohlen)

## Tests
- Visual smoke tests für 13", 15", Mobile.  
- Sequencer integration test: Blackout→Voice→Selection→SVG Build.  
- EventBus unit tests for emit/waitFor/persistence.

## Contribution
- Vor jedem Merge: PR‑Checkliste abarbeiten.  
- UI‑Änderungen nur über CSS; keine runtime Layout‑Overrides.

