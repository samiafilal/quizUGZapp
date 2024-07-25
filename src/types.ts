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
    favorite : number,
    time : number
}

export type Player = {
    name : string,
    score : number
}

export type ServerPlayer = {
    name : string,
}

export type Team = {    
    name : string,
    score : number,
    players : Player[]
}

export type ServerTeam = {
    name : string,
    players : ServerPlayer[]
}

export type Game = {
    getTeams : () => Promise<Team[]>,
    getPhase : () => Promise<number>,
    getAddTeamURL : () => Promise<string>,
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
    moveQuestionUp: (question: Question) => void; 
    moveQuestionDown: (question: Question) => void; 
    deleteQuestion: (question: Question) => void;
    getCurrentQuestion: () => Question | undefined;
};