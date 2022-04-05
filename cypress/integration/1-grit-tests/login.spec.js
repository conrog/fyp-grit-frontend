/// <reference types="cypress" />

describe("Login Page", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000/login", {
      onBeforeLoad: (win) => {
        win.sessionStorage.clear();
      },
    });
  });

  it("displays the login", () => {
    cy.get("[data-cy=form-title]").should("have.text", "Log In");
  });

  it("logs in with invalid credentials", () => {
    cy.get("#username")
      .type("Conor")
      .get("#password")
      .type("wrongpassword")
      .get("[data-cy=login-button]")
      .click()
      .get("[data-cy=login-error-message]")
      .should("be.visible")
      .contains("The username or password you have entered is incorrect.");
  });

  it("logs in username and password not populated", () => {
    cy.get("[data-cy=login-button]")
      .click()
      .get("[data-cy=username-error]")
      .should("be.visible")
      .contains("Required")
      .get("[data-cy=password-error]")
      .should("be.visible")
      .contains("Required");
  });

  it("logs in with username missing", () => {
    cy.get("#password")
      .type("password")
      .get("[data-cy=login-button]")
      .click()
      .get("[data-cy=username-error]")
      .should("be.visible")
      .contains("Required");
  });

  it("logs in with password missing", () => {
    cy.get("#username")
      .type("Conor")
      .get("[data-cy=login-button]")
      .click()
      .get("[data-cy=password-error]")
      .should("be.visible")
      .contains("Required");
  });

  it("routes to the register page", () => {
    cy.get("[data-cy=register-link")
      .should("contain", "Sign Up")
      .click()
      .url()
      .should("include", "/register")
      .get("[data-cy=form-title]")
      .contains("Register");
  });

  it("logs in", () => {
    cy.get("#username")
      .type("Conor")
      .get("#password")
      .type("abc123")
      .get("[data-cy=login-button]")
      .click()
      .get("[data-cy=grit-navbar]")
      .should("have.text", "GRIT");
    cy.window()
      .its("sessionStorage")
      .invoke("getItem", "token")
      .should("exist");
  });
});
