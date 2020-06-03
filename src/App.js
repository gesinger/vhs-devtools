import React, { useState, useEffect } from 'react';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import PlayerNavigator from './PlayerNavigator.js'
import getPlayers from './window-functions';

const REFRESH_RATE = 1 * 1000;

// TODO check colorscheme preferece
const theme = createMuiTheme({
  palette: {
    type: 'dark'
  },
});

export default function App(props) {
  const [players, setPlayers] = useState([]);

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
    const interval = setInterval(inspectForUpdatedPlayers, REFRESH_RATE);

    return () => {
      clearInterval(interval);
    };
  }, [inspectForUpdatedPlayers, REFRESH_RATE]);

  if (!players.length) {
    return null;
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <PlayerNavigator players={players} />
    </ThemeProvider>
  );
};
