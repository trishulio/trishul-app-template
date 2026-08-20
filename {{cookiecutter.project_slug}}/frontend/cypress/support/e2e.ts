// Global Cypress setup. Imported via `supportFile` in cypress.config.mjs.
// Ensures custom commands from ./commands are registered before any spec runs.
import "./commands";

/**
 * Reliability fixes for the {{cookiecutter.project_name}} e2e suite.
 *
 * 1. The app is a PWA (vite-plugin-pwa). Its service worker, once installed,
 *    intercepts navigations and can prevent the browser from ever firing the
 *    `load` event — which surfaces in Cypress as "Your page did not fire its
 *    `load` event within Nms" during `cy.visit` / `cy.session`. Block the SW
 *    registration script so it never installs.
 *
 * 2. The SPA may pull third-party fonts/bundles. If a host hangs, the `load`
 *    event is delayed. Stub the font CSS so it resolves instantly.
 *
 * NOTE: we must NOT touch `navigator.serviceWorker` in a global `beforeEach`
 * (that runs before a page exists — the document is in an invalid state and
 * any SW call throws). Intercepting registration at the network layer is the
 * correct, safe way to stop the SW from installing.
 */
beforeEach(() => {
  // Stop the PWA service worker from ever installing.
  cy.intercept("GET", "**/registerSW.js", { statusCode: 404, body: "" });
  cy.intercept("GET", "**/sw.js", { statusCode: 404, body: "" });

  // Stub third-party font requests so they can't stall the `load` event.
  cy.intercept("GET", "https://fonts.googleapis.com/**", {
    statusCode: 200,
    body: "",
    headers: { "content-type": "text/css" },
  });
  cy.intercept("GET", "https://fonts.gstatic.com/**", {
    statusCode: 200,
    body: "",
  });
});
