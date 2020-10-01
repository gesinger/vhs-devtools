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
    (chrome || browser).devtools.inspectedWindow.eval(getPlayers, updatePlayers);
  };

  useEffect(() => {
    const requestFinishedListener = (result) => {
      if (!players.length) {
        return;
      }

      const request = result.request;
      const response = result.response;

      players.forEach((player) => {
        if (request.method !== 'GET') {
          return;
        }

        let probablySourceRequest = false;

        if (
          response.content.mimeType === 'application/dash+xml' &&
          (player.isShaka || player.isDashjs)
        ) {
          probablySourceRequest = true;
        }

        if (player.src !== request.url && !probablySourceRequest) {
          return;
        }

        result.getContent((contentResult) => {
          setSourceRequests(sourceRequests.concat([{
            url: request.url,
            content: isBase64Encoded(contentResult) ? window.atob(contentResult) :
              contentResult,
            started: new Date(result.startedDateTime)
          }]));
        });
      });
    };

    (chrome || browser).devtools.network.onRequestFinished.addListener(requestFinishedListener);

    const interval = setInterval(inspectForUpdatedPlayers, REFRESH_RATE);

    return () => {
      (chrome || browser).devtools.network.onRequestFinished.removeListener(requestFinishedListener);
      clearInterval(interval);
    };
  }, [inspectForUpdatedPlayers, REFRESH_RATE]);

  if (!players.length) {
    return null;
  }

  players.forEach((player) => {
    // Shaka and Dash.js don't yet have a way for us to access updated MPD locations. As a
    // workaround, allow any matching source requests to be used. Although this can be a
    // problem when there are multiple players on the page, for the most part it won't
    // matter too much.
    const matchingSourceRequests = player.isShaka || player.isDashjs ? sourceRequests :
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
