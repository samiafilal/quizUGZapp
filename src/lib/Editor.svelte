<script lang="ts">
  import getDB from '../db'
  import { onMount } from 'svelte';
  import type { Question } from "../types";
  import type { DB } from "../types";
  let db: DB; 
  let question: string = "";
  let answer1: string = "";
  let answer2: string = "";
  let answer3: string = "";
  let answer4: string = "";
  let difficulty: string = "Facile";
  let category: string = "";

  let difficulties: string[] = ["Facile", "Moyenne", "Difficile"];
  let categories: string[] = [
    "Sport",
    "Musique",
    "Histoire",
    "Sciences",
    "Cinéma"
  ];

let mockQuestions : Question[] = 
[
    {
        "id": 1,
        "question": "Quel est le sport le plus populaire au monde?",
        "answer1": "Basketball",
        "answer2": "Football",
        "answer3": "Tennis",
        "answer4": "Rugby",
        "correct_answer": 1,
        "category": "Sport",
        "difficulty": 1,
        "favorite": 0,
        "time": 20
    },
    {
        "id": 2,
        "question": "Qui a composé la Symphonie No. 9?",
        "answer1": "Mozart",
        "answer2": "Beethoven",
        "answer3": "Bach",
        "answer4": "Chopin",
        "correct_answer": 1,
        "category": "Musique",
        "difficulty": 2,
        "favorite": 1,
        "time": 35
    },
    {
        "id": 3,
        "question": "Quelle année a marqué la fin de la Seconde Guerre mondiale?",
        "answer1": "1945",
        "answer2": "1939",
        "answer3": "1941",
        "answer4": "1944",
        "correct_answer": 0,
        "category": "Histoire",
        "difficulty": 1,
        "favorite": 0,
        "time": 30
    },
    {
        "id": 4,
        "question": "Quelle est la planète la plus proche du soleil?",
        "answer1": "Mars",
        "answer2": "Vénus",
        "answer3": "Mercure",
        "answer4": "Terre",
        "correct_answer": 2,
        "category": "Sciences",
        "difficulty": 0,
        "favorite": 1,
        "time": 25
    },
    {
        "id": 5,
        "question": "Qui a réalisé le film 'Inception'?",
        "answer1": "Steven Spielberg",
        "answer2": "James Cameron",
        "answer3": "Quentin Tarantino",
        "answer4": "Christopher Nolan",
        "correct_answer": 3,
        "category": "Cinéma",
        "difficulty": 1,
        "favorite": 0,
        "time": 40
    },
    {
        "id": 6,
        "question": "Combien de joueurs y a-t-il dans une équipe de football?",
        "answer1": "9",
        "answer2": "10",
        "answer3": "11",
        "answer4": "12",
        "correct_answer": 2,
        "category": "Sport",
        "difficulty": 0,
        "favorite": 1,
        "time": 30
    },
    {
        "id": 7,
        "question": "Quelle est la capitale de la France?",
        "answer1": "Berlin",
        "answer2": "Madrid",
        "answer3": "Paris",
        "answer4": "Rome",
        "correct_answer": 2,
        "category": "Histoire",
        "difficulty": 0,
        "favorite": 0,
        "time": 20
    },
    {
        "id": 8,
        "question": "Qui est connu comme le 'Roi du Pop'?",
        "answer1": "Elvis Presley",
        "answer2": "Michael Jackson",
        "answer3": "Freddie Mercury",
        "answer4": "Prince",
        "correct_answer": 1,
        "category": "Musique",
        "difficulty": 0,
        "favorite": 1,
        "time": 35
    },
    {
        "id": 9,
        "question": "Quelle est la formule chimique de l'eau?",
        "answer1": "H2O",
        "answer2": "CO2",
        "answer3": "O2",
        "answer4": "N2",
        "correct_answer": 0,
        "category": "Sciences",
        "difficulty": 0,
        "favorite": 0,
        "time": 25
    },
    {
        "id": 10,
        "question": "Quel film a remporté l'Oscar du meilleur film en 2020?",
        "answer1": "Parasite",
        "answer2": "Joker",
        "answer3": "1917",
        "answer4": "Once Upon a Time in Hollywood",
        "correct_answer": 0,
        "category": "Cinéma",
        "difficulty": 2,
        "favorite": 1,
        "time": 40
    },
    {
        "id": 11,
        "question": "Quel est le plus grand océan du monde?",
        "answer1": "Océan Atlantique",
        "answer2": "Océan Indien",
        "answer3": "Océan Arctique",
        "answer4": "Océan Pacifique",
        "correct_answer": 3,
        "category": "Sciences",
        "difficulty": 1,
        "favorite": 0,
        "time": 30
    },
    {
        "id": 12,
        "question": "Quelle est la note la plus aiguë sur un piano?",
        "answer1": "Do",
        "answer2": "Ré",
        "answer3": "Sol",
        "answer4": "La",
        "correct_answer": 0,
        "category": "Musique",
        "difficulty": 2,
        "favorite": 1,
        "time": 40
    },
    {
        "id": 13,
        "question": "Qui a écrit 'Les Misérables'?",
        "answer1": "Victor Hugo",
        "answer2": "Emile Zola",
        "answer3": "Honoré de Balzac",
        "answer4": "Gustave Flaubert",
        "correct_answer": 0,
        "category": "Histoire",
        "difficulty": 1,
        "favorite": 0,
        "time": 25
    },
    {
        "id": 14,
        "question": "Quelle est la vitesse de la lumière?",
        "answer1": "300,000 km/s",
        "answer2": "150,000 km/s",
        "answer3": "450,000 km/s",
        "answer4": "600,000 km/s",
        "correct_answer": 0,
        "category": "Sciences",
        "difficulty": 2,
        "favorite": 1,
        "time": 45
    },
    {
        "id": 15,
        "question": "Quel acteur joue le rôle principal dans 'Pirates des Caraïbes'?",
        "answer1": "Brad Pitt",
        "answer2": "Johnny Depp",
        "answer3": "Leonardo DiCaprio",
        "answer4": "Tom Cruise",
        "correct_answer": 1,
        "category": "Cinéma",
        "difficulty": 0,
        "favorite": 0,
        "time": 20
    },
    {
        "id": 16,
        "question": "Combien de joueurs y a-t-il dans une équipe de basketball?",
        "answer1": "5",
        "answer2": "6",
        "answer3": "7",
        "answer4": "8",
        "correct_answer": 0,
        "category": "Sport",
        "difficulty": 0,
        "favorite": 1,
        "time": 25
    },
    {
        "id": 17,
        "question": "Qui est connu comme le 'Roi du Rock'?",
        "answer1": "Elvis Presley",
        "answer2": "Chuck Berry",
        "answer3": "Buddy Holly",
        "answer4": "Little Richard",
        "correct_answer": 0,
        "category": "Musique",
        "difficulty": 1,
        "favorite": 0,
        "time": 30
    },
    {
        "id": 18,
        "question": "Quelle année a vu la chute du mur de Berlin?",
        "answer1": "1987",
        "answer2": "1988",
        "answer3": "1989",
        "answer4": "1990",
        "correct_answer": 2,
        "category": "Histoire",
        "difficulty": 0,
        "favorite": 1,
        "time": 20
    },
    {
        "id": 19,
        "question": "Quel est l'élément chimique représenté par le symbole 'O'?",
        "answer1": "Or",
        "answer2": "Oxygène",
        "answer3": "Osmium",
        "answer4": "Ortium",
        "correct_answer": 1,
        "category": "Sciences",
        "difficulty": 0,
        "favorite": 0,
        "time": 35
    },
    {
        "id": 20,
        "question": "Qui a réalisé 'Titanic'?",
        "answer1": "Steven Spielberg",
        "answer2": "James Cameron",
        "answer3": "Martin Scorsese",
        "answer4": "Christopher Nolan",
        "correct_answer": 1,
        "category": "Cinéma",
        "difficulty": 1,
        "favorite": 1,
        "time": 30
    },
    {
        "id": 21,
        "question": "Quel sport utilise une balle jaune et une raquette?",
        "answer1": "Badminton",
        "answer2": "Squash",
        "answer3": "Tennis",
        "answer4": "Ping-Pong",
        "correct_answer": 2,
        "category": "Sport",
        "difficulty": 0,
        "favorite": 0,
        "time": 25
    },
    {
        "id": 22,
        "question": "Quelle est la capitale de l'Italie?",
        "answer1": "Milan",
        "answer2": "Rome",
        "answer3": "Venise",
        "answer4": "Florence",
        "correct_answer": 1,
        "category": "Histoire",
        "difficulty": 0,
        "favorite": 1,
        "time": 20
    },
    {
        "id": 23,
        "question": "Quel est le symbole chimique du Fer?",
        "answer1": "Fe",
        "answer2": "Ir",
        "answer3": "Fr",
        "answer4": "F",
        "correct_answer": 0,
        "category": "Sciences",
        "difficulty": 1,
        "favorite": 0,
        "time": 30
    },
    {
        "id": 24,
        "question": "Qui a écrit 'Bohemian Rhapsody'?",
        "answer1": "Freddie Mercury",
        "answer2": "John Lennon",
        "answer3": "David Bowie",
        "answer4": "Paul McCartney",
        "correct_answer": 0,
        "category": "Musique",
        "difficulty": 1,
        "favorite": 1,
        "time": 35
    },
    {
        "id": 25,
        "question": "Quel film a remporté l'Oscar du meilleur film en 2018?",
        "answer1": "La La Land",
        "answer2": "Moonlight",
        "answer3": "The Shape of Water",
        "answer4": "Three Billboards Outside Ebbing, Missouri",
        "correct_answer": 2,
        "category": "Cinéma",
        "difficulty": 2,
        "favorite": 0,
        "time": 45
    },
    {
        "id": 26,
        "question": "Quelle est la capitale de l'Espagne?",
        "answer1": "Barcelone",
        "answer2": "Séville",
        "answer3": "Madrid",
        "answer4": "Valence",
        "correct_answer": 2,
        "category": "Histoire",
        "difficulty": 0,
        "favorite": 1,
        "time": 25
    },
    {
        "id": 27,
        "question": "Quelle planète est connue comme la Planète Rouge?",
        "answer1": "Jupiter",
        "answer2": "Mars",
        "answer3": "Saturne",
        "answer4": "Vénus",
        "correct_answer": 1,
        "category": "Sciences",
        "difficulty": 0,
        "favorite": 0,
        "time": 20
    },
    {
        "id": 28,
        "question": "Qui a chanté 'Thriller'?",
        "answer1": "Prince",
        "answer2": "David Bowie",
        "answer3": "Michael Jackson",
        "answer4": "Stevie Wonder",
        "correct_answer": 2,
        "category": "Musique",
        "difficulty": 0,
        "favorite": 1,
        "time": 35
    },
    {
        "id": 29,
        "question": "Quel est le plus petit pays du monde?",
        "answer1": "Monaco",
        "answer2": "Liechtenstein",
        "answer3": "Vatican",
        "answer4": "Malte",
        "correct_answer": 2,
        "category": "Histoire",
        "difficulty": 1,
        "favorite": 0,
        "time": 30
    },
    {
        "id": 30,
        "question": "Qui a dirigé 'Pulp Fiction'?",
        "answer1": "Steven Spielberg",
        "answer2": "Quentin Tarantino",
        "answer3": "James Cameron",
        "answer4": "Martin Scorsese",
        "correct_answer": 1,
        "category": "Cinéma",
        "difficulty": 2,
        "favorite": 1,
        "time": 45
    }
]



  

  async function update() {
    
  }

  onMount(() => {
    getDB().then(async (result) => {
      db = result as DB;
      for(let i=0; i< mockQuestions.length; i++){
        await db.addQuestion(mockQuestions[i]);
      }
    });
    });
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
    <input list="categories" bind:value={category} class="answer" />
    <datalist id="categories">
      {#each categories as cat}
        <option value={cat}>{cat}</option>
      {/each}
    </datalist>
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
