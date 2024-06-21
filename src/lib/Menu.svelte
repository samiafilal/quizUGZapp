<script lang="ts">
    import { emit } from '@tauri-apps/api/event'
    export let tabs = [
        { name: "File", icon: "fa-clock" , id: "Queue" },
        { name: "Favoris", icon: "fa-star", id: "Favorites"},
        { name: "Historique", icon: "fa-history", id: "History"},
        { name: "Questions", icon: "fa-th-list", id: "Library" },
        { name: "Editeur", icon: "fa-edit", id: "Editor" },
        { name: "Classement", icon: "fa-chart-line", id: "Ranking" },
        { name: "Sons", icon: "fa-volume-up", id: "Sounds"},
        { name: "Réseau", icon: "fa-network-wired", id: "Network" },
    ];
  
    // Emit the selected tab  
    const selectTab = (tab: string) => {
        emit('updateTab', tab)
    }
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
    }
  
    .vertical-menu {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 10%;
        height: 100%;
        padding: 2vh;
        font-family: 'Montserrat', sans-serif;
    }
  
    .tab {
        color: #ffffff;
        width: 100%;
        margin-bottom: 1vh;
        text-align: center;
        cursor: pointer;
        font-size: 1vw;
        display: flex;
        align-items: left;
        justify-content: left;
        background-color: none;
        border: none;
        outline: none;
        background: none;
        box-shadow: none;
    }
  
    .tab:hover {
        transform: scale(1.05);
        margin-left: 8%;
        width: 92%;
    }
  
    .tab:last-child {
        margin-bottom: 0;
    }
  
    .icon {
        margin-right: 0.5vw;
    }
  </style>
  
  <div class="vertical-menu">
    {#each tabs as { name, icon, id }}
      <button type="button" class="tab" on:click={() => selectTab(id)} on:keydown={(event) => event.key === 'Enter' && selectTab(id)}>
            <i class="fas {icon} icon"></i>{name}
      </button>
    {/each}
  </div>
  