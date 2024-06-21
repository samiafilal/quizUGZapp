<script lang="ts">
  import { onMount } from 'svelte';
  import type { Question, DB, Queue } from "../types";
  import getDB from '../db';
  import getQueue from '../queue';
  let queue: Queue;
  let db: DB;
  let searchQuery = "";
  let selectedDifficulty = "Toutes";
  let selectedCategory = "Toutes";
  let container: HTMLDivElement;
  let difficulties = ["Toutes", "Facile", "Moyen", "Difficile"];
  const difficultyAsNumber = {
    "Facile": 0,
    "Moyen": 1,
    "Difficile": 2
  };
  let categories = ["Toutes"];
  let questions = [] as Question[];

  function toggleFavorite(question: Question) {
    question.favorite = question.favorite == 1 ? 0 : 1;
  }

  function addToQueue(question: Question) {
    queue.addQuestion(question);
  }

  function editQuestion(question: Question) {
    // Edit question logic
  }

  function deleteQuestion(question: Question) {
    db.deleteQuestion(question).then(() => {
      questions = questions.filter((q) => q.id !== question.id);
        db.searchInQuestionsAndAnswersFilteredByCategoryAndDifficulty(
          searchQuery,
          selectedCategory,
          difficultyAsNumber[selectedDifficulty as keyof typeof difficultyAsNumber],
          questions.length,1
        ).then((returnedQuestions) => {
          questions = [...questions, ...returnedQuestions];
        });
    })
  }

  function fetchMoreQuestions() {
    const category = selectedCategory === "Toutes" ? "" : selectedCategory;
    db.searchInQuestionsAndAnswersFilteredByCategoryAndDifficulty(
      searchQuery,
      selectedCategory,
      difficultyAsNumber[selectedDifficulty as keyof typeof difficultyAsNumber],
      questions.length,10
    ).then((returnedQuestions) => {
      questions = [...questions, ...returnedQuestions];
    });
  }

  function filtersChanged() {
    const category = selectedCategory === "Toutes" ? "" : selectedCategory;
    db.searchInQuestionsAndAnswersFilteredByCategoryAndDifficulty(
      searchQuery,
      selectedCategory,
      difficultyAsNumber[selectedDifficulty as keyof typeof difficultyAsNumber],
      0,10
    ).then((returnedQuestions) => {
      questions = returnedQuestions ?? [];
    });
  }

  let searchTimer: number | undefined;
  function queryChanged() {
    if (searchTimer) {
      clearTimeout(searchTimer);
    }
    searchTimer = setTimeout(() => {
      filtersChanged();
    }, 200);
  }

  let scrollTimer: number | undefined;
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
    getDB().then((result) => {
      db = result as DB;
      db.getAllCategories().then((returnedCategories: string[]) => {
        returnedCategories = returnedCategories ?? [];
        returnedCategories.push("Toutes");
        categories = returnedCategories;
      });
      db.searchInQuestionsAndAnswersFilteredByCategoryAndDifficulty(
        searchQuery,
        selectedCategory,
        difficultyAsNumber[selectedDifficulty as keyof typeof difficultyAsNumber],
        0,10
      ).then((returnedQuestions) => {
        questions = returnedQuestions ?? [];
      });
    });

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

  .search-container, .filter-container {
    width: 100%;
    display: flex;
    justify-content: space-between;
    margin-bottom: 1rem;
  }

  .search-container {
    position: relative;
    width: 100%;
  }

  .search-container input {
    width: 100%;
    padding: 1rem 3rem 1rem 1rem; /* Adjust padding for the search icon */
    border-radius: 1vw;
    border: 0.1vw solid var(--input-border-color);
    background-color: var(--input-bg-color);
    color: var(--input-text-color);
    font-size: 1rem;
  }

  .search-container .search-icon {
    position: absolute;
    right: 1rem;
    top: 50%;
    transform: translateY(-50%);
    font-size: 1.5rem;
    color: var(--input-text-color);
  }

  .filter-container select {
    width: 48%;
    padding: 1rem;
    border-radius: 1vw;
    border: 0.1vw solid var(--input-border-color);
    background-color: var(--input-bg-color);
    color: var(--input-text-color);
    font-size: 1rem;
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

  .question-item .actions button.favorite .fa-star {
    color: gold;
  }

  
  .question-item .actions button:not(.favorite) .fa-star-o {
    color: grey;
  }

  .question-item .actions button:active {
    transform: scale(0.95);
    box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.2);
  }
</style>

<div class="container" bind:this={container}>
  <div class="search-container">
    <input type="text" placeholder="Search..." bind:value={searchQuery} on:change={queryChanged} on:keyup={queryChanged} />
    <i class="fa fa-search search-icon"></i>
  </div>
  <div class="filter-container">
    <select bind:value={selectedDifficulty} on:change={filtersChanged}>
      {#each difficulties as difficulty}
        <option value={difficulty}>{difficulty}</option>
      {/each}
    </select>
    <select bind:value={selectedCategory} on:change={filtersChanged}>
      {#each categories as category}
        <option value={category}>{category}</option>
      {/each}
    </select>
  </div>
  <div class="question-list">
    {#each questions as question}
      <div class="question-item">
        <div class="info">
          <span class="difficulty-dot-{question.difficulty.toString()}"><i class="fa fa-circle"></i></span>
          {question.question}
        </div>
        <div class="actions">
          <button class:favorite={question.favorite == 1} on:click={() => toggleFavorite(question)}>
            <i class="fa fa-star"></i>
          </button>
          <button on:click={() => addToQueue(question)}><i class="fa fa-clock"></i></button>
          <button on:click={() => editQuestion(question)}><i class="fa fa-edit"></i></button>
          <button on:click={() => deleteQuestion(question)}><i class="fa fa-trash"></i></button>
        </div>
      </div>
    {/each}
  </div>
</div>
