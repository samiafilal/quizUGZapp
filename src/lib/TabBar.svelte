<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { onMount } from 'svelte';
  import type { Question, Queue } from "../types";
  import getQueue from '../queue';
  import { listen } from '@tauri-apps/api/event';

  let queue: Queue;
  let currentQuestion = "";
  let currentDifficulty = -1;
  let currentCategory = "";


  function next() {
  }

  function previous() {
  }

  listen("question_added_to_queue", (event) => {
    const question : Question | undefined = queue.getCurrentQuestion();
    console.log(question)
    currentQuestion = (question && question.question) ?? "";
    currentCategory = (question && question.category) ?? "";
    currentDifficulty = (question && question.difficulty) ?? -1;
  });

  listen("question_deleted_from_queue", (event) => {
    const question : Question | undefined = queue.getCurrentQuestion();
    console.log(question)
    currentQuestion = (question && question.question) ?? "";
    currentCategory = (question && question.category) ?? "";
    currentDifficulty = (question && question.difficulty) ?? -1;
  });

  onMount(() => {
    queue = getQueue();
  });

</script>

<style>
  @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap');

  :root {
    --primary-color: #1a252f;
    --secondary-color: #34495e;
    --accent-color: #27ae60;
    --hover-color: rgba(255, 255, 255, 0.1);
    --background-gradient-start: #422c50;
    --background-gradient-end: #4a6073;
    --input-bg-color: #e6e6e6;
    --input-border-color: rgba(0, 0, 0, 0.2);
    --input-text-color: #6f6f6f;
    --button-bg-color: #ffffff;
    --button-text-color: #0f0f0f;
    --background-color-dark: #1a252f;
    --easy-color: #27ae60; /* green */
    --medium-color: #f1c40f; /* yellow */
    --hard-color: #e74c3c; /* red */
  }

  .tab-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem;
    background-color: rgba(255,255 , 255, 0.2);
    width: 100%;
    height: 10%;
    box-sizing: border-box;
    font-family: 'Montserrat', sans-serif;
  }

  .controls {
    display: flex;
    align-items: center;
  }

  .controls button {
    border: none;
    background: none;
    color: var(--button-text-color);
    padding: 0.5rem;
    cursor: pointer;
    font-size: 1.5rem;
    margin-right: 1rem;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }

  .controls button:hover {
    color: var(--hover-color);
  }

  .controls button:active {
    transform: scale(0.95);
  }

  .current-question {
    display: flex;
    align-items: center;
    color: white;
    font-size: 1rem;
  }

 

  .difficulty-dot-0 {
    color: var(--easy-color);
  }

  .difficulty-dot-1 {
    color: var(--medium-color);
  }

  .difficulty-dot-2 {
    color: var(--hard-color);
  }

  .category {
    color: white;
    font-size: 1rem;
  }

  .fa.fa-circle {
    margin-right: 1vw;
  }

</style>

<div class="tab-bar">
  <div class="controls">
    <button on:click={previous}><i class="fa fa-arrow-left"></i></button>
    <button on:click={next}><i class="fa fa-arrow-right"></i></button>
  </div>
  <div class="current-question">
    {#if currentDifficulty != -1}
    <span class="difficulty-dot-{currentDifficulty.toString()}"><i class="fa fa-circle"></i></span>
    {/if}
    {currentQuestion ?? ""}
  </div>
  <div class="category">
    {currentCategory ?? ""}
  </div>
</div>
