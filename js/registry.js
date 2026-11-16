// Every player data file calls registerPlayer({...}). See data/_TEMPLATE.js for the format.
window.PLAYERS = [];
window.registerPlayer = function (player) {
  window.PLAYERS.push(player);
};
