const { send, on } = window.electron;
const toggleButton = document.getElementById("toggleButton");
const statusIndicator = document.getElementById("statusIndicator");

let scriptRunning = false;

toggleButton.addEventListener("click", () => {
  send("toggle-script");
});

on("script-status", (isRunning) => {
  scriptRunning = isRunning;
  statusIndicator.textContent = isRunning ? "Script is ON" : "Script is OFF";
});
