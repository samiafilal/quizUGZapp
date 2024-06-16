<script lang="ts">
  import TabBar from './lib/TabBar.svelte';
  import Menu from './lib/Menu.svelte';  
  import Details from './lib/Details.svelte';
  import Songs from './lib/Songs.svelte';
  import ViewScreen from './lib/ViewScreen.svelte';
</script>

<main id="container">
  <div class="column" id="column1">
    <TabBar/>
    <div class = "row" id="row1">
        <Menu/>
      <div class="column" id="column2">
        <ViewScreen/>
        <div class = "row" id="row2">
          <Details/>  
          <Songs/>
        </div>
      </div>
    </div>
  </div>
</main>

<style>

#container {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        width:100%;
        height: 100%;
        margin : auto;
        padding : 0;
        background: linear-gradient(90deg, var(--background-gradient-start), var(--background-gradient-end)); /* Dégradé d'arrière-plan foncé */
        font-family: 'Montserrat', sans-serif; /* Choix de police */
    }

 
  #column1{
   width : 100%;
   height : 100%;
   display: flex;
    background: linear-gradient(90deg, var(--background-gradient-start), var(--background-gradient-end));
    flex-direction: column;
  }
  #row1{
   width : 100%;
   height: 90%;
   display: flex;
    background: linear-gradient(90deg, var(--background-gradient-start), var(--background-gradient-end));
    flex-direction: row;
  }
  #column2{
   width : 90%;
   height : 100%;
   display: flex;
    background: linear-gradient(90deg, var(--background-gradient-start), var(--background-gradient-end));
    flex-direction: column;
  }
  #row2{
   width : 100%;
   height: 60%;
   display: flex;
    background: linear-gradient(90deg, var(--background-gradient-start), var(--background-gradient-end));
    flex-direction: row;
  }
  .row {
    display: flex;
    background: linear-gradient(90deg, var(--background-gradient-start), var(--background-gradient-end));
    flex-direction: row;
  } 
  .column {
    display: flex;
    background: linear-gradient(90deg, var(--background-gradient-start), var(--background-gradient-end));
    flex-direction: column;
  } 

</style>