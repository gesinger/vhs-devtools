import React, { useState } from 'react';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import TextField from '@material-ui/core/TextField';

export default function SettingsSelector(props) {
  const { setSettings, settings } = props;

  const handleChanged = (prop, valueField) => (event) => {
    setSettings({
      ...settings,
      [prop]: event.target[valueField]
    });
  };
  const handleRefreshRateChanged = (event) => {
    setSettings({
      ...settings,
      ['refreshRate']: event.target.value
    });
  };

  return (
    <FormGroup row>
      <FormControlLabel
        control={
          <Switch
            checked={settings.isRefreshing}
            onChange={handleChanged('isRefreshing', 'checked')}
            name="isRefreshing"
          />
        }
        label="Keep Refreshing"
      />
      <TextField
        id="refreshRate"
        value={settings.refreshRate}
        onChange={handleRefreshRateChanged}
        label="Refresh Rate (s)"
        type="number"
      />
    </FormGroup>
  );
}
