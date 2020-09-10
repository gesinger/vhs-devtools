import React, { useState, useEffect } from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Box from '@material-ui/core/Box';
import xmlJs from 'xml-js';
import ReactJson from 'react-json-view'
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import ReactDiffViewer from 'react-diff-viewer';

const xmlToJson = (xml) => {
  return JSON.parse(xmlJs.xml2json(xml, {
    compact: true,
    attributesKey: 'attributes'
  }));
};

export default function SourceRequestsPanel(props) {
  const { requests } = props;
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [displayMode, setDisplayMode] = useState('json');

  if (!requests || !requests.length) {
    return null;
  }

  const handleListItemClicked = (index) => {
    setSelectedIndex(index);
  };

  const selectedRequest =
    typeof selectedIndex === 'number' ? requests[selectedIndex] : null;
  const isXml = selectedRequest && selectedRequest.content.startsWith('<');
  const selectedRequestJson = selectedRequest && isXml ?
    xmlToJson(selectedRequest.content) : null;
  const priorRequestJson = selectedRequestJson && selectedIndex > 0 ?
    xmlToJson(requests[selectedIndex - 1].content) : null;
  const displayDiff = displayMode === 'diff' && selectedRequestJson && priorRequestJson;
  const displayJson = selectedRequestJson && (displayMode === 'json' || !priorRequestJson);

  return (
    <Box display="flex" flexDirection="row">
      <Box>
        <List>
          {requests.map((request, index) => (
            <ListItem
              button
              selected={selectedIndex === index}
              onClick={handleListItemClicked.bind(null, index)}
              key={index}
            >
              {request.started.toLocaleTimeString()}
            </ListItem>
          ))}
        </List>
      </Box>
      <Box>
        <Box>
          <ButtonGroup>
            <Button onClick={() => { setDisplayMode('json'); }}>JSON</Button>
            <Button onClick={() => { setDisplayMode('diff'); }}>Diff</Button>
          </ButtonGroup>
        </Box>
        <Box>
          {displayJson && (
            <ReactJson
              src={selectedRequestJson}
              theme="monokai"
              name={false}
              displayDataTypes={false}
            />
          )}
          {displayDiff && (
            <ReactDiffViewer
              oldValue={JSON.stringify(priorRequestJson, null, 2)}
              newValue={JSON.stringify(selectedRequestJson, null, 2)}
              splitView={true}
              useDarkTheme={true}
            />
          )}
          {selectedRequest && !isXml && (
            <Box>{selectedRequest.content}</Box>
          )}
        </Box>
      </Box>
    </Box>
  );
}
