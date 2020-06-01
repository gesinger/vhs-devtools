import React from 'react';
import ReactDOM from 'react-dom';
import App from './App.js';

let players = [];

const updateAppWithPlayers = (updatedPlayers) => {
  players = updatedPlayers;

  ReactDOM.render(
    <App players={players} />,
    document.getElementById('root')
  );
};

const updatePlayers = (updatedPlayers) => {
  if (!updatedPlayers) {
    return;
  }

  if (players.length !== updatedPlayers.length) {
    updateAppWithPlayers(updatedPlayers);
    return;
  }

  for (let i = 0; i < players.length; i++) {
    if (players[i].id !== updatedPlayers[i].id) {
      updateAppWithPlayers(updatedPlayers);
      return;
    }
  }
};

const REFRESH_RATE = 5 * 1000;
const inspectForUpdatedPlayers = () => {
  chrome.devtools.inspectedWindow.eval(
    `
    if (window.videojs) {
      Object.keys(window.videojs.players).map((playerId) => {
        return {
          id: playerId
        };
      });
    }
    `,
    (updatedPlayers, isException) => {
      updatePlayers(updatedPlayers);
    }
  );
};

setInterval(inspectForUpdatedPlayers, REFRESH_RATE);
inspectForUpdatedPlayers();
