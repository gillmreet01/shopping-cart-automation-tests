// Covers the three checkout screens: your information -> overview -> complete
class CheckoutPage {
  constructor(page) {
    this.page = page;
    this.title = page.locator('[data-test="title"]');
    this.firstNameInput = page.locator('[data-test="firstName"]');
    this.lastNameInput = page.locator('[data-test="lastName"]');
    this.postalCodeInput = page.locator('[data-test="postalCode"]');
    this.continueButton = page.locator('[data-test="continue"]');
    this.errorMessage = page.locator('[data-test="error"]');

    // Overview screen
    this.itemPrices = page.locator('[data-test="inventory-item-price"]');
    this.subtotalLabel = page.locator('[data-test="subtotal-label"]');
    this.finishButton = page.locator('[data-test="finish"]');

    // Complete screen
    this.completeHeader = page.locator('[data-test="complete-header"]');
  }

  async fillInformation({ firstName, lastName, postalCode }) {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.postalCodeInput.fill(postalCode);
    await this.continueButton.click();
  }

  async finish() {
    await this.finishButton.click();
  }

  // Sum of the individual item prices shown on the overview screen
  async getSumOfItemPrices() {
    // allTextContents() does not auto-wait, so wait for the overview items to render first
    await this.itemPrices.first().waitFor();
    const texts = await this.itemPrices.allTextContents(); // e.g. ['$29.99', '$9.99']
    return texts.reduce((sum, text) => sum + parseFloat(text.replace('$', '')), 0);
  }

  // The "Item total: $39.98" value as a number
  async getSubtotal() {
    const text = await this.subtotalLabel.textContent();
    return parseFloat(text.replace('Item total: $', ''));
  }
}

module.exports = { CheckoutPage };
