/// <reference types="cypress" />

describe('User Management', () => {
  beforeEach(() => {
    localStorage.clear();
    cy.visit('/');
    cy.get('#users-list').should('be.visible');
    cy.get('#users-list table').should('exist');
  });

  it('should add a new user', () => {
    cy.contains('Add User').click();

    cy.get('input#name').type('Test');
    cy.get('input#surname').type('User');
    cy.get('input#email').type('test.user@example.com');
    cy.get('input#birthday').type('1990-01-01');
    cy.get('select#education').select('Bachelor');

    cy.contains('Save').click();

    cy.get('#users-list table').within(() => {
      cy.contains('td', /^Test$/).should('exist');
      cy.contains('td', /^User$/).should('exist');
      cy.contains('td', /^test.user@example.com$/).should('exist');
    });
  });

  it('should delete an existing user', () => {
    cy.get('#users-list table').within(() => {
      cy.contains('td', /^John$/)
        .parents('tr')
        .within(() => {
          cy.contains('delete').click();
        });
    });

    cy.get('#users-list table').within(() => {
      cy.contains('td', /^John$/).should('not.exist');
    });
  });
});
