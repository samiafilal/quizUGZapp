<script lang="ts">
  import {QRCodeImage} from "svelte-qrcode-image"
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
    <h1>Créez votre équipe  </h1>
    <QRCodeImage text="https://quizugz.fr/createTeam" width={300}  />
</div>
