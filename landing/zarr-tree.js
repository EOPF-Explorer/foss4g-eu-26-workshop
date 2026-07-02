// Landing-page GeoZarr explorer.
//
// Reads a Sentinel-2 store's consolidated metadata via zarrita, renders the group/array
// tree, and lazily opens each node on click to inspect its shape, type, and attributes.
import * as zarr from "zarrita";
import { fetchGeoZarrUrl } from "../shared/utils";

// Fallback store if the STAC lookup isn't implemented / fails (staging items rotate).
const FALLBACK_ROOT =
  "https://s3.explorer.eopf.copernicus.eu/esa-zarr-sentinel-explorer-fra/tests-output/sentinel-2-l2a/S2B_MSIL2A_20260618T100029_N0512_R122_T37WDU_20260618T135307.zarr";

const esc = (s) =>
  String(s).replace(
    /[&<>"]/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c],
  );

/**
 * Resolve the GeoZarr store root and a short id for the current Sentinel-2 product.
 * Falls back to a pinned store if the lookup fails, so the page always works.
 * @returns {Promise<{ root: string, id: string }>}
 */
async function resolveStoreRoot() {
  try {
    const root = (await fetchGeoZarrUrl()).split("/measurements/")[0];
    const id = root
      .split("/")
      .at(-1)
      .replace(/\.zarr$/, "");
    if (root && id) return { root, id };
  } catch (err) {
    console.warn("GeoZarr lookup failed; using pinned fallback store", err);
  }
  return {
    root: FALLBACK_ROOT,
    id: FALLBACK_ROOT.split("/").pop().split(".")[0],
  };
}

/**
 * Build the nested tree from zarrita's consolidated `contents()` listing. Each entry is
 * `{ path, kind }` with an absolute path; we strip the leading "/" and nest by segment.
 * Intermediates default to groups; the final segment carries the entry's real kind.
 * @param {{ path: string, kind: string }[]} contents
 * @returns {{ root: object, byPath: Map<string, object> }}
 */
function buildTree(contents) {
  const root = {
    name: "",
    path: "",
    type: "group",
    meta: {},
    children: new Map(),
  };
  const byPath = new Map([["", root]]);
  for (const { path, kind } of contents) {
    if (path === "/") continue;
    const segments = path.slice(1).split("/");
    let current = root;
    let acc = "";

    segments.forEach((name, i) => {
      acc = acc ? `${acc}/${name}` : name;
      if (!current.children.has(name)) {
        const child = {
          name,
          path: acc,
          type: "group",
          meta: {},
          children: new Map(),
        };
        current.children.set(name, child);
        byPath.set(acc, child);
      }
      current = current.children.get(name);
      if (i === segments.length - 1) current.type = kind;
    });
  }
  return { root, byPath };
}

// ======================= RENDERING (provided) =======================

/**
 * Groups first, then arrays; each alphabetical (numeric-aware).
 * @param {object} node
 * @returns {object[]}
 */
function sortedChildren(node) {
  return [...node.children.values()].sort((a, b) => {
    if (a.type !== b.type) return a.type === "group" ? -1 : 1;
    return a.name.localeCompare(b.name, undefined, { numeric: true });
  });
}

/**
 * @param {object} node
 * @returns {string}
 */
function renderNode(node) {
  const isGroup = node.type === "group";
  const badge = isGroup
    ? `<span class="ze-badge ze-group">${node?.children.size}</span>`
    : `<span class="ze-badge ze-array">${(node.meta.shape ?? []).join("×") || "array"}</span>`;
  const caret = `<span class="ze-caret${isGroup ? "" : " ze-leaf"}" aria-hidden="true"></span>`;
  const children = isGroup
    ? `<ul class="ze-children">${sortedChildren(node).map(renderNode).join("")}</ul>`
    : "";

  return `<li class="ze-node" data-path="${esc(node.path)}">
    <button class="ze-row" type="button">
      ${caret}<span class="ze-name">${esc(node.name)}</span>${badge}
    </button>${children}
  </li>`;
}

/**
 * @param {object} meta
 * @returns {number[]|undefined}
 */
function shardChunk(meta) {
  const sharding = (meta.codecs ?? []).find(
    (c) => c.name === "sharding_indexed",
  );
  return sharding?.configuration?.chunk_shape;
}

/**
 * @param {object} meta
 * @returns {string|null}
 */
function compressorName(meta) {
  const sharding = (meta.codecs ?? []).find(
    (c) => c.name === "sharding_indexed",
  );
  const inner = sharding?.configuration?.codecs ?? meta.codecs ?? [];
  const blosc = inner.find((c) => c.name === "blosc");
  return blosc
    ? `blosc/${blosc.configuration?.cname} (level ${blosc.configuration?.clevel})`
    : null;
}

/**
 * @param {string} label
 * @param {string|number|null|undefined} value
 * @returns {string}
 */
function row(label, value) {
  return value == null || value === ""
    ? ""
    : `<div class="ze-kv"><dt>${esc(label)}</dt><dd>${value}</dd></div>`;
}

/**
 * @param {object} node
 * @returns {string}
 */
function arrayDetail(node) {
  const m = node.meta;
  const eo = m.attributes?._eopf_attrs ?? {};
  const inner = shardChunk(m);
  return [
    row("type", '<span class="ze-tag">array</span>'),
    row("dimensions", (m.dimension_names ?? []).join(", ")),
    row("shape", (m.shape ?? []).join(" &times; ")),
    row("data type", m.data_type),
    row("chunk", m.chunk_grid?.configuration?.chunk_shape?.join(" &times; ")),
    inner ? row("shard inner chunk", inner.join(" &times; ")) : "",
    row("compression", compressorName(m)),
    row("fill value", m.fill_value),
    row("name", m.attributes?.long_name),
    row("units", m.attributes?.units),
    row("grid mapping", m.attributes?.grid_mapping),
    m.attributes?.crs_wkt
      ? row(
          "CRS",
          m.attributes.projected_crs_name ?? m.attributes.geographic_crs_name,
        )
      : "",
    eo.scale_factor != null
      ? row(
          "scaling",
          `value &times; ${eo.scale_factor} + ${eo.add_offset ?? 0}`,
        )
      : "",
    eo.valid_min != null
      ? row("valid range", `${eo.valid_min} - ${eo.valid_max}`)
      : "",
  ].join("");
}
/**
 * Normalize a zarrita node into the raw-metadata shape the detail renderers expect.
 * zarrita supplies shape/dtype/dimensions/attrs; codecs and chunk_grid come from the
 * raw consolidated-map entry, since zarrita's public API does not expose them.
 * @param {import("zarrita").Array<any, any> | import("zarrita").Group<any>} obj
 * @param {Record<string, any>} [raw] Raw consolidated-map entry (for codecs/chunk_grid).
 * @returns {object}
 */
function toMeta(obj, raw) {
  if (obj.kind === "array") {
    return {
      node_type: "array",
      shape: obj.shape,
      data_type: obj.dtype,
      dimension_names: obj.dimensionNames,
      fill_value: obj.fillValue,
      attributes: obj.attrs,
      codecs: raw?.codecs,
      chunk_grid: raw?.chunk_grid,
    };
  }
  return { node_type: "group", attributes: obj.attrs };
}
/**
 * @param {object} node
 * @returns {string}
 */
function groupDetail(node) {
  const a = node.meta.attributes ?? {};
  const ms = a.multiscales;
  const conventions = a.zarr_conventions;
  const groups = [...node.children.values()].filter(
    (c) => c.type === "group",
  ).length;
  const arrays = node.children.size - groups;

  // proj: + spatial: conventions live on a group (root, or a resolution level like r10m).
  const transform = a["spatial:transform"];
  const pixelSize = transform
    ? `${Math.abs(transform[0])} &times; ${Math.abs(transform[4])}`
    : null;
  const bbox = a["spatial:bbox"];

  const levels = ms?.layout
    ? `<div class="ze-kv"><dt>multiscales</dt><dd>${ms.layout
        .map((l) => `${esc(l.asset)} (${(l["spatial:shape"] ?? []).join("×")})`)
        .join("<br>")}</dd></div>`
    : "";

  // Each convention carries its own description + spec link — the explanation is in the data.
  const conv = conventions?.length
    ? `<div class="ze-kv"><dt>conventions</dt><dd>${conventions
        .map((c) => {
          const name = c.spec_url
            ? `<a href="${esc(c.spec_url)}" target="_blank" rel="noopener">${esc(c.name)}</a>`
            : esc(c.name);
          return `${name} &mdash; ${esc(c.description ?? "")}`;
        })
        .join("<br>")}</dd></div>`
    : "";

  return [
    row("type", '<span class="ze-tag">group</span>'),
    row(
      "members",
      `${groups} group${groups === 1 ? "" : "s"}, ${arrays} array${arrays === 1 ? "" : "s"}`,
    ),
    row("CRS", a["proj:code"]),
    row("pixel grid", (a["spatial:shape"] ?? []).join(" &times; ")),
    pixelSize ? row("pixel size", `${pixelSize} (CRS units)`) : "",
    bbox
      ? row("extent", `${bbox[0]}, ${bbox[1]} &rarr; ${bbox[2]}, ${bbox[3]}`)
      : "",
    row("grid mapping", a.grid_mapping),
    levels,
    conv,
  ].join("");
}

/**
 * @param {object} node
 * @returns {string}
 */
function renderDetail(node) {
  if (!node) {
    return `<p class="ze-hint">Select a node to inspect its shape, type, and attributes.</p>`;
  }
  const title = node.path === "" ? "/ (store root)" : node.path;
  const body = node.type === "array" ? arrayDetail(node) : groupDetail(node);
  return `<h3 class="ze-detail-title">${esc(title)}</h3><dl class="ze-kvs">${body}</dl>`;
}

/**
 * Fetch the metadata, build the tree, and wire the explorer.
 * @param {HTMLElement} treeEl
 * @param {HTMLElement} detailEl
 */
export async function mountZarrTree(treeEl, detailEl) {
  if (!treeEl) return;
  try {
    const { root, id } = await resolveStoreRoot();
    const store = new zarr.FetchStore(root);
    const consolidatedMetadata = await zarr.withConsolidatedMetadata(store);
    const bytes = await store.get("/zarr.json");
    const meta = JSON.parse(new TextDecoder().decode(bytes));
    const nodes = meta.consolidated_metadata?.metadata;
    if (!nodes) throw new Error("no consolidated metadata on this store");

    const { root: tree, byPath } = buildTree(consolidatedMetadata.contents());
    if (!tree?.children.size) {
      treeEl.innerHTML = `<p class="ze-hint">No nodes found in this store's metadata.</p>`;
      return;
    }

    // Label the synthetic root with the store id and render it as the top node so the
    // root group is itself clickable, with all members nested beneath it.
    tree.name = id;
    treeEl.innerHTML = `<ul class="ze-children ze-rootlist">${renderNode(tree)}</ul>`;
    treeEl.dataset.item = id;

    treeEl.addEventListener("click", async (e) => {
      const rowEl = e.target.closest(".ze-row");
      if (!rowEl) return;
      const li = rowEl.closest(".ze-node");
      const node = byPath.get(li.dataset.path);

      // Structural toggle + highlight are instant (synchronous).
      if (node?.children.size) li.classList.toggle("ze-open");
      treeEl
        .querySelectorAll(".ze-row.ze-selected")
        .forEach((el) => el.classList.remove("ze-selected"));
      rowEl.classList.add("ze-selected");

      // Lazy-open the node's metadata via zarrita on first click, then cache on the node.
      // Open against the consolidated store so this is served from memory (no network).
      if (!node?.meta?.loaded) {
        const label = node.path || "store root";
        detailEl.innerHTML = `<p class="ze-hint">Opening ${esc(label)}…</p>`;
        try {
          const obj = await zarr.open(
            zarr.root(consolidatedMetadata).resolve(node.path),
            { kind: node.type },
          );
          node.meta = { ...toMeta(obj, nodes[node.path]), loaded: true };
        } catch (err) {
          detailEl.innerHTML = `<p class="ze-hint">Could not open ${esc(label)} (${esc(err.message)}).</p>`;
          return;
        }
      }
      // A newer click may have won while we awaited — don't overwrite its panel.
      if (!rowEl.classList.contains("ze-selected")) return;
      detailEl.innerHTML = renderDetail(node);
    });
  } catch (err) {
    console.error("zarr tree error", err);
    treeEl.innerHTML = `<p class="ze-hint">Could not load the store metadata (${esc(err.message)}). Network or CORS issue.</p>`;
  }
}
