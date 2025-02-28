import { mockState } from '../support/utils/helpers';
describe('Tech Quiz App', () => {
   context('Quiz Setup', () =>{ beforeEach(() => {
        cy.intercept('GET', '/api/questions/random', {
            statusCode: 200,
            body: mockState // use mock state to load mock questions
        }).as('getRandomQuestion');
        cy.visit('/');
        cy.contains('Start Quiz', {timeout: 10000}).should('be.visible').click();
        cy.wait('@getRandomQuestion').its('response.statusCode').should('eq', 200);
    });

    // load a random question
    it('should display a question when the quiz starts', () => {
        cy.get('h2').should('be.visible').and('not.contain', 'Loading');
    });
    it('should display multiple answers for the question', () => {
        cy.get('btn.btn-primary').should('have.length', 4).and('be.visible');
    });
});
context('Answering Questions', () => {
    // beforeEach(() => {
    //     cy.intercept('GET', '/api/questions/random', {
    //         statusCode: 200,
    //         body: mockState
    //     }).as('getRandomQuestion');
    // })
    it('Allows the user to select an answer and adds one to the score if correct', () => {
        cy.get('h2').invoke('text').then((questionText) => {
            const currentQuestion = mockState.questions.find(q => q.question == questionText)

            if (!currentQuestion) {
                throw new Error('Question not found in mockState');
            }
            cy.get('btn.btn-primary').each(($btn, index) => {
                cy.wrap($btn).invoke('text').then((btnText) => {
                    const selectedAnswer = currentQuestion.answers[index];
                    if (selectedAnswer.isCorrect){
                        cy.wrap($btn).click();
                    }
                });
            });
        });
    });
    //it moves to the next question after an answer is selected
    it('should display the next question when the user submits their answer', () => {
        cy.get('h2').then(($question) => {
            const firstQuestion = $question.text();

            cy.get('btn.btn-primary').first().click();
            cy.get('h2').should('not.contain', firstQuestion);
        });
    });
});
       // test that a new question is displayed when the first question is answered
    context('Completing the Quiz', () => {
// when the quiz is done, the score should be displayed
    // it should be possible to restart the quiz
    it('should display the score at the end of the quiz', () => {
        for (let i = 0; i < mockState.questions.length; i++) {
            cy.get('btn.btn-primary').first().click();
        }
        cy.contains('Quiz Completed').should('be.visible');
        cy.contains('Your score: ${mockState.score}/${mockState.questions.length}').should('be.visible');
        cy.contains('Take New Quiz').should('be.visible')
    });
    });
    
})