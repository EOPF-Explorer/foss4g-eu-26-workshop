// Step 1: Import the packages.
// - @eox/layout
// - @eox/map
// - @eox/map/src/plugins/advancedLayersAndSources
// - @eox/layercontrol
// - @eox/jsonform          (renders the config form -> "config" tool)

// After importing, add <eox-layout>, <eox-map>, and
// <eox-layercontrol> elements in index.html for the components to render.

// ----------------------------------------------------------------------------
// PART A — Band manipulation
// ----------------------------------------------------------------------------
// Step 2: A Sentinel-2 scene over the Czech Republic (south Bohemia)
// Part B reads multiple groups, so this is the store ROOT.
const storeUrl =
  "https://s3.explorer.eopf.copernicus.eu/esa-zarr-sentinel-explorer-fra/tests-output/sentinel-2-l2a/S2C_MSIL2A_20260606T100551_N0512_R022_T33UVQ_20260606T152612.zarr";

// Step 3: Build the layers. Uncomment the OSM base below, then add the WebGLTile
// GeoZarr layer (bands ["b04", "b03", "b02", "b11"]) with the layerConfig and style
// described next.
/** @type {import("@eox/map").EoxLayer[]} */
const layers = [
  // {
  //   type: "Tile",
  //   properties: { id: "basemap", title: "OpenStreetMap" },
  //   source: {
  //     type: "XYZ",
  //     url: "https://tiles.maps.eox.at/wmts/1.0.0/osm_3857/default/g/{z}/{y}/{x}.jpg",
  //   },
  // },
  // Add the WebGLTile GeoZarr layer here.
];

// The GeoZarr layer:
//
//   On the layer's `properties`, add a `layerConfig` object:
//     - type: "style"   (form changes update style variables)
//     - schema: a JSON Schema with properties for:
//         red / green / blue  -> number, enum [1,2,3,4], enum_titles
//             ["Red (B04)", "Green (B03)", "Blue (B02)", "SWIR (B11)"]
//         redMax / greenMax / blueMax / gamma -> number, format "range"
//   Also set layerControlExpand: true and layerControlToolsExpand: true.
//
//   The layer `style` declares matching `variables` and references them with
//   ["var", "..."]:
//     gamma: ["var", "gamma"]
//     color: ["color",
//       ["interpolate", ["linear"], ["band", ["var", "red"]],   0, 0, ["var", "redMax"],   255],
//       ["interpolate", ["linear"], ["band", ["var", "green"]], 0, 0, ["var", "greenMax"], 255],
//       ["interpolate", ["linear"], ["band", ["var", "blue"]],  0, 0, ["var", "blueMax"],  255],
//     ]

// Step 4: Assign layers, center, and zoom to the map. Uncomment:
// const map = document.querySelector("#my-map");
// Object.assign(map, {
//   center: [14.52, 49.08],
//   zoom: 8,
//   layers,
// });
//   Then open the config tool and try a false-color SWIR composite.

// ----------------------------------------------------------------------------
// PART B — Multi-group: mask clouds using a band from a different group
// ----------------------------------------------------------------------------
// A single GeoZarr store holds many groups. So far we've only read from
// `measurements/reflectance`. Now we'll pull in the cloud-probability band (cld,
// in %) from the `quality/probability` group and use it to mask out clouds.
//
// Step 5: Point the source `url` at the store ROOT (we already did this above),
//   then switch `bands` to the object form so each band names its own group:
//     bands: [
//       { name: "b04", group: "measurements/reflectance" },
//       { name: "b03", group: "measurements/reflectance" },
//       { name: "b02", group: "measurements/reflectance" },
//       { name: "b11", group: "measurements/reflectance" },
//       { name: "cld", group: "quality/probability" }, // cloud probability %, band 5
//     ]
//
// Step 6: Add a `cloudThreshold` control: a number/range schema property (0-100)
//   plus a matching style variable, then extend the alpha mask so pixels above
//   the threshold turn transparent:
//     [">", ["band", 5], ["var", "cloudThreshold"]] -> 0
