# Andreas Junge – Künstler-Website

Next.js 15 + Payload CMS 3 + SQLite. Frontend und Admin-Panel in einer Anwendung.

- Frontend: `http://localhost:3000`
- Admin-Panel: `http://localhost:3000/admin`

---

## Lokale Entwicklung

```bash
pnpm install
cp .env.example .env          # PAYLOAD_SECRET anpassen
pnpm payload migrate          # Datenbank-Tabellen anlegen
pnpm dev                      # Dev-Server starten
```

Einmalig nach dem ersten Start Seed-Daten einspielen:

```bash
pnpm seed
```

---

## Deployment auf Debian 13 + Apache

Die Anwendung läuft als Node-Prozess (verwaltet von PM2) und wird von **Apache als Reverse Proxy** nach außen bedient. Eine `.htaccess` wird **nicht** benötigt, da sämtlicher Traffic an den Node-Prozess weitergereicht wird.

### Servervoraussetzungen

- Debian 13 (Trixie), frisch installiert
- Ein Benutzer mit `sudo`-Rechten
- Eine auf den Server zeigende Domain (für SSL)
- Offene Ports 80 und 443

### 1. Node.js 22 (LTS), pnpm und PM2 installieren

Das Debian-Repo-Node ist häufig zu alt – daher NodeSource verwenden:

```bash
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo bash -
sudo apt-get install -y nodejs git rsync
sudo npm install -g pnpm pm2
```

Versionen prüfen (`node -v` ≥ 22, `pnpm -v` ≥ 9).

### 2. Firewall einrichten

```bash
sudo apt-get install -y ufw
sudo ufw allow OpenSSH
sudo ufw allow 'WWW Full'    # Ports 80 + 443
sudo ufw enable
```

### 3. Apache installieren und Module aktivieren

```bash
sudo apt-get install -y apache2
sudo a2enmod proxy proxy_http proxy_wstunnel headers rewrite ssl
sudo systemctl restart apache2
```

> `proxy_wstunnel` ist für die Live-Updates im Admin-Panel (WebSockets) erforderlich.

### 4. Projekt auf den Server bringen

```bash
sudo mkdir -p /var/www/andreas-junge
sudo chown $USER:$USER /var/www/andreas-junge
cd /var/www/andreas-junge

git clone <REPO_URL> .
```

Datenbank und CMS-Medien separat übertragen (vom lokalen Rechner aus) – diese sind per `.gitignore` ausgeschlossen:

```bash
rsync -avz ./local.db  user@server:/var/www/andreas-junge/local.db
rsync -avz ./media/    user@server:/var/www/andreas-junge/media/
```

> Die Diashow-Bilder unter `public/assets/images/` sind im Repo enthalten und kommen bereits per `git clone` mit.

### 5. Umgebungsvariablen konfigurieren

```bash
cp .env.example .env
```

Sicheren `PAYLOAD_SECRET` generieren:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

In `.env` eintragen:

```env
DATABASE_URL=file:./local.db
PAYLOAD_SECRET=hier-den-generierten-string-einfügen
```

### 6. Abhängigkeiten installieren und Build erstellen

```bash
pnpm install
pnpm payload migrate
pnpm build
```

> Die `.npmrc` (mit `*libsql*`-Hoist-Pattern) ist im Repo enthalten und für den SQLite-Adapter notwendig.

### 7. Mit PM2 starten

```bash
pm2 start ecosystem.config.cjs
pm2 save
pm2 startup   # ausgegebenen Befehl kopieren und ausführen
```

Die App lauscht nun lokal auf `127.0.0.1:3000`.

### 8. Apache als Reverse Proxy konfigurieren

Mitgelieferte `apache.conf` übernehmen und Domain anpassen:

```bash
sudo cp apache.conf /etc/apache2/sites-available/andreas-junge.conf
sudo nano /etc/apache2/sites-available/andreas-junge.conf   # yourdomain.com anpassen
```

Site aktivieren, Standard-Site deaktivieren und neu laden:

```bash
sudo a2ensite andreas-junge
sudo a2dissite 000-default          # optional, falls keine andere Site benötigt wird
sudo apache2ctl configtest
sudo systemctl reload apache2
```

Die `apache.conf` setzt bereits: Reverse Proxy auf Port 3000, WebSocket-Upgrade, `LimitRequestBody 10M` (passend zum 10-MB-Upload-Limit) und Weiterreichen der `X-Forwarded-*`-Header.

### 9. SSL mit Let's Encrypt (Certbot für Apache)

```bash
sudo apt-get install -y certbot python3-certbot-apache
sudo certbot --apache -d yourdomain.com
```

Certbot legt automatisch einen `<VirtualHost *:443>`-Block an und leitet HTTP→HTTPS um. Im 443-Block sollte `RequestHeader set X-Forwarded-Proto "https"` gesetzt sein (siehe Kommentar in `apache.conf`), damit Payload korrekte HTTPS-URLs erzeugt.

---

## Update-Workflow

```bash
cd /var/www/andreas-junge
git pull
pnpm install
pnpm payload migrate      # falls neue Migrationen vorhanden
pnpm build
pm2 restart andreas-junge
```

---

## Nützliche Commands

| Command | Beschreibung |
|---|---|
| `pnpm dev` | Dev-Server starten |
| `pnpm build` | Produktions-Build |
| `pnpm seed` | Seed-Daten einspielen (einmalig) |
| `pnpm generate:types` | `payload-types.ts` neu generieren |
| `pnpm generate:importmap` | Import-Map neu generieren |
| `pnpm payload migrate` | Datenbankmigrationen ausführen |
| `pnpm payload migrate:create` | Neue Migration erstellen |

---

## Fehlersuche

| Problem | Lösung |
|---|---|
| 502 / 503 (Proxy Error) | Läuft der Node-Prozess? `pm2 status` → `pm2 logs andreas-junge`. Apache-Module aktiv? `apache2ctl -M \| grep proxy` |
| Admin-Live-Updates / WebSocket-Fehler | `sudo a2enmod proxy_wstunnel && sudo systemctl reload apache2` |
| Admin-Login schlägt fehl | `.env` prüfen – `PAYLOAD_SECRET` muss gesetzt sein |
| Upload > 10 MB schlägt fehl | `LimitRequestBody` in `apache.conf` und `upload.limits.fileSize` in `payload.config.ts` angleichen |
| `Cannot find module 'libsql'` | `.npmrc` fehlt/ungenutzt – `rm -rf node_modules .next && pnpm install && pnpm build` |
| Bilder (CMS-Uploads) nicht sichtbar | `media/`-Ordner fehlt auf dem Server – per `rsync` übertragen |
| Apache-Config-Fehler | `sudo apache2ctl configtest` zeigt die fehlerhafte Zeile |
