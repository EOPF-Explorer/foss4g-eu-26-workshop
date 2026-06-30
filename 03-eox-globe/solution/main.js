import "@eox/map";
import "@eox/map/src/plugins/globe";
// The GeoZarr source type comes from the advanced layers/sources plugin.
import "@eox/map/src/plugins/advancedLayersAndSources";
import { LonLat } from "@openglobus/og";
import { fetchGeoZarrUrl } from "../../shared/utils.js";

// One Sentinel-2 scene per fly-to location, so there's imagery to land on.
// The coordinates match the toolbar buttons in index.html.
const locations = [
  {
    id: "milano-cortina",
    title: "Milano Cortina",
    bbox: [12.0, 46.45, 12.25, 46.65],
  },
  { id: "brussels", title: "Brussels", bbox: [4.25, 50.75, 4.45, 50.95] },
  { id: "lisbon", title: "Lisbon", bbox: [-9.25, 38.65, -9.05, 38.85] },
  { id: "iceland", title: "Iceland", bbox: [-20.25, 63.45, -20.0, 63.65] },
];

const sceneUrls = await Promise.all(
  locations.map((l) => fetchGeoZarrUrl(l.bbox)),
);

// Shared true-color RGB style for every GeoZarr layer.
const style = {
  gamma: 1.5,
  color: [
    "color",
    ["interpolate", ["linear"], ["band", 1], 0, 0, 0.5, 255],
    ["interpolate", ["linear"], ["band", 2], 0, 0, 0.5, 255],
    ["interpolate", ["linear"], ["band", 3], 0, 0, 0.5, 255],
  ],
};

/** @type {import("@eox/map").EoxLayer[]} */
const layers = [
  {
    type: "Tile",
    properties: { id: "basemap", title: "OpenStreetMap" },
    source: {
      type: "XYZ",
      url: "https://tiles.maps.eox.at/wmts/1.0.0/osm_3857/default/g/{z}/{y}/{x}.jpg",
      crossOrigin: "anonymous",
    },
  },
  ...locations.map((l, i) => ({
    type: "WebGLTile",
    properties: { id: l.id, title: `Sentinel-2 — ${l.title}` },
    source: {
      type: "GeoZarr",
      url: sceneUrls[i],
      bands: ["b04", "b03", "b02"],
    },
    style,
  })),
];

const map = document.querySelector("#globe");

// Start in 2D; the toggle button below switches to the 3D globe.
Object.assign(map, {
  layers,
  center: [12.12, 46.54],
  zoom: 7,
  globeConfig: {
    terrain: true,
  },
});

const toggle = document.querySelector("#toggle");
toggle.addEventListener("click", () => {
  const is2D = map.projection !== "globe";
  map.projection = is2D ? "globe" : "EPSG:3857";
  toggle.textContent = is2D ? "Switch to 2D" : "Switch to 3D";
});

document.querySelectorAll(".fly").forEach((btn) => {
  btn.addEventListener("click", () => {
    const lon = Number(btn.dataset.lon);
    const lat = Number(btn.dataset.lat);
    if (map.projection !== "globe") {
      map.center = [lon, lat];
      map.zoom = 8;
      return;
    }
    const planet = map.globe?.planet;
    if (!planet) return;
    planet.flyLonLat(
      new LonLat(lon, lat, 200000),
      new LonLat(lon, lat, 0),
      4000,
    );
  });
});
