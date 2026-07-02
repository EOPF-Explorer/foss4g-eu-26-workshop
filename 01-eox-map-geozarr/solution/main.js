import "@eox/layout";
import "@eox/map";
import "@eox/map/src/plugins/advancedLayersAndSources";
import "@eox/layercontrol";
import { fetchGeoZarrUrl } from "../../shared/utils.js";

// Sentinel-2 scene over Napoli (bbox around the map centre).
const zarrUrl = await fetchGeoZarrUrl([14.0, 41.0, 14.2, 41.2]);

// True color: gamma 1.5, each RGB band interpolated 0-0.5 -> 0-255.
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

/** @type {import("@eox/map").EoxLayer[]} */
const layers = [
  {
    type: "Tile",
    properties: { id: "osm", title: "OpenStreetMap" },
    source: {
      type: "XYZ",
      url: "https://tiles.maps.eox.at/wmts/1.0.0/osm_3857/default/g/{z}/{y}/{x}.jpg",
    },
  },
  {
    type: "WebGLTile",
    properties: { id: "geozarr", title: "Sentinel-2 GeoZarr" },
    source: {
      type: "GeoZarr",
      url: zarrUrl,
      // b08 (NIR, band 4) is unused by the true-color style but needed for NDVI.
      bands: ["b04", "b03", "b02", "b08"],
      crossOrigin: "anonymous",
    },
    style: trueColorStyle,
  },
];

const map = document.querySelector("#my-map");
Object.assign(map, {
  center: [14.09, 41.1],
  zoom: 10,
  layers,
});

// eox-map diffs layer definitions on assignment and restyles the existing layer
// in place. The definition object must be replaced (not mutated): the map holds
// a reference to it, so a mutation would compare the object against itself.
/** @param {import("ol/layer/WebGLTile").Style} style */
function updateStyle(style) {
  const layers = [...map.layers];
  const geozarrLayer = layers[1];
  layers[1] = { ...geozarrLayer, style };
  map.layers = layers;
}

let ndviShown = false;
document.querySelector("#ndvi-button").addEventListener("click", (e) => {
  ndviShown = !ndviShown;
  updateStyle(ndviShown ? ndviStyle : trueColorStyle);
  e.target.textContent = ndviShown ? "Show true color" : "Show NDVI";
});
