import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { timeRangesString } from './ui-utils';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';

// TODO why do we have to change font color
// TODO width flex
const useStyles = makeStyles((theme) => ({
  table: {
    backgroundColor: theme.palette.background.paper,
    color: 'white',
    maxWidth: 300
  }
}));

const renderMediaBufferedRow = (player, mediaType) => {
  const buffered = player[`${mediaType}Buffered`];

  if (!buffered) {
    return null;
  }

  const mediaTypeLabel = mediaType.charAt(0).toUpperCase() + mediaType.slice(1);

  return (
    <TableRow>
      <TableCell><Box pl={2}>{mediaTypeLabel}</Box></TableCell>
      <TableCell align="right">{timeRangesString(buffered)}</TableCell>
    </TableRow>
  );
};

export default function TopLevelInfo(props) {
  const classes = useStyles();
  const { player } = props;

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} size="small">
        <TableBody>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell align="right">{player.id}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Current Time</TableCell>
            <TableCell align="right">{player.currentTime.toFixed(2)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Duration</TableCell>
            <TableCell align="right">{player.duration.toFixed(2)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Seekable</TableCell>
            <TableCell align="right">{timeRangesString(player.seekable)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Buffered</TableCell>
            <TableCell align="right">{timeRangesString(player.buffered)}</TableCell>
          </TableRow>
          {renderMediaBufferedRow(player, 'video')}
          {renderMediaBufferedRow(player, 'audio')}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
