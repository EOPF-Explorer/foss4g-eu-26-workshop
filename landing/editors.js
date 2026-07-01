/* global __PROJECT_ROOT__ */
// Link targets for the landing "Start" buttons. Web exercises open their running page
// in the browser; the in-page app bar handles editing and the solution switch.
// Notebook exercises open the .ipynb in VS Code via the vscode://file deep link
// (the browser prompts once; tick "always allow" to suppress future prompts). Off
// localhost the deep link is non-functional, so we fall back to the file path.

/** @returns {boolean} */
export function isLocal() {
  return ["localhost", "127.0.0.1", "[::1]"].includes(location.hostname);
}

/**
 * Running page for a web exercise.
 * @param {string} dir
 * @returns {string}
 */
export function pageHref(dir) {
  return `/${dir}/`;
}

/**
 * Open a file in VS Code (notebook "Start" buttons).
 * @param {string} dir
 * @param {string} file
 * @returns {string}
 */
export function editorHref(dir, file) {
  if (!isLocal()) return `/${dir}/${file}`;
  return `vscode://file${__PROJECT_ROOT__}/${dir}/${file}`;
}
