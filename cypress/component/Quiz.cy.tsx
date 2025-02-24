import React from 'react';
import Quiz from '../../client/src/components/Quiz.jsx';

//test that quiz component renders after mounting
describe('<Quiz />', () => {
    it('should render the Quiz component', () => {
        cy.mount(<Quiz />);
        cy.get('[data-cy="quiz"]').should('exist');
    })

//test that first question is displayed when the quiz starts
    it('should display the first question when the quiz starts', () => {
        cy.mount(<Quiz />);
        cy.get('[data-cy="start-button"]').click();
        cy.get('[data-cy="question"]').should('exist');
    });
//test that the next question is displayed when the user submits their answer
    it('should display the next question when the user submits their answer', () => {
        cy.mount(<Quiz />);
        cy.get('[data-cy="start-button"]').click();
        cy.get('[data-cy="answer"]').first().click();
        cy.get('[data-cy="question"]').should('exist');
    });
//test that the quiz displays the results when the user has answered all questions
    it('should display the score at the end of the quiz', () => {
        cy.mount(<Quiz />);
        cy.get('[data-cy="start-button"]').click();
        for (let i = 0; i < 10; i++) {
            cy.get('[data-cy="answer-button"]').first().click();
        }
        cy.get('[data-cy="score"]').should('exist');
    });
});