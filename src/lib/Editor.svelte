<script lang="ts">
  import { emit } from '@tauri-apps/api/event'
  import getDB from '../db'

  let question: string="", answer1: string="", answer2: string="", answer3: string="", answer4: string = "" 

  async function update(){
    const db = await getDB()
    await db.addQuestion(question, [answer1, answer2, answer3, answer4])
    const questionWithAnswers = await db.getQuestion()
    emit('updateScreen', questionWithAnswers)
  }
</script>

  <form class="questionWithAnswers" on:submit|preventDefault={update}>
    <textarea id="update-input" placeholder="Question" bind:value={question} class="question"/>
    <div class="flexRow">
      <input placeholder="Answer 1" bind:value={answer1} class="answer"/>
      <input placeholder="Answer 2" bind:value={answer2} class="answer"/>
    </div>  
    <div class="flexRow">
      <input placeholder="Answer 3" bind:value={answer3} class="answer"/>
      <input placeholder="Answer 4" bind:value={answer4} class="answer"/>
    </div> 
    <button type="submit">Update</button>
  </form>


<style>
  input,
button {
  border-radius: 8px;
  border: 1px solid transparent;
  padding: 0.6em 1.2em;
  font-size: 1em;
  font-weight: 500;
  font-family: inherit;
  color: #0f0f0f;
  background-color: #ffffff;
  transition: border-color 0.25s;
  box-shadow: 0 2px 2px rgba(0, 0, 0, 0.2);
}

textarea{
  border-radius: 8px;
  border: 1px solid rgba(0, 0, 0, 0.2);
  padding: 0.6em 1.2em;
  font-size: 1em;
  font-weight: 500;
  font-family: inherit;
  color: #6f6f6f;
  background-color: #ffffff;
  transition: border-color 0.25s;
  box-shadow: 0 2px 2px rgba(0, 0, 0, 0.2);
  resize: none;
  box-sizing: border-box;
  caret-color: #fff;
}

button {
  cursor: pointer;
}

button:hover {
  border-color: #396cd8;
}
button:active {
  border-color: #396cd8;
  background-color: #e8e8e8;
}

input,
button {
  outline: none;
}

.answer{
  background-color: #e6e6e6;
  color: #6f6f6f;

  margin: 2%;
  width : 100%;
}
.question{
  background-color: #e6e6e6;
  margin: 2%;
  text-align: center;
  width:100%;
  display : block;
}
.flexRow{
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width:100%;
}

.questionWithAnswers{
  border-radius: 20px;
  padding: 5%;
  background-color: #f6f6f6;
  display: block;
  flex-direction: column;
  align-items: center;
  width:80%;
  margin:auto;
}

::placeholder { 
  color: #fff; 
  opacity: 1; 
}
</style>


