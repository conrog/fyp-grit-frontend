/// <reference types="cypress" />

describe("Register Page", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000/register", {
      onBeforeLoad: (win) => {
        win.sessionStorage.clear();
      },
    });
  });

  it("displays the register page", () => {
    cy.get("[data-cy=form-title]").should("have.text", "Register");
  });

  it("register with username, password and confirm password not populated", () => {
    cy.get("[data-cy=create-account]")
      .click()
      .get("[data-cy=username-error]")
      .should("be.visible")
      .contains("Required")
      .get("[data-cy=password-error]")
      .should("be.visible")
      .contains("Required")
      .get("[data-cy=confirm-password-error]")
      .should("be.visible")
      .contains("Required");
  });

  it("register with already claimed username", () => {
    cy.get("#username")
      .type("Conor")
      .get("#password")
      .type("password")
      .get("#confirmPassword")
      .type("password")
      .get("[data-cy=create-account]")
      .click()
      .get("[data-cy=user-exists-error]")
      .should("be.visible")
      .contains("Username already in use.");
  });

  it("register with mismatching passwords", () => {
    cy.get("#username")
      .type("Conor")
      .get("#password")
      .type("password")
      .get("#confirmPassword")
      .type("passwor")
      .get("[data-cy=create-account]")
      .click()
      .get("[data-cy=password-match-error]")
      .should("be.visible")
      .get("#password")
      .clear()
      .type("passwor")
      .get("#confirmPassword")
      .clear()
      .type("password")
      .get("[data-cy=password-match-error]")
      .should("be.visible");
  });

  it("routes to the login page", () => {
    cy.get("[data-cy=login-link")
      .should("contain", "Log in")
      .click()
      .url()
      .should("include", "/login")
      .get("[data-cy=form-title]")
      .should("contain", "Log In");
  });

  it("registers a user", () => {
    cy.get("#username")
      .type("TestUser")
      .get("#password")
      .type("password")
      .get("#confirmPassword")
      .type("password")
      .get("[data-cy=create-account]")
      .click()
      .get("[data-cy=grit-navbar]")
      .should("have.text", "GRIT");

    cy.window()
      .its("sessionStorage")
      .invoke("getItem", "token")
      .should("exist");
  });
});
