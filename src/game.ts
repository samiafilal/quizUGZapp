import type { Team } from "./types";
import { emit } from '@tauri-apps/api/event'
import { listen } from '@tauri-apps/api/event';
import { invoke } from '@tauri-apps/api/tauri';
import WebSocket from "tauri-plugin-websocket-api";
import type { Game } from "./types";
let ws ;
let phase : number;
let teams : Team[] = []
listen('tab_bar_next', async (event) => {
    phase = await invoke("phase",{method : "increment"})
    emit('phase_updated')
});
listen('tab_bar_previous', async (event) => {
    phase = await invoke("phase",{method : "decrement"})
    emit('phase_updated')
});


export default async function getGame(master : boolean) : Promise<Game> {
    phase = await invoke("phase",{method : "get"})
    if(master){
        ws = await WebSocket.connect("wss://quizugz.fr/masterSocket");
        console.log("master")
        ws.addListener((msg) => {
            const answers = typeof(msg) == "string" ? JSON.parse(msg) : msg;
            console.table(msg)
        });
    }

    const getTeams = (): Team[] => {
        return teams;
    }

    const getPhase =  (): number => {
        return phase;
    }

    const result = {getTeams,getPhase};
    return result;
}
