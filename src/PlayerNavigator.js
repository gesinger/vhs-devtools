import React, { Component } from 'react';
import PlayerPanel from './PlayerPanel';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
    display: 'flex',
    height: 224,
  },
  tabs: {
    borderRight: `1px solid ${theme.palette.divider}`,
  },
}));

export default function PlayerNavigator(props) {
  const { players } = props;
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const renderTabs = () => {
    if (!players || players.length === 1) {
      return null;
    }

    return (
      <Tabs
        orientation="vertical"
        variant="scrollable"
        onChange={handleChange}
        value={value}
        className={classes.tabs}
      >
        {players.map((player, index) => (
          <Tab label={player.id} key={index} />
        ))}
      </Tabs>
    );
  }

  return (
    <div className={classes.root}>
      {renderTabs()}

      <PlayerPanel player={players[value]} />
    </div>
  );
};
