import type { Question } from "./types";

let queue : Question[] = []

const batchSize = 10

export default function getQueue(){
    
    const getQuestions = (offset: number, count = batchSize): Question[] => {
        offset = offset * batchSize;
        const start = offset;
        const stop = offset + count - 1 < queue.length ? offset + count - 1 : queue.length - 1;
        const result = start < queue.length ? queue.slice(offset, stop) : [];
        return result;
    }
    const addQuestion = (question : Question) => {
        if(!queue.find(q => q === question))
            queue.push(question);
    }
    const deleteQuestion = (question : Question) => {
        queue = queue.filter(q => q !== question)
    }

    const result = {getQuestions,addQuestion,deleteQuestion}
    return result;
}
