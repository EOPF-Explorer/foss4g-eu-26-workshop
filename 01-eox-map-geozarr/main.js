// Step 1: Import the required packages
import "@eox/layout";
import "@eox/map";
import "@eox/map/src/plugins/advancedLayersAndSources";
import "@eox/layercontrol";

// After importing, add (uncomment) the <eox-layout>, <eox-map>, and
// <eox-layercontrol> elements in index.html for the components to render.

// Step 2: Get the GeoZarr URL. fetchGeoZarrUrl() in ../shared/utils.js returns a
// recent clear scene; pass a small bbox around Napoli. Import it at the top:
//   import { fetchGeoZarrUrl } from "../shared/utils.js";
//   const zarrUrl = await fetchGeoZarrUrl([14.0, 41.0, 14.2, 41.2]);

// Both styles are provided. True color: gamma 1.5, each RGB band interpolated
// 0-0.5 -> 0-255.
const trueColorStyle = {
  gamma: 1.5,
  color: [
    "color",
    ["interpolate", ["linear"], ["band", 1], 0, 0, 0.5, 255],
    ["interpolate", ["linear"], ["band", 2], 0, 0, 0.5, 255],
    ["interpolate", ["linear"], ["band", 3], 0, 0, 0.5, 255],
  ],
};

// NDVI = (NIR - Red) / (NIR + Red); band 4 is NIR (b08) and band 1 is Red (b04),
// mapped through a grey -> yellow -> green color ramp.
const ndviStyle = {
  color: [
    "interpolate",
    ["linear"],
    ["/", ["-", ["band", 4], ["band", 1]], ["+", ["band", 4], ["band", 1]]],
    -0.2,
    [191, 191, 191],
    0,
    [255, 255, 224],
    0.2,
    [145, 191, 82],
    0.4,
    [79, 138, 46],
    0.6,
    [15, 84, 10],
  ],
};

// Step 3: Build the layers. Uncomment the OpenStreetMap base, then the GeoZarr
// data layer: a WebGLTile with a GeoZarr source, starting with the true-color
// style. Besides the RGB bands the source loads b08 (NIR) as band 4 — the
// true-color style ignores it, but the NDVI style needs it.
/** @type {import("@eox/map").EoxLayer[]} */
const layers = [
  // {
  //   type: "Tile",
  //   properties: { id: "osm", title: "OpenStreetMap" },
  //   source: {
  //     type: "XYZ",
  //     url: "https://tiles.maps.eox.at/wmts/1.0.0/osm_3857/default/g/{z}/{y}/{x}.jpg",
  //   },
  // },
  // {
  //   type: "WebGLTile",
  //   properties: { id: "geozarr", title: "Sentinel-2 GeoZarr" },
  //   source: {
  //     type: "GeoZarr",
  //     url: zarrUrl,
  //     bands: ["b04", "b03", "b02", "b08"],
  //     crossOrigin: "anonymous",
  //   },
  //   style: trueColorStyle,
  // },
];

// Step 4: Assign layers, center, and zoom to the map element. Uncomment:
// const map = document.querySelector("#my-map");
// Object.assign(map, {
//   center: [14.09, 41.1], // Napoli area
//   zoom: 10,
//   layers,
// });

// Step 5: Toggle the same layer between true color and NDVI with the
// #ndvi-button (index.html). Complete updateStyle: build a new layers array
// where the "geozarr" definition carries the given `style`, then reassign
// `map.layers` — eox-map diffs the definitions and restyles the existing layer
// in place, no reload needed.
// function updateStyle(style) {
//   const layers = [...map.layers]
//   const geozarrLayer = layers[1]
//   // assign the style to geozarr layer
//   map.layers = layers
// }
// let ndviShown = false;
// document.querySelector("#ndvi-button").addEventListener("click", (e) => {
//   ndviShown = !ndviShown;
//   updateStyle(ndviShown ? ndviStyle : trueColorStyle);
//   e.target.textContent = ndviShown ? "Show true color" : "Show NDVI";
// });
