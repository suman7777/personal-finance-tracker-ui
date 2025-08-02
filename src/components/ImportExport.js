import React from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';

const ImportExport = () => (
  <Box sx={{ p: 4 }}>
    <Typography variant="h4" fontWeight={900} sx={{ mb: 3 }}>Import / Export</Typography>
    <Paper sx={{ p: 3, mb: 2 }}>
      <Typography variant="body1">Import your data from CSV or Excel files.</Typography>
      <Button variant="contained" sx={{ mt: 2 }}>Import File</Button>
    </Paper>
    <Paper sx={{ p: 3 }}>
      <Typography variant="body1">Export all your data.</Typography>
      <Button variant="outlined" sx={{ mt: 2 }}>Export Data</Button>
    </Paper>
  </Box>
);

export default ImportExport;
