<script lang="ts">
  import { emit } from '@tauri-apps/api/event'
  import getDB from '../db'

  let question: string = "";
  let answer1: string = "";
  let answer2: string = "";
  let answer3: string = "";
  let answer4: string = "";
  let difficulty: string = "Facile";
  let category: string = "Catégorie 1";

  let difficulties: string[] = ["Facile", "Moyenne", "Difficile"];
  let categories: string[] = [
    "Catégorie 1",
    "Catégorie 2",
    "Catégorie 3",
    "Catégorie 4",
    "Catégorie 5"
  ];

  async function update() {
    const db = await getDB()
    await db.addQuestion(question, [answer1, answer2, answer3, answer4])
    const questionWithAnswers = await db.getQuestion()
    emit('updateScreen', questionWithAnswers)
  }
</script>

<form class="questionWithAnswers" on:submit|preventDefault={update}>
  <textarea id="update-input" placeholder="Question" bind:value={question} class="question"></textarea>
  <div class="flexRow">
    <input placeholder="A" bind:value={answer1} class="answer"/>
    <input placeholder="B" bind:value={answer2} class="answer"/>
  </div>  
  <div class="flexRow">
    <input placeholder="C" bind:value={answer3} class="answer"/>
    <input placeholder="D" bind:value={answer4} class="answer"/>
  </div>
  <div class="flexRow">
    <select bind:value={difficulty} class="dropdown">
      {#each difficulties as diff}
        <option value={diff}>{diff}</option>
      {/each}
    </select>
    <select bind:value={category} class="dropdown">
      {#each categories as cat}
        <option value={cat}>{cat}</option>
      {/each}
    </select>
  </div>
  <button type="submit">Sauver</button>
</form>

<style>
  @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap');

  :root {
    --primary-color: #1a252f;
    --secondary-color: #34495e;
    --accent-color: #27ae60;
    --hover-color: #2980b9;
    --background-gradient-start: #422c50;
    --background-gradient-end: #4a6073;
    --input-bg-color: #e6e6e6;
    --input-border-color: rgba(0, 0, 0, 0.2);
    --input-text-color: #6f6f6f;
    --button-bg-color: #ffffff;
    --button-text-color: #0f0f0f;
  }

  .questionWithAnswers {
    border-radius: 1.5vw;
    padding: 5%;
    background-color: #f6f6f600;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 80%;
    margin: auto;
    font-family: 'Montserrat', sans-serif;
  }

  .question, .answer, .dropdown {
    background-color: var(--input-bg-color);
    color: var(--input-text-color);
    border-radius: 1vw;
    border: 0.1vw solid var(--input-border-color);
    padding: 1.5vh;
    font-size: 1em;
    font-weight: 500;
    box-shadow: 0 0.2vh 0.2vh rgba(0, 0, 0, 0.2);
    margin: 2%;
    width: 100%;
    box-sizing: border-box;
  }

  .question {
    text-align: center;
    resize: none;
    caret-color:var(--input-text-color);
  }

  .flexRow {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    width: 100%;
  }

  input, button, textarea, select {
    font-family: inherit;
    outline: none;
    transition: border-color 0.25s, background-color 0.25s, transform 0.25s;
  }

  button {
    border-radius: 1vw;
    border: 0.1vw solid transparent;
    padding: 0.6em 1.2em;
    font-size: 1em;
    font-weight: 500;
    color: var(--button-text-color);
    background-color: var(--button-bg-color);
    box-shadow: 0 0.2vh 0.2vh rgba(0, 0, 0, 0.2);
    cursor: pointer;
  }

  button:hover {
    border-color: var(--hover-color);
    background-color: #e8e8e8;
  }

  button:active {
    border-color: var(--hover-color);
    background-color: #e8e8e8;
  }

  ::placeholder {
    color: var(--input-text-color);
    opacity: 1;
  }

  select{
    height : 3.5vh
  }
</style>
