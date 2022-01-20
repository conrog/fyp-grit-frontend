/// <reference types="cypress" />

describe("Example Cypress Tests", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3001");
  });

  it("displays web application", () => {
    cy.get("h1").first().contains("GRIT Workout Reccomender System:");
  });

  it("attempts to set empty user", () => {
    const stub = cy.stub();

    cy.on("window:alert", stub);

    cy.get("[value='Set User']")
      .click()
      .then(() => {
        expect(stub.getCall(0)).to.be.calledWith("Username must not be blank!");
      });
  });

  it("sets a valid user", () => {
    cy.get("[placeholder='Enter username...']").type("Conor");
    cy.get("[value='Set User']").click();
    cy.get("h2").contains("Workouts");
  });
});
