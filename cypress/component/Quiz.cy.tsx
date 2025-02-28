import React from 'react';
import Quiz from '../../client/src/components/Quiz';
import { mount } from 'cypress/react';
import { mockState } from '../support/utils/helpers';

describe('<Quiz />', () => {
    beforeEach(() => {
        cy.intercept('GET', '/api/questions/random', {
            statusCode: 200,
            body: mockState.questions // use mock questions
        }).as('getMockQuestion');
    });
//test that quiz component renders after mounting
    it('should render the Quiz component', () => {
        mount(<Quiz />);
        cy.get('.btn.btn-primary').contains('Start Quiz').should('be.visible').click();
        cy.wait('@getMockQuestion');
        cy.get('h2').should('exist');
    });
//test that first question is displayed when the quiz starts
    it('should display the first question when the quiz starts', () => {
        mount(<Quiz />);
        cy.get('.btn.btn-primary').contains('Start Quiz').click();
        cy.wait('@getMockQuestion');
        cy.get('h2').should('exist');
    });
//test that the next question is displayed when the user submits their answer
    it('should display the next question when the user submits their answer', () => {
        mount(<Quiz />);
        cy.get('.btn.btn-primary').contains('Start Quiz').click();
        cy.wait('@getMockQuestion');
        cy.get('.btn.btn-primary').first().click();
        cy.get('h2').should('exist');
    });
//test that the quiz displays the results when the user has answered all questions
    it('should display the score at the end of the quiz', () => {
        mount(<Quiz />);
        cy.get('.btn.btn-primary').contains('Start Quiz').click();
        cy.wait('@getMockQuestion');
        for (let i = 0; i < mockState.questions.length; i++) {
            cy.get('.btn.btn-primary').first().click();
        }
        cy.contains('Quiz Completed').should('be.visible');
        cy.contains(`Your score: ${mockState.score}/${mockState.questions.length}`).should('be.visible');
        cy.contains('Take New Quiz').should('be.visible');
    });
});
