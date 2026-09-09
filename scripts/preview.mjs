import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
const files = new Map([
  ["/leonbede7/", ["index.html", "text/html; charset=utf-8"]],
  ["/leonbede7/styles.css", ["styles.css", "text/css; charset=utf-8"]],
  ["/leonbede7/profile/", ["profile/index.html", "text/html; charset=utf-8"]],
  ["/leonbede7/profile.css", ["profile.css", "text/css; charset=utf-8"]],
  [
    "/leonbede7/work/galerija/",
    ["work/galerija/index.html", "text/html; charset=utf-8"],
  ],
  ["/leonbede7/case-study.css", ["case-study.css", "text/css; charset=utf-8"]],
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
  if (path === "/leonbede7/work/galerija") {
    res.writeHead(302, { Location: "/leonbede7/work/galerija/" });
    res.end();
    return;
  }
  if (path === "/leonbede7/profile") {
    res.writeHead(302, { Location: "/leonbede7/profile/" });
    res.end();
    return;
  }
  if (path === "/" || path === "/leonbede7") {
    res.writeHead(302, { Location: "/leonbede7/" });
    res.end();
    return;
  }
  let asset = files.get(path);
  const relative = path.startsWith("/leonbede7/")
    ? path.slice("/leonbede7/".length)
    : "";
  if (
    /^(assets|js)\/[a-zA-Z0-9_-]+\.(webp|jpg|png|svg|pdf|woff2|js|txt)$/.test(
      relative,
    )
  ) {
    const extension = relative.split(".").at(-1);
    const types = {
      webp: "image/webp",
      jpg: "image/jpeg",
      png: "image/png",
      svg: "image/svg+xml",
      pdf: "application/pdf",
      woff2: "font/woff2",
      js: "text/javascript; charset=utf-8",
      txt: "text/plain; charset=utf-8",
    };
    asset = [relative, types[extension]];
  }
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
