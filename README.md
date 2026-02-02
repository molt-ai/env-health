# 🌿 EnviroHealth

> **Free environmental health reports for any US address.**

EnviroHealth aggregates data from 5+ federal databases to generate comprehensive environmental health reports for any US location. Get instant grades and actionable recommendations for air quality, water safety, toxic sites, health outcomes, and natural hazards.

<!-- TODO: Add screenshot -->
<!-- ![EnviroHealth Screenshot](./screenshot.png) -->

## ✨ Features

- **🔍 Address Search** — Search by address, city, or ZIP code with autocomplete
- **📊 Overall Health Grade** — A-F letter grade with 0-100 score
- **💨 Air Quality** — Real-time AQI and pollutant data from AirNow
- **💧 Water Safety** — Drinking water violations from EPA Envirofacts
- **☢️ Toxic Sites** — TRI facility mapping from EPA Toxic Release Inventory
- **🏥 Health Outcomes** — Disease prevalence and health data from CDC PLACES
- **🌪️ Natural Hazards** — Flood, fire, storm risk from FEMA National Risk Index
- **📋 Recommendations** — Actionable, prioritized recommendations based on findings
- **🗺️ Interactive Map** — Leaflet map showing toxic release sites near your location
- **⚖️ Compare Mode** — Side-by-side comparison of two locations
- **📄 PDF Export** — Download or print your full report
- **🔗 Shareable Links** — Copy-friendly URLs for any report
- **🌙 Dark Theme** — Beautiful dark academia aesthetic

## 🚀 Getting Started

### Prerequisites

- Node.js 20+ (tested with 22.x)
- npm or yarn

### Installation

```bash
git clone https://github.com/molt-ai/env-health.git
cd env-health
npm install
```

### Environment Variables

Copy the example env file and fill in your keys:

```bash
cp .env.example .env.local
```

| Variable | Required | Description |
|----------|----------|-------------|
| `AIRNOW_API_KEY` | **Yes** | AirNow API key for air quality data. [Sign up free](https://docs.airnowapi.org/) |
| `NEXT_PUBLIC_GEOAPIFY_KEY` | No | Geoapify key for address autocomplete. Falls back to server-side Nominatim |
| `NEXT_PUBLIC_POSTHOG_KEY` | No | PostHog project API key for behavior analytics. [Sign up free](https://posthog.com) |
| `NEXT_PUBLIC_POSTHOG_HOST` | No | PostHog host URL. Defaults to `https://us.i.posthog.com` |

**No API key needed for:** EPA Envirofacts, CDC PLACES (Socrata), FEMA NRI

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Build

```bash
npm run build
npm start
```

## 🌐 Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fmolt-ai%2Fenv-health&env=AIRNOW_API_KEY&envDescription=API%20keys%20for%20environmental%20data%20sources&envLink=https%3A%2F%2Fgithub.com%2Fmolt-ai%2Fenv-health%23environment-variables)

1. Click the button above or import from GitHub on [vercel.com](https://vercel.com)
2. Add your `AIRNOW_API_KEY` environment variable
3. Optionally add `NEXT_PUBLIC_GEOAPIFY_KEY` and `NEXT_PUBLIC_POSTHOG_KEY`
4. Deploy!

## 📊 Analytics

EnviroHealth supports optional analytics:

- **[Vercel Analytics](https://vercel.com/analytics)** — Automatic page views and web vitals (enabled by default on Vercel)
- **[Vercel Speed Insights](https://vercel.com/docs/speed-insights)** — Core Web Vitals monitoring
- **[PostHog](https://posthog.com)** — Behavior tracking (report generation, shares, PDF exports, comparison usage)

All analytics gracefully degrade when keys aren't configured. No personal data is collected.

## 🏗️ Tech Stack

- **Framework:** [Next.js 16](https://nextjs.org/) (App Router)
- **Styling:** [Tailwind CSS 4](https://tailwindcss.com/)
- **Maps:** [Leaflet](https://leafletjs.com/) + [React Leaflet](https://react-leaflet.js.org/)
- **PDF:** Browser print API
- **Analytics:** Vercel Analytics, PostHog
- **Data Sources:**
  - [AirNow API](https://docs.airnowapi.org/) — Real-time air quality
  - [EPA Envirofacts](https://www.epa.gov/enviro/envirofacts-data-service-api) — Water safety & toxic releases
  - [CDC PLACES](https://www.cdc.gov/places/) — Community health data
  - [FEMA NRI](https://hazards.fema.gov/nri/) — Natural hazard risk

## 📁 Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── geocode/         # Server-side geocoding proxy
│   │   └── health-report/   # Main report generation API
│   ├── compare/             # Location comparison page
│   ├── privacy/             # Privacy policy
│   ├── report/[zip]/        # Dynamic report pages
│   ├── layout.tsx           # Root layout with analytics
│   ├── page.tsx             # Home page / landing
│   ├── sitemap.ts           # Dynamic sitemap
│   └── robots.ts            # robots.txt
├── components/
│   ├── sections/            # Report section components
│   ├── JsonLd.tsx           # Structured data (SEO)
│   ├── MapView.tsx          # Interactive Leaflet map
│   ├── PostHogProvider.tsx  # Analytics provider
│   ├── ReportView.tsx       # Full report display
│   ├── ScoreCard.tsx        # Grade/score display
│   └── Toast.tsx            # Toast notifications
└── lib/
    ├── data-sources/        # API clients for each data source
    ├── analytics.ts         # Event tracking helpers
    ├── explainers.ts        # Recommendation generation
    ├── scoring.ts           # Score/grade calculation
    └── types.ts             # TypeScript interfaces
```

## 📄 License

MIT — see [LICENSE](./LICENSE).

## 🤝 Contributing

Contributions welcome! Please open an issue first to discuss what you'd like to change.

1. Fork the repo
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
