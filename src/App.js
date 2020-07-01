import React, { useState, useEffect } from 'react';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import PlayerNavigator from './PlayerNavigator.js'
import getPlayers from './window-functions';

// RegEx via https://stackoverflow.com/a/8571649
const isBase64Encoded = (string) => {
  return RegExp('^([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{2}==)?$').test(string);
};

const REFRESH_RATE = 1 * 1000;

// TODO check colorscheme preferece
const theme = createMuiTheme({
  palette: {
    type: 'dark'
  },
});

export default function App(props) {
  const [players, setPlayers] = useState([]);
  const [sourceRequests, setSourceRequests] = useState([]);

  const updatePlayers = (updatedPlayers, isException) => {
    if (isException) {
      console.error(isException);
      return;
    }
    if (JSON.stringify(players) === JSON.stringify(updatedPlayers)) {
      return;
    }
    setPlayers(updatedPlayers)
  };

  const inspectForUpdatedPlayers = () => {
    chrome.devtools.inspectedWindow.eval(getPlayers, updatePlayers);
  };

  useEffect(() => {
    const requestFinishedListener = (result) => {
      if (!players.length) {
        return;
      }

      players.forEach((player) => {
        if (player.src !== result.request.url) {
          return;
        }

        if (result.request.method !== 'GET') {
          return;
        }

        result.getContent((contentResult) => {
          setSourceRequests(sourceRequests.concat([{
            url: result.request.url,
            content: isBase64Encoded(contentResult) ? window.atob(contentResult) :
              contentResult,
            started: new Date(result.startedDateTime)
          }]));
        });
      });
    };

    chrome.devtools.network.onRequestFinished.addListener(requestFinishedListener);

    const interval = setInterval(inspectForUpdatedPlayers, REFRESH_RATE);

    return () => {
      chrome.devtools.network.onRequestFinished.removeListener(requestFinishedListener);
      clearInterval(interval);
    };
  }, [inspectForUpdatedPlayers, REFRESH_RATE]);

  if (!players.length) {
    return null;
  }

  players.forEach((player) => {
    const matchingSourceRequests =
      sourceRequests.filter((request) => request.url === player.src);

    player.sourceRequests = matchingSourceRequests;
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <PlayerNavigator players={players} />
    </ThemeProvider>
  );
};
