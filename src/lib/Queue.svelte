<script lang="ts">
  import { onMount } from 'svelte';
  import type { Question, Queue } from "../types";
  import getQueue from '../queue';
  

  let queue: Queue;
  let container: HTMLDivElement;
  
  let questions = [] as Question[];

  

 

  function fetchMoreQuestions() {
    questions = [...questions, ...queue.getQuestions(questions.length,10)];
  }

  function deleteQuestion(question: Question) {
    queue.deleteQuestion(question);
    questions = questions.filter((q) => q.id !== question.id);
    questions = [...questions, ...queue.getQuestions(questions.length,1)];
  }

  function moveQuestionUp(question: Question) {
    queue.moveQuestionUp(question);
    const index = questions.findIndex(q => q === question)
    if (index > 0) {
      questions[index] = questions[index-1];
      questions[index-1] = question;
    }
  }
  function moveQuestionDown(question: Question) {
    queue.moveQuestionDown(question);
    const index = questions.findIndex(q => q === question)
    if (index < questions.length - 1) {
      questions[index] = questions[index+1];
      questions[index+1] = question;
    }
  }
  

  let scrollTimer: NodeJS.Timeout | undefined;
  function handleScroll() {
    if (container.scrollTop + container.clientHeight >= container.scrollHeight) {
      if (scrollTimer) {
        clearTimeout(scrollTimer);
      }
      scrollTimer = setTimeout(() => {
        console.log("Reached bottom of scrollable container");
        onScrollEnd();
      }, 200);
    }
  }

  function onScrollEnd() {
    fetchMoreQuestions();
  }

  onMount(() => {
    queue = getQueue();
    questions = queue.getQuestions(0,10);
    container.addEventListener('scroll', handleScroll);
    return () => {
      container.removeEventListener('scroll', handleScroll);
    };
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

  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    height: 80vh; /* Set height for scrollable area */
    margin: auto;
    padding: 2rem;
    background-color: var(--background-color-dark);
    border-radius: 1.5vw;
    font-family: 'Montserrat', sans-serif;
    overflow-y: auto; /* Enable vertical scrolling */
  }

  

  .question-list {
    width: 100%;
  }

  .question-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    margin-bottom: 1rem;
    background-color: var(--secondary-color);
    border-radius: 1vw;
    color: white;
    font-size: 1rem;
  }

 

  .question-item .difficulty-dot-0 {
    color: var(--easy-color);
    margin-right: 1vw;
  }

  .question-item .difficulty-dot-1 {
    color: var(--medium-color);
    margin-right: 1vw;
  }

  .question-item .difficulty-dot-2 {
    color: var(--hard-color);
    margin-right: 1vw;
  }

  .question-item .actions {
    display: flex;
    align-items: center;
  }

  .question-item .actions button {
    border: none;
    background: none;
    cursor: pointer;
    margin-left: 1rem;
    font-size: 1rem;
  }

</style>

<div class="container" bind:this={container}>
  <div class="question-list">
    {#each questions as question, idx}
      <div class="question-item">
        <div class="info">
          <span class="difficulty-dot-{question.difficulty.toString()}"><i class="fa fa-circle"></i></span>
          {question.question}
        </div>
        <div class="actions">
          {#if idx === 0}
            <button disabled><i class="fa fa-arrow-up"></i></button>
          {:else}
            <button on:click={() => {moveQuestionUp(question)}}><i class="fa fa-arrow-up"></i></button>
          {/if}
          {#if idx === questions.length - 1}
            <button disabled><i class="fa fa-arrow-down"></i></button>
          {:else}
            <button on:click={() => {moveQuestionDown(question)}}><i class="fa fa-arrow-down"></i></button>
          {/if}
          <button on:click={() => {deleteQuestion(question)}}><i class="fa fa-trash"></i></button>
        </div>
      </div>
    {/each}
  </div>
</div>
