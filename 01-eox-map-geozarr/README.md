# 01: Basic Map with GeoZarr

In this exercise you'll create a map that loads Sentinel-2 data directly from a GeoZarr store on S3, with no tile server. You'll use `eox-layout` for positioning, `eox-map` for rendering, and `eox-layercontrol` for layer management.

## Result

Target result:

![Exercise 01 result](../assets/screenshots/01.png)

## Import packages

[main.js](./main.js) imports the required packages:

- `@eox/layout` — grid layout system
- `@eox/map` — map component
- `@eox/map/src/plugins/advancedLayersAndSources` — adds the `GeoZarr` source type
- `@eox/layercontrol` — layer management panel

These are bare specifiers resolved by Vite from `node_modules`. CDN equivalents via unpkg (works with any static server):

- `https://unpkg.com/@eox/layout/dist/eox-layout.js`
- `https://unpkg.com/@eox/map/dist/eox-map.js`
- `https://unpkg.com/@eox/map/dist/eox-map-advanced-layers-and-sources.js`
- `https://unpkg.com/@eox/layercontrol/dist/eox-layercontrol.js`


## Add HTML

In [index.html](./index.html), uncomment the provided layout - two panels on an `eox-layout` (12-column grid):

- **Left panel** (3 columns): `eox-layercontrol`
- **Right panel** (9 columns): `eox-map`

Link the layer control to the map using the `for` attribute with the pattern `for="eox-map#<map-id>"`.

Hint: use `eox-layout-item` with `x`, `y`, `w`, `h` attributes to position items in the grid.


## Configure the map layers

In [main.js](./main.js), uncomment the two provided layers:

### Base Layer

An OpenStreetMap base layer using `XYZ` source type. The EOX tile server URL follows the pattern:
```
https://tiles.maps.eox.at/wmts/1.0.0/osm_3857/default/g/{z}/{y}/{x}.jpg
```

### Data Layer — GeoZarr

A `WebGLTile` layer with a `GeoZarr` source. Get the scene URL from
`fetchGeoZarrUrl` in `../shared/utils.js`, which returns a recent low-cloud
Sentinel-2 product for a bounding box:

```js
import { fetchGeoZarrUrl } from "../shared/utils.js";
const zarrUrl = await fetchGeoZarrUrl([14.0, 41.0, 14.2, 41.2]); // around Napoli
```

It renders true-color RGB from bands `["b04", "b03", "b02", "b08"]` — the fourth
band, `b08` (NIR), is ignored by the true-color style but is needed for the NDVI style later.

The provided style:
- Sets `gamma: 1.5` for brightness correction
- Uses `["interpolate", ["linear"], ["band", n], 0, 0, 0.5, 255]` to scale each band's reflectance (0-0.5) to display values (0-255)

### Key concepts

| Property | Description |
|----------|-------------|
| `type: "GeoZarr"` | Source type for loading Zarr data directly from S3 |
| `bands` | Array of band identifiers to load (e.g., `["b04", "b03", "b02"]`) |
| `["band", n]` | Access a band by 1-based index in style expressions |
| `gamma` | Brightness correction value |

## Assign to the map

Use `Object.assign` on the map element to set `layers`, `center` ([14.09, 41.1] for the Napoli area), and `zoom` (10).

## Toggle the layer between true color and NDVI

The map is not locked to one visualization: a layer's `style` can be swapped at
runtime. You'll restyle the **same** GeoZarr layer with the provided
`#ndvi-button` (uncomment it in [index.html](./index.html)), toggling between
true color and NDVI.

NDVI (Normalized Difference Vegetation Index) highlights vegetation:

```
NDVI = (NIR - Red) / (NIR + Red)
```

With the source's `bands: ["b04", "b03", "b02", "b08"]`, Red is band `1` and NIR
is band `4`. Both styles are provided as variables in main.js: `trueColorStyle`
and `ndviStyle` — the latter computes the ratio in a WebGL expression and maps
it through a grey → yellow → green color ramp. The button listener that flips
between them is provided too; your task is the `updateStyle(style)` function:

1. Copy the current definitions: `const layers = [...map.layers]`
2. **Replace** the GeoZarr definition with a copy carrying the new style:
   `layers[1] = { ...layers[1], style }`
3. Reassign `map.layers = layers`

eox-map diffs the layer definitions on assignment and restyles the existing
layer in place — no reload, the source and loaded tiles stay untouched.


## Compare

Compare with the [solution folder](./solution/).

Next, try out [section 02](../02-eox-advanced/README.md).

## Further reading

- [EOxElements Storybook](https://eox-a.github.io/EOxElements/) — full component API reference, properties, and examples
- [OpenLayers Flatstyle Expressions](https://openlayers.org/en/latest/apidoc/module-ol_expr_expression.html)