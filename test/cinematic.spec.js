import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
const base = "/leonbede7/";

for (const width of [320, 390, 768, 1366, 1920]) {
  test(`readable reduced-motion story at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: width > 1000 ? 900 : 844 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto(base);
    await page.evaluate(() => document.fonts.ready);
    await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
    await expect(
      page.getByRole("button", {
        name: "Reduced motion is enabled by your device",
      }),
    ).toBeDisabled();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    for (const selector of [
      ".hero",
      ".origin",
      ".chapter-car",
      ".chapter-system",
      ".chapter-product",
      ".evaluation",
      ".contact",
    ]) {
      await page.locator(selector).scrollIntoViewIfNeeded();
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
    }
    await expect(page.locator("canvas")).toHaveCount(0);
    await expect(page.locator(".pin-spacer")).toHaveCount(0);
    const audit = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    expect(audit.violations).toEqual([]);
    expect(errors).toEqual([]);
    if (width === 390 || width === 1366)
      await page.screenshot({
        path: `test-results/story-${width}.png`,
        fullPage: true,
      });
  });
}

test("saved policy example changes decision without making a model request", async ({
  page,
}) => {
  const external = [];
  page.on("request", (req) => {
    if (!req.url().startsWith("http://127.0.0.1:4318/"))
      external.push(req.url());
  });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(base);
  await page
    .getByRole("button", { name: "Explicit reason", exact: true })
    .click();
  await expect(page.locator(".decision-name")).toHaveText(
    "Standard human review",
  );
  await expect(
    page.getByRole("button", { name: "Explicit reason", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("button", { name: "Keyword rule", exact: true }).click();
  await expect(page.locator(".decision-name")).toHaveText("Specialist review");
  expect(external).toEqual([]);
});

test("keyboard navigation, disclosure and contact remain usable", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(base);
  await page.keyboard.press("Tab");
  await expect(page.locator(".skip")).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/#main$/);
  const summary = page
    .locator("summary")
    .filter({ hasText: "Give AI a defined role." });
  await summary.focus();
  await page.keyboard.press("Enter");
  await expect(
    page.locator("details").filter({ has: summary }),
  ).toHaveAttribute("open", "");
  await page.getByRole("link", { name: "Contact", exact: true }).click();
  await expect(page).toHaveURL(/#contact$/);
  await expect(
    page.getByRole("link", { name: "Contact on LinkedIn" }),
  ).toHaveAttribute("href", "https://www.linkedin.com/in/leon-bede");
});

test("all content works with JavaScript disabled", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("http://127.0.0.1:4318" + base);
  for (const link of await page.locator('a[href^="#"]').all())
    await expect(page.locator(await link.getAttribute("href"))).toHaveCount(1);
  await expect(page.locator(".policy-controls")).toBeHidden();
  await expect(page.locator(".policy-fallback")).toContainText(
    "standard human review",
  );
  await page.locator("summary").nth(1).click();
  await expect(page.locator("details").nth(1)).toHaveAttribute("open", "");
  expect(await page.locator("body").innerText()).not.toMatch(/[\u2013\u2014]/);
  await context.close();
});

test("motion can be paused, persists after reload and restores content", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto(base);
  await page.getByRole("button", { name: "Pause decorative motion" }).click();
  await expect(page.locator("body")).toHaveClass(/motion-paused/);
  await expect(page.locator(".pin-spacer")).toHaveCount(0);
  await page.reload();
  await expect(
    page.getByRole("button", { name: "Enable decorative motion" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Enable decorative motion" }).click();
  await expect(
    page.getByRole("button", { name: "Pause decorative motion" }),
  ).toBeVisible();
  await page.getByRole("link", { name: "Explore Galerija" }).click();
  await expect(page).toHaveURL(/#work$/);
  await expect(page.locator(".chapter-car")).toBeInViewport();
});

test("static graphics survive missing WebGL", async ({ page }) => {
  await page.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (type, ...args) {
      if (String(type).startsWith("webgl")) return null;
      return original.call(this, type, ...args);
    };
  });
  await page.goto(base);
  await page.locator(".signal-stage").scrollIntoViewIfNeeded();
  await expect(page.locator(".signal-stage .scene-fallback")).toBeVisible();
  await expect(page.locator(".signal-stage canvas")).toHaveCount(0);
  await page
    .getByRole("button", { name: "Explicit reason", exact: true })
    .click();
  await expect(page.locator(".decision-name")).toHaveText(
    "Standard human review",
  );
});

test("missing pages return a usable recovery link", async ({ page }) => {
  const response = await page.goto(base + "missing");
  expect(response.status()).toBe(404);
  await page.getByRole("link", { name: "Open portfolio" }).click();
  await expect(page.locator("h1")).toContainText("The work starts");
});

for (const width of [390, 1366]) {
  test(`animated story remains usable at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 768 });
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.goto(base);
    await page.evaluate(() => document.fonts.ready);
    await expect(page.locator(".pin-spacer")).toHaveCount(0);
    for (const selector of [
      ".chapter-car",
      ".chapter-system",
      ".chapter-product",
      ".contact",
    ]) {
      await page.locator(selector).scrollIntoViewIfNeeded();
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
    }
    await expect(
      page.getByRole("link", { name: "Contact on LinkedIn" }),
    ).toBeVisible();
    const audit = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    expect(audit.violations).toEqual([]);
  });
}

