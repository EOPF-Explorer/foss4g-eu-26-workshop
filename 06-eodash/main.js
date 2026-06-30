// eodash builds a dashboard a config object: you describe a STAC
// endpoint and a grid of widgets, and it wires the map, catalogue, and layer
// control to a shared store. This base config already renders a map;
// you grow it by adding side-panel widgets (Step 2).

// Step 1: Uncomment the <eo-dash> element in index.html.

/** @type {import("@eodash/eodash").Eodash} */
const config = {
  id: "eopf-explorer-workshop",
  // eodash queries this STAC API to list collections, fill the catalogue, and
  // decide how to render each item's assets and links. `api: true` marks it as a STAC API
  // (paged search) rather than a static catalogue.
  stacEndpoint: {
    endpoint: "https://api.explorer.eopf.copernicus.eu/stac",
    api: true,
  },
  brand: {
    name: "EOPF Sentinel Zarr Explorer Workshop",
    // Hide eodash's own header/footer
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
    // Step 2: add the side panels here. Each entry is
    //   { id, type: "internal", title, layout: { x, y, w, h }, widget: { name } }
    // on the same 12-column grid as eox-layout. Add:
    //   - EodashItemCatalog on the left   -> layout { x: 0, y: 0, w: 3, h: 12 }
    //   - EodashLayerControl on the right -> layout { x: 9, y: 0, w: 3, h: 12 }
    // On the layer control, expose every tool except the datetime picker by
    // setting its widget.properties:
    //   properties: { tools: ["info", "config", "legend", "opacity"] }
    widgets: [],
  },
};

// Step 3: Wire it up. Set the `config` property, then register the web component
// with a dynamic import so eodash picks up the config as it initialises. Uncomment:
//   const dashboard = document.querySelector("#dashboard");
//   dashboard.config = async () => config; // a function returning the config
//   await import("@eodash/eodash/webcomponent");
