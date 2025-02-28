import { Schema } from 'mongoose';
interface Question {
    question: string;
    answers: Answer[];
}

interface Answer {
    answer: string;
    isCorrect: boolean;
}

interface Quiz {
    questions: Question[];
    currentQuestionIndex: number;
    score: number;
    quizCompleted: boolean;
    quizStarted: boolean;
}

export { Question, Answer, Quiz };