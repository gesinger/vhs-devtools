import React from 'react';
import Box from '@material-ui/core/Box';
import PlaylistPanel from './PlaylistPanel';

export default function PlaylistsPanel(props) {
  const { mainPlaylist, audioPlaylist } = props;

  return (
    <Box display="flex" flexDirection="row">
      <Box>
        <PlaylistPanel playlist={mainPlaylist} playlistType="Main" />
      </Box>
      {audioPlaylist &&
        <Box>
          <PlaylistPanel playlist={audioPlaylist} playlistType="Audio" />
        </Box>
      }
    </Box>
  );
}
