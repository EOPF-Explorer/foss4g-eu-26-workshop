import "@eox/ui/style.css";

import "@fontsource/open-sans/400.css";
import "@fontsource/open-sans/600.css";
import "@fontsource/open-sans/700.css";
import "@fontsource/exo-2/600.css";
import "@fontsource/exo-2/700.css";

import "./assets/brand/eopf-theme.css";
import "./index.css";

import { renderLanding } from "./landing/render.js";
import { mountZarrTree } from "./landing/zarr-tree.js";

document.getElementById("app").innerHTML = renderLanding();
document.body.classList.add("ready");

// GeoZarr explorer modal: open on demand, mount the tree (and fetch metadata) only on
// first open so the page doesn't pay for it unless the user asks.
const zarrModal = document.getElementById("zarr-modal");
let zarrMounted = false;
document.getElementById("zarr-modal-open")?.addEventListener("click", () => {
  zarrModal.showModal();
  document.body.style.overflow = "hidden";
  if (!zarrMounted) {
    zarrMounted = true;
    mountZarrTree(
      zarrModal.querySelector("#zarr-tree"),
      zarrModal.querySelector("#zarr-detail"),
    );
  }
});
document
  .getElementById("zarr-modal-close")
  ?.addEventListener("click", () => zarrModal.close());
zarrModal?.addEventListener("click", (e) => {
  if (e.target === zarrModal) zarrModal.close();
});
zarrModal?.addEventListener("close", () => {
  document.body.style.overflow = "";
});
