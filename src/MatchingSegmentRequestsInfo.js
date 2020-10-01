import React, { useState, useEffect } from 'react';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import HourglassEmptyIcon from '@material-ui/icons/HourglassEmpty';
import SegmentRequestInfo from './SegmentRequestInfo';

export default function MatchingSegmentRequestsInfo(props) {
  const { segment } = props;
  const [matchingEntries, setMatchingEntries] = useState(null);
  const [hasNoMatch, setHasNoMatch] = useState(null);

  useEffect(() => {
    (chrome || browser).devtools.network.getHAR((result) => {
      const entries = result.entries;

      const matchingEntries = entries.filter((entry) => {
        const request = entry.request;

        if (segment.resolvedUri !== request.url) {
          return false;
        }

        if (!segment.byterange) {
          return true;
        }

        const rangeHeader = request.headers.find((header) => header.name === 'Range');

        if (!rangeHeader) {
          return false;
        }

        const byteRangeStart = segment.byterange.offset;
        const byteRangeEnd = byteRangeStart + segment.byterange.length - 1;

        if (rangeHeader.value !== `bytes=${byteRangeStart}-${byteRangeEnd}`) {
          return false;
        }

        return true;
      });

      if (matchingEntries.length === 0) {
        setHasNoMatch(true);
        return;
      }

      setHasNoMatch(false);
      setMatchingEntries(matchingEntries);
    });
  }, [segment]);

  if (hasNoMatch) {
    return (
      <Box>
        <Typography variant="h5">
          No Matching Segment Request
        </Typography>
        <Typography variant="subtitle1">
          Was the request made? And Was the debugger opened when the request was made?
        </Typography>
      </Box>
    );
  }

  if (!matchingEntries) {
    return (
      <HourglassEmptyIcon fontSize="large" />
    );
  }

  return (
    <Box m={3}>
      <List>
        {matchingEntries.map((entry, index) => (
          <ListItem key={index}>
            <SegmentRequestInfo requestEntry={entry} />
          </ListItem>
        ))}
      </List>
    </Box>
  );
}
