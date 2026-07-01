/* global __PROJECT_ROOT__ */
// Floating nav bar, loaded on every web exercise page. Reads the URL to determine
// which exercise is active and whether it is the solution view, then renders a home
// link, an exercise/solution toggle, and an "Edit code" deep link into VS Code.

const isLocal = ["localhost", "127.0.0.1", "[::1]"].includes(location.hostname);

const segments = location.pathname.split("/").filter(Boolean);
const dir = segments[0] ?? "";
const isSolution = segments.includes("solution");
const num = dir.slice(0, 2);

// Preserve the current query string when toggling, so per-exercise params (e.g.
// eodash's ?indicator=) carry across the exercise/solution switch.
const exercisePath = `/${dir}/${location.search}`;
const solutionPath = `/${dir}/solution/${location.search}`;

// Lucide icons (ISC licence), inlined so the bar has no asset dependencies.
const ICON_BACK = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>`;
const ICON_CODE = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m16 18 6-6-6-6"/><path d="m8 6-6 6 6 6"/></svg>`;

// "Edit code" opens the file behind the current view. Omitted off localhost, where the
// vscode://file deep link is non-functional.
const editFile = `${isSolution ? `${dir}/solution` : dir}/main.js`;
const edit = isLocal
  ? `<a class="wb-edit" href="vscode://file${__PROJECT_ROOT__}/${editFile}" title="Open this file in VS Code">${ICON_CODE}Edit code</a>`
  : "";

const bar = document.createElement("nav");
bar.className = "workshop-appbar";
bar.setAttribute("aria-label", "Workshop navigation");
bar.innerHTML = `
  <a class="wb-home" href="/">${ICON_BACK}Workshop</a>
  <span class="wb-sep"></span>
  <span class="wb-num">${num}</span>
  <span class="wb-toggle" role="group" aria-label="View">
    <a href="${exercisePath}" class="${isSolution ? "" : "on"}"${isSolution ? "" : ' aria-current="page"'}>Exercise</a>
    <a href="${solutionPath}" class="${isSolution ? "on" : ""}"${isSolution ? ' aria-current="page"' : ""}>Solution</a>
  </span>
  ${edit}`;
document.body.appendChild(bar);
