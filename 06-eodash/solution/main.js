// eodash builds the whole dashboard from one config object: a STAC endpoint plus a
// grid of named widgets, all sharing one store. It renders whatever assets the STAC
// catalogue exposes (GeoZarr, COG, WMTS, etc.).
/** @type {import("@eodash/eodash").Eodash} */
const config = {
  id: "eopf-workshop",
  // eodash queries this STAC API to list collections, fill the catalogue, and
  // decide how to render each item's assets. `api: true` marks it as a STAC API
  // (paged search) rather than a static catalogue.
  stacEndpoint: {
    endpoint: "https://api.explorer.eopf.copernicus.eu/stac",
    api: true,
  },
  brand: {
    name: "EOPF Sentinel Zarr Explorer",
    // Hide eodash's own header/footer — the workshop already has its own top bar.
    noLayout: true,
    // theme.colors restyle the dashboard's UI (buttons, panels, accents).
    theme: {
      colors: { primary: "#003047", secondary: "#00ae9d", surface: "#ffffff" },
    },
  },
  template: {
    // The background widget fills the viewport behind the panels — here, the map.
    background: {
      id: "background-map",
      type: "internal",
      widget: { name: "EodashMap" },
    },
    // Side panels on the same 12-column grid as eox-layout.
    widgets: [
      {
        id: "filters",
        type: "internal",
        title: "Datasets",
        layout: { x: 0, y: 0, w: 3, h: 12 },
        // layoutTarget: null disables the layout switcher (the catalog defaults it
        // to "lite"). It must be null, not undefined — Vue falls back to the default
        // for undefined props.
        widget: {
          name: "EodashItemCatalog",
          properties: { layoutTarget: null },
        },
      },
      {
        id: "layers",
        type: "internal",
        title: "Layers",
        layout: { x: 9, y: 0, w: 3, h: 12 },
        widget: {
          name: "EodashLayerControl",
          // Expose every per-layer tool except the datetime picker
          properties: { tools: ["info", "config", "legend", "opacity"] },
        },
      },
    ],
  },
};

// Set the `config` property, then register the web component with a dynamic import
// so eodash picks up the config as it initialises.
const dashboard = document.querySelector("#dashboard");
dashboard.config = async () => config;

await import("@eodash/eodash/webcomponent");
