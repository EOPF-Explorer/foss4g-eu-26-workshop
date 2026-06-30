import "@eox/layout";
import "@eox/map";
import "@eox/map/src/plugins/advancedLayersAndSources";
import "@eox/layercontrol";
import "@eox/jsonform";

// Store Root URL — Sentinel-2 over the Czech Republic (south Bohemia)
const storeUrl =
  "https://s3.explorer.eopf.copernicus.eu/esa-zarr-sentinel-explorer-fra/tests-output/sentinel-2-l2a/S2C_MSIL2A_20260606T100551_N0512_R022_T33UVQ_20260606T152612.zarr";

const channelOptions = {
  enum: [1, 2, 3, 4],
  options: {
    enum_titles: ["Red (B04)", "Green (B03)", "Blue (B02)", "SWIR (B11)"],
  },
};

const rangeOption = {
  type: "number",
  minimum: 0.1,
  maximum: 1,
  default: 0.5,
  step: 0.1,
  format: "range",
};

/** @type {import("@eox/map").EoxLayer[]} */
const layers = [
  {
    type: "Tile",
    properties: { id: "basemap", title: "OpenStreetMap" },
    source: {
      type: "XYZ",
      url: "https://tiles.maps.eox.at/wmts/1.0.0/osm_3857/default/g/{z}/{y}/{x}.jpg",
    },
  },
  {
    type: "WebGLTile",
    properties: {
      id: "s2-layer",
      title: "Sentinel-2 GeoZarr",
      layerControlExpand: true,
      layerControlToolsExpand: true,
      layerConfig: {
        type: "style",
        schema: {
          type: "object",
          title: "Visualization Settings",
          properties: {
            red: {
              title: "Red Channel",
              type: "number",
              default: 1,
              ...channelOptions,
            },
            green: {
              title: "Green Channel",
              type: "number",
              default: 2,
              ...channelOptions,
            },
            blue: {
              title: "Blue Channel",
              type: "number",
              default: 3,
              ...channelOptions,
            },
            redMax: { title: "Red Max", ...rangeOption },
            greenMax: { title: "Green Max", ...rangeOption },
            blueMax: { title: "Blue Max", ...rangeOption },
            gamma: {
              title: "Gamma Correction",
              type: "number",
              minimum: 0.5,
              maximum: 3.0,
              default: 1.5,
              step: 0.1,
              format: "range",
            },
            cloudThreshold: {
              title: "Cloud mask",
              type: "number",
              minimum: 0,
              maximum: 100,
              default: 100,
              step: 5,
              format: "range",
            },
          },
        },
      },
    },
    source: {
      type: "GeoZarr",
      url: storeUrl,
      // Multi-group: the RGB + SWIR bands come from measurements/reflectance, while
      // the cloud-probability band (cld, in %) comes from a different group in the
      // same store.
      bands: [
        { name: "b04", group: "measurements/reflectance" },
        { name: "b03", group: "measurements/reflectance" },
        { name: "b02", group: "measurements/reflectance" },
        { name: "b11", group: "measurements/reflectance" },
        { name: "cld", group: "quality/probability" },
      ],
    },
    style: {
      variables: {
        red: 1,
        green: 2,
        blue: 3,
        redMax: 0.5,
        greenMax: 0.5,
        blueMax: 0.5,
        gamma: 1.5,
        cloudThreshold: 100,
      },
      gamma: ["var", "gamma"],
      color: [
        "color",
        [
          "interpolate",
          ["linear"],
          ["band", ["var", "red"]],
          0,
          0,
          ["var", "redMax"],
          255,
        ],
        [
          "interpolate",
          ["linear"],
          ["band", ["var", "green"]],
          0,
          0,
          ["var", "greenMax"],
          255,
        ],
        [
          "interpolate",
          ["linear"],
          ["band", ["var", "blue"]],
          0,
          0,
          ["var", "blueMax"],
          255,
        ],
        // cloud mask: alpha 0 where cloud probability (band 5) exceeds the threshold
        ["case", [">", ["band", 5], ["var", "cloudThreshold"]], 0, 1],
      ],
    },
  },
];

const map = document.querySelector("#my-map");
Object.assign(map, {
  center: [14.52, 49.08],
  zoom: 8,
  layers,
});
