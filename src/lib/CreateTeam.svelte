<script lang="ts">
  import { QRCodeImage } from "svelte-qrcode-image";
  import type { Team } from "../types";
  export let url: string;
  export let teams: Team[];
</script>

<style>
  .container {
    display: flex;
    justify-content: space-around;
    align-items: center;
    flex-direction: row;
    height: 100%;
    width: 100%;
    background: linear-gradient(90deg, #422c50, #4a6073);
    font-family: 'Montserrat', sans-serif;
    overflow: hidden;
  }

  .teams-container {
    margin-bottom: 20px;
    width: 50%;
    background-color: rgba(255, 255, 255, 0.1);
    border-radius: 10px;
    padding: 20px;
    height:80%;
    overflow-y: scroll;
  }

  .team {
    margin-bottom: 20px;
  }

  .team h2 {
    color: #fff;
    margin: 0;
    padding: 10px;
    background-color: rgba(0, 0, 0, 0.2);
    border-radius: 5px;
  }

  .players {
    margin-top: 10px;
    padding-left: 20px;
  }

  .players h3 {
    color: #fff;
    margin: 5px 0;
  }

  .qr-container {
    margin-top: 20px;
  }
</style>

<div class="container">
  {#if teams}
    <div class="teams-container">
      {#each teams as team}
        <div class="team">
          <h2>{team.name}</h2>
          <div class="players">
            {#each team.players as player}
              <h3>{player.name}</h3>
            {/each}
          </div>
        </div>
      {/each}
    </div>
  {/if}
  <div class="qr-container">
    <QRCodeImage text={url} width={300} />
  </div>
</div>
