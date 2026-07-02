// Renders the landing page from content.js into an HTML string.
// Re-called after editor selection changes so "Start" links remain current.

import { hero, sections, footerLinks } from "./content.js";
import { pageHref, editorHref } from "./editors.js";

/**
 * @param {object} ex
 * @returns {string}
 */
function exerciseCard(ex) {
  const body = `
    <div class="body">
      <span class="num">${ex.num}</span>
      <h3>${ex.title}</h3>
      <p>${ex.description}</p>
    </div>`;

  // Notebook exercises (identified by a `file` property) are self-contained: Start
  // opens the notebook in VS Code and there is no solution/ page. Web exercises open
  // in the browser; the in-page app bar handles editing and the solution switch.
  const isNotebook = Boolean(ex.file);
  const query = ex.demoQuery ? `?${ex.demoQuery}` : "";
  const start = isNotebook
    ? editorHref(ex.dir, ex.file)
    : pageHref(ex.dir) + query;
  const startTitle = isNotebook
    ? "Opens the notebook in VS Code"
    : "Opens this exercise in the browser";
  const solution = isNotebook
    ? ""
    : `<a class="btn btn-ghost" href="/${ex.dir}/solution/${query}">Solution</a>`;

  return `<article class="exercise">${body}
    <nav>
      <a class="btn btn-primary" href="${start}" title="${startTitle}">Start</a>
      ${solution}
    </nav>
  </article>`;
}

/**
 * @param {object} section
 * @returns {string}
 */
function sectionBlock(section) {
  const cards = section.exercises
    .map((ex) => `<div class="s12 m6 l3">${exerciseCard(ex)}</div>`)
    .join("");
  return `
    <div class="section-head">
      <span class="idx">${section.index}</span>
      <h2>${section.title}</h2>
      <span class="rule"></span>
    </div>
    <div class="grid">${cards}</div>`;
}

// The GeoZarr explorer modal. The hero "Explore a GeoZarr store" button opens it;
// index.js mounts the tree lazily on first open.
/** @returns {string} */
function zarrExplorer() {
  return `
    <dialog class="ze-modal" id="zarr-modal" aria-labelledby="ze-modal-title">
      <div class="ze-modal-head">
        <h2 id="ze-modal-title">What's inside a Sentinel-2 GeoZarr?</h2>
        <button class="ze-modal-close" id="zarr-modal-close" type="button" aria-label="Close">&times;</button>
      </div>
      <p class="ze-intro">One Sentinel-2 product is a single Zarr store: a tree of groups
        and arrays, read live from one consolidated <code>zarr.json</code>. It is a
        <strong>GeoZarr</strong> &mdash; groups carry a CRS (<code>proj:</code>), a spatial
        grid and extent (<code>spatial:</code>), and a <code>multiscales</code> resolution
        pyramid, surfaced when you select them. Click any node to inspect its shape, type,
        and attributes.</p>
      <div class="ze-grid">
        <div class="ze-tree" id="zarr-tree"><p class="ze-hint">Loading store metadata...</p></div>
        <aside class="ze-detail" id="zarr-detail"><p class="ze-hint">Select a node to inspect its shape, type, and attributes.</p></aside>
      </div>
    </dialog>`;
}

/** @returns {string} */
function footer() {
  const links = footerLinks
    .map(
      ({ label, href }) =>
        `<a href="${href}" target="_blank" rel="noopener">${label}</a>`,
    )
    .join("");
  return `<footer class="container"><nav class="links">${links}</nav></footer>`;
}

/** @returns {string} */
export function renderLanding() {
  return `
    <header class="hero">
      <div class="wrap">
        <img src="${hero.logo}" alt="EOPF Explorer" />
        <span class="eyebrow">${hero.eyebrow}</span>
        <h1>${hero.title}</h1>
        <p>${hero.lede}</p>
        <div class="cta-row">
          <a class="btn btn-primary" href="${pageHref(hero.cta.dir)}" title="Opens exercise 01 in the browser">${hero.cta.label} →</a>
          <button class="btn btn-explore" id="zarr-modal-open" type="button" title="Inspect a live Sentinel-2 GeoZarr store">Explore a GeoZarr store</button>
          <a class="btn btn-explore" href="${hero.slides.href}" target="_blank" rel="noopener" title="Workshop slides (PDF)">${hero.slides.label}</a>
          <span class="meta">${hero.meta}</span>
        </div>
      </div>
    </header>
    <main class="container">${sections.map(sectionBlock).join("")}</main>
    ${zarrExplorer()}
    ${footer()}`;
}
