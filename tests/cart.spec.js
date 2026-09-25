const { test, expect } = require('../fixtures');
const { users, products } = require('../data/testData');

test.describe('Shopping cart', () => {
  // Runs before every test: log in so each test starts on the products page
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.loginAs(users.standard);
  });

  test('cart badge is not shown when the cart is empty', async ({ inventoryPage }) => {
    await expect(inventoryPage.cartBadge).toHaveCount(0);
  });

  test('adding one product shows 1 in the cart badge', async ({ inventoryPage }) => {
    await inventoryPage.addToCart(products.backpack.name);

    await expect(inventoryPage.cartBadge).toHaveText('1');
  });

  test('adding every product shows 6 in the cart badge', async ({ inventoryPage }) => {
    for (const product of Object.values(products)) {
      await inventoryPage.addToCart(product.name);
    }

    await expect(inventoryPage.cartBadge).toHaveText('6');
  });

  test('added products appear in the cart', async ({ inventoryPage, cartPage }) => {
    await inventoryPage.addToCart(products.backpack.name);
    await inventoryPage.addToCart(products.bikeLight.name);
    await inventoryPage.openCart();

    await expect(cartPage.cartItems).toHaveCount(2);
    await expect(cartPage.itemNames).toHaveText([products.backpack.name, products.bikeLight.name]);
  });

  test('removing a product on the products page lowers the badge', async ({ inventoryPage }) => {
    await inventoryPage.addToCart(products.backpack.name);
    await inventoryPage.addToCart(products.bikeLight.name);

    await inventoryPage.removeFromCart(products.backpack.name);

    await expect(inventoryPage.cartBadge).toHaveText('1');
  });

  test('removing a product in the cart updates the list and the badge', async ({ inventoryPage, cartPage }) => {
    await inventoryPage.addToCart(products.backpack.name);
    await inventoryPage.addToCart(products.bikeLight.name);
    await inventoryPage.openCart();

    await cartPage.removeItem(products.backpack.name);

    await expect(cartPage.cartItems).toHaveCount(1);
    await expect(cartPage.itemNames).toHaveText([products.bikeLight.name]);
    await expect(inventoryPage.cartBadge).toHaveText('1');
  });

  test('removing the last product removes the badge', async ({ inventoryPage, cartPage }) => {
    await inventoryPage.addToCart(products.onesie.name);
    await inventoryPage.openCart();

    await cartPage.removeItem(products.onesie.name);

    await expect(cartPage.cartItems).toHaveCount(0);
    await expect(inventoryPage.cartBadge).toHaveCount(0);
  });

  test('cart keeps its items after "Continue Shopping" and a page reload', async ({ page, inventoryPage, cartPage }) => {
    await inventoryPage.addToCart(products.fleeceJacket.name);
    await inventoryPage.openCart();
    await cartPage.continueShopping();

    await page.reload();

    await expect(inventoryPage.cartBadge).toHaveText('1');
    await inventoryPage.openCart();
    await expect(cartPage.itemNames).toHaveText([products.fleeceJacket.name]);
  });

  test('sorting Z to A does not change the cart', async ({ inventoryPage }) => {
    await inventoryPage.addToCart(products.backpack.name);

    await inventoryPage.sortBy('za');

    await expect(inventoryPage.productNames.first()).toHaveText(products.redTShirt.name);
    await expect(inventoryPage.cartBadge).toHaveText('1');
  });
});
