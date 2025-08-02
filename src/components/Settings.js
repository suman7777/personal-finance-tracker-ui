import React from 'react';
import { Box, Typography, Switch, FormControlLabel, Paper, Divider } from '@mui/material';

const Settings = () => (
  <Box sx={{ p: 4 }}>
    <Typography variant="h4" fontWeight={900} sx={{ mb: 3 }}>Settings & Profile</Typography>
    <Paper sx={{ p: 3, mb: 2 }}>
      <Typography variant="h6">Preferences</Typography>
      <Divider sx={{ my: 2 }} />
      <FormControlLabel control={<Switch defaultChecked />} label="Dark Mode" />
      <FormControlLabel control={<Switch />} label="Notifications" />
    </Paper>
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6">Profile Info</Typography>
      <Divider sx={{ my: 2 }} />
      <Typography variant="body2">Name: John Doe</Typography>
      <Typography variant="body2">Email: john@example.com</Typography>
    </Paper>
  </Box>
);

export default Settings;
