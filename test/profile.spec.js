import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
for (const width of [320, 390, 1440]) {
  test(`profile is readable and accessible at ${width}px`, async ({
    browser,
  }) => {
    const context = await browser.newContext({
      viewport: { width, height: 900 },
    });
    const page = await context.newPage();
    await page.goto("http://127.0.0.1:4318/leonbede7/profile/");
    await expect(page.locator("h1")).toHaveText("Leon Bede");
    await expect(page.locator(".education")).toContainText("In progress");
    expect(await page.locator("body").innerText()).not.toMatch(
      /Expected 2026|final.year|\u2014/,
    );
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    for (const link of await page.locator('a[href^="#"]').all())
      await expect(page.locator(await link.getAttribute("href"))).toHaveCount(
        1,
      );
    await page.keyboard.press("Tab");
    await expect(page.locator(".skip")).toBeFocused();
    const audit = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    expect(audit.violations).toEqual([]);
    await page.screenshot({
      path: `test-results/profile-${width}.png`,
      fullPage: true,
    });
    await context.close();
  });
}
test("profile navigation and PDF download work without JavaScript", async ({
  browser,
}) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    baseURL: "http://127.0.0.1:4318",
  });
  const page = await context.newPage();
  await page.goto("/leonbede7/");
  await page.getByRole("link", { name: "Experience & PDF" }).first().click();
  await expect(page).toHaveURL(/\/profile\/$/);
  const download = page.getByRole("link", { name: "Download profile (PDF)" });
  const waiting = page.waitForEvent("download");
  await download.click();
  const file = await waiting;
  expect(file.suggestedFilename()).toBe("leon-bede-profile.pdf");
  expect(await file.failure()).toBeNull();
  const pdf = await page.request.get("/leonbede7/assets/leon-bede-profile.pdf");
  expect(pdf.status()).toBe(200);
  expect(pdf.headers()["content-type"]).toContain("application/pdf");
  expect((await pdf.body()).subarray(0, 5).toString()).toBe("%PDF-");
  await page.getByRole("link", { name: "Explore the portfolio" }).click();
  await expect(page.locator("h1")).toContainText("The work starts");
  await context.close();
});
