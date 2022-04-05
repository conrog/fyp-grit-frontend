/// <reference types="cypress" />

describe("Dashboard Page", () => {
  it("displays the dashboard page", () => {
    cy.login("Conor", "abc123");

    cy.url()
      .should("include", "/dashboard")
      .get("[data-cy=page-heading]")
      .should("contain.text", "Dashboard");
  });

  it("change graph type", () => {
    cy.get("[data-cy=graph-select]")
      .should("contain", "Volume")
      .select("proportion")
      .should("contain", "Proportion")
      .get("[data-cy=graph-title]")
      .should("contain", "Proportion of Workouts")
      .get("[data-cy=graph-select]")
      .should("contain", "Proportion")
      .select("volume")
      .get("[data-cy=graph-title]")
      .should("contain", "Volume Per Workout");
  });

  it("search recent workouts", () => {
    cy.get("[data-cy=search-input]")
      .type("Squats and Bench")
      .get("[data-cy=workout-name")
      .should("contain", "Squats and Bench")
      .get("[data-cy=search-input]")
      .clear()
      .type("1231231131asdasd")
      .get("[data-cy=no-workouts-message]")
      .should("be.visible")
      .should("contain", "No Workouts Found")
      .get("[data-cy=search-input]")
      .clear();
  });

  it("view workout from recent activity list", () => {
    cy.get("[data-cy=workout-name")
      .eq(0)
      .click()
      .url()
      .should("include", "/workouts");
  });

  it("view user profile from recent activity list", () => {
    cy.visit("http://localhost:3000/dashboard")
      .get("[data-cy=workout-username")
      .eq(0)
      .click()
      .url()
      .should("include", "/users");
  });

  it("likes workout from recent activity list", () => {
    cy.visit("http://localhost:3000/dashboard")
      .get("[data-cy=like-button")
      .eq(0)
      .invoke("attr", "title")
      .should("contain", "Like")
      .get("[data-cy=like-button")
      .eq(0)
      .click()
      .invoke("attr", "title")
      .should("contain", "Unlike");
  });

  it("graph shows message when no data is present", () => {
    cy.login("Mark", "abc123")
      .get("[data-cy=no-graph-data]")
      .should("contain", "No Training Data to Graph");
  });
});
