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

## Deployment auf Debian 12

### 1. Node.js, pnpm und PM2 installieren

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo bash -
sudo apt-get install -y nodejs
sudo npm install -g pnpm pm2
```

### 2. Firewall einrichten

```bash
sudo apt-get install -y ufw
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable
```

### 3. Projekt auf den Server bringen

```bash
sudo mkdir -p /var/www/andreas-junge
sudo chown $USER:$USER /var/www/andreas-junge
cd /var/www/andreas-junge

git clone <REPO_URL> .
```

Datenbank und Medien separat übertragen (vom lokalen Rechner):

```bash
rsync -avz ./local.db  user@server:/var/www/andreas-junge/local.db
rsync -avz ./media/    user@server:/var/www/andreas-junge/media/
```

### 4. Umgebungsvariablen konfigurieren

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

### 5. Abhängigkeiten installieren und Build erstellen

```bash
pnpm install
pnpm payload migrate
pnpm build
```

### 6. Mit PM2 starten

```bash
pm2 start ecosystem.config.cjs
pm2 save
pm2 startup   # Befehl kopieren und ausführen
```

### 7. Nginx als Reverse Proxy

```bash
sudo apt-get install -y nginx
sudo cp nginx.conf /etc/nginx/sites-available/andreas-junge
sudo ln -s /etc/nginx/sites-available/andreas-junge /etc/nginx/sites-enabled/
```

`yourdomain.com` in der Konfiguration anpassen:

```bash
sudo nano /etc/nginx/sites-available/andreas-junge
```

Nginx neu laden:

```bash
sudo nginx -t
sudo systemctl reload nginx
```

### 8. SSL mit Let's Encrypt

```bash
sudo apt-get install -y certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
```

---

## Update-Workflow

```bash
cd /var/www/andreas-junge
git pull
pnpm install
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
| 502 Bad Gateway | `pm2 status` → `pm2 logs andreas-junge` |
| Admin-Login schlägt fehl | `.env` prüfen – `PAYLOAD_SECRET` muss gesetzt sein |
| `Cannot find module 'libsql'` | `.npmrc` fehlt – anlegen und `rm -rf node_modules .next && pnpm install && pnpm build` |
| Bilder nicht sichtbar | `media/`-Ordner fehlt auf Server – per `rsync` übertragen |
# andreasJunge
