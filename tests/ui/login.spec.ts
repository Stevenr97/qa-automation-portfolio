import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { InventoryPage } from '../../pages/InventoryPage';

const PASSWORD = 'secret_sauce'; // Public demo password shown on saucedemo.com

test.describe('Login', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test('standard user can log in', async ({ page }) => {
    await loginPage.login('standard_user', PASSWORD);
    await new InventoryPage(page).expectLoaded();
  });

  test('wrong password shows an error', async () => {
    await loginPage.login('standard_user', 'wrong_password');
    await loginPage.expectError('Username and password do not match');
  });

  test('empty password shows a required-field error', async () => {
    await loginPage.login('standard_user', '');
    await loginPage.expectError('Password is required');
  });

  test('locked-out user cannot log in', async () => {
    await loginPage.login('locked_out_user', PASSWORD);
    await loginPage.expectError('this user has been locked out');
  });

  test('empty username shows a required-field error', async () => {
    await loginPage.login('', PASSWORD);
    await loginPage.expectError('Username is required');
  });

  test('user stays on the login page after a failed login', async ({ page }) => {
    await loginPage.login('standard_user', 'wrong_password');
    await expect(page).toHaveURL('/');
  });
});
