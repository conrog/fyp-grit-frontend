/// <reference types="cypress" />

describe("Profile Page", () => {
  it("displays the users profile page", () => {
    cy.login("Conor", "abc123")
      .get("[data-cy=profile-dropdown-button]")
      .click()
      .get("[data-cy=profile-link]")
      .should("contain", "Profile")
      .click()
      .url()
      .should("include", "/users")
      .get("[data-cy=page-heading]")
      .should("contain", "Profile");
  });

  it("edits users profile", () => {
    cy.get("[data-cy=edit-profile-button]")
      .click()
      .get("[data-cy=first-name-input]")
      .should("be.enabled")
      .clear()
      .type("Jack")
      .get("[data-cy=last-name-input]")
      .should("be.enabled")
      .clear()
      .type("Smith")
      .get("[data-cy=dob-input]")
      .should("be.enabled")
      .clear()
      .type("2000-08-02")
      .get("[data-cy=gender-select]")
      .select("Female")
      .get("[data-cy=bio-input]")
      .clear()
      .type("Updated biography.")
      .get("[data-cy=profile-type-select]")
      .select("private")
      .get("[data-cy=update-button]")
      .click()
      .get(".Toastify__toast-body")
      .should("contain", "Profile updated!")
      .get("[data-cy=first-name]")
      .should("contain", "Jack")
      .get("[data-cy=last-name]")
      .should("contain", "Smith")
      .get("[data-cy=dob]")
      .should("contain", "02/08/2000")
      .get("[data-cy=gender]")
      .should("contain", "Female")
      .get("[data-cy=bio]")
      .should("contain", "Updated biography.")
      .get("[data-cy=profile-type]")
      .should("contain", "Private");
  });

  it("cancel edit of users profile", () => {
    cy.get("[data-cy=edit-profile-button]")
      .click()
      .get("[data-cy=first-name-input]")
      .should("be.enabled")
      .clear()
      .type("Conor")
      .get("[data-cy=last-name-input]")
      .should("be.enabled")
      .clear()
      .type("Rogers")
      .get("[data-cy=dob-input]")
      .should("be.enabled")
      .clear()
      .type("1996-08-02")
      .get("[data-cy=gender-select]")
      .select("Male")
      .get("[data-cy=bio-input]")
      .clear()
      .type("Updated biography.")
      .get("[data-cy=profile-type-select]")
      .select("public")
      .get("[data-cy=cancel-button]")
      .click()
      .get(".Toastify__toast-body")
      .should("contain", "Profile updated!")
      .get("[data-cy=first-name]")
      .should("contain", "Jack")
      .get("[data-cy=last-name]")
      .should("contain", "Smith")
      .get("[data-cy=dob]")
      .should("contain", "02/08/2000")
      .get("[data-cy=gender]")
      .should("contain", "Female")
      .get("[data-cy=bio]")
      .should("contain", "Updated biography.")
      .get("[data-cy=profile-type]")
      .should("contain", "Private");
  });

  it("lists user that the user follows", () => {
    cy.get("[data-cy=list-title]")
      .should("contain", "That You Follow")
      .get("[data-cy=username]")
      .should("contain", "Paul")
      .should("contain", "Mark");
  });

  it("lists users that follow the user", () => {
    cy.get("[data-cy=list-select]")
      .select("followers")
      .get("[data-cy=username]")
      .should("contain", "Paul");
  });
});
