import { defineConfig } from "vite";
import { viteStaticCopy } from "vite-plugin-static-copy";

export default defineConfig({
  server: {
    port: 3000,
  },
  publicDir: "public",
  plugins: [
    viteStaticCopy({
      targets: [
        { src: "05-eox-storytelling/public/*", dest: "." },
        { src: "05-eox-storytelling/solution/public/*", dest: "." },
        { src: "assets/*", dest: "assets" },
      ],
    }),
  ],
  define: {
    __PROJECT_ROOT__: JSON.stringify(process.cwd().replaceAll("\\", "/")),
  },
});
