import { defineConfig } from "cypress";

/**
 * Cypress e2e configuration for the {{cookiecutter.project_name}} SPA.
 *
 * ESM (.mjs -> loaded as cypress.config.mjs) variant so it loads cleanly
 * under the frontend's "type": "module" package.json. Defaults target the
 * local Vite dev server (port 3000) but can be pointed at any environment
 * via env vars:
 *
 *   CYPRESS_BASE_URL=https://app.{{cookiecutter.subdomain}}.com npx cypress run
 */
export default defineConfig({
  e2e: {
    baseUrl: process.env.CYPRESS_BASE_URL || "http://localhost:3000",
    supportFile: "cypress/support/e2e.ts",
    specPattern: "cypress/e2e/**/*.cy.ts",
    defaultCommandTimeout: 10_000,
    requestTimeout: 10_000,
    pageLoadTimeout: 120_000,
    viewportWidth: 1280,
    viewportHeight: 900,
    trashAssetsBeforeRuns: true,
    env: {
      appName: "{{cookiecutter.project_name}}",
      authEmail: process.env.CYPRESS_AUTH_EMAIL || "",
      authPassword: process.env.CYPRESS_AUTH_PASSWORD || "",
    },
  },
});
