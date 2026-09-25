const { test, expect } = require('../fixtures');
const { users } = require('../data/testData');

test.describe('Login', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
  });

  test('valid user can log in and see the products page', async ({ page, loginPage, inventoryPage }) => {
    await loginPage.loginAs(users.standard);

    await expect(page).toHaveURL(/inventory\.html/);
    await expect(inventoryPage.title).toHaveText('Products');
  });

  test('wrong password shows an error and stays on the login page', async ({ page, loginPage }) => {
    await loginPage.loginAs(users.wrongPassword);

    await expect(loginPage.errorMessage).toContainText('do not match any user');
    await expect(page).not.toHaveURL(/inventory\.html/);
  });

  test('locked-out user cannot log in', async ({ loginPage }) => {
    await loginPage.loginAs(users.lockedOut);

    await expect(loginPage.errorMessage).toContainText('locked out');
  });

  test('empty username shows a required-field error', async ({ loginPage }) => {
    await loginPage.login('', 'secret_sauce');

    await expect(loginPage.errorMessage).toContainText('Username is required');
  });
});
