import questions from '../../fixtures/questions.json';
import { Quiz } from '../types';
import { Question } from '../types';
//import { Answer } from '../types';

export const mockState: Quiz = {
    questions: questions as Question[],
    currentQuestionIndex: 0,
    score: 0,
    quizCompleted: false,
    quizStarted: false,
}