import type { Question } from "./types";
import { emit } from '@tauri-apps/api/event'

let queue : Question[] = []


export default function getQueue(){
    
    const getQuestions = (offset: number, count: number): Question[] => {
        const start = offset;
        const stop = offset + count <= queue.length ? start + count : queue.length;
        const result = start < queue.length ? queue.slice(start, stop) : [];
        return result;
    }
    const addQuestion = (question : Question) => {
        if(!queue.find(q => q === question)){
            queue.push(question);
            if(queue.length === 1)
                emit("question_added_to_queue")
        }
    }
    const deleteQuestion = (question : Question) => {
        queue = queue.filter(q => q !== question)
        emit("question_deleted_from_queue")
    }
    const getCurrentQuestion = () : Question => {
        return queue[0]
    }

    const result = {getQuestions,addQuestion,deleteQuestion,getCurrentQuestion}
    return result;
}
