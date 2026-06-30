// The story content lives in solution/public/story.md, loaded via the
// `markdown-url` attribute on <eox-storytelling> in index.html.
// The URL must be absolute — a relative path resolves against the component
// module, not the page. This file only registers the web components the story uses.
import "@eox/storytelling";
import "@eox/map";
import "@eox/map/src/plugins/advancedLayersAndSources";
