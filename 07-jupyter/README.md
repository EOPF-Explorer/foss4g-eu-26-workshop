# 07: EOxElements in Jupyter

The same EOxElements components run inside a **Python notebook** via
[`ipyeoxelements`](https://github.com/EOX-A/EOxElements-Jupyter)
(built on [anywidget](https://anywidget.dev/)). The map config is the **same dict**
you wrote as JSON in exercise 01. Python class names map automatically to web
components (`EOxMap` → `<eox-map>`).

## Run it

Create a virtual environment (Python >= 3.12.11), install the dependencies, then
open the notebook:

```bash
python3 -m venv .venv && source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
jupyter lab    # then open 07-jupyter/notebook.ipynb and run the cells top to bottom
```

The widgets are `ipywidgets`/`anywidget` based, so each map needs an explicit height
(`layout={"height": "500px"}`) — without it the output cell collapses and the map
looks blank.

> Using VS Code's notebook editor instead of JupyterLab? `requirements.txt` pins
> `ipykernel < 7`, since ipykernel 7 currently fails to connect in the VS Code
> Jupyter extension.

## What the notebook covers

1. **A map from a Python dict** — exercise 01's OSM + Sentinel-2 GeoZarr layers,
   written as a Python `dict` instead of JSON, rendered with `EOxMap(layers=..., center=..., zoom=...)`.
2. **A linked layer control** — `EOxLayercontrol(for_="#main-map")` next to the map
   in an `ipywidgets` `HBox` (note `for_` — `for` is a Python keyword).
3. **Band math (NDVI)** — a `WebGLTile` GeoZarr layer that computes NDVI from the NIR
   and Red bands on the GPU and colours it with a ramp.
4. **A chart from the data** — read the RGB bands from the GeoZarr store with `zarr`
   and chart the mean reflectance per band with `EOxChart`.

## Why the same dict

The dict has the same shape as the JSON in the browser exercises. A Python
workflow — loading data, computing an index, inspecting a scene — can use the same
EO visualisation without separate front-end code.

## Further reading

- [EOxElements-Jupyter](https://github.com/EOX-A/EOxElements-Jupyter) — `ipyeoxelements` source and examples
- [anywidget](https://anywidget.dev/) — the framework it's built on
