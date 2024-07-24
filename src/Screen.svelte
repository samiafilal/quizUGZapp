<script lang="ts">
    import { listen } from '@tauri-apps/api/event';
    import QuestionWithAnswers from './lib/QuestionWithAnswers.svelte';
    import { onMount } from 'svelte';
    import CreateTeam from './lib/CreateTeam.svelte';
    import Welcome from './lib/Welcome.svelte';
    import type { Game } from './types';
    import getGame from './game';
    export let master : boolean = false;
    let game : Game;

    onMount(async () => {
        game =  await getGame(master);
        phase = await game.getPhase();
    });

    listen('phase_updated', async (event) => {
        phase = await game.getPhase();
    });
    let phase : number;
    

</script>

<main class="container">
    {#if phase == 0}
	    <Welcome/>
    {:else if phase == 1}
        <CreateTeam/>
    {/if}
</main>

<style>
    .container {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        width: 100%;
        height: 100%;
        margin: auto;
        padding: 0;
        font-family: 'Montserrat', sans-serif; 
    }
   
</style>
