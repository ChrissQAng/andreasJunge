# Deployment-Anleitung: Andreas-Junge-Website

Diese Anleitung führt **Schritt für Schritt** durch das Deployment auf einem
**Debian-13-Server mit Apache**. Sie ist für Einsteiger geschrieben – jeder Befehl
wird kurz erklärt. Wenn du alle Abschnitte der Reihe nach abarbeitest, läuft die
Website am Ende öffentlich erreichbar unter deiner Domain.

> **Wie funktioniert das Setup grob?**
> Die Website ist eine Next.js-Anwendung mit eingebautem Admin-Panel (Payload CMS).
> Sie läuft als **Node-Prozess** im Hintergrund (gestartet und überwacht von **PM2**)
> und lauscht nur lokal auf Port 3000. **Apache** steht davor als „Reverse Proxy":
> Er nimmt die Anfragen aus dem Internet (Port 80/443) entgegen und reicht sie an
> den Node-Prozess weiter. Eine `.htaccess`-Datei wird **nicht** benötigt.

---

## Konventionen in dieser Anleitung

- Befehle, die mit `sudo` beginnen, erfordern Administrator-Rechte.
- Ersetze überall:
  - `deinedomain.de` → deine echte Domain
  - `<REPO_URL>` → die URL deines Git-Repositories (z. B. von GitHub)
  - `user@server` → Benutzername und IP/Hostname deines Servers
- Befehle mit `$USER` musst du **nicht** anpassen – die Shell setzt deinen
  Benutzernamen automatisch ein.

---

## Voraussetzungen

Bevor du beginnst, brauchst du:

- [ ] Einen **Debian-13-Server** (frisch installiert), z. B. einen V-Server / VPS
- [ ] **SSH-Zugang** zum Server mit einem Benutzer, der `sudo` darf
- [ ] Eine **Domain**, deren DNS-A-Eintrag auf die **IP-Adresse deines Servers** zeigt
      (nötig für das SSL-Zertifikat)
- [ ] Auf deinem **lokalen Rechner**: das fertige Projekt inkl. `local.db` und
      dem Ordner `media/` (die Datenbank und die hochgeladenen Bilder)

---

## Schritt 0: Mit dem Server verbinden

Von deinem lokalen Rechner aus per SSH einloggen:

```bash
ssh user@server
```

Alle folgenden Befehle (außer den ausdrücklich als „vom lokalen Rechner"
markierten) führst du **auf dem Server** aus.

Zuerst das System aktualisieren:

```bash
sudo apt-get update && sudo apt-get upgrade -y
```

