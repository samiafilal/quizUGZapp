import "./styles.css";
import Screen from "./Screen.svelte";

const screen = new Screen({
  target: document.getElementById("screen"),
});

export default screen;
