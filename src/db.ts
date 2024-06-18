import Database from "tauri-plugin-sql-api";
import { invoke } from '@tauri-apps/api/tauri'


let dbSQL: Database | void


type SqliteQuestionWithAnswers = {
    id : number,
    question: string
}

function serializeQuestionWithAnswers(question: string, answers: string[]){
    console.table({question, answers})
    return JSON.stringify({question, answers})
}

function deserializeQuestionWithAnswers(serializedQuestionWithAnswers: string){
    console.log(JSON.parse(serializedQuestionWithAnswers))
    return JSON.parse(serializedQuestionWithAnswers)
}


export default async function getDB(){
    let db: {[key: string]: {question: string, answers: string[]}} = {}
    if(!dbSQL){
        await invoke("create_db_if_no_db")
        dbSQL = await Database.load("sqlite:main.sqlite").catch((e) => {
            console.error(e);
            return
        });
    }
    const getQuestion = async () => {
            const result : SqliteQuestionWithAnswers[] = (dbSQL && await dbSQL.select(
                    "SELECT * FROM questions"
                ) as SqliteQuestionWithAnswers[]) ?? [];
            console.log(result[0].question)
            return deserializeQuestionWithAnswers(result[result.length -1].question)
    };
     const addQuestion = async (question: string, answers: string[]) => {
            const serializedQuestionWithAnswers = serializeQuestionWithAnswers(question, answers)
            console.log(serializedQuestionWithAnswers)
            const result = dbSQL && await dbSQL.execute(
                    "INSERT into questions (question) VALUES ($1)",
                    [serializedQuestionWithAnswers],
                ).catch((e) => {
                    console.error(e);
            });
    };
    const result = {getQuestion, addQuestion}
    return result;
}
