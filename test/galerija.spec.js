import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
for (const width of [320, 390, 768, 1440]) {
  test(`Galerija case study has readable evidence and accessible decisions at ${width}px`, async ({
    browser,
  }) => {
    const context = await browser.newContext({
      viewport: { width, height: 900 },
      reducedMotion: "reduce",
    });
    const page = await context.newPage();
    const errors = [],
      failed = [];
    page.on("pageerror", (e) => errors.push(e.message));
    page.on("response", (r) => {
      if (r.status() >= 400) failed.push(r.url());
    });
    await page.goto("http://127.0.0.1:4318/leonbede7/work/galerija/");
      await expect(page.locator("h1")).toHaveText(/Automobili\s*Galerija\./);
    await expect(page.locator(".contribution")).toContainText(
      "AI generated much of the implementation",
    );
    await expect(page.locator("#evidence")).toContainText(
      "do not yet have measured time savings",
    );
    expect(await page.locator("body").innerText()).not.toContain("\u2014");
    await page.keyboard.press("Tab");
    await expect(page.locator(".skip")).toBeFocused();
    for (const link of await page.locator('a[href^="#"]').all()) {
      await expect(page.locator(await link.getAttribute("href"))).toHaveCount(
        1,
      );
    }
    const second = page.locator(".decision-list details").nth(1);
    await second.locator("summary").focus();
    await page.keyboard.press("Enter");
    await expect(second).toHaveAttribute("open", "");
    await expect(second).toContainText("validation and human review");
    for (const image of await page.locator("img").all()) {
      await image.scrollIntoViewIfNeeded();
      await expect(image).toHaveJSProperty("complete", true);
      expect(await image.evaluate((img) => img.naturalWidth)).toBeGreaterThan(
        0,
      );
    }
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    const audit = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    expect(audit.violations).toEqual([]);
    expect(errors).toEqual([]);
    expect(failed).toEqual([]);
    await page.screenshot({
      path: `test-results/galerija-${width}.png`,
      fullPage: true,
    });
    await context.close();
  });
}
test("flagship case study and return navigation work without JavaScript under the Pages subpath", async ({
  browser,
}) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    baseURL: "http://127.0.0.1:4318",
  });
  const page = await context.newPage();
  await page.goto("/leonbede7/");
  await page.getByRole("link", { name: "Read the full case study" }).click();
  await expect(page).toHaveURL(/\/work\/galerija\/$/);
  await page
    .getByText("Use AI for candidates and drafts.", { exact: true })
    .click();
  await expect(page.locator(".decision-list details").nth(1)).toHaveAttribute(
    "open",
    "",
  );
  await page
    .getByRole("link", { name: "Back to portfolio", exact: true })
    .click();
  await expect(page.locator("h1")).toContainText("The work starts");
  const sitemap = await page.request.get("/leonbede7/sitemap.xml");
  expect(await sitemap.text()).toContain(
    "https://leonbede7.github.io/leonbede7/work/galerija/",
  );
  await context.close();
});
