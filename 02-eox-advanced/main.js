// ----------------------------------------------------------------------------
// PART A — Band manipulation (provided: uncomment, run, and explore)
// ----------------------------------------------------------------------------
// Step 1: Uncomment the imports, then uncomment the layout in index.html.
// import "@eox/layout";
// import "@eox/map";
// import "@eox/map/src/plugins/advancedLayersAndSources";
// import "@eox/layercontrol";
// import "@eox/jsonform"; // renders the config form -> "config" tool

// A Sentinel-2 scene over the Czech Republic (south Bohemia).
// Part B reads multiple groups, so this is the store ROOT.
const storeUrl =
  "https://s3.explorer.eopf.copernicus.eu/esa-zarr-sentinel-explorer-fra/tests-output/sentinel-2-l2a/S2C_MSIL2A_20260606T100551_N0512_R022_T33UVQ_20260606T152612.zarr";

// Step 2: Uncomment the schema building blocks and the layers.
//
// The GeoZarr layer's `layerConfig` embeds a JSON Schema in the layer
// properties; eox-layercontrol renders it as a form (the "config" tool) whose
// fields write into the style `variables`, referenced in the style with
// ["var", "..."].

// Schema building blocks, shared by the channel dropdowns and the sliders.
// const channelOptions = {
//   enum: [1, 2, 3, 4],
//   options: {
//     enum_titles: ["Red (B04)", "Green (B03)", "Blue (B02)", "SWIR (B11)"],
//   },
// };

// const rangeOption = {
//   type: "number",
//   minimum: 0.1,
//   maximum: 1,
//   default: 0.5,
//   step: 0.1,
//   format: "range",
// };

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
  // {
  //   type: "WebGLTile",
  //   properties: {
  //     id: "s2-layer",
  //     title: "Sentinel-2 GeoZarr",
  //     layerControlExpand: true,
  //     layerControlToolsExpand: true,
  //     layerConfig: {
  //       type: "style", // form changes update the style `variables`
  //       schema: {
  //         type: "object",
  //         title: "Visualization Settings",
  //         properties: {
  //           red: {
  //             title: "Red Channel",
  //             type: "number",
  //             default: 1,
  //             ...channelOptions,
  //           },
  //           green: {
  //             title: "Green Channel",
  //             type: "number",
  //             default: 2,
  //             ...channelOptions,
  //           },
  //           blue: {
  //             title: "Blue Channel",
  //             type: "number",
  //             default: 3,
  //             ...channelOptions,
  //           },
  //           redMax: { title: "Red Max", ...rangeOption },
  //           greenMax: { title: "Green Max", ...rangeOption },
  //           blueMax: { title: "Blue Max", ...rangeOption },
  //           gamma: {
  //             title: "Gamma Correction",
  //             type: "number",
  //             minimum: 0.5,
  //             maximum: 3.0,
  //             default: 1.5,
  //             step: 0.1,
  //             format: "range",
  //           },
  //         },
  //       },
  //     },
  //   },
  //   source: {
  //     type: "GeoZarr",
  //     // With plain-string bands the URL must point INSIDE one group.
  //     url: `${storeUrl}/measurements/reflectance`,
  //     bands: ["b04", "b03", "b02", "b11"],
  //   },
  //   style: {
  //     variables: {
  //       red: 1,
  //       green: 2,
  //       blue: 3,
  //       redMax: 0.5,
  //       greenMax: 0.5,
  //       blueMax: 0.5,
  //       gamma: 1.5,
  //     },
  //     gamma: ["var", "gamma"],
  //     color: [
  //       "color",
  //       [
  //         "interpolate",
  //         ["linear"],
  //         ["band", ["var", "red"]],
  //         0,
  //         0,
  //         ["var", "redMax"],
  //         255,
  //       ],
  //       [
  //         "interpolate",
  //         ["linear"],
  //         ["band", ["var", "green"]],
  //         0,
  //         0,
  //         ["var", "greenMax"],
  //         255,
  //       ],
  //       [
  //         "interpolate",
  //         ["linear"],
  //         ["band", ["var", "blue"]],
  //         0,
  //         0,
  //         ["var", "blueMax"],
  //         255,
  //       ],
  //     ],
  //   },
  // },
];

// Step 3: Assign layers, center, and zoom to the map. Uncomment:
// const map = document.querySelector("#my-map");
// Object.assign(map, {
//   center: [14.52, 49.08],
//   zoom: 8,
//   layers,
// });
//   Then open the layer's config tool and try a false-color SWIR composite:
//   Red -> SWIR (B11), Green -> Red (B04), Blue -> Green (B03).

// ----------------------------------------------------------------------------
// PART B — your task: mask clouds using a band from a different group
// ----------------------------------------------------------------------------
// A single GeoZarr store holds many groups. So far we've only read from
// `measurements/reflectance`. Now pull in the cloud-probability band (cld,
// in %) from the `quality/probability` group and use it to mask out clouds.
//
// Step 4: Point the source `url` at the store ROOT (`storeUrl`), then switch
//   `bands` to the object form so each band names its own group:
//     bands: [
//       { name: "b04", group: "measurements/reflectance" },
//       { name: "b03", group: "measurements/reflectance" },
//       { name: "b02", group: "measurements/reflectance" },
//       { name: "b11", group: "measurements/reflectance" },
//       { name: "cld", group: "quality/probability" }, // cloud probability %, band 5
//     ]
//
// Step 5: Add a `cloudThreshold` control: a number/range schema property
//   (minimum 0, maximum 100, default 100, step 5) plus a matching style
//   variable `cloudThreshold: 100`.
//
// Step 6: Append an alpha channel to the style's `color` array so pixels above
//   the threshold turn transparent:
//     ["case", [">", ["band", 5], ["var", "cloudThreshold"]], 0, 1],
