<script lang="ts">
    import { listen } from '@tauri-apps/api/event';
    import type { Question } from '../types';
    export let phase: number;
    export let question : Question | undefined;
</script>

<main class="container"> 
    <div class="questionWithAnswers">
        <div class="question">{question && question.question}</div>
        <div class="flexRow">
            <div class="answer">{question && question.answer1}</div>
            <div class="answer">{question && question.answer2}</div>
        </div>
        <div class="flexRow">
            <div class="answer">{question && question.answer3}</div>
            <div class="answer">{question && question.answer4}</div>
        </div>
    </div>
</main>

<style>
    @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap');

    /* Définition des couleurs */
    :root {
        --primary-color: #1a252f; /* Couleur principale (bleu très foncé) */
        --secondary-color: #34495e; /* Couleur secondaire (bleu foncé) */
        --accent-color: #27ae60; /* Couleur d'accentuation (vert foncé) */
        --hover-color: #2980b9; /* Couleur au survol (bleu foncé) */
        --background-gradient-start: #422c50; /* Dégradé de fond début */
        --background-gradient-end: #4a6073; /* Dégradé de fond fin */
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
        font-family: 'Montserrat', sans-serif; /* Choix de police */
    }

    .questionWithAnswers {
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 60%;
        height: auto;
        padding: 2vh;
        background-color: #1a252f;
        box-shadow: 0 0 2vh rgba(0, 0, 0, 0.1);
        animation: fadeIn 1s ease-in-out; /* Animation d'apparition */
        overflow: hidden; /* Ajouté pour masquer le pseudo-élément débordant */
    }

    

    .question {
        white-space: pre-wrap;
        color: #ffffff; /* Texte blanc */
        width: 100%;
        padding: 1.5vh;
        border: 0.1vh solid var(--primary-color);
        border-radius: 1vw;
        font-size: 1.45vw;
        text-align: center;
        background-color: var(--secondary-color);
        transition: background-color 0.3s ease; /* Transition pour l'effet dynamique */
    }

   

    .flexRow {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        width: 100%;
    }

    .answer {
        color: #ffffff; /* Texte blanc */
        width: 48%;
        padding: 1.5vh;
        border: 0.1vh solid var(--primary-color);
        border-radius: 1vw;
        text-align: center;
        background-color: var(--secondary-color);
        transition: background-color 0.3s ease, transform 0.3s ease; /* Transition pour l'effet dynamique */
        font-size: 1.45vw;
    }


    /* Animation d'apparition */
    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(-1vh);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
</style>
