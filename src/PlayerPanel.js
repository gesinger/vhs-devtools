import React from 'react';
import TopLevelInfo from './TopLevelInfo';

export default function PlayerPanel(props) {
  const { player } = props;

  return (
    <div className="player-panel">
      <TopLevelInfo player={player} />
    </div>
  );
}