test("3D loads near the scene, pauses and survives context loss", async () => {
  test.setTimeout(60000);
  const { chromium } = await import("@playwright/test");
  const browser = await chromium.launch({
    args: [
      "--enable-unsafe-swiftshader",
      "--use-gl=angle",
      "--use-angle=swiftshader",
      "--disable-dev-shm-usage",
    ],
  });
  try {
    const page = await browser.newPage({
      viewport: { width: 1280, height: 800 },
    });
    await page.addInitScript(() => {
      window.sceneDraws = 0;
      const original = WebGL2RenderingContext.prototype.drawElements;
      WebGL2RenderingContext.prototype.drawElements = function (...args) {
        window.sceneDraws++;
        return original.apply(this, args);
      };
    });
    const sceneRequests = [];
    page.on("request", (r) => {
      if (/\/scenes-/.test(r.url())) sceneRequests.push(r.url());
    });
    await page.goto("http://127.0.0.1:4318" + base);
    await expect(
      page.getByRole("button", {
        name: "Motion on. Pause decorative motion",
        exact: true,
      }),
    ).toBeVisible();
    expect(sceneRequests).toEqual([]);
    await page.locator(".signal-stage").scrollIntoViewIfNeeded();
    await expect(page.locator(".signal-stage")).toHaveClass(/scene-loaded/, {
      timeout: 20000,
    });
    expect(sceneRequests).toHaveLength(1);
    await expect
      .poll(() => page.evaluate(() => window.sceneDraws))
      .toBeGreaterThan(0);
    await page.emulateMedia({ reducedMotion: "reduce" });
    await expect(page.locator("body")).toHaveClass(/motion-paused/);
    await page.waitForTimeout(150);
    const count = await page.evaluate(() => window.sceneDraws);
    await page.waitForTimeout(250);
    expect(await page.evaluate(() => window.sceneDraws)).toBe(count);
    await page
      .locator(".signal-stage canvas")
      .evaluate((c) =>
        c.getContext("webgl2").getExtension("WEBGL_lose_context").loseContext(),
      );
    await expect(page.locator(".signal-stage .scene-fallback")).toBeVisible();
    await page
      .getByRole("button", { name: "Explicit reason", exact: true })
      .click();
    await expect(page.locator(".decision-name")).toHaveText(
      "Standard human review",
    );
  } finally {
    await browser.close();
  }
});

test("changing motion preference during a policy response restores its readable state", async ({
  page,
}) => {
  await page.goto(base);
  await page
    .getByRole("button", { name: "Explicit reason", exact: true })
    .click();
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.locator("#policy-result")).toHaveCSS("opacity", "1");
  await expect(page.locator("#policy-result")).toHaveCSS("transform", "none");
  await expect(page.locator(".decision-name")).toHaveText(
    "Standard human review",
  );
  const audit = await new AxeBuilder({ page })
    .include("#policy-result")
    .withTags(["wcag2aa"])
    .analyze();
  expect(audit.violations).toEqual([]);
});
