<script lang="ts">
    import { listen } from '@tauri-apps/api/event';
    import QuestionWithAnswers from './lib/QuestionWithAnswers.svelte';
    import CreateTeam from './lib/CreateTeam.svelte';
</script>

<main class="container">
    <CreateTeam/>
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
