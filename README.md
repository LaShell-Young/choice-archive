# Choice Archive

An interactive React component gallery built with Vite and MUI. It pairs common UI patterns—cards, charts, tabs, sliders, tables, pagination, drawers, tooltips, and responsive grids—with live public data.

## Run locally

```sh
npm install
npm start
```

Run the production build and tests with `npm run build` and `npm test`. Use `npm run preview` to serve the built site locally.

## Data sources

API requests are made without keys or an application server. Weather, RandomUser, DiceBear, and Stardew data load in the browser. Sonto and HealthCare.gov feeds are fetched into ignored `public/data` snapshots by `npm run sync:data` because their endpoints do not currently allow browser CORS; `prestart` and `prebuild` refresh those snapshots automatically. Each showcase panel includes its source and documentation link.

| Showcase | Data source |
| --- | --- |
| Weather and hourly chart | [Open-Meteo](https://open-meteo.com/) |
| Generated profile illustrations | [DiceBear](https://www.dicebear.com/) |
| Synthetic profile details | [RandomUser](https://randomuser.me/) |
| Tech and AI news in five languages | [Sonto](https://sonto.tech/) |
| Health insurance glossary | [HealthCare.gov Content API](https://www.healthcare.gov/developers/) |
| Crops and seasons | [Stardew Valley Wiki API](https://www.stardewvalleywiki.net/developers) |
| Event countdown | [CountdownsHQ](https://countdownshq.com/) |

CountdownsHQ does not document a public JSON API, so the date picker and ticking clock run locally; the panel links to the site for event information rather than implying an API feed.

## Add another source

1. Add source metadata to `API_SOURCES` in `src/data/apiSources.js` (name, homepage, short explanation, and endpoint).
2. Add a small fetch adapter in that file. Keep request/response normalization there and use the shared HTTP error handling. For sources without CORS, add a fetch-and-stage entry to `scripts/fetch-public-data.mjs` and load that same-origin file in the browser.
3. Build a focused MUI panel in `src/components/SourceShowcase.js`, include `SourceNote` for attribution, and place the panel in `src/Dashboard.js`.

The panels are independent, so each source can have its own loading, retry, and error state.

## GitHub Pages

`.github/workflows/deploy.yml` builds the Vite app and publishes `dist` to GitHub Pages on pushes to `main`. The workflow sets Vite's base path to `/choice-archive/`, matching this repository's project site URL. If the repository is renamed, update that path in the workflow.
