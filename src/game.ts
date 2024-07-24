import type { Team } from "./types";
import { emit } from '@tauri-apps/api/event'
import { listen } from '@tauri-apps/api/event';
import { writable } from 'svelte/store';
import { invoke } from '@tauri-apps/api/tauri';
let teams : Team[] = []
listen('tab_bar_next', async (event) => {
    await invoke("phase",{method : "increment"})
    emit('phase_updated')
});
listen('tab_bar_previous', async (event) => {
    await invoke("phase",{method : "decrement"})
    emit('phase_updated')
});


export default function getGame(){
    
    const getTeams = (): Team[] => {
        return teams;
    }

    const getPhase = async (): Promise<number> => {
        return invoke("phase",{method : "get"});
    }

    const result = {getTeams,getPhase};
    return result;
}
