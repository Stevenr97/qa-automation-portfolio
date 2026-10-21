import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { InventoryPage } from '../../pages/InventoryPage';
import { CheckoutPage } from '../../pages/CheckoutPage';

test.describe('Cart and checkout', () => {
  let inventory: InventoryPage;

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');
    inventory = new InventoryPage(page);
    await inventory.expectLoaded();
  });

  test('adding products updates the cart badge', async () => {
    await inventory.addToCart('sauce-labs-backpack');
    await expect(inventory.cartBadge).toHaveText('1');

    await inventory.addToCart('sauce-labs-bike-light');
    await expect(inventory.cartBadge).toHaveText('2');
  });

  test('user can complete a purchase', async ({ page }) => {
    await inventory.addToCart('sauce-labs-backpack');
    await inventory.openCart();

    const checkout = new CheckoutPage(page);
    await checkout.checkoutButton.click();
    await checkout.fillCustomerInfo('Steven', 'Brito', '170150');
    await checkout.finishButton.click();

    await checkout.expectOrderComplete();
  });

  test('checkout requires the first name', async ({ page }) => {
    await inventory.addToCart('sauce-labs-backpack');
    await inventory.openCart();

    const checkout = new CheckoutPage(page);
    await checkout.checkoutButton.click();
    await checkout.fillCustomerInfo('', 'Brito', '170150');

    await expect(checkout.error).toContainText('First Name is required');
  });
});
