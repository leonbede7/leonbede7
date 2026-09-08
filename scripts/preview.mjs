import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
const files = new Map([
  ["/leonbede7/", ["index.html", "text/html; charset=utf-8"]],
  ["/leonbede7/styles.css", ["styles.css", "text/css; charset=utf-8"]],
  [
    "/leonbede7/assets/intake-eval.jpg",
    ["assets/intake-eval.jpg", "image/jpeg"],
  ],
  ["/leonbede7/assets/galerija.jpg", ["assets/galerija.jpg", "image/jpeg"]],
  ["/leonbede7/robots.txt", ["robots.txt", "text/plain; charset=utf-8"]],
  ["/leonbede7/sitemap.xml", ["sitemap.xml", "application/xml; charset=utf-8"]],
]);
createServer(async (req, res) => {
  const path = new URL(req.url, "http://127.0.0.1:4318").pathname;
  if (path === "/" || path === "/leonbede7") {
    res.writeHead(302, { Location: "/leonbede7/" });
    res.end();
    return;
  }
  const asset = files.get(path);
  try {
    const data = await readFile(
      new URL("../site/" + (asset?.[0] ?? "404.html"), import.meta.url),
    );
    res.writeHead(asset ? 200 : 404, {
      "Content-Type": asset?.[1] ?? "text/html; charset=utf-8",
    });
    res.end(data);
  } catch {
    res.writeHead(500);
    res.end("Preview file unavailable.");
  }
}).listen(4318, "127.0.0.1", () =>
  console.log("Portfolio: http://127.0.0.1:4318/leonbede7/"),
);
