/// <reference types="cypress" />

/**
 * Custom commands shared across the {{cookiecutter.project_name}} e2e specs.
 *
 * Design goal: **data-testid-first with graceful fallback**. The selector
 * convention is `[data-testid="..."]`. Not every input carries a testid yet,
 * so every helper accepts a `testid` plus a plain CSS fallback (role / label /
 * placeholder based) and resolves whichever is present in the DOM.
 */

/* eslint-disable @typescript-eslint/no-namespace */
declare global {
  namespace Cypress {
    interface Chainable {
      /** Resolve an element preferring `[data-testid=...]`, else `fallback`. */
      getField(testid: string, fallback: string): Chainable<JQuery<HTMLElement>>;
      /** Clear + type into a field (testid-first with CSS fallback). */
      typeField(
        testid: string,
        fallback: string,
        text: string,
      ): Chainable<JQuery<HTMLElement>>;
      /** Click a field/button (testid-first with CSS fallback). */
      clickField(testid: string, fallback: string): Chainable<JQuery<HTMLElement>>;
      /** Drive a SearchableDropdown: open -> search -> pick an option. */
      selectSearchableOption(opts: {
        triggerText: string;
        searchPlaceholder: string;
        searchQuery: string;
        optionText: string;
      }): Chainable<void>;
      /** Authenticate once via the UI and reuse the session for later tests. */
      login(): Chainable<void>;
    }
  }
}

/** Friendly wrapper around cy.session() so specs read plainly. */
Cypress.Commands.add("login", () => {
  cy.session(
    "login-session",
    () => {
      cy.visit("/");
      // Unauthenticated visits render the Cognito login view.
      cy.get("#login-email", { timeout: 20_000 }).should("be.visible");
      cy.get("#login-email").clear().type(email());
      cy.get("#login-password").type(password());
      cy.get("button[type='submit']").contains("Sign In").click();

      // Once authenticated the login form is replaced by the app shell.
      cy.get("#login-email", { timeout: 30_000 }).should("not.exist");
      cy.url().should("not.include", "/login");
    },
    {
      // Skip the UI login entirely if a valid session already exists
      // (tokens persist in storage), so already-logged-in runs stay fast.
      validate: () => {
        cy.visit("/");
        cy.get("body", { timeout: 15_000 }).then(($body) => {
          const stillLoggedOut = $body.find("#login-email").length > 0;
          if (stillLoggedOut) {
            throw new Error("Logged out");
          }
        });
      },
    },
  );
});

function email(): string {
  return Cypress.env("authEmail") as string;
}
function password(): string {
  return Cypress.env("authPassword") as string;
}

/** Pick whichever selector currently resolves: testid preferred, else CSS. */
function resolveEl(testid: string, fallback: string) {
  return cy.get("body").then(($body) => {
    const testidSel = `[data-testid="${testid}"]`;
    const selector = $body.find(testidSel).length ? testidSel : fallback;
    return cy.get(selector);
  });
}

Cypress.Commands.add("getField", (testid, fallback) => {
  return resolveEl(testid, fallback);
});

Cypress.Commands.add("typeField", (testid, fallback, text) => {
  return resolveEl(testid, fallback)
    .scrollIntoView()
    .clear({ force: true })
    .type(text, { force: true });
});

Cypress.Commands.add("clickField", (testid, fallback) => {
  return resolveEl(testid, fallback).scrollIntoView().click({ force: true });
});

/**
 * The app's custom dropdowns (entity selectors) all share the same shape: a
 * trigger `<button>` that opens a panel containing a search `<input>` and a
 * list of option `<button>`s.
 */
Cypress.Commands.add(
  "selectSearchableOption",
  ({ triggerText, searchPlaceholder, searchQuery, optionText }) => {
    cy.contains("button", triggerText).first().click();
    cy.get(`input[placeholder="${searchPlaceholder}"]`)
      .should("be.visible")
      .clear()
      .type(searchQuery);
    cy.contains("button", optionText, { timeout: 15_000 })
      .first()
      .click({ force: true });

    // KNOWN APP BEHAVIOUR: the dropdown panel does NOT auto-close after an
    // option is selected (it only closes on click-outside). The open panel
    // (z-50) covers the elements below it, so subsequent clicks/types on the
    // form get blocked by Cypress ("element is being covered by another
    // element"). Dismiss the panel by clicking a neutral spot on the page.
    cy.get("body").click(4, 4, { force: true });
  },
);

export {};
