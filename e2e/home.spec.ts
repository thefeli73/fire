import { test, expect } from "@playwright/test";

test("homepage has title and calculator", async ({ page }) => {
  await page.goto("/");

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/InvestingFIRE/);

  // Check for main heading
  await expect(page.getByRole("heading", { name: "InvestingFIRE" })).toBeVisible();

  // Check for Calculator
  await expect(page.getByText("FIRE Calculator")).toBeVisible();
});

