const STAC_ENDPOINT = "https://api.explorer.eopf.copernicus.eu/stac";
const COLLECTION = "sentinel-2-l2a";
const MAX_CLOUD_COVER = 30;
const ASSET_TYPE = "application/vnd.zarr; version=3; profile=multiscales";
// Pinned fallback scene (T33TVF) used when the STAC lookup fails.
const FALLBACK_URL =
  "https://s3.explorer.eopf.copernicus.eu/esa-zarr-sentinel-explorer-fra/tests-output/sentinel-2-l2a/S2B_MSIL2A_20260608T100029_N0512_R122_T33TVF_20260608T135005.zarr/measurements/reflectance";

/**
 * Fetch the URL of a recent, low-cloud Sentinel-2 L2A GeoZarr scene from the EOPF
 * STAC API. Returns the `measurements/reflectance` group URL of the newest item with
 * cloud cover below 30%. On lookup failure, logs a warning and returns a pinned fallback
 * URL instead of throwing, so exercises load regardless.
 * @param {[number, number, number, number]} [bbox] - Bounding box as [west, south, east, north] in degrees; omit to search globally.
 * @returns {Promise<string>} URL of the reflectance group.
 */
export async function fetchGeoZarrUrl(bbox) {
  const params = new URLSearchParams({
    "filter-lang": "cql2-text",
    filter: `eo:cloud_cover < ${MAX_CLOUD_COVER}`,
    sortby: "-datetime",
    limit: "1",
  });
  if (bbox) params.set("bbox", bbox.join(","));

  try {
    const res = await fetch(
      `${STAC_ENDPOINT}/collections/${COLLECTION}/items?${params}`,
    );
    if (!res.ok) throw new Error(`STAC request failed: ${res.status}`);

    const { features = [] } = await res.json();
    const url = features[0]
      ? Object.values(features[0].assets).find((a) => a.type === ASSET_TYPE)
          ?.href
      : undefined;
    if (!url) throw new Error("no matching scene in the STAC response");

    return url;
  } catch (err) {
    console.warn(
      `fetchGeoZarrUrl: ${err.message}. Falling back to ${FALLBACK_URL}`,
    );
    return FALLBACK_URL;
  }
}
