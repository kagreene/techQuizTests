import type { Request, Response } from 'express';
// import question model
//import { IQuestion, Question} from '../models/Question.js';
import { Question } from '../models/Question.js';
// gets a set of random questions
export const getRandomQuestions = async (_req: Request, res: Response) => {
  try {
    console.log('fetching questions');
    const questions = await Question.find({});
   // const questions = await Question.aggregate<IQuestion>([
      // { $sample: { size: 10 } },
      // { $project: { __v: 0 } }]);
      console.log("questions being sent:", questions);
    res.status(200).json(questions);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
