# EOPF Sentinel Zarr Explorer - FOSS4G Workshop

_[FOSS4G Europe 2026](https://2026.europe.foss4g.org/) - Timișoara, Romania, 3 July 2026_

Web visualization techniques and resources for the **GeoZarr** specification.

Build interactive web mapping applications on cloud-native Copernicus Sentinel data
(GeoZarr on S3) using **EOxElements** (OpenLayers-based web components),**eox-storytelling**, **TiTiler**, **eodash**, and **Jupyter EOxElements** for Jupyter Notebooks.

## What you'll learn

- Read cloud-native GeoZarr straight from S3
- Style and combine bands in the browser
- Render server-side tiles and band-math (NDVI, SWIR) with TiTiler
- Build a scrollytelling story
- Build a STAC-driven dashboard
- Visualize Interactive components in Jupyter notebooks


## Prerequisites

- **Node.js 24 or above** — runs the browser exercises (01-06, 08) and the dev server.
- **Python 3.12.11 or above**, with `venv` and `pip` — for the Jupyter exercise (07);
  see [`07-jupyter/requirements.txt`](./07-jupyter/requirements.txt).
- A modern browser.

**Coding knowledge**

- **JavaScript — intermediate:** configuring web components / custom elements and
  basic DOM integration.
- **Python — beginner:** only for the Jupyter EOxElements section (07).


## Setup

```bash
npm install
npm run dev
```

Then open the landing page at **http://localhost:3000/** and start with exercise 01.

> The exercises are plain JavaScript. A `tsconfig.json` is included if you want JSDoc
> annotations and `// @ts-check` for inline type checking, or TypeScript — Vite handles
> both.

## Exercises

Each numbered folder is a step. Web exercises have a starter (`index.html`,
`main.js`, `style.css`) for you to edit and a complete `solution/`; notebook
exercises have a `.ipynb`. Every folder has a `README.md` to follow.

| # | Exercise | What you build |
|---|----------|----------------|
| [01](./01-eox-map-geozarr/) | Basic Map + GeoZarr | Load a Sentinel-2 GeoZarr from S3 into `eox-map` with a layer control |
| [02](./02-eox-advanced/) | Advanced Visualization | Interactive band / gamma / cloud-mask controls via the `layerConfig` pattern (incl. bands from multiple groups) |
| [03](./03-eox-globe/) | 3D Globe | Drape a Sentinel-2 GeoZarr over a 3D globe with terrain and fly-to |
| [04](./04-titiler/) | TiTiler (server-side) | Server-rendered tiles in `eox-map`: RGB tuning + band-math indices with colour maps |
| [05](./05-eox-storytelling/) | Storytelling | A Markdown-driven scrollytelling tour comparing band combinations |
| [06](./06-eodash/) | eodash Dashboard | A STAC-driven EO dashboard from a single config object |
| [07](./07-jupyter/) | Jupyter EOxElements | The same components and configs inside a Python notebook (`ipyeoxelements`) |
| [08](./08-zarrita/) | GeoZarr Deep-Dive *(optional)* | Read a GeoZarr store directly with zarrita.js and paint a band to a canvas |

## Tech stack

- **Vite + npm** 
- **EOxElements** — OpenLayers-based web components (`eox-map`, `eox-layercontrol`, `eox-jsonform`, `eox-storytelling`)
- **OpenGlobus** — 3D globe (`eox-map` globe plugin)
- **eodash** — STAC-driven dashboards
- **TiTiler-EOPF** — server-side tile rendering
- **EOxElements-Jupyter** (`ipyeoxelements`) — the components inside notebooks
- **zarrita.js** — direct GeoZarr reads

## Resources

- [EOPF Explorer](https://explorer.eopf.copernicus.eu/) — data exploration service
- [EOPF Explorer software](https://github.com/EOPF-Explorer) — the GitHub org behind the service
- [EOPF Explorer STAC API](https://api.explorer.eopf.copernicus.eu/stac)
- [EOPF Explorer STAC Browser](https://api.explorer.eopf.copernicus.eu/browser)
- [TiTiler-EOPF raster API](https://api.explorer.eopf.copernicus.eu/raster/api.html)
- [TiTiler-EOPF source](https://github.com/EOPF-Explorer/titiler-eopf)
- [EOxElements docs & storybook](https://eox-a.github.io/EOxElements/)
- [EOxElements-Jupyter](https://github.com/EOX-A/EOxElements-Jupyter)
- [eodash](https://eodash.org/)
- [eodash client docs](https://eodash.github.io/eodash/)
- [OpenLayers](https://openlayers.org/)
- [OpenGlobus](https://github.com/openglobus/openglobus)
- [zarrita.js](https://github.com/manzt/zarrita.js)
- [GeoZarr specification](https://github.com/zarr-developers/geozarr-spec)
- [STAC specification](https://stacspec.org/)

## Contributing

Found a bug or want to improve something? Open an issue or pull request on the relevant repository:

- [This workshop](https://github.com/EOPF-Explorer/foss4g-workshop)
- [EOxElements](https://github.com/EOX-A/EOxElements)
- [EOxElements-Jupyter](https://github.com/EOX-A/EOxElements-Jupyter)
- [eodash](https://github.com/eodash/eodash)
- [TiTiler-EOPF](https://github.com/EOPF-Explorer/titiler-eopf)
