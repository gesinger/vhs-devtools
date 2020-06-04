import React, { useState, useEffect } from 'react';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box'; import { makeStyles } from '@material-ui/core/styles';
import SegmentsPanel from './SegmentsPanel';
import PlaylistsPanel from './PlaylistsPanel';
import SourceBuffersPanel from './SourceBuffersPanel';

function TabPanel(props) {
  const { children, selectedIndex, index, ...other } = props;

  return (
    <div
      hidden={selectedIndex !== index}
      {...other}
    >
      {selectedIndex === index && (
        <Box>
          {children}
        </Box>
      )}
    </div>
  );
}

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.paper,
  },
  tabs: {
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
}));

export default function ToolNavigator(props) {
  const { player } = props;
  const classes = useStyles();
  const [selectedToolIndex, setSelectedToolIndex] = useState(0);

  const handleChange = (event, toolIndex) => {
    setSelectedToolIndex(toolIndex);
  };

  return (
    <div className={classes.root}>
      <Tabs
        onChange={handleChange}
        value={selectedToolIndex}
        className={classes.tabs}
      >
        <Tab label="Playlists" key={0} />
        <Tab label="Segments" key={1} />
        <Tab label="Source Buffers" key={2} />
      </Tabs>
      <div>
        <TabPanel selectedIndex={selectedToolIndex} index={0}>
          <PlaylistsPanel
            mainPlaylist={player.mainPlaylist}
            audioPlaylist={player.audioPlaylist} />
        </TabPanel>
        <TabPanel selectedIndex={selectedToolIndex} index={1}>
          <SegmentsPanel player={player} />
        </TabPanel>
        <TabPanel selectedIndex={selectedToolIndex} index={2}>
          <SourceBuffersPanel sourceBuffers={player.sourceBuffers} />
        </TabPanel>
      </div>
    </div>
  );
};
