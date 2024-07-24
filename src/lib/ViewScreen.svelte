<script lang="ts">
  import Screen from '../Screen.svelte';
  import { WebviewWindow } from '@tauri-apps/api/window'
  const openWindow = () => {
    const webview = new WebviewWindow('Screen', {
      url: 'index_screen.html',
    })
    webview.once('tauri://error', function (e) {
      console.log(e)
    })
  }
</script>

<div id="main">
  <button class="fas fa-expand expand-icon" on:click={() => {openWindow()}} aria-label="Expand" type="button"></button>
  <Screen master={true}/>
</div>

<style>
  #main {
    width:100%;
    height:45%;
    display: flex;
    position:relative;
  } 
  .expand-icon {
        position: absolute;
        top: 10px; 
        right: 10px; 
        font-size: 24px; 
        color: #000; 
        cursor: pointer;
    }
</style>