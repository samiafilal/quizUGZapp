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
            emit("updated_queue")
        }
    }
    const deleteQuestion = (question : Question) => {
        queue = queue.filter(q => q !== question)
        emit("updated_queue")
    }
    const getCurrentQuestion = () : Question => {
        return queue[0]
    }
    const moveQuestionDown = (question : Question) => {
        const index = queue.findIndex(q => q === question)
        if(index < queue.length - 1){
            queue[index] = queue[index + 1]
            queue[index + 1] = question
            emit("updated_queue")
        }
    }
    const moveQuestionUp = (question : Question) => {   
        const index = queue.findIndex(q => q === question)
        if(index > 0){
            queue[index] = queue[index - 1]
            queue[index - 1] = question
            emit("updated_queue")
        }
    }

    const nextQuestion = () : boolean => {
        if(queue.length > 1){
            queue =  queue.slice(1)
            emit("updated_queue")
            return true;
        }
        return false;
    }

    const result = {getQuestions,addQuestion,deleteQuestion,getCurrentQuestion,moveQuestionDown,moveQuestionUp,nextQuestion};
    return result;
}
