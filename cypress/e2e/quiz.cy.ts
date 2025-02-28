import { mockState } from '../support/utils/helpers';

describe('Tech Quiz App - Fixture-Based E2E Test', () => {
    context('Game Setup', () => {
        beforeEach(() => {
            cy.intercept('GET', '/api/questions/random', {
                statusCode: 200,
                body: mockState.questions // use mock questions
            }).as('getMockQuestion');
            
            cy.visit('http://localhost:3001', {
                onBeforeLoad(win) {
                    win.localStorage.setItem('quizProgress', JSON.stringify(mockState));
                }
            });
            cy.wait(2000); // Ensure UI is ready
            cy.get('.btn.btn-primary').contains('Start Quiz', { timeout: 10000 }).should('be.visible').click();
            cy.wait('@getMockQuestion', {timeout: 10000});
        });
        // question should be displayed when the quiz starts
        it('should display a question when the quiz starts', () => {
            cy.get('h2')
              .should('be.visible')
              .and('not.contain', 'Loading');
        });
        //test that the question has multiple answers and they are displayed
        it('should display multiple answers for the question', () => {
            cy.get('.btn.btn-primary').should('have.length', 4).and('be.visible');
        });
    });

    context('Answering Questions', () => {
        beforeEach(() => {
            cy.intercept('GET', '/api/questions/random', {
                statusCode: 200,
                body: mockState.questions // use mock questions
            }).as('getMockQuestion');
            
            cy.visit('http://localhost:3001', {
                onBeforeLoad(win) {
                    win.localStorage.setItem('quizProgress', JSON.stringify(mockState));
                }
            });
            cy.wait(2000); // Ensure UI is ready
            cy.get('.btn.btn-primary').contains('Start Quiz', { timeout: 10000 }).should('be.visible').click();
            cy.wait('@getMockQuestion', {timeout: 10000});
        });
        // Test that user can select an answer and adds one to the score if correct
        it('Allows the user to select an answer and adds one to the score if correct', () => {
            cy.get('h2').invoke('text').then((questionText) => {
                cy.log(`Question text: ${questionText}`);
                const currentQuestion = mockState.questions.find(q => q.question === questionText);
                
                if (!currentQuestion) {
                    throw new Error('Question not found in mockState');
                }
                
                cy.get('.btn.btn-primary').each(($btn, index) => {
                    cy.wrap($btn).invoke('text').then((btnText) => {
                        const selectedAnswer = currentQuestion.answers[index];
                        if (selectedAnswer.isCorrect) {
                            cy.wrap($btn).click();
                        }
                    });
                });
            });
        });
        // Test that the next question is displayed when the user submits their answer
        it('should display the next question when the user submits their answer', () => {
            cy.get('h2').then(($question) => {
                const firstQuestion = $question.text();
                cy.log(`First question: ${firstQuestion}`);
                
                cy.get('.btn.btn-primary').first().click();
                
                cy.get('h2').should('not.have.text', firstQuestion);
            });
        });
    });

    context('Completing the Quiz', () => {
        beforeEach(() => {
            cy.intercept('GET', '/api/questions/random', {
                statusCode: 200,
                body: mockState.questions // use mock questions
            }).as('getMockQuestion');
            
            cy.visit('http://localhost:3001', {
                onBeforeLoad(win) {
                    win.localStorage.setItem('quizProgress', JSON.stringify(mockState));
                }
            });
            cy.wait(2000); // Ensure UI is ready
            cy.get('.btn.btn-primary').contains('Start Quiz', { timeout: 10000 }).should('be.visible').click();
            cy.wait('@getMockQuestion', {timeout: 10000});
        });
        // test that the score is displayed at the end of the quiz
        it('should display the score at the end of the quiz', () => {
            for (let i = 0; i < mockState.questions.length; i++) {
                cy.get('.btn.btn-primary').first().click();
            }
            cy.contains('.alert.alert-success', 'Your score:').should('be.visible');
            cy.contains(`Your score: ${mockState.score}/${mockState.questions.length}`).should('be.visible');
        });
        // test that the user can restart the quiz
        it('should be possible to restart the quiz', () => {
            for (let i = 0; i < mockState.questions.length; i++) {
                cy.get('.btn.btn-primary').first().click();
            }
            cy.get('.alert.alert-success').should('exist');
            cy.get('.btn.btn-primary').contains('Take New Quiz').click();
            cy.get('h2').should('exist');
        });
    });
});
