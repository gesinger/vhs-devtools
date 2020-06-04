import React, { useState } from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ArrowForward from '@material-ui/icons/ArrowForward';
import SegmentInfo from './SegmentInfo';

export default function SegmentsList(props) {
  const { segments, setSegmentSelection } = props;
  const [selectedIndex, setSelectedIndex] = useState(null);

  const handleListItemClicked = (index) => {
    setSelectedIndex(index);
    setSegmentSelection(index);
  };

  return (
    <div>
      <List>
        {segments.map((segment, index) => (
          <ListItem
            button
            selected={selectedIndex === segment.mediaIndex}
            onClick={handleListItemClicked.bind(null, segment.mediaIndex)}
            key={segment.mediaIndex}
          >
            {index > 0 && segment.mediaIndex > segments[index - 1].mediaIndex + 1 && (
              <ArrowForward fontSize="large" />
            )}
            <SegmentInfo segment={segment} />
          </ListItem>
        ))}
      </List>
    </div>
  );
}
