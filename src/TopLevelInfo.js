import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { timeRangesString } from './ui-utils';

// TODO why do we have to change font color
const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    color: 'white'
  }
}));

const renderMediaBuffered = (player) => {
  // TODO more elegant
  if (player.audioBuffered && player.videoBuffered) {
    return (
      <div>
        <p>Audio Buffered: {timeRangesString(player.audioBuffered)}</p>
        <p>Video Buffered: {timeRangesString(player.videoBuffered)}</p>
      </div>
    );
  }
  if (player.audioBuffered) {
    return (
      <p>Audio Buffered: {timeRangesString(player.audioBuffered)}</p>
    );
  }
  if (player.videoBuffered) {
    return (
      <p>Video Buffered: {timeRangesString(player.videoBuffered)}</p>
    );
  }
};

export default function TopLevelInfo(props) {
  const classes = useStyles();
  const { player } = props;

  return (
    <div className={classes.root}>
      <p>Player ID: {player.id}</p>
      <p>Current Time: {player.currentTime}</p>
      <p>Duration: {player.duration.toFixed(2)}</p>
      <p>Buffered: {timeRangesString(player.buffered)}</p>
      {renderMediaBuffered(player)}
      <p>Seekable: {timeRangesString(player.seekable)}</p>
    </div>
  );
}
