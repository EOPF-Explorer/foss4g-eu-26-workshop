// Exercise 08: read a GeoZarr store directly with zarrita.js and paint a band
// composite to the canvas. The canvas rendering is provided — your task is the
// zarrita portion: open the store, locate the reflectance bands, and read them.

import { fetchGeoZarrUrl } from "../shared/utils.js";

// The store root of a recent, clear Sentinel-2 scene. fetchGeoZarrUrl returns the
// reflectance group URL, so the suffix is stripped to get the store root.
const STORE_URL = (await fetchGeoZarrUrl([14.0, 41.0, 14.2, 41.2])).replace(
  /\/measurements\/reflectance$/,
  "",
);

// ---- Provided: canvas rendering (no zarrita knowledge needed) ----

/**
 * Paint a true-colour RGB composite to the #viz canvas.
 * Each band is the result of a zarr.get call: { data: Float32Array, shape: [height, width] }.
 * Sentinel-2 surface reflectance values are typically below 0.3; dividing by 0.3
 * maps the usable range to 0-255.
 * @param {{ data: Float32Array, shape: number[] }} red   - band b04
 * @param {{ data: Float32Array, shape: number[] }} green - band b03
 * @param {{ data: Float32Array, shape: number[] }} blue  - band b02
 */
function paintComposite(red, green, blue) {
  const [height, width] = red.shape;
  const canvas = /** @type {HTMLCanvasElement} */ (
    document.querySelector("#viz")
  );
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  const image = ctx.createImageData(width, height);
  const toByte = (v) => Math.max(0, Math.min(255, (v / 0.3) * 255));
  for (let i = 0; i < width * height; i++) {
    image.data[i * 4 + 0] = toByte(red.data[i]);
    image.data[i * 4 + 1] = toByte(green.data[i]);
    image.data[i * 4 + 2] = toByte(blue.data[i]);
    image.data[i * 4 + 3] = 255;
  }
  ctx.putImageData(image, 0, 0);
}

/**
 * Write lines of text into the #meta panel.
 * @param {string[]} lines
 */
function showMeta(lines) {
  document.querySelector("#meta").textContent = lines.join("\n");
}

// ---- Your turn: read the GeoZarr with zarrita ----

// Step 1: Import zarrita at the very top of this file:
//   import * as zarr from "zarrita";

// Step 2: A .zarr store is a tree of groups and arrays accessed over HTTP — the
// same mechanism eox-map uses internally. Open it with a FetchStore:
//   const store = new zarr.FetchStore(STORE_URL);

// Step 3: Open the root group, then resolve into the measurements/reflectance group:
//   const rootGroup   = await zarr.open(store, { kind: "group" });
//   const reflectance = await zarr.open(rootGroup.resolve("measurements/reflectance"), { kind: "group" });
//   reflectance.attrs.multiscales lists the resolution levels (r10m ... r720m).

// Step 4: Read a band at the 60 m overview (a single, small chunk). Define a helper
// that resolves the array and fetches it with zarr.get:
//   async function readBand(name) {
//     const array = await zarr.open(reflectance.resolve(`r60m/${name}`), { kind: "array" });
//     const chunk = await zarr.get(array);   // { data, shape, stride }
//     return { array, data: chunk.data, shape: chunk.shape };
//   }
//   Read b04 (red), b03 (green), b02 (blue).

// Step 5: Pass the three bands to the renderer:
//   paintComposite(red, green, blue);

// Step 6 (optional): display GeoZarr metadata with showMeta([...]) — for example,
//   the resolution levels and a band's array.shape / array.dtype / array.chunks.
