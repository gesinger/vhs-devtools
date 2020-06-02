import React, { useState, useEffect } from 'react';
import TopLevelInfo from './TopLevelInfo';
import ToolNavigator from './ToolNavigator';
import Divider from '@material-ui/core/Divider';

export default function PlayerPanel(props) {
  const { player } = props;

  return (
    <div className="player-panel">
      <TopLevelInfo player={player} />
      <Divider />
      <ToolNavigator player={player} />
    </div>
  );
}
