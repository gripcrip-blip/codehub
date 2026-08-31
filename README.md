# PromoHoyo

Fan-made aggregator of HoYoverse promo codes. No ads. No accounts. No backend.

Promo codes live in `data/codes.json`. A Python parser fills that file from public sources. GitHub Actions runs the parser every day, commits updates, and deploys the site to [Netlify](https://promohoyo.netlify.app).

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

It writes `data/codes.json`. Codes are collected, not verified. The GitHub Action `.github/workflows/update-codes.yml` runs every day at 09:00 Moscow time, on demand, and deploys the site when the data changes.

## Languages

English, Russian, Spanish, Chinese, and Japanese. Promo codes are never translated.

English URLs have no prefix (`/genshin-impact-codes`). Other locales use `/ru`, `/es`, `/zh`, `/ja`.
