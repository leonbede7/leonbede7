import { readFile, writeFile, mkdir } from "node:fs/promises";
import { createHash } from "node:crypto";
import { transform } from "esbuild";
export async function buildProfile() {
  const raw = await readFile("src/profile.json");
  const data = JSON.parse(raw);
  const pdf = await readFile("site/assets/leon-bede-profile.pdf");
  const proof = JSON.parse(await readFile("src/profile-pdf.json", "utf8"));
  const hash = (v) => createHash("sha256").update(v).digest("hex");
  if (hash(raw) !== proof.dataSha256 || hash(pdf) !== proof.pdfSha256)
    throw new Error(
      "Profile PDF is out of date. Regenerate it with scripts/build-profile-pdf.py before building.",
    );
  const e = (v) =>
    String(v).replace(
      /[&<>"']/g,
      (c) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        })[c],
    );
  const links = (items) =>
    items.map((x) => `<a href="${e(x.url)}">${e(x.label)}</a>`).join("");
  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Leon Bede | Experience &amp; selected work</title><meta name="description" content="A concise profile of Leon Bede's AI implementation and product work, with project evidence, experience and a one-page PDF."><link rel="canonical" href="https://leonbede7.github.io/leonbede7/profile/"><meta name="theme-color" content="#f3f0e9"><link rel="icon" href="../assets/favicon.svg" type="image/svg+xml"><link rel="stylesheet" href="../profile.css"><meta property="og:title" content="Leon Bede | Experience &amp; selected work"><meta property="og:description" content="AI implementation, dealership product development and public experiments. Read the profile or download the one-page PDF."><meta property="og:type" content="profile"><meta property="og:url" content="https://leonbede7.github.io/leonbede7/profile/"><meta property="og:image" content="https://leonbede7.github.io/leonbede7/assets/social.jpg"></head><body><a class="skip" href="#main">Skip to content</a><div class="shell"><header class="bar"><a class="wordmark" href="../">Leon Bede<span aria-hidden="true"> /</span></a><a href="../">Explore the portfolio</a></header><main id="main"><section class="intro" aria-labelledby="name"><p class="eyebrow">Experience &amp; selected work</p><h1 id="name">${e(data.name)}</h1><p class="headline">${e(data.headline)}</p><p class="summary">${e(data.summary)}</p><p class="facts">${e(data.location)} · ${e(data.workEligibility)}<br>${e(data.focus)}</p><div class="actions"><a class="download" href="../assets/leon-bede-profile.pdf" download>Download profile (PDF)</a>${links(data.links.filter((x) => x.label !== "Portfolio"))}</div></section><section class="profile-section" aria-labelledby="projects"><h2 id="projects">Selected work</h2><div class="entries">${data.projects.map((p) => `<article class="project"><h3>${e(p.name)}</h3><p class="status">${e(p.status)}</p><p>${e(p.description)}</p><p class="stack">${e(p.stack)}</p><div class="proof-links">${links(p.links)}</div></article>`).join("")}</div></section><section class="profile-section" aria-labelledby="experience"><h2 id="experience">Experience</h2><div class="entries">${data.experience.map((x) => `<article class="experience"><div class="experience-title"><h3>${e(x.organization)}</h3><span class="period">${e(x.period)}</span></div><p class="role">${e(x.role)}</p><p>${e(x.description)}</p></article>`).join("")}</div></section><section class="profile-section" aria-labelledby="tools"><h2 id="tools">Tools &amp; methods</h2><dl class="skills">${data.skills.map((x) => `<div><dt>${e(x.label)}</dt><dd>${e(x.value)}</dd></div>`).join("")}</dl></section><section class="profile-section" aria-labelledby="education"><h2 id="education">Education &amp; languages</h2><div class="education"><h3>${e(data.education.institution)}</h3><p>${e(data.education.description)}</p><p class="status">${e(data.education.status)}</p><p>${e(data.languages)}</p></div></section></main><footer class="foot"><span>Updated ${e(data.updated)}</span><a href="../#contact">Contact Leon</a><a href="https://github.com/leonbede7/leonbede7/blob/main/src/profile.json">Profile source</a></footer></div></body></html>`;
  await mkdir("site/profile", { recursive: true });
  await writeFile("site/profile/index.html", html);
  const css = await transform(await readFile("src/profile.css", "utf8"), {
    loader: "css",
    minify: true,
  });
  await writeFile("site/profile.css", css.code);
}
