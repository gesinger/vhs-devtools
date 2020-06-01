import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

// TODO
const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    color: 'white'
  }
}));

export default function TopLevelInfo(props) {
  const { player } = props;
  const classes = useStyles();
  const [duration, setDuration] = React.useState('duration');

  chrome.devtools.inspectedWindow.eval(
    `
    videojs.players['${player.id}'].duration()
    `,
    (inspectedDuration, isException) => {
      // TODO
      console.log(inspectedDuration, isException);
      setDuration(inspectedDuration);
    }
  );

  return (
    <div className={classes.root}>
      <p>Player ID: {player.id}</p>
      <p>Duration: {duration}</p>
    </div>
  );
}
