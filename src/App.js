import React, { useState, useEffect } from 'react';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import SettingsSelector from './SettingsSelector.js'
import PlayerNavigator from './PlayerNavigator.js'
import getPlayers from './window-functions';
import { mp4Inspector, tsInspector } from 'thumbcoil';
import {
  isLikelyFmp4MediaSegment,
  isLikely
} from '@videojs/vhs-utils/dist/containers';

// RegEx via https://stackoverflow.com/a/8571649
const isBase64Encoded = (string) => {
  return RegExp('^([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{2}==)?$').test(string);
};

const stringToUint8Array = (string) => {
  const array = new Uint8Array(string.length);

  for (let i = 0; i < string.length; i++) {
    array[i] = string.charCodeAt(i);
  }

  return array;
};

// 1 second
const DEFAULT_REFRESH_RATE = 1;

// TODO check colorscheme preferece
const theme = createMuiTheme({
  palette: {
    type: 'dark'
  },
});

let currentPlayers;

export default function App(props) {
  const [settings, setSettings] = useState({
    refreshRate: DEFAULT_REFRESH_RATE,
    isRefreshing: true,
    shouldSaveSourceRequests: false,
    shouldSaveContentRequests: false
  });
  const [players, setPlayers] = useState([]);
  const [sourceRequests, setSourceRequests] = useState([]);
  const [contentRequests, setContentRequests] = useState([]);

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

  const saveSourceRequest = (request, response, result, player) => {
    const probablySourceRequest = response.content.mimeType === 'application/dash+xml' &&
      (player.isShaka || player.isDashjs);

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
  };

  const saveContentRequest = (request, response, result, player) => {
    if (response.content.mimeType !== 'video/MP2T'.toLowerCase() &&
        response.content.mimeType !== 'video/mp4'.toLowerCase() &&
        response.content.mimeType !== 'binary/octet-stream'.toLowerCase()) {
      return;
    }

    result.getContent((contentResult) => {
      const bytes = stringToUint8Array(
        isBase64Encoded(contentResult) ? window.atob(contentResult) : contentResult
      );
      const isLikelyTs = isLikely.ts(bytes);
      let thumbcoiled = isLikelyFmp4MediaSegment(bytes) ?
        mp4Inspector.inspect(bytes) : isLikelyTs ?
        tsInspector.inspect(bytes) : null;
      if (thumbcoiled) {
        // remove data elements to avoid using too much memory
        thumbcoiled = JSON.parse(
          JSON.stringify(thumbcoiled, (k,v) => (k === 'data')? void 0 : v)
        );
      }

      setContentRequests(contentRequests.concat([{
        url: request.url,
        thumbcoiled,
        started: new Date(result.startedDateTime)
      }]));
    });
  };

  useEffect(() => {
    if (!settings.isRefreshing) {
      return;
    }

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

        if (settings.shouldSaveSourceRequests) {
          saveSourceRequest(request, response, result, player);
        }
        if (settings.shouldSaveContentRequests) {
          saveContentRequest(request, response, result, player);
        }
      });
    };

    (chrome || browser).devtools.network.onRequestFinished.addListener(
      requestFinishedListener);

    const interval = setInterval(inspectForUpdatedPlayers, settings.refreshRate * 1000);

    return () => {
      (chrome || browser).devtools.network.onRequestFinished.removeListener(
        requestFinishedListener);
      clearInterval(interval);
    };
  }, [
    inspectForUpdatedPlayers,
    saveSourceRequest,
    saveContentRequest,
    settings
  ]);

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
    player.contentRequests = contentRequests;
  });

  // although typically this should be handled before updating the state, since the request
  // listener and the player update listener are on separate intervals (technically, the
  // player update is on an interval and the request update is on request finishes), and
  // only one object is passed down (players), a comparison is made here to ensure
  // components aren't needlessly updated
  currentPlayers = JSON.stringify(players) === JSON.stringify(currentPlayers) ?
    currentPlayers : players;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <SettingsSelector setSettings={setSettings} settings={settings} />
      <PlayerNavigator players={currentPlayers} />
    </ThemeProvider>
  );
};
