# Realtime Chat (Next.js + Socket.IO)

Lern-Pet-Projekt: Realtime-Chat mit Räumen, Presence und KI-Assistent.
Ziel — WebSocket lernen und ein starkes Projekt fürs Junior-Developer-Portfolio bauen.

## Tech-Stack

- **Next.js 16** (App Router) + **React 19** + **TypeScript**
- **Socket.IO** (Server + Client) — Realtime über WebSocket
- **Tailwind CSS 4**
- Eigener Node-Server (`server.ts`), gestartet über `tsx`

## Architektur

Ein einziger HTTP-Server bedient sowohl Next.js (Seiten) als auch Socket.IO (WebSocket):

```
Browser A ──WS──┐
                ├──> server.ts (Next.js handler + Socket.IO) ──> Verteilung pro Raum
Browser B ──WS──┘
```

- `server.ts` — eigener Server: `createServer(handler)` (Next) + `new Server(httpServer)` (Socket.IO)
- `app/client.tsx` — Client-Komponente des Chats (Socket-Verbindung, Senden/Empfangen von Nachrichten)
- `app/page.tsx` — Seite

## Starten

> Alle Befehle aus dem Projektordner ausführen.

```bash
npm install
npm run dev
```

http://localhost:3000 öffnen (zum Testen von Realtime in zwei Tabs).

Wichtig zum Entwicklungs-Workflow:
- `tsx` startet NICHT automatisch neu, wenn sich `server.ts` ändert — nach Server-Änderungen **Strg+C** drücken und erneut `npm run dev`.
- Frontend-Änderungen (`*.tsx`) werden automatisch übernommen (Hot Reload).
- Im SELBEN Terminal neu starten, keine neuen Terminals öffnen — sonst entstehen Node-Zombie-Prozesse.

## Fortschritt

- [x] **Schritt 0.** Theorie: WebSocket vs. HTTP, wozu Socket.IO
- [x] **Schritt 1.** Next.js-Grundgerüst (TS + Tailwind)
- [x] **Schritt 2.** Eigener Server + Socket.IO, erste Verbindung
- [x] **Schritt 3.** Realtime-Nachrichten per Broadcast (zwischen Tabs)
- [ ] **Schritt 4.** Login-Screen (Name + Raum) und Räume (in Arbeit)
- [ ] **Schritt 5.** Presence — Liste der Online-Benutzer
- [ ] **Schritt 6.** „Schreibt gerade…“-Anzeige (Typing-Indicator)
- [ ] **Schritt 7.** UI mit Tailwind + Auto-Scroll + Reconnect
- [ ] **Schritt 8.** KI-Befehl `/ai` mit Streaming der Antwort
- [ ] **Schritt 9.** Politur + README
- [ ] **Schritt 10.** Deployment (Railway / Render)

## Was ich gelernt habe (Lern-Journal)

### WebSocket / Socket.IO
- **HTTP** — Modell „Anfrage → Antwort“: der Server kann nicht von sich aus sprechen, die Verbindung wird nach der Antwort geschlossen.
- **WebSocket** — dauerhafte (persistent), bidirektionale (full-duplex) Verbindung: Client und Server senden jederzeit Daten.
- **Socket.IO** — Aufsatz auf WebSocket: Auto-Reconnect, Räume (Rooms), benannte Events, Fallback.
- Kommunikation über **benannte Events**: eine Seite `emit`, die andere `on`.
- Verbindungs-Events haben UNTERSCHIEDLICHE Namen: auf dem Server `io.on('connection')`, auf dem Client `socket.on('connect')`.
- Wer empfängt (serverseitig): `socket.emit` (an einen), `io.emit` (an alle), `socket.broadcast.emit` (an alle außer den Sender).

### Next.js
- Standardmäßig sind Komponenten **Server Components**; für Interaktivität (`useEffect`, Sockets) braucht es `'use client'` (**Client Component**).
- Eine Client-Komponente darf nicht als Funktion `Client()` aufgerufen werden — sie wird als JSX `<Client />` gerendert.
- Ein eigener Server ist nötig, weil sich an den eingebauten Next-Server kein Socket.IO anhängen lässt. Reihenfolge ist wichtig: erst `createServer(handler)`, dann `new Server(httpServer)`.
- `httpServer.listen(3000)` lauscht auf einem Port (ZAHL) — keine URL, kein `io.listen`.

### React
- Socket im `useEffect` erstellen (nicht im Komponenten-Body — sonst wird er bei jedem Render neu erstellt und startet im SSR).
- Aufräumen: `return () => socket.disconnect()` aus dem `useEffect`.
- **Strict Mode mountet die Komponente im Dev-Modus zweimal** — den Socket sofort bei Erstellung in ein `useRef` schreiben, sonst arbeitet man evtl. mit einem bereits getrennten Socket.
- State funktional aktualisieren: `setMessages(prev => [...prev, msg])` (sonst „friert“ die Closure auf dem alten Wert ein).
- Listen mit `.map()` rendern (NICHT `.keys()` — das sind Indizes), immer mit `key`.
- Event-Handler nur typisieren, wenn man `e` tatsächlich verwendet.

### Debugging / Umgebung (Windows)
- „Unmögliche“ Fehler (Modul existiert, wird aber „nicht gefunden“) + hohe CPU-Last → an **kaputten `.next`-Cache** und **Node-Zombie-Prozesse** denken, nicht an den eigenen Code.
- Lösung: Node-Prozesse beenden, `.next` löschen, neu starten.
- Mehrere Lockfiles → `turbopack.root` in `next.config.ts` setzen.