- `update` lädt die aktuelle Paketliste, `upgrade -y` installiert Updates
  (`-y` beantwortet Rückfragen automatisch mit „ja").

---

## Schritt 1: Node.js 22, pnpm und PM2 installieren

Die Website braucht **Node.js** (die Laufzeitumgebung), **pnpm** (den
Paket-Manager) und **PM2** (hält den Node-Prozess am Laufen).

```bash
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo bash -
sudo apt-get install -y nodejs git rsync
sudo npm install -g pnpm pm2
```

- Zeile 1 richtet die offizielle NodeSource-Paketquelle für Node.js 22 ein
  (die Debian-eigene Version ist oft zu alt).
- Zeile 2 installiert Node.js sowie `git` (zum Klonen des Projekts) und `rsync`
  (zum Übertragen von Dateien).
- Zeile 3 installiert `pnpm` und `pm2` global (`-g`).

**Prüfen**, ob alles da ist:

```bash
node -v    # sollte v22.x.x zeigen
pnpm -v    # sollte 9 oder höher zeigen
pm2 -v
```

---

## Schritt 2: Firewall einrichten

Die Firewall lässt nur die nötigen Ports offen (SSH + Web).

```bash
sudo apt-get install -y ufw
sudo ufw allow OpenSSH
sudo ufw allow 'WWW Full'
sudo ufw enable
```

- `allow OpenSSH` hält Port 22 offen, damit du dich weiter einloggen kannst.
- `allow 'WWW Full'` öffnet Port 80 (HTTP) und 443 (HTTPS).
- `enable` aktiviert die Firewall (mit `y` bestätigen).

> ⚠️ Achte darauf, dass **OpenSSH erlaubt ist, bevor** du `enable` ausführst –
> sonst sperrst du dich selbst aus.

---

## Schritt 3: Apache installieren und Module aktivieren

```bash
sudo apt-get install -y apache2
sudo a2enmod proxy proxy_http proxy_wstunnel headers rewrite ssl
sudo systemctl restart apache2
```

- Zeile 1 installiert den Apache-Webserver.
- Zeile 2 aktiviert die Module, die für den Reverse Proxy nötig sind:
  - `proxy`, `proxy_http` – Weiterleitung an den Node-Prozess
  - `proxy_wstunnel` – WebSockets (für Live-Updates im Admin-Panel)
  - `headers`, `rewrite` – zum Setzen von Headern und Umschreiben von Anfragen
  - `ssl` – für HTTPS (Schritt 9)
- Zeile 3 startet Apache neu, damit die Module geladen werden.

---

## Schritt 4: Projekt auf den Server holen

Zielverzeichnis anlegen und das Repository hineinklonen:

```bash
sudo mkdir -p /var/www/andreas-junge
sudo chown $USER:$USER /var/www/andreas-junge
cd /var/www/andreas-junge
git clone <REPO_URL> .
```

- `mkdir -p` legt den Ordner `/var/www/andreas-junge` an.
- `chown` macht dich zum Eigentümer, damit du ohne `sudo` darin arbeiten kannst.
- `cd` wechselt in den Ordner.
- `git clone <REPO_URL> .` lädt das Projekt in den **aktuellen** Ordner
  (der Punkt `.` am Ende ist wichtig).

### Datenbank und Bilder übertragen

Die Datenbank (`local.db`) und die hochgeladenen CMS-Bilder (`media/`) sind
**nicht** im Git-Repository (sie sind absichtlich ausgeschlossen). Übertrage sie
**vom lokalen Rechner aus** – also in einem **neuen Terminal-Fenster auf deinem
eigenen Computer**, nicht auf dem Server:

```bash
# Diese zwei Befehle auf dem LOKALEN Rechner ausführen:
rsync -avz ./local.db  user@server:/var/www/andreas-junge/local.db
rsync -avz ./media/    user@server:/var/www/andreas-junge/media/
```

- `rsync` kopiert Dateien sicher über SSH auf den Server.
- Die erste Zeile überträgt die Datenbank, die zweite den kompletten `media/`-Ordner.

> ✅ Mit der übertragenen `local.db` sind **alle echten Inhalte und dein
> Admin-Login sofort vorhanden**. Du musst auf dem Server **nichts neu befüllen**.
>
> ⚠️ Führe auf dem Server **niemals `pnpm seed`** aus – das würde die echten
> Inhalte mit Platzhaltern überschreiben.
>
> Die Bilder der Startseiten-Diashow (`public/assets/images/`) sind bereits im
> Repository und kamen mit `git clone` automatisch mit.

---

## Schritt 5: Umgebungsvariablen (.env) konfigurieren

Die Anwendung braucht zwei Geheimnisse in einer `.env`-Datei. Vorlage kopieren:

```bash
cp .env.example .env
```

Einen sicheren, zufälligen `PAYLOAD_SECRET` erzeugen (verschlüsselt die
Login-Sitzungen):

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Den ausgegebenen langen Zeichen-String kopieren. Dann die `.env` öffnen:

```bash
nano .env
```

Den Inhalt so eintragen (den generierten String einfügen):

```env
DATABASE_URL=file:./local.db
PAYLOAD_SECRET=hier-den-generierten-string-einfügen
```

- Im Editor `nano`: speichern mit **Strg+O**, dann **Enter**, beenden mit **Strg+X**.

> 🔒 Die `.env` enthält ein Geheimnis und ist absichtlich **nicht** im Git-Repo.
> Sie bleibt nur auf dem Server.

---

## Schritt 6: Abhängigkeiten installieren und Build erstellen

```bash
pnpm install
pnpm run build
```

- `pnpm install` lädt alle benötigten Programmbibliotheken herunter.
- `pnpm run build` startet das Build-Skript aus `package.json`, das in diesem
  Projekt `next build` ausführt.
  Das kann ein bis zwei Minuten dauern.

> Falls du **keine** `local.db` übertragen hast (frische, leere Datenbank), führe
> **vor** `pnpm build` noch `pnpm payload migrate` aus – das legt die leeren
> Datenbank-Tabellen an. Bei übertragener DB (Schritt 4) ist das **nicht** nötig.

---

## Schritt 7: Anwendung mit PM2 starten

PM2 startet den Node-Prozess und hält ihn dauerhaft am Laufen (auch nach einem
Neustart des Servers).

```bash
pm2 start ecosystem.config.cjs
pm2 save
pm2 startup
```

- `pm2 start ecosystem.config.cjs` startet die App nach der mitgelieferten
  Konfiguration (Port 3000, Name „andreas-junge").
- `pm2 save` merkt sich die laufende App.
- `pm2 startup` gibt **einen Befehl aus**, den du **kopieren und ausführen** musst –
  damit startet die App automatisch nach einem Server-Neustart.

**Prüfen**, ob die App läuft:

```bash
pm2 status
```

In der Spalte `status` sollte `online` stehen. Die Website ist jetzt **intern**
unter `127.0.0.1:3000` erreichbar – aber noch nicht aus dem Internet.

---

## Schritt 8: Apache als Reverse Proxy konfigurieren

Die mitgelieferte Konfiguration übernehmen:

```bash
sudo cp apache.conf /etc/apache2/sites-available/andreas-junge.conf
sudo nano /etc/apache2/sites-available/andreas-junge.conf
```

In der geöffneten Datei `yourdomain.com` durch deine echte Domain ersetzen
(speichern: **Strg+O**, **Enter**, **Strg+X**).

Die Konfiguration aktivieren:

```bash
sudo a2ensite andreas-junge
sudo a2dissite 000-default
sudo apache2ctl configtest
sudo systemctl reload apache2
```

- `a2ensite andreas-junge` aktiviert deine Seite.
- `a2dissite 000-default` deaktiviert die Apache-Standardseite („It works!").
- `apache2ctl configtest` prüft die Konfiguration auf Fehler – es sollte
  `Syntax OK` erscheinen.
- `systemctl reload apache2` lädt Apache mit der neuen Konfiguration neu.

Jetzt sollte die Website unter `http://deinedomain.de` erreichbar sein.

---

## Schritt 9: HTTPS / SSL mit Let's Encrypt einrichten

Ein kostenloses SSL-Zertifikat sorgt für die sichere `https://`-Verbindung.

```bash
sudo apt-get install -y certbot python3-certbot-apache
sudo certbot --apache -d deinedomain.de
```

- `certbot` holt und installiert das Zertifikat automatisch.
- Folge den Anweisungen (E-Mail eingeben, Bedingungen bestätigen). Wähle bei der
  Frage nach Umleitung die Option, **HTTP auf HTTPS umzuleiten**.

Certbot legt automatisch einen `https`-Block an und erneuert das Zertifikat
selbstständig. Danach ist die Seite unter `https://deinedomain.de` erreichbar.

> Hinweis: Certbot fügt im neuen `https`-Block idealerweise die Zeile
> `RequestHeader set X-Forwarded-Proto "https"` ein (siehe Kommentar in
> `apache.conf`), damit das Admin-Panel korrekte HTTPS-Adressen erzeugt.

---

## Fertig! 🎉

Die Website läuft jetzt öffentlich:

- **Website:** `https://deinedomain.de`
- **Admin-Panel:** `https://deinedomain.de/admin`

Melde dich einmal im Admin-Panel an und – falls dein Passwort ein Testpasswort
war – **ändere es** unter deinem Benutzerprofil.

---

## Updates einspielen (späterer Änderungen)

Wenn du am Code etwas geändert und ins Repository gepusht hast:

```bash
cd /var/www/andreas-junge
git pull
pnpm install
pnpm payload migrate      # nur falls neue Datenbank-Migrationen dazugekommen sind
pnpm run build
pm2 restart andreas-junge
```

- `git pull` holt die neuen Änderungen.
- `pnpm install` installiert ggf. neue Bibliotheken.
- `pnpm build` baut die Website neu.
- `pm2 restart` startet die App mit dem neuen Stand.

---

## Fehlersuche (Troubleshooting)

| Problem | Ursache & Lösung |
|---|---|
| **„502 / 503 Proxy Error"** im Browser | Der Node-Prozess läuft nicht. Prüfen: `pm2 status`, Logs ansehen: `pm2 logs andreas-junge`. Sind die Apache-Proxy-Module aktiv? `apache2ctl -M \| grep proxy` |
| **Admin-Login funktioniert nicht / Live-Updates fehlen** | WebSocket-Modul fehlt: `sudo a2enmod proxy_wstunnel && sudo systemctl reload apache2` |
| **Login schlägt generell fehl** | `.env` prüfen – `PAYLOAD_SECRET` muss gesetzt sein. Danach `pm2 restart andreas-junge`. |
| **Upload eines Bildes > 10 MB schlägt fehl** | Limit in `apache.conf` (`LimitRequestBody`) anheben und `sudo systemctl reload apache2`. |
| **Hochgeladene Bilder werden nicht angezeigt** | Der Ordner `media/` fehlt auf dem Server – per `rsync` übertragen (Schritt 4). |
| **`Cannot find module 'libsql'`** beim Build | Aufräumen und neu bauen: `rm -rf node_modules .next && pnpm install && pnpm build` |
| **Apache startet nicht / Fehler beim Reload** | `sudo apache2ctl configtest` zeigt die fehlerhafte Zeile an. |
| **Website nicht erreichbar, aber `pm2 status` = online** | Firewall prüfen (`sudo ufw status` → 'WWW Full' erlaubt?) und DNS-Eintrag der Domain auf die Server-IP kontrollieren. |

---

## Nützliche Befehle im Überblick

| Befehl | Bedeutung |
|---|---|
| `pm2 status` | Zeigt, ob die App läuft |
| `pm2 logs andreas-junge` | Live-Logs der Anwendung ansehen |
| `pm2 restart andreas-junge` | App neu starten |
| `sudo systemctl reload apache2` | Apache-Konfiguration neu laden |
| `sudo apache2ctl configtest` | Apache-Konfiguration auf Fehler prüfen |
| `sudo ufw status` | Firewall-Status anzeigen |
