// Step 1: Import the packages.
// - @eox/map
// - @eox/map/src/plugins/globe   (adds the 3D globe projection)
// - @eox/map/src/plugins/advancedLayersAndSources   (adds the GeoZarr source)

import { LonLat } from "@openglobus/og"; //  needed for the fly-to feature

// Step 2: We want imagery to land on at every fly-to location, so build one
// Sentinel-2 GeoZarr layer per location. These coordinates match the toolbar
// buttons in index.html.
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

// Fetch a scene URL for each location with fetchGeoZarrUrl(bbox) from
// ../shared/utils.js, e.g.:
//   const sceneUrls = await Promise.all(locations.map((l) => fetchGeoZarrUrl(l.bbox)));

// Build the layers: uncomment the OSM base below (crossOrigin lets the globe read
// tile pixels), then add one WebGLTile GeoZarr layer per location (bands
// ["b04","b03","b02"], same true-color style as before. EOxMap uses a hybrid
// renderer: OpenGlobus falls back to OpenLayers canvas rendering for the GeoZarr
// layers and reprojects the result onto the globe.
/** @type {import("@eox/map").EoxLayer[]} */
const layers = [
  // {
  //   type: "Tile",
  //   properties: { id: "osm", title: "OpenStreetMap" },
  //   source: {
  //     type: "XYZ",
  //     url: "https://tiles.maps.eox.at/wmts/1.0.0/osm_3857/default/g/{z}/{y}/{x}.jpg",
  //     crossOrigin: "anonymous",
  //   },
  // },
  // Add one GeoZarr WebGLTile layer per location here (map over `locations`).
];

// --- Element handles ---
// Selects the map and toolbar buttons declared in index.html.
// `map` is null until the <eox-map id="globe"> element is uncommented.
const map = document.querySelector("#globe");
const toggleButton = document.querySelector("#toggle");
const flyButtons = document.querySelectorAll(".fly");

// Step 3: Configure `map`:
// - assign the layers
// - set center [12.12, 46.54] and zoom 7 to frame the first scene (Milano Cortina)
// The map starts in 2D (projection="EPSG:3857" in the HTML); the toggle button
// switches it to the 3D globe.

// Step 4: Wire `toggleButton`  On click, flip map.projection
//   between "EPSG:3857" and "globe", enable terrain when entering the globe
//   (map.globeConfig.terrain = true), and update the button label.

// Fly to a location when a toolbar button is clicked. On the globe, the camera
// animates with flyLonLat; in 2D we can simply recenter the map.
flyButtons.forEach((btn) => {
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
