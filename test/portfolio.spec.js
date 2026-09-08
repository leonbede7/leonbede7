import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

for (const [width, mode] of [
  [320, "light"],
  [390, "light"],
  [768, "light"],
  [1440, "light"],
  [390, "dark"],
  [1440, "dark"],
]) {
  test(`readable layout and accessible content at ${width}px in ${mode} mode`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 1000 });
    await page.emulateMedia({ colorScheme: mode, reducedMotion: "reduce" });
    const failures = [];
    page.on("pageerror", (error) => failures.push(error.message));
    await page.goto("/leonbede7/");
    await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    expect(
      await page
        .locator("img")
        .evaluateAll((images) =>
          images.every((img) => img.complete && img.naturalWidth > 0),
        ),
    ).toBe(true);
    const audit = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    expect(audit.violations).toEqual([]);
    expect(failures).toEqual([]);
    await page.screenshot({
      path: `test-results/portfolio-${width}-${mode}.png`,
      fullPage: true,
    });
  });
}

test("keyboard navigation reaches content, disclosure and contact", async ({
  page,
}) => {
  await page.goto("/leonbede7/");
  await page.keyboard.press("Tab");
  await expect(page.locator(".skip")).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/#main$/);
  await page.locator("summary").focus();
  await page.keyboard.press("Enter");
  await expect(page.locator(".detail-body")).toBeVisible();
  await page.keyboard.press("Enter");
  await expect(page.locator(".detail-body")).toBeHidden();
  await page.getByRole("link", { name: "Contact", exact: true }).click();
  await expect(page).toHaveURL(/#contact$/);
  await expect(
    page.getByRole("link", { name: "Contact on LinkedIn" }),
  ).toHaveAttribute("href", "https://www.linkedin.com/in/leon-bede");
});

test("site works without JavaScript and internal navigation has valid targets", async ({
  browser,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("http://127.0.0.1:4318/leonbede7/");
  for (const link of await page.locator('a[href^="#"]').all()) {
    const href = await link.getAttribute("href");
    await expect(page.locator(href)).toHaveCount(1);
  }
  await page.locator("summary").click();
  await expect(page.locator(".detail-body")).toBeVisible();
  expect(await page.locator("body").innerText()).not.toMatch(/[\u2013\u2014]/);
  await context.close();
});

test("unknown routes offer a working way back to the portfolio", async ({
  page,
}) => {
  const response = await page.goto("/leonbede7/missing");
  expect(response.status()).toBe(404);
  await page.getByRole("link", { name: "Open portfolio" }).click();
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "AI implementation",
  );
});
