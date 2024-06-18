<script>
  export let categories = [
      { name: "File d'attente", icon: "fa-clock" },
      { name: "Favoris", icon: "fa-star" },
      { name: "Historique", icon: "fa-history" },
      { name: "Catégories", icon: "fa-th-list" },
      { name: "Editeur", icon: "fa-edit" },
      { name: "Classement", icon: "fa-chart-line" },
      { name: "Sons", icon: "fa-volume-up" },
      { name: "Réseau", icon: "fa-network-wired" }
  ];
</script>

<style>
  @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap');

  :root {
      --primary-color: #1a252f;
      --secondary-color: #34495e;
      --accent-color: #27ae60;
      --hover-color: #2980b9;
      --background-gradient-start: #422c50;
      --background-gradient-end: #4a6073;
  }

  .vertical-menu {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 10%;
      height: 100%;
      background: linear-gradient(90deg, var(--background-gradient-start), var(--background-gradient-end));
      padding: 2vh;
      font-family: 'Montserrat', sans-serif;
  }

  .category {
      color: #ffffff;
      width: 100%;
      padding: 1.5vh;
      margin-bottom: 1vh;
      border: 0.1vh solid var(--primary-color);
      border-radius: 1vw;
      text-align: center;
      background-color: var(--secondary-color);
      cursor: pointer;
      transition: background-color 0.3s ease, transform 0.3s ease;
      font-size: 1vw;
      display: flex;
      align-items: left;
      justify-content: left;
  }

  .category:hover {
      background-color: var(--hover-color);
      transform: scale(1.05);
  }

  .category:last-child {
      margin-bottom: 0;
  }

  .icon {
      margin-right: 0.5vw;
  }
</style>

<div class="vertical-menu">
  {#each categories as { name, icon }}
      <div class="category">
          <i class="fas {icon} icon"></i>{name}
      </div>
  {/each}
</div>
