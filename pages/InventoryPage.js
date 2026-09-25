// Turns "Sauce Labs Backpack" into "sauce-labs-backpack" (used in SauceDemo's data-test ids)
function toSlug(productName) {
  return productName.toLowerCase().replace(/ /g, '-');
}

class InventoryPage {
  constructor(page) {
    this.page = page;
    this.title = page.locator('[data-test="title"]');
    this.cartBadge = page.locator('[data-test="shopping-cart-badge"]');
    this.cartLink = page.locator('[data-test="shopping-cart-link"]');
    this.productNames = page.locator('[data-test="inventory-item-name"]');
    this.sortDropdown = page.locator('[data-test="product-sort-container"]');
  }

  async addToCart(productName) {
    await this.page.locator(`[data-test="add-to-cart-${toSlug(productName)}"]`).click();
  }

  async removeFromCart(productName) {
    await this.page.locator(`[data-test="remove-${toSlug(productName)}"]`).click();
  }

  async openCart() {
    await this.cartLink.click();
  }

  // Sort options: 'az', 'za', 'lohi', 'hilo'
  async sortBy(option) {
    await this.sortDropdown.selectOption(option);
  }
}

module.exports = { InventoryPage };
