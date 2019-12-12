import openSocket from "socket.io-client";
const socket = openSocket("http://localhost:8000");

function updateState(gameState) {
  socket.emit("subscribeToState", gameState);
}

function updater(receieveState) {
  socket.on("state", receieveState);
}

export { updateState, updater };
