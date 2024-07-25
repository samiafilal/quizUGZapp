import type { Team } from "./types";
import { emit } from '@tauri-apps/api/event';
import { listen } from '@tauri-apps/api/event';
import { invoke } from '@tauri-apps/api/tauri';
import WebSocket from "tauri-plugin-websocket-api";
import type { Game } from "./types";

let ws: WebSocket | void;
let phase: number;
let createTeamURL: string;
let teams: Team[] = [];
import { getClient, ResponseType } from '@tauri-apps/api/http';


function processMsg(msg: any) {
    // Implement the message processing logic here
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
            const answers = typeof(msg) === "string" ? JSON.parse(msg) : msg;
            console.table(msg);
            processMsg(msg);
        });
    }
    if(master && !createTeamURL) {
        createTeamURL = await startGame();
    }

    const getTeams = (): Team[] => {
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
