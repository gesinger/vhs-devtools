import React, { useState } from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';

export default function SegmentRequestInfo(props) {
  const { requestEntry } = props;
  const startedTime = new Date(requestEntry.startedDateTime).toLocaleTimeString();

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableBody>
          <TableRow>
            <TableCell>URI</TableCell>
            <TableCell align="right">{requestEntry.request.url}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Request Start Time</TableCell>
            <TableCell align="right">{startedTime}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Request Duration (ms)</TableCell>
            <TableCell align="right">{requestEntry.time.toFixed(2)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Response Status</TableCell>
            <TableCell align="right">{requestEntry.response.status}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Response Body (bytes)</TableCell>
            <TableCell align="right">{requestEntry.response.bodySize}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}
