// Step 1: Import the packages — these only register the web components; the story
// content itself lives in a Markdown file (see step 3).
// - @eox/storytelling
// - @eox/map
// - @eox/map/src/plugins/advancedLayersAndSources   (for the GeoZarr source)

// Step 2: In index.html, point <eox-storytelling> at a Markdown file with the
//   `markdown-url` attribute
//     <eox-storytelling markdown-url="/05-eox-storytelling/public/story.md" show-nav>

// Step 3: Finish the story in /05-eox-storytelling/public/story.md — it already has
//   the True Color step as a worked example and a gap to fill in (the SWIR step).
//   The storytelling component reads HTML comments `<!--{ ... }-->` to turn headings
//   into interactive maps; follow the TODO in the file.

// GeoZarr URL (Napoli):
// https://s3.explorer.eopf.copernicus.eu/esa-zarr-sentinel-explorer-fra/tests-output/sentinel-2-l2a-staging/S2A_MSIL2A_20251227T100441_N0511_R122_T33TVF_20251227T121715.zarr/measurements/reflectance
