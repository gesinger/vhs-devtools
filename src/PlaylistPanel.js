import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

export default function PlaylistPanel(props) {
  const { playlist, playlistType } = props;
  const width = playlist.resolution && playlist.resolution.width;
  const height = playlist.resolution && playlist.resolution.ehgith;

  return (
    <div>
      <Typography variant="h5">
        <Box pl={1} mt={1}>{playlistType}</Box>
      </Typography>
      <TableContainer component={Paper}>
        <Table size="small">
          <TableBody>
            {playlist.bandiwdth &&
              <TableRow>
                <TableCell>Bandwidth</TableCell>
                <TableCell align="right">{playlist.bandwidth}</TableCell>
              </TableRow>
            }
            {playlist.codecs &&
              <TableRow>
                <TableCell>Codecs</TableCell>
                <TableCell align="right">{playlist.codecs}</TableCell>
              </TableRow>
            }
            {width &&
              <TableRow>
                <TableCell>Width</TableCell>
                <TableCell align="right">{width}</TableCell>
              </TableRow>
            }
            {height &&
              <TableRow>
                <TableCell>Height</TableCell>
                <TableCell align="right">{height}</TableCell>
              </TableRow>
            }
            {playlist.targetDuration &&
              <TableRow>
                <TableCell>Target Duration</TableCell>
                <TableCell align="right">{playlist.targetDuration}</TableCell>
              </TableRow>
            }
            <TableRow>
              <TableCell>Num Segments</TableCell>
              <TableCell align="right">{playlist.segments.length}</TableCell>
            </TableRow>
            {playlist.minDuration &&
              <TableRow>
                <TableCell>Min Segment Duration</TableCell>
                <TableCell align="right">{playlist.minDuration}</TableCell>
              </TableRow>
            }
            {playlist.maxDuration &&
              <TableRow>
                <TableCell>Max Segment Duration</TableCell>
                <TableCell align="right">{playlist.maxDuration}</TableCell>
              </TableRow>
            }
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
