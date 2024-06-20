<script lang="ts">
  import Editor from "./Editor.svelte";
  import Library from "./Library.svelte";
  import { listen } from '@tauri-apps/api/event';

  let selectedTab: string = "Library";

  function selectTab(tab: string) {
    selectedTab = tab;
  }
  listen('updateTab', (event) => {
        const payload = event.payload as string;
        selectTab(payload);
  });
</script>

<div id="container">
  {#if selectedTab === "Editor"}
    <Editor />
  {:else if selectedTab === "Library"}
    <Library />
  {/if}
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
        font-family: 'Montserrat', sans-serif; /* Choix de police */
    }
</style>