const { test, expect } = require('../fixtures');
const { users, products, checkoutInfo } = require('../data/testData');

test.describe('Checkout', () => {
  // Start every test with two products in the cart, on the checkout information screen
  test.beforeEach(async ({ loginPage, inventoryPage, cartPage }) => {
    await loginPage.goto();
    await loginPage.loginAs(users.standard);
    await inventoryPage.addToCart(products.backpack.name);
    await inventoryPage.addToCart(products.bikeLight.name);
    await inventoryPage.openCart();
    await cartPage.checkout();
  });

  test('user can complete a purchase', async ({ page, checkoutPage, inventoryPage }) => {
    await checkoutPage.fillInformation(checkoutInfo);
    await checkoutPage.finish();

    await expect(page).toHaveURL(/checkout-complete\.html/);
    await expect(checkoutPage.completeHeader).toHaveText('Thank you for your order!');
    await expect(inventoryPage.cartBadge).toHaveCount(0); // cart is emptied after the order
  });

  test('order overview total matches the sum of the item prices', async ({ checkoutPage }) => {
    await checkoutPage.fillInformation(checkoutInfo);

    const expected = products.backpack.price + products.bikeLight.price;
    expect(await checkoutPage.getSumOfItemPrices()).toBeCloseTo(expected, 2);
    expect(await checkoutPage.getSubtotal()).toBeCloseTo(expected, 2);
  });

  test('missing first name shows an error', async ({ checkoutPage }) => {
    await checkoutPage.fillInformation({ ...checkoutInfo, firstName: '' });

    await expect(checkoutPage.errorMessage).toContainText('First Name is required');
  });

  test('missing postal code shows an error', async ({ checkoutPage }) => {
    await checkoutPage.fillInformation({ ...checkoutInfo, postalCode: '' });

    await expect(checkoutPage.errorMessage).toContainText('Postal Code is required');
  });
});
