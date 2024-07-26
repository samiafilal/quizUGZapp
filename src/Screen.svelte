<script lang="ts">
    import { listen } from '@tauri-apps/api/event';
    import QuestionWithAnswers from './lib/QuestionWithAnswers.svelte';
    import { onMount } from 'svelte';
    import CreateTeam from './lib/CreateTeam.svelte';
    import Welcome from './lib/Welcome.svelte';
    import type { Game, Question, Team } from './types';
    import getGame from './game';
    export let master : boolean = false;
    const baseURL = "https://quizugz.fr";
    let game : Game;
    let phase : number;
    let errorMessage = '';
    let createTeamURL = '';
    let teams : Team[];
    let question : Question | undefined;

    onMount(async () => {
        getGame(master).then(async g => {
            game = g;
            createTeamURL = await game.getAddTeamURL();
            phase = await game.getPhase();
            teams = await game.getTeams();
        }).catch((e) => {
            errorMessage = e;
        });
    });

    listen('phase_updated', async (event) => {
        phase = game && await game.getPhase();
    });

    listen('question_updated', async (event) => {
        question = game && await game.getQuestion();
    });

    listen('updated_players', async (event) => {
        teams = game && await game.getTeams()
        console.table(teams);
    });
    

</script>

<main class="container">
    {#if errorMessage}
        <h1>{errorMessage}</h1>
    {:else}
        {#if phase == 0}
	        <Welcome/>
        {:else if phase == 1}
            <CreateTeam url={baseURL+createTeamURL} teams={teams}/>
        {:else if phase > 1}
            <QuestionWithAnswers phase={phase} question={question}/>
        {/if}
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
