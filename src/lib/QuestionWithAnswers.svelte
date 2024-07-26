<script lang="ts">
    import { listen } from '@tauri-apps/api/event';
    import type { Question } from '../types';
    export let phase: number;
    export let question : Question | undefined;
</script>

<main class="container"> 
    {#if question}
    <div class="questionWithAnswers">
        <div class="question">{question && question.question}</div>
        <div class="flexRow">
            <div class='answer'>{phase >= 3 ? question.answer1 : "?"}</div> 
            <div class='answer'>{phase >= 4 ? question.answer2 : "?"}</div> 
        </div>
        <div class="flexRow">
            <div class='answer'>{phase >= 5 ? question.answer3 : "?"}</div> 
            <div class='answer'>{phase >= 6 ? question.answer4 : "?"}</div> 
        </div>
    </div>
    {/if}
</main>

<style>
    @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap');

    :root {
        --primary-color: #1a252f; /* Main color (dark blue) */
        --secondary-color: #34495e; /* Secondary color (dark blue) */
        --accent-color: #27ae60; /* Accent color (dark green) */
        --hover-color: #2980b9; /* Hover color (dark blue) */
        --background-gradient-start: #422c50; /* Gradient start color */
        --background-gradient-end: #4a6073; /* Gradient end color */
    }

    .container {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        width: 100%;
        height: 100%;
        margin: auto;
        padding: 0;
        font-family: 'Montserrat', sans-serif; /* Font choice */
        background: linear-gradient(90deg, var(--background-gradient-start), var(--background-gradient-end));
    }

    .questionWithAnswers {
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 60%;
        padding: 2vh;
        background-color: rgba(0, 0, 0, 0);
        box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
        border-radius: 15px;
        animation: fadeIn 1s ease-in-out; /* Fade-in animation */
        overflow: hidden; /* Hide overflow */
    }

    .question {
        white-space: pre-wrap;
        color: #ffffff; /* White text */
        width: 100%;
        padding: 2vh;
        border-radius: 10px;
        font-size: 3vh;
        text-align: center;
        background-color: rgba(0, 0, 0, 0);
        transition: background-color 0.3s ease; /* Background color transition */
    }

    .flexRow {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        width: 100%;
        margin-top: 2vh;
    }

    .answer, .emptyAnswer {
        color: #ffffff; /* White text */
        width: 48%;
        padding: 2vh;
        text-align: center;
        background-color: transparent;
        border-radius: 10px;
        font-size: 3vh;
        transition: background-color 0.3s ease, transform 0.3s ease; /* Background color and transform transition */
        cursor: pointer;
    }

    .answer:hover {
        background-color: var(--hover-color);
        transform: scale(1.05);
    }

    .emptyAnswer {
        color: var(--primary-color);
    }

    /* Fade-in animation */
    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(-20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
</style>
