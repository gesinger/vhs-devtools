import React, { Component } from 'react';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import PlayerNavigator from './PlayerNavigator.js'

// TODO prefers colorscheme dark
const theme = createMuiTheme({
	palette: {
		type: 'dark'
	},
});

class App extends Component {
  constructor(props) {
    super(props)

    this.state = { players: this.props.players };
  }

  render() {
    return(
      <ThemeProvider theme={theme}>
        <PlayerNavigator players={this.state.players} />
      </ThemeProvider>
    );
  }
}

export default App;
