import React, { useState } from 'react';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import ReactJson from 'react-json-view'

export default function ThumbcoilPanel(props) {
  const { segmentDetails, segmentContent } = props;
  const [matchingEntry, setMatchingEntry] = useState(null);

  if (!segmentContent) {
    return (
      <Box>
        <Typography variant="h5">
          Unable to load thumbcoil panel
        </Typography>
        <Typography variant="subtitle1">
          <p>Was the request made?</p>
          <p>Was vhs-utils running when the request was made?</p>
          <p>Does thumbcoil support parsing this segment type?</p>
        </Typography>
      </Box>
    );
  }

  return (
    <ReactJson
      src={segmentContent.thumbcoiled}
      theme="monokai"
      name={false}
      displayDataTypes={false}
      collapsed={true}
    />
  );
}
