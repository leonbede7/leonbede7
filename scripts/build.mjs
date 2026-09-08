import { build, transform } from "esbuild";
import { buildProfile } from "./build-profile.mjs";
import {
  mkdir,
  copyFile,
  readdir,
  unlink,
  readFile,
  writeFile,
} from "node:fs/promises";
await mkdir("site/js", { recursive: true });
// Remove only this build's old generated JavaScript chunks, never arbitrary paths.
for (const name of await readdir("site/js"))
  if (/^[a-zA-Z0-9_-]+\.js$/.test(name)) await unlink("site/js/" + name);
const result = await build({
  entryPoints: ["src/app.js"],
  bundle: true,
  splitting: true,
  format: "esm",
  outdir: "site/js",
  minify: true,
  target: ["es2022"],
  metafile: true,
  legalComments: "eof",
});
await copyFile("src/index.html", "site/index.html");
const css = await transform(await readFile("src/styles.css", "utf8"), {
  loader: "css",
  minify: true,
});
await writeFile("site/styles.css", css.code);
for (const [path, details] of Object.entries(result.metafile.outputs))
  console.log(`${path}: ${(details.bytes / 1024).toFixed(1)} KiB`);
console.log("Built static HTML, CSS and deferred motion modules.");
await buildProfile();
console.log("Built profile and verified its matching PDF.");
