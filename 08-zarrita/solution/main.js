import * as zarr from "zarrita";
import { fetchGeoZarrUrl } from "../../shared/utils.js";

// The store root. A .zarr is a tree of groups and arrays accessed over HTTP;
// zarrita reads it via a FetchStore — the same mechanism eox-map uses internally.
// fetchGeoZarrUrl returns the reflectance group URL, so the suffix is stripped.
const root = (await fetchGeoZarrUrl([14.0, 41.0, 14.2, 41.2])).replace(
  /\/measurements\/reflectance$/,
  "",
);

const store = new zarr.FetchStore(root);

// Open the reflectance group. Its multiscales attribute lists the resolution
// levels (r10m, r20m, r60m, …).
const rootGroup = await zarr.open(store, { kind: "group" });
const reflectance = await zarr.open(
  rootGroup.resolve("measurements/reflectance"),
  { kind: "group" },
);

/**
 * Open a band at the 60 m overview and read the full array as a single chunk
 * (~13 MB — small enough to fetch in the browser).
 * @param {string} name
 * @returns {Promise<{ array: object, data: Float32Array, shape: number[] }>}
 */
async function readBand(name) {
  const array = await zarr.open(reflectance.resolve(`r60m/${name}`), {
    kind: "array",
  });
  const chunk = await zarr.get(array); // { data: Float32Array, shape, stride }
  return { array, data: chunk.data, shape: chunk.shape };
}

const red = await readBand("b04");
const green = await readBand("b03");
const blue = await readBand("b02");

// Display store metadata: resolution levels and per-band array properties.
const levels = reflectance.attrs.multiscales?.layout?.map((l) => l.asset) ?? [];
const meta = document.querySelector("#meta");
meta.textContent = [
  `resolution levels: ${levels.join(", ")}`,
  `b04 @ r60m: shape ${JSON.stringify(red.array.shape)}, dtype ${red.array.dtype}, chunks ${JSON.stringify(red.array.chunks)}`,
].join("\n");

// Paint a true-colour composite. Sentinel-2 surface reflectance values are typically
// below 0.3, so dividing by 0.3 maps the usable range to 0-255.
const [height, width] = red.shape;
const canvas = document.querySelector("#viz");
canvas.width = width;
canvas.height = height;
const ctx = canvas.getContext("2d");
const image = ctx.createImageData(width, height);
const max = 0.3;
const toByte = (v) => Math.max(0, Math.min(255, (v / max) * 255));

for (let i = 0; i < width * height; i++) {
  image.data[i * 4 + 0] = toByte(red.data[i]);
  image.data[i * 4 + 1] = toByte(green.data[i]);
  image.data[i * 4 + 2] = toByte(blue.data[i]);
  image.data[i * 4 + 3] = 255;
}
ctx.putImageData(image, 0, 0);
