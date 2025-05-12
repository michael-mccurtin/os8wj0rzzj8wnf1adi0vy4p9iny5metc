import { test, expect } from '@playwright/test';

test.describe('Home Page', () => {
  test('should load top stories and paginate', async ({ page }) => {
    await page.goto('/');

    // Show spinner initially while loading
    await expect(page.locator('mat-spinner')).toBeVisible();

    // First story card should appear
    const cards = page.locator('app-story-item');
    await expect(cards.first()).toBeVisible();

    // Paginate forward
    await page.getByRole('button', { name: 'Next →' }).click();

    // Verify current page label updates
    await expect(page.locator('.page-label')).toContainText('2');
  });

  test('should toggle between grid and list views', async ({ page }) => {
    await page.goto('/');

    // Switch to list view and verify
    await page.getByLabel('List view').click();
    await expect(page.locator('app-story-list >> div').first()).toHaveClass(
      /story-list/,
    );

    // Switch to grid view and verify
    await page.getByLabel('Grid view').click();
    await expect(page.locator('app-story-list >> div').first()).toHaveClass(
      /story-grid/,
    );
  });

  test('should default to list view on small screens', async ({ page }) => {
    await page.setViewportSize({ width: 699, height: 800 });
    await page.goto('/');

    // Wait for layout to render
    await expect(page.locator('app-story-item').first()).toBeVisible();

    // Expect list layout due to small screen
    await expect(page.locator('app-story-list >> div').first()).toHaveClass(
      /story-list/,
    );
  });

  test('should force list view when resized below 700px', async ({ page }) => {
    await page.goto('/');

    // Switch to grid view first
    await page.getByLabel('Grid view').click();
    await expect(page.locator('app-story-list >> div').first()).toHaveClass(
      /story-grid/,
    );

    // Resize viewport below threshold
    await page.setViewportSize({ width: 699, height: 800 });

    // App should automatically switch to list layout
    await expect(page.locator('app-story-list >> div').first()).toHaveClass(
      /story-list/,
    );
  });
});
