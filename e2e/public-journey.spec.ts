import { expect, test } from "@playwright/test";

test("landing page exposes the Jembara journey", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/Jembara/i);
  await expect(page.getByRole("heading", { name: /Temukan Talenta/i })).toBeVisible();
  await expect(page.getByText(/Jembatani Keterampilan/i).first()).toBeVisible();
});

test("login validates credentials without exposing account existence", async ({ page }) => {
  await page.goto("/login");
  await page.getByLabel("Email").fill("tidak-ada@example.com");
  await page.getByLabel("Password").fill("Password123!");
  await page.getByRole("button", { name: /Masuk/i }).click();
  await expect(page.getByText("Email atau password salah")).toBeVisible();
});

test("public project routes never expose closed projects", async ({ page }) => {
  const response = await page.goto("/projects/00000000-0000-0000-0000-000000000000");
  expect(response?.status()).toBe(404);
});