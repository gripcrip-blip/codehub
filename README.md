# CODEHUB

Fan-made aggregator of HoYoverse promo codes. No ads. No accounts. No backend.

Promo codes live in `data/codes.json`. A Python parser fills that file from public sources; GitHub Actions commits updates so the site can rebuild (Netlify/Vercel) automatically.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
npm run build
```

## Parser

No extra Python packages. From the repo root:

```bash
python parser/update_codes.py
```

It writes `data/codes.json`. Codes are collected, not verified. The GitHub Action `.github/workflows/update-codes.yml` runs every 3 hours and on demand.

## Languages

English, Russian, Spanish, Chinese, and Japanese. Promo codes are never translated.

English URLs have no prefix (`/genshin-impact-codes`). Other locales use `/ru`, `/es`, `/zh`, `/ja`.
