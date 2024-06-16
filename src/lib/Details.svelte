<script lang="ts">
  import Editor from "./Editor.svelte";
</script>

<div id="container">
  <Editor/>
</div>

<style>
  #container {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        width:60%;
        height: 100%;
        margin : auto;
        padding : 0;
        background: linear-gradient(90deg, var(--background-gradient-start), var(--background-gradient-end)); /* Dégradé d'arrière-plan foncé */
        font-family: 'Montserrat', sans-serif; /* Choix de police */
    }
</style>