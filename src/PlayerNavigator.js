import React, { useState, useEffect } from 'react';
import PlayerPanel from './PlayerPanel';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  tabs: {
    borderBottom: `1px solid ${theme.palette.divider}`,
  }
}));

export default function PlayerNavigator(props) {
  const { players } = props;
  const classes = useStyles();
  const [selectedPlayerId, setSelectedPlayerId] = useState(0);

  const handleChange = (event, playerId) => {
    setSelectedPlayerId(playerId);
  };

  const renderTabs = () => {
    if (players.length < 2) {
      return null;
    }

    return (
      <Tabs
        onChange={handleChange}
        value={selectedPlayerId}
        className={classes.tabs}
      >
        {players.map((player, index) => (
          <Tab label={player.id} key={index} />
        ))}
      </Tabs>
    );
  }

  return (
    <div>
      {renderTabs()}

      <PlayerPanel player={players[selectedPlayerId]} />
    </div>
  );
};
