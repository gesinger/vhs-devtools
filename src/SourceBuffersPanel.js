import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

export default function SourceBuffersPanel(props) {
  const { sourceBuffers } = props;
  const audioBuffer = sourceBuffers.audio;
  const videoBuffer = sourceBuffers.video;

  return (
    <Box display="flex" flexDirection="row">
      {videoBuffer && (
        <Box>
          <Typography variant="h5">
            <Box pl={1} mt={1}>Video</Box>
          </Typography>
          <TableContainer component={Paper}>
            <Table size="small">
              <TableBody>
                <TableRow>
                  <TableCell>Timestamp Offset</TableCell>
                  <TableCell align="right">{videoBuffer.timestampOffset}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}
      {audioBuffer && (
        <Box>
          <Typography variant="h5">
            <Box pl={1} mt={1}>Audio</Box>
          </Typography>
          <TableContainer component={Paper}>
            <Table size="small">
              <TableBody>
                <TableRow>
                  <TableCell>Timestamp Offset</TableCell>
                  <TableCell align="right">{audioBuffer.timestampOffset}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}
    </Box>
  );
}
