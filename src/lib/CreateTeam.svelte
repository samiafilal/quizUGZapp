<script lang="ts">
  import {QRCodeImage} from "svelte-qrcode-image"
  import type { Team } from "../types";
  export let url : string;
  export let teams : Team[];
</script>

<style>
  .container {
    display: flex;
    justify-content: space-around;
    align-items: center;
    height: 100%;
    width : 100%;
    background: linear-gradient(90deg, #422c50, #4a6073);
  }
</style>

<div class="container">
    {#if teams}
        <table>
            {#each teams as team}
              <tr>
                <td><h2>{team.name}</h2></td>
                {#each team.players as player}
                <td><h3>{player.name}</h3></td>
                {/each}
              </tr>
            {/each}
        </table>
    {/if}
    <QRCodeImage text={url} width={300}  />
</div>
