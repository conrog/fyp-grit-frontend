/// <reference types="cypress" />

describe("Navigation Bar Functionality", () => {
  before(() => {
    cy.login("Conor", "abc123");
  });

  it("displays the dashboard page", () => {
    cy.get("[data-cy=page-heading]").contains("Dashboard");
  });

  it("navigates to the workouts page", () => {
    cy.get("[data-cy=workouts-link]")
      .should("contain", "Workouts")
      .click()
      .url()
      .should("include", "/workouts")
      .get("[data-cy=page-heading]")
      .should("contain", "Workouts");
  });

  it("navigates to the social page", () => {
    cy.get("[data-cy=social-link]")
      .should("contain", "Social")
      .click()
      .url()
      .should("include", "/users")
      .get("[data-cy=page-heading]")
      .should("contain", "Social");
  });

  it("navigates to the help page", () => {
    cy.get("[data-cy=help-link]")
      .should("contain", "Help")
      .click()
      .url()
      .should("include", "/help")
      .get("[data-cy=page-heading]")
      .should("contain", "Help");
  });

  it("navigates to the dashboard page", () => {
    cy.get("[data-cy=dashboard-link]")
      .should("contain", "Dashboard")
      .click()
      .url()
      .should("include", "/dashboard")
      .get("[data-cy=page-heading]")
      .should("contain", "Dashboard");
  });

  it("navigates to the users profile page", () => {
    cy.get("[data-cy=profile-dropdown-button]")
      .click()
      .get("[data-cy=profile-link]")
      .should("contain", "Profile")
      .click()
      .url()
      .should("include", "/users")
      .get("[data-cy=page-heading]")
      .should("contain", "Profile");
  });

  it("signs out", () => {
    cy.get("[data-cy=profile-dropdown-button]")
      .click()
      .get("[data-cy=sign-out]")
      .should("contain", "Sign out")
      .click({ force: true })
      .get("[data-cy=form-title]")
      .should("contain", "Log In");

    cy.window()
      .its("sessionStorage")
      .invoke("getItem", "token")
      .should("not.exist");
  });
});
