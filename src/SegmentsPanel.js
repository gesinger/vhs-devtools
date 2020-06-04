import React, { useState, useEffect } from 'react';
import SegmentsList from './SegmentsList';
import MatchingSegmentRequestsInfo from './MatchingSegmentRequestsInfo';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import Box from '@material-ui/core/Box';

export default function SegmentsPanel(props) {
  const { player } = props;
  const [selectedPlaylistType, setSelectedPlaylistType] = useState('Main');
  const [showOnlyLoaded, setShowOnlyLoaded] = useState(false);
  const [selectedSegmentIndex, setSelectedSegmentIndex] = useState(null);

  useEffect(() => {
    setSelectedPlaylistType('Main');
    setSelectedSegmentIndex(null);
  }, [player]);

  const handlePlaylistSelection = (event) => {
    setSelectedPlaylistType(event.target.value);
  };

  const setSegmentSelection = (segmentIndex) => {
    setSelectedSegmentIndex(segmentIndex);
  };

  const selectedPlaylist = player[`${selectedPlaylistType.toLowerCase()}Playlist`];

  if (!selectedPlaylist) {
    // player has switched but component has not yet re-rendered
    // a re-render will happen after this return
    return null;
  }

  const segmentsWithTimes = selectedPlaylist.segments.filter(
    (segment) => typeof segment.start === 'number' && typeof segment.end === 'number'
  );

  return (
    <div>
      <Box ml={1} mt={1}>
        <FormGroup row>
          {player.audioPlaylist && (
            <Box mr={3}>
              <FormControl>
                <InputLabel>Playlist</InputLabel>
                <Select
                  value={selectedPlaylistType}
                  onChange={handlePlaylistSelection}
                >
                  <MenuItem value='Main'>Main</MenuItem>
                  <MenuItem value='Audio'>Audio</MenuItem>
                </Select>
              </FormControl>
            </Box>
          )}
          <FormControlLabel
            control={
              <Switch
                checked={showOnlyLoaded}
                onChange={(event) => setShowOnlyLoaded(event.target.checked)}
              />
            }
            label="Show only segments with timing info"
          />
        </FormGroup>
      </Box>
      <Box display="flex" flexDirection="row">
        <Box>
          <SegmentsList
            segments={showOnlyLoaded ? segmentsWithTimes : selectedPlaylist.segments}
            setSegmentSelection={setSegmentSelection}
          />
        </Box>
        {typeof selectedSegmentIndex === 'number' && (
          <Box>
            <MatchingSegmentRequestsInfo
              segment={selectedPlaylist.segments[selectedSegmentIndex]}
            />
          </Box>
        )}
      </Box>
    </div>
  );
}
