<script lang="ts">
    import { listen } from '@tauri-apps/api/event';
    import QuestionWithAnswers from './lib/QuestionWithAnswers.svelte';
    import CreateTeam from './lib/CreateTeam.svelte';
</script>

<main class="container">
    <CreateTeam/>
    <i class="fas fa-expand expand-icon"></i> <!-- Font Awesome expand icon -->
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
        font-family: 'Montserrat', sans-serif; /* Choix de police */
        position: relative; /* Make the container the reference for absolute positioning */
    }
    .expand-icon {
        position: absolute;
        top: 10px; /* Adjust as needed */
        right: 10px; /* Adjust as needed */
        font-size: 24px; /* Adjust as needed */
        color: #000; /* Adjust as needed */
        cursor: pointer;
    }
</style>
