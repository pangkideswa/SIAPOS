# Deployment Plan

> Rencana deployment SIAPOS ke production.

---

## Status

| Komponen | Status |
|----------|--------|
| Frontend (Next.js) | Ready — tinggal deploy |
| Backend (Laravel) | Planning |
| Database (PostgreSQL) | Planning |
| Domain | Already owned: `siapos.my.id` |
| CI/CD | Planning |

---

## Frontend — Vercel

### Spesifikasi

| Item | Detail |
|------|--------|
| Platform | Vercel |
| Framework | Next.js 15 |
| Node | 20.x |
| Build Command | `npm run build` |
| Output Directory | `.next` |
| Install Command | `npm install` |

### Environment Variables

| Variable | Value |
|----------|-------|
| `NEXT_PUBLIC_API_URL` | `https://api.siapos.my.id/api` |
| `NEXT_PUBLIC_APP_URL` | `https://siapos.my.id` |

### Domain

| Domain | Tipe | Target |
|--------|------|--------|
| `siapos.my.id` | Production | Vercel |
| `preview.siapos.my.id` | Preview/Staging | Vercel Preview |

### Deployment Workflow

1. Push ke branch `main` → Auto-deploy ke production.
2. Push ke branch `develop` → Auto-deploy ke preview.
3. Pull Request → Vercel Preview Deployment.

---

## Backend — Coming Soon

### Opsi Hosting

| Platform | Pertimbangan |
|----------|-------------|
| VPS (DigitalOcean / Linode) | Full control, butuh DevOps |
| Railway / Render | Easy deploy, auto HTTPS |
| Laravel Forge + AWS | Managed, production-grade |

### Requirement

| Komponen | Spesifikasi |
|----------|-------------|
| Server | Ubuntu 22.04 LTS |
| PHP | 8.3+ |
| Composer | Latest |
| Database | PostgreSQL 16 |
| Web Server | Nginx |
| Queue | Redis (for notifications) |
| Cache | Redis |

---

## Database — Coming Soon

### Provider

| Opsi | Keterangan |
|------|------------|
| Supabase | PostgreSQL managed, free tier available |
| Neon | Serverless PostgreSQL, free tier |
| Vercel Postgres | Integrated with Vercel |

### Konfigurasi

```env
DB_CONNECTION=pgsql
DB_HOST=your-db-host
DB_PORT=5432
DB_DATABASE=siapos
DB_USERNAME=siapos_user
DB_PASSWORD=secure_password
```

---

## CI/CD Pipeline (Coming Soon)

### GitHub Actions

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 20
      - run: npm ci
      - run: npm run build
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
```

---

## Langkah Deployment

### Frontend

1. Push repository ke GitHub.
2. Import project ke Vercel.
3. Set environment variables.
4. Configure domain `siapos.my.id` di Vercel.
5. Deploy.

### Backend (Future)

1. Setup VPS / Railway server.
2. Clone repository backend.
3. Install dependencies (`composer install --optimize-autoloader`).
4. Setup PostgreSQL database.
5. Run migration (`php artisan migrate --force`).
6. Setup Nginx virtual host.
7. Configure SSL (Let's Encrypt).
8. Setup queue worker (`php artisan queue:work`).
9. Setup cron (`php artisan schedule:run`).

---

## Security Checklist (Pre-Production)

- [ ] Environment variables tidak boleh di commit.
- [ ] `.env` production dengan key generation.
- [ ] HTTPS enforced (Vercel auto).
- [ ] CORS configuration.
- [ ] Rate limiting.
- [ ] Input validation server-side.
- [ ] SQL injection prevention (Laravel Eloquent).
- [ ] XSS protection.
- [ ] CSRF protection.
- [ ] Session security.
- [ ] Database backup strategy.
- [ ] Monitoring & logging.

---

## Monitoring (Coming Soon)

| Tool | Kegunaan |
|------|----------|
| Vercel Analytics | Frontend performance |
| Sentry | Error tracking |
| Laravel Telescope | Backend debugging |
| Uptime Robot | Uptime monitoring |
