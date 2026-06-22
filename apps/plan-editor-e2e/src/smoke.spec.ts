import { expect, test } from '@playwright/test';

test('a member can sign in and see the seeded projects', async ({ page }) => {
  await page.goto('/login');

  await page.getByTestId('login-email').fill('alice@example.com');
  await page.getByTestId('login-password').fill('Password1!');
  await page.getByTestId('login-submit').click();

  await expect(page).toHaveURL(/\/projects/);
  await expect(page.getByTestId('project-list')).toContainText('Apollo');
});

test('bad credentials are rejected', async ({ page }) => {
  await page.goto('/login');

  await page.getByTestId('login-email').fill('alice@example.com');
  await page.getByTestId('login-password').fill('wrong-password');
  await page.getByTestId('login-submit').click();

  await expect(page.getByTestId('login-error')).toBeVisible();
});
