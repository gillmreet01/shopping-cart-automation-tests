# Shopping Cart Automation Tests

Playwright + JavaScript end-to-end tests for the SauceDemo shopping cart (https://www.saucedemo.com/).

## Setup
```
npm install
npx playwright install
```

## Run
```
npm test              # headless, all tests on Chromium, Firefox and WebKit
npm run test:headed   # watch the browser
npm run report        # open the HTML report
npx playwright test --project=chromium   # one browser
npx playwright test tests/cart.spec.js   # one file
```

Every test runs once per browser (17 tests x 3 browsers = 51 runs). The same suite runs
automatically on GitHub Actions (`.github/workflows/playwright.yml`) on every push.

## Structure
```
data/testData.js      users, products, checkout details (single source of test data)
pages/                Page Objects: LoginPage, InventoryPage, CartPage, CheckoutPage
fixtures/index.js     custom fixtures that hand page objects to tests
tests/                login.spec.js, cart.spec.js, checkout.spec.js
playwright.config.js  base URL, timeout, retries, reporter, screenshots/traces, browsers
.github/workflows/    CI: runs the suite on push
```

## What is tested (17 tests)
| File | Coverage |
|---|---|
| login.spec.js | valid login; wrong password; locked-out user; empty username |
| cart.spec.js | empty cart has no badge; add one; add all six; cart contents; remove (products page); remove (cart page); remove last item; cart survives reload; sort does not affect cart |
| checkout.spec.js | full purchase; overview total = sum of item prices; missing first name; missing postal code |

## Design choices
- **Page Object Model**: locators and actions live in `pages/`, tests read like plain steps.
- **Fixtures**: tests receive ready-made page objects instead of building them.
- **Test data file**: no credentials or product names hard-coded inside tests.
- **Web-first assertions** (`expect(locator)...`) auto-retry, so no `sleep()` calls.
- **Independent tests**: each test gets a fresh browser context and its own login.
