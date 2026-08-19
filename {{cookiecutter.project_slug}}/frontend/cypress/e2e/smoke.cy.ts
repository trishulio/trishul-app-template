// Cypress smoke test placeholder — replace with real domain specs.
// Follows the data-testid-first + graceful-fallback pattern in cypress/support.
describe("smoke", () => {
  it("loads the app shell", () => {
    cy.visit("/");
    cy.get("body", { timeout: 20_000 }).should("be.visible");
  });
});
