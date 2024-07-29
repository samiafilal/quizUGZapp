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
let timeLeft : number;
let timerPaused : boolean = false;
let timer : NodeJS.Timeout;
import { getClient, ResponseType } from '@tauri-apps/api/http';

function playerExists(team: Team, playerName: string): boolean {
    return team.players.map(p => p.name).includes(playerName);
}

function launchTimer(time: number) {
    timeLeft = time;
    emit('timer_updated', timeLeft);
    timer = setInterval(() => {
        if(!timerPaused){
            timeLeft--;
            updateCountdown();
            emit('timer_updated', timeLeft);
        }
        if(timeLeft == 0){
            updateCountdown();
            clearInterval(timer);
        }
    }, 1000);
}

function pauseTimer(){
    timerPaused = true;
    emit('timer_paused');
}

function resumeTimer(){
    timerPaused = false;
    emit('timer_resumed');
}

function resetTimer(time : number){
    timerPaused = false;
    timeLeft = time;
    updateCountdown();
    emit('timer_resumed');
    emit('timer_updated',timeLeft);
}

function stopTimer(){
    timerPaused = false;
    timeLeft = -1;
    emit('timer_updated',timeLeft);
    clearInterval(timer);
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

function updateCountdown(){
    ws && ws.send(JSON.stringify({event : "update_countdown", countdown : timeLeft}))
}

async function updateQuestion(question : Question){
    if(question){
        await invoke("question", { method: "set", currentQuestion: JSON.stringify(question)});
        const partialQuestion = {...question};
        partialQuestion.answer1 = phase < 3 ? "?" : question.answer1;
        partialQuestion.answer2 = phase < 4 ? "?" : question.answer2;
        partialQuestion.answer3 = phase < 5 ? "?" : question.answer3;
        partialQuestion.answer4 = phase < 6 ? "?" : question.answer4;    
        const serverQuestion = {
            question: partialQuestion.question,
            answer1: partialQuestion.answer1,
            answer2: partialQuestion.answer2,
            answer3: partialQuestion.answer3,
            answer4: partialQuestion.answer4,
            correct_answer: partialQuestion.correct_answer,
            category : partialQuestion.category,
            difficulty : partialQuestion.difficulty,
            time : partialQuestion.time
        }
        ws && ws.send(JSON.stringify({event : "update_question", question : serverQuestion}));
        emit('question_updated');
    }else{
        console.log("No question in queue");
        return;
    }
}


export default async function getGame(master: boolean): Promise<Game> {
    queue = getQueue();
    if(master) {
        listen('tab_bar_next', async (event) => {
            if(phase === 0 && !createTeamURL){
                return;
            }
            if(phase === 0){
                phase = await invoke("phase", { method: "increment" });
                emit('phase_updated');
                return;
            }
            if(phase >= 1 && phase <= 5){
                const question = queue.getCurrentQuestion();
                if(question){
                    phase = await invoke("phase", { method: "increment" });
                    await updateQuestion(question);
                    emit('phase_updated');
                    return;
                }
                console.log("No question in queue");
                return;
            }
            if(phase === 6){
                launchTimer(currentQuestion?.time || 30);
                phase = await invoke("phase", { method: "increment" });
                emit('phase_updated');
                return;
            }
            
        });
        
        listen('tab_bar_previous', async (event) => {
            if(phase === 2){
                return;
            }
            if(phase >= 3 && phase <= 6){
                    phase = await invoke("phase", { method: "decrement" });
                    emit('phase_updated');
            }
            if(phase == 7){
                stopTimer();
                phase = await invoke("phase", { method: "decrement" });
                emit('phase_updated');
            }
        });

        listen('tab_bar_reset', async (event) => {
            phase == 7 && resetTimer(currentQuestion?.time || 30);
        });

        listen('tab_bar_pause', async (event) => {
            phase == 7 && pauseTimer();
        });

        listen('tab_bar_resume', async (event) => {
            phase == 7 && resumeTimer();
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

    const isTimerPaused = () : boolean => {
        return timerPaused;
    }

    const result = { getTeams, getPhase, getAddTeamURL, getQuestion, isTimerPaused };
    return result;
}
