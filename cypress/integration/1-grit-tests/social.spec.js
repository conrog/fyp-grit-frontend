/// <reference types="cypress" />

describe("Social Page", () => {
  it("displays the social page", () => {
    cy.login("Conor", "abc123")
      .get("[data-cy=social-link]")
      .click()
      .url()
      .should("contain", "/users")
      .get("[data-cy=page-heading]")
      .should("contain", "Social");
  });

  it("searches for users", () => {
    cy.get("[data-cy=user-search-input]")
      .type("mark")
      .get("[data-cy=search-button]")
      .click()
      .get("[data-cy=username]")
      .eq(0)
      .should("contain", "Mark")
      .get("[data-cy=user-search-input]")
      .clear()
      .type("12312zxcxz")
      .get("[data-cy=search-button]")
      .click()
      .get("[data-cy=no-results-message]")
      .should("be.visible")
      .get("[data-cy=user-search-input]")
      .clear()
      .get("[data-cy=search-button]")
      .click();
  });

  it("follow a user", () => {
    cy.get("[data-cy=follow-button]")
      .eq(0)
      .should("contain", "Follow")
      .click()
      .should("contain", "Unfollow");
  });

  it("unfollow a user", () => {
    cy.get("[data-cy=follow-button]")
      .eq(0)
      .should("contain", "Unfollow")
      .click()
      .should("contain", "Follow");
  });

  it("clicks to view a users profile", () => {
    cy.get("[data-cy=username]")
      .contains("Mark")
      .click()
      .url()
      .should("include", "/users/Mark")
      .get("[data-cy=page-heading]")
      .should("contain", "Profile");
  });

  it("views a private profile", () => {
    cy.visit("http://localhost:3000/users/Jack")
      .get("[data-cy=private-message]")
      .should("be.visible")
      .should("contain", "Jack's account is private!");
  });
});
