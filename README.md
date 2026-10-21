# QA Automation Portfolio

![Playwright Tests](https://github.com/Stevenr97/qa-automation-portfolio/actions/workflows/playwright.yml/badge.svg)

End-to-end UI and API test automation with **Playwright** and **TypeScript**, running automatically on every push with **GitHub Actions**.

## What's tested

| Suite | Application under test | Coverage |
| --- | --- | --- |
| UI | [Swag Labs](https://www.saucedemo.com), a demo e-commerce site | Login (valid, invalid, locked-out, required fields), cart, full checkout, checkout validation |
| API | [Restful-Booker](https://restful-booker.herokuapp.com), a demo booking REST API | List, create and read back, authenticated update and delete, unauthorized update |

## Approach

- **Page Object Model** for UI tests: selectors and actions live in `pages/`, so tests read like user flows.
- **Positive and negative cases** in both suites, not just the happy path.
- **API tests validate data, not only status codes**: created and updated records are read back and compared field by field.
- **CI pipeline** on GitHub Actions runs every test on each push and pull request and keeps the HTML report as a downloadable artifact.

## Project structure

```
pages/             Page Objects for Swag Labs
tests/ui/          UI tests
tests/api/         API tests
.github/workflows/ CI pipeline
```

## Run locally

```bash
npm ci
npx playwright install
npm test            # all tests
npm run test:ui     # UI tests only
npm run test:api    # API tests only
npm run report      # open the HTML report
```

## Author

**Steven Brito**, QA Engineer · [LinkedIn](https://www.linkedin.com/in/steven-brito-199b06116)
