import React from 'react';

export default function SegmentRequestInfo(props) {
  const { segment } = props;

  // TODO get HAR for segment request if available
  chrome.devtools.network.getHAR((result) => {
    console.log(result);
  });

  return (
    <div>
      <p>Index: {segment.mediaIndex}</p>
    </div>
  );
}
