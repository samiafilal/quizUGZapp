export type Question = {
    id : number,
    question: string,
    answer1: string,
    answer2: string,
    answer3: string,
    answer4: string,
    correct_answer: number,
    category : string,
    difficulty : number,
    favorite : number
}

export type DB = {
    addQuestion : (question : Question) => Promise<void>,
    searchInQuestionsAndAnswersFilteredByCategoryAndDifficulty : (searchString : string, category : string, difficulty : number, offset: number, count: number) => Promise<Question[]>,
    getAllCategories : () => Promise<string[]>,
    deleteQuestion : (question : Question) => Promise<void>
}

export type Queue = { 
    getQuestions: (offset : number, count : number) => Question[]; 
    addQuestion: (question: Question) => void; 
    deleteQuestion: (question: Question) => void;
    getCurrentQuestion: () => Question | undefined;
};