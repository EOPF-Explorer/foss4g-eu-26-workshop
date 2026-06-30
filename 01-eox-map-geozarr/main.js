// Step 1: Import the required packages
// - @eox/layout
// - @eox/map
// - @eox/map/src/plugins/advancedLayersAndSources  (adds the GeoZarr source type)
// - @eox/layercontrol

// After importing, add (uncomment) the <eox-layout>, <eox-map>, and
// <eox-layercontrol> elements in index.html for the components to render.

// Step 2: Get the GeoZarr URL. fetchGeoZarrUrl() in ../shared/utils.js returns a
// recent clear scene; pass a small bbox around Napoli. Import it at the top:
//   import { fetchGeoZarrUrl } from "../shared/utils.js";
//   const zarrUrl = await fetchGeoZarrUrl([14.0, 41.0, 14.2, 41.2]);

// Step 3: Build the layers. Uncomment the OpenStreetMap base below, then the
// GeoZarr data layer: a WebGLTile with a GeoZarr source, bands ["b04","b03","b02"],
// and the flat WebGL `style` (gamma 1.5, each band interpolated 0-0.5 -> 0-255).
/** @type {import("@eox/map").EoxLayer[]} */
const layers = [
  // {
  //   type: "Group",
  //   properties: { id: "base", title: "Base Layers" },
  //   layers: [
  //     {
  //       type: "Tile",
  //       properties: { id: "osm", title: "OpenStreetMap" },
  //       source: {
  //         type: "XYZ",
  //         url: "https://tiles.maps.eox.at/wmts/1.0.0/osm_3857/default/g/{z}/{y}/{x}.jpg",
  //       },
  //     },
  //   ],
  // },
  // Add the GeoZarr data layer here (WebGLTile + GeoZarr source). Use this style:
  // style: {
  //   gamma: 1.5,
  //   color: [
  //     "color",
  //     ["interpolate", ["linear"], ["band", 1], 0, 0, 0.5, 255],
  //     ["interpolate", ["linear"], ["band", 2], 0, 0, 0.5, 255],
  //     ["interpolate", ["linear"], ["band", 3], 0, 0, 0.5, 255],
  //   ],
  // },
];

// Step 4: Assign layers, center, and zoom to the map element. Uncomment:
// const map = document.querySelector("#my-map");
// Object.assign(map, {
//   center: [14.09, 41.1], // Napoli area
//   zoom: 10,
//   layers,
// });
