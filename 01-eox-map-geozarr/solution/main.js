import "@eox/layout";
import "@eox/map";
import "@eox/map/src/plugins/advancedLayersAndSources";
import "@eox/layercontrol";
import { fetchGeoZarrUrl } from "../../shared/utils.js";

// Sentinel-2 scene over Napoli (bbox around the map centre).
const zarrUrl = await fetchGeoZarrUrl([14.0, 41.0, 14.2, 41.2]);

/** @type {import("@eox/map").EoxLayer[]} */
const layers = [
  {
    type: "Group",
    properties: { id: "base", title: "Base Layers" },
    layers: [
      {
        type: "Tile",
        properties: { id: "osm", title: "OpenStreetMap" },
        source: {
          type: "XYZ",
          url: "https://tiles.maps.eox.at/wmts/1.0.0/osm_3857/default/g/{z}/{y}/{x}.jpg",
        },
      },
    ],
  },
  {
    type: "Group",
    properties: { id: "data", title: "Data", layerControlExpand: true },
    layers: [
      {
        type: "WebGLTile",
        properties: { id: "geozarr", title: "Sentinel-2 GeoZarr" },
        source: {
          type: "GeoZarr",
          url: zarrUrl,
          bands: ["b04", "b03", "b02"],
        },
        style: {
          gamma: 1.5,
          color: [
            "color",
            ["interpolate", ["linear"], ["band", 1], 0, 0, 0.5, 255],
            ["interpolate", ["linear"], ["band", 2], 0, 0, 0.5, 255],
            ["interpolate", ["linear"], ["band", 3], 0, 0, 0.5, 255],
          ],
        },
      },
    ],
  },
];

const map = document.querySelector("#my-map");
Object.assign(map, {
  center: [14.09, 41.1],
  zoom: 10,
  layers,
});
