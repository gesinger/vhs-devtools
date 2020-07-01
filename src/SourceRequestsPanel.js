import React, { useState, useEffect } from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Box from '@material-ui/core/Box';
import xmlJs from 'xml-js';
import ReactJson from 'react-json-view'

export default function SourceRequestsPanel(props) {
  const { requests } = props;
  const [selectedIndex, setSelectedIndex] = useState(null);

  if (!requests || !requests.length) {
    return null;
  }

  const handleListItemClicked = (index) => {
    setSelectedIndex(index);
  };

  const selectedRequest =
    typeof selectedIndex === 'number' ? requests[selectedIndex] : null;
  const isXml = selectedRequest && selectedRequest.content.startsWith('<');
  let selectedRequestJson = selectedRequest && isXml ?
    JSON.parse(xmlJs.xml2json(selectedRequest.content, {
      compact: true,
      attributesKey: 'attributes'
    })) :
    null;

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

      {selectedRequestJson && (
        <Box>
          <ReactJson
            src={selectedRequestJson}
            theme="monokai"
            name={false}
            displayDataTypes={false}
          />
        </Box>
      )}
      {selectedRequest && !isXml && (
        <Box>
          {selectedRequest.content}
        </Box>
      )}
    </Box>
  );
}
