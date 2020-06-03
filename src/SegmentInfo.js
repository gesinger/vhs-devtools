import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme) => ({
  hasTimes: {
    backgroundColor: theme.palette.success.main
  }
}));

export default function SegmentInfo(props) {
  const classes = useStyles();
  const { segment } = props;

  const hasTimes = typeof segment.start === 'number' && typeof segment.end == 'number';

  return (
    <Card variant="outlined" className={`${hasTimes ? classes.hasTimes : ''}`}>
      <CardContent>
        <Typography variant="h6">
          {segment.mediaIndex}
          {hasTimes && (
            <span> | {segment.start.toFixed(3)} => {segment.end.toFixed(3)}</span>
          )}
        </Typography>
        <TableContainer>
          <Table size="small">
            <TableBody>
              <TableRow>
                <TableCell>duration</TableCell>
                <TableCell align="right">{segment.duration.toFixed(3)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>timeline</TableCell>
                <TableCell align="right">{segment.timeline}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
}
