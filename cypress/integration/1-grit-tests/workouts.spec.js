/// <reference types="cypress" />

describe("Workouts Page", () => {
  it("displays the workouts page", () => {
    cy.login("Conor", "abc123")
      .get("[data-cy=workouts-link]")
      .click()
      .url()
      .should("contain", "/workouts")
      .get("[data-cy=page-heading]")
      .should("contain", "Workouts");
  });

  it("creates a new workout", () => {
    cy.get("[data-cy=create-workout]")
      .click()
      .url()
      .should("include", "/workouts/new")
      .get("[data-cy=name-input]")
      .type("Test Workout")
      .get("[data-cy=description-input]")
      .type("Test description")
      .get("[data-cy=save-button]")
      .click()
      .get(".Toastify__toast-body")
      .should("contain", "Test Workout has been created.");
  });

  it("deletes a new workout", () => {
    cy.visit("http://localhost:3000/workouts")
      .get("[data-cy=workout-search]")
      .type("Test Workout")
      .get("[data-cy=delete-workout]")
      .eq(0)
      .click()
      .get("[data-cy=modal-delete-workout-button]")
      .click()
      .get(".Toastify__toast-body")
      .should("contain", "Test Workout has been deleted.");
  });
});
