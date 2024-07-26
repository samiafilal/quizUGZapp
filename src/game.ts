import type { Team, Game, ServerPlayer, ServerTeam, Question, Queue } from "./types";
import { emit } from '@tauri-apps/api/event';
import { listen } from '@tauri-apps/api/event';
import { invoke } from '@tauri-apps/api/tauri';
import WebSocket from "tauri-plugin-websocket-api";
import getQueue from "./queue";
let ws: WebSocket | void;
let phase: number;
let createTeamURL: string;
let teams: Team[] = [];
let currentQuestion: Question | undefined;
let queue: Queue;

import { getClient, ResponseType } from '@tauri-apps/api/http';

function playerExists(team: Team, playerName: string): boolean {
    return team.players.map(p => p.name).includes(playerName);
}

    


async function processMsg(msg: any) {
    if(msg.event){
        if(msg.event === "updated_players"){
            const newState = msg.teams;
            if(!newState) return;
            newState.forEach((serverTeam: ServerTeam) => {
                const index = teams.findIndex(t => t.name === serverTeam.name);
                if(index === -1){
                    teams.push({name: serverTeam.name, score: 0, players: serverTeam.players.map((p: ServerPlayer) => ({name: p.name, score: 0}))});
                } else {
                    const newPlayers = serverTeam.players.filter(player => !playerExists(teams[index],player.name)).map((p: ServerPlayer) => ({name: p.name, score: 0}));
                    teams[index].players = teams[index].players.concat(newPlayers);
                }
            });
            console.log(JSON.stringify(teams))
            await invoke("game_state", { method: "set", game : JSON.stringify(teams)});
            emit('updated_players');
            return;
        }
    }
}

export default async function getGame(master: boolean): Promise<Game> {
    queue = getQueue();
    if(master) {
        listen('tab_bar_next', async (event) => {
            if(phase === 0 && !createTeamURL){
                return;
            }
            if(phase >= 1){
                const question = queue.getCurrentQuestion();
                if(question){
                    await invoke("question", { method: "set", currentQuestion: JSON.stringify(question)});
                    const serverQuestion = {
                        question: question.question,
                        answer1: question.answer1,
                        answer2: question.answer2,
                        answer3: question.answer3,
                        answer4: question.answer4,
                        correct_answer: question.correct_answer,
                        category : question.category,
                        difficulty : question.difficulty,
                        time : question.time
                    }
                    ws && ws.send(JSON.stringify({event : "update_question", question : serverQuestion}));
                    emit('question_updated');
                }else{
                    console.log("No question in queue");
                    return;
                }
            }
            phase = await invoke("phase", { method: "increment" });
            emit('phase_updated');
        });
        
        listen('tab_bar_previous', async (event) => {
            phase = await invoke("phase", { method: "decrement" });
            emit('phase_updated');
        });
    }
    const startGame = async (): Promise<string> => {
        try {
            const client = await getClient();
            const url = (await client.get('https://quizugz.fr/start', {
                responseType: ResponseType.Text,
              })).data as string;
            await invoke("add_team_url", { method: "set", url : url});
            createTeamURL = url;
            console.log("Game started:", url);
            return url;
        } catch (error) {
            console.error("Error starting game:", error);
            throw error;
        }
    };
    
    if (master && !ws) {
        ws = await WebSocket.connect("wss://quizugz.fr/masterSocket");
        ws.addListener((msg) => {
            console.log("Received message from server of type", typeof(msg));
            const answer = typeof(msg.data) === "string" ? JSON.parse(msg.data) : msg.data;
            console.table(msg);
            processMsg(answer);
        });
        
    }
    if(master && !createTeamURL) {
        createTeamURL = await startGame();
    }

    const getTeams = async (): Promise<Team[]> => {
        teams = await invoke("game_state", { method: "get", game: ""}).then((teams) => JSON.parse(teams as string)).catch((e) => console.log(e));
        console.log("Teams:", teams);
        return teams;
    }

    const getQuestion = async (): Promise<Question | undefined> => {
        currentQuestion = await invoke("question", { method: "get", currentQuestion: ""}).then((question) => JSON.parse(question as string)).catch((e) => console.log(e));
        console.log("Question:", currentQuestion);
        return currentQuestion;
    }

    const getPhase = async (): Promise<number> => {
        phase = await invoke("phase", { method: "get" });
        return phase;
    }

    const getAddTeamURL = async (): Promise<string> => {
        createTeamURL = await invoke("add_team_url", { method: "get", url: ""});
        return createTeamURL;
    }

    const result = { getTeams, getPhase, getAddTeamURL, getQuestion };
    return result;
}
