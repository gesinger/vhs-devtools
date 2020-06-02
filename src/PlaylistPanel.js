import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

export default function PlaylistPanel(props) {
  const { playlist } = props;

  return (
    <TableContainer component={Paper}>
      <Table size="small">
        <TableBody>
          <TableRow>
            <TableCell>Bandwidth</TableCell>
            <TableCell align="right">{playlist.bandwidth}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Codecs</TableCell>
            <TableCell align="right">{playlist.codecs}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Width</TableCell>
            <TableCell align="right">{playlist.resolution.width || ''}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Height</TableCell>
            <TableCell align="right">{playlist.resolution.height || ''}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}
