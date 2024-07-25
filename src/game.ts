import type { Team, Game, ServerPlayer, ServerTeam } from "./types";
import { emit } from '@tauri-apps/api/event';
import { listen } from '@tauri-apps/api/event';
import { invoke } from '@tauri-apps/api/tauri';
import WebSocket from "tauri-plugin-websocket-api";

let ws: WebSocket | void;
let phase: number;
let createTeamURL: string;
let teams: Team[] = [];
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
    if(master) {
        listen('tab_bar_next', async (event) => {
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

    const getPhase = async (): Promise<number> => {
        phase = await invoke("phase", { method: "get" });
        return phase;
    }

    const getAddTeamURL = async (): Promise<string> => {
        createTeamURL = await invoke("add_team_url", { method: "get", url: ""});
        return createTeamURL;
    }

    const result = { getTeams, getPhase, getAddTeamURL };
    return result;
}
