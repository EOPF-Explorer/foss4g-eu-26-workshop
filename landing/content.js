// Landing page content. Edit here to update the page.
// render.js converts these objects to HTML; no markup changes needed here.

export const hero = {
  logo: "/assets/brand/eopf-explorer-negative.svg",
  eyebrow: "FOSS4G Workshop",
  title: "EOPF Sentinel Zarr Explorer",
  lede: "Hands-on exercises for visualizing Sentinel GeoZarr data in the browser and in Python.",
  cta: { label: "Start exercise 01", dir: "01-eox-map-geozarr" },
  slides: {
    label: "Slides",
    href: "/assets/EOPF%20Explorer%20FOSS4G%20EU%2026.pdf",
  },
  meta: "8 hands-on exercises · ~3.5 hours",
};

/**
 * @typedef {object} Exercise
 * @property {string} num - Two-digit label, e.g. "01"
 * @property {string} dir - Folder name under the repo root
 * @property {string} title
 * @property {string} description
 * @property {string} [file] - File the "Start" button opens (default "main.js")
 * @property {string} [demoQuery] - Query string appended to the demo links (no leading ?)
 */

/** @type {{ index: string, title: string, exercises: Exercise[] }[]} */
export const sections = [
  {
    index: "01",
    title: "Build with EOxElements",
    exercises: [
      {
        num: "01",
        dir: "01-eox-map-geozarr",
        title: "Basic Map + GeoZarr",
        description:
          "Load a Sentinel-2 GeoZarr from S3 into eox-map and add a layer control.",
        status: "active",
      },
      {
        num: "02",
        dir: "02-eox-advanced",
        title: "Advanced Visualization",
        description:
          "Explore interactive band and gamma controls built with the layerConfig pattern, then add a cloud mask driven by a band from another group.",
        status: "active",
      },
      {
        num: "03",
        dir: "03-eox-globe",
        title: "3D Globe",
        description:
          "Drape a Sentinel-2 GeoZarr scene over a 3D globe with terrain and fly-to.",
        status: "active",
      },
      {
        num: "04",
        dir: "04-titiler",
        title: "TiTiler (server-side)",
        description:
          "Render GeoZarr server-side with TiTiler. A layerConfig form controls the tile request, applying the same pattern from exercise 02 to server-side parameters.",
        status: "active",
      },
    ],
  },
  {
    index: "02",
    title: "Storytelling",
    exercises: [
      {
        num: "05",
        dir: "05-eox-storytelling",
        title: "Storytelling",
        description:
          "Write a Markdown story that drives a scroll-synced map comparing band combinations.",
        status: "active",
      },
    ],
  },
  {
    index: "03",
    title: "Dashboards with eodash",
    exercises: [
      {
        num: "06",
        dir: "06-eodash",
        title: "eodash",
        description:
          "Configure a STAC-driven EO dashboard from a single object: map, item catalogue, and layer control, backed by the EOPF Explorer STAC API.",
        status: "active",
        demoQuery: "indicator=sentinel-2-l2a",
      },
    ],
  },
  {
    index: "04",
    title: "Python & notebooks",
    exercises: [
      {
        num: "07",
        dir: "07-jupyter",
        title: "Jupyter EOxElements",
        description:
          "Run EOxElements inside a Python notebook with ipyeoxelements, reusing the layer config from exercise 01 as a Python dict.",
        status: "active",
        file: "notebook.ipynb",
      },
    ],
  },
  {
    index: "05",
    title: "Advanced (optional)",
    exercises: [
      {
        num: "08",
        dir: "08-zarrita",
        title: "GeoZarr Deep-Dive",
        description:
          "Open a GeoZarr store with zarrita.js, read a 60 m band, and paint a true-colour composite to a canvas.",
        status: "active",
      },
    ],
  },
];

export const footerLinks = [
  { label: "EOPF Explorer", href: "https://explorer.eopf.copernicus.eu/" },
  {
    label: "STAC Browser",
    href: "https://api.explorer.eopf.copernicus.eu/browser",
  },
  { label: "EOxElements", href: "https://eox-a.github.io/EOxElements/" },
  {
    label: "EOxElements Jupyter",
    href: "https://github.com/EOX-A/EOxElements-Jupyter",
  },
  { label: "eodash", href: "https://eodash.org/" },
  {
    label: "TiTiler-EOPF",
    href: "https://github.com/EOPF-Explorer/titiler-eopf",
  },
  {
    label: "GeoZarr",
    href: "https://github.com/zarr-developers/geozarr-spec",
  },
];
