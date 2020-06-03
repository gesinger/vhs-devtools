import React, { useState } from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
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
        {segments.map((segment) => (
          <ListItem
            button
            selected={selectedIndex === segment.mediaIndex}
            onClick={handleListItemClicked.bind(null, segment.mediaIndex)}
            key={segment.mediaIndex}
          >
            <SegmentInfo segment={segment} />
          </ListItem>
        ))}
      </List>
    </div>
  );
}
