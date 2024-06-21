import Database from "tauri-plugin-sql-api";
import { invoke } from '@tauri-apps/api/tauri'
import type { Question } from "./types";

let dbSQL: Database | void



export default async function getDB(){
    if(!dbSQL){
        await invoke("create_db_if_no_db")
        dbSQL = await Database.load("sqlite:main.sqlite").catch((e) => {
            console.error(e);
            return
        });
    }

    const addCategory = async (category : string) => {  
        dbSQL && await dbSQL.execute(
            "INSERT INTO categories (category) VALUES ($1)",
            [category],
        ).catch((e) => {
            console.error(e);
        });
    } 

     const addQuestion = async (question : Question) => {
        const categoryIdArray = dbSQL && await dbSQL.select(
            "SELECT id FROM categories WHERE category = $1",
            [question.category],
        ).catch((e) => {
            console.error(e);
        }) as {id : number}[];
        const categoryId = categoryIdArray && categoryIdArray.length > 0 && categoryIdArray[0] && categoryIdArray[0].id
        if(!categoryId){
            await addCategory(question.category)
            addQuestion(question)
            return
        }
        const result = dbSQL && await dbSQL.execute(
            "INSERT INTO questions (question, answer1, answer2, answer3, answer4, correct_answer, category_id, difficulty, favorite) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)",
            [question.question, question.answer1, question.answer2, question.answer3, question.answer4, question.correct_answer, categoryId, question.difficulty, question.favorite],
        ).catch((e) => {
            console.error(e);
        });
        }

    const deleteQuestion = async (question : Question) => {
        const result = dbSQL && await dbSQL.execute(
            "DELETE FROM questions WHERE id = $1",
            [question.id],
        ).catch((e) => {
            console.error(e);
        });
    }

    const getAllCategories = async () => {
        const result = dbSQL && await dbSQL.select(
            "SELECT * FROM categories",
        ).catch((e) => {
            console.error(e);
        }) as {category : string}[];
        return result ? result.map((category: { category: string; }) => category.category) : []
    }


    const searchInQuestionsAndAnswersFilteredByCategoryAndDifficulty = async (searchString : string, category : string, difficulty : number, offset: number, count: number = 10) => {
        const categoryIdArray = dbSQL && await dbSQL.select(
            "SELECT id FROM categories WHERE category = $1",
            [category],
        ).catch((e) => {
            console.error(e);
        }) as {id : number}[];
        const categoryId = categoryIdArray && categoryIdArray.length > 0 && categoryIdArray[0] && categoryIdArray[0].id
        console.log(difficulty)
        offset = offset * 10
        let argIdx = 1
        let SQLQuery = "SELECT * FROM questions WHERE 1=1 " +
        (searchString.length > 0 ? `AND (question LIKE $${argIdx} OR answer1 LIKE $${argIdx} OR answer2 LIKE $${argIdx} OR ANSWER3 LIKE $${argIdx} OR ANSWER4 LIKE $${argIdx})` : "") 
        let SQLQueryArgs : any[] = []
        if(searchString.length > 0){
            SQLQueryArgs.push(`%${searchString}%`)
            argIdx++
        }
        if(categoryId){
            SQLQuery += `AND category_id = $${argIdx.toString()} `
            SQLQueryArgs.push(categoryId)
            argIdx++
        }
        if(typeof(difficulty) == "number"){
            SQLQuery += `AND difficulty = $${argIdx.toString()} `
            SQLQueryArgs.push(difficulty)
        }
        SQLQuery += `ORDER BY question ASC LIMIT ${count} OFFSET ` + offset.toString()
        console.log(SQLQuery)
        console.log(SQLQueryArgs)
        const result = dbSQL && await dbSQL.select(
            SQLQuery,
            SQLQueryArgs,
        ).catch((e) => {
            console.error(e);
        }) as Question[];
        console.table(result)
        return result
    }

            

    const result = {addQuestion,searchInQuestionsAndAnswersFilteredByCategoryAndDifficulty,getAllCategories,deleteQuestion}
    return result;
}
