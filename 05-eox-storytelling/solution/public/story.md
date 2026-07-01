# Sentinel-2 Band Comparison

This story uses a single Sentinel-2 GeoZarr scene over Napoli to compare
how different band combinations expose distinct surface properties.

Scroll down to move between the views.

## Band Combinations <!--{ as="eox-map" mode="tour" projection="EPSG:3857" }-->

### <!--{ layers='[{"type":"Tile","properties":{"id":"osm","title":"OpenStreetMap"},"source":{"type":"XYZ","url":"https://tiles.maps.eox.at/wmts/1.0.0/osm_3857/default/g/{z}/{y}/{x}.jpg"}},{"type":"WebGLTile","properties":{"id":"sentinel-layer","title":"Sentinel-2 GeoZarr"},"source":{"type":"GeoZarr","url":"https://s3.explorer.eopf.copernicus.eu/esa-zarr-sentinel-explorer-fra/tests-output/sentinel-2-l2a-staging/S2A_MSIL2A_20251227T100441_N0511_R122_T33TVF_20251227T121715.zarr/measurements/reflectance","bands":["b04","b03","b02"]},"style":{"gamma":1.5,"color":["color",["interpolate",["linear"],["band",1],0,0,0.5,255],["interpolate",["linear"],["band",2],0,0,0.5,255],["interpolate",["linear"],["band",3],0,0,0.5,255]]}}]' center="[14.24, 40.83]" zoom="12" }-->

#### True Color (RGB)
**Bands: Red (B04), Green (B03), Blue (B02)**
A natural-color composite — the area roughly as the human eye would see it.
Useful for general interpretation of land cover, water, and clouds.

### <!--{ layers='[{"type":"Tile","properties":{"id":"osm","title":"OpenStreetMap"},"source":{"type":"XYZ","url":"https://tiles.maps.eox.at/wmts/1.0.0/osm_3857/default/g/{z}/{y}/{x}.jpg"}},{"type":"WebGLTile","properties":{"id":"sentinel-layer","title":"Sentinel-2 GeoZarr"},"source":{"type":"GeoZarr","url":"https://s3.explorer.eopf.copernicus.eu/esa-zarr-sentinel-explorer-fra/tests-output/sentinel-2-l2a-staging/S2A_MSIL2A_20251227T100441_N0511_R122_T33TVF_20251227T121715.zarr/measurements/reflectance","bands":["b12","b8a","b04"]},"style":{"gamma":1.5,"color":["color",["interpolate",["linear"],["band",1],0,0,0.5,255],["interpolate",["linear"],["band",2],0,0,0.5,255],["interpolate",["linear"],["band",3],0,0,0.5,255]]}}]' center="[14.24, 40.83]" zoom="12" }-->

#### Short-Wave Infrared (SWIR)
**Bands: SWIR2 (B12), NIR (B8A), Red (B04)**
With NIR on the green channel, healthy vegetation glows bright green, while water
is near-black and bare soil and built-up areas appear in browns, magentas, and
greys. Short-wave infrared also cuts through haze and highlights moisture.
