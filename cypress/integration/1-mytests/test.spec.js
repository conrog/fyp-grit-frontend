/// <reference types="cypress" />

describe("GRIT Example", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000/login");
  });

  it("displays the login", () => {
    cy.get("[data-cy=form-title]").should("have.text", "Log In");
  });

  it("logs in", () => {
    cy.get("#username").type("Conor");
    cy.get("#password").type("abc123");
    // cy.get("[data-cy=login-button]").click();
  });
});
