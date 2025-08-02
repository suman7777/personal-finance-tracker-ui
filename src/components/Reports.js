import React, { useEffect, useState } from 'react';
import { Box, Typography, Card, CardContent, Grid, Button, Stack, CircularProgress, Alert } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import MoreVertIcon from '@mui/icons-material/MoreVert';

const Reports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://localhost:8080/api/reports')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch reports');
        return res.json();
      })
      .then(data => {
        setReports(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return (
    <Box sx={{ p: 4, bgcolor: '#f6f6f2', minHeight: '100vh' }}>
      <Typography variant="h4" fontWeight={900} sx={{ mb: 3, letterSpacing: 1 }}>Reports</Typography>
      {loading && <CircularProgress />}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <Grid container spacing={3}>
        {reports.map((report, idx) => (
          <Grid item xs={12} md={6} lg={3} key={report.id}>
            <Card sx={{ borderRadius: 3, boxShadow: 2, position: 'relative', overflow: 'visible' }}>
              {/* Accent bar */}
              <Box sx={{ position: 'absolute', top: -8, left: 24, width: 40, height: 6, bgcolor: 'info.main', borderRadius: 2 }} />
              <CardContent>
                <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
                  <Typography variant="h6" fontWeight={700}>{report.name}</Typography>
                  <MoreVertIcon sx={{ color: 'text.secondary', fontSize: 22, ml: 1, cursor: 'pointer' }} />
                </Stack>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>Date: {report.date}</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>Type: {report.type}</Typography>
                <Stack direction="row" spacing={2}>
                  <Button variant="contained" startIcon={<DownloadIcon />} sx={{ borderRadius: 2 }}>
                    Download
                  </Button>
                  <Button variant="outlined" sx={{ borderRadius: 2 }}>
                    View
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
        <Grid item xs={12} md={6} lg={3}>
          <Card sx={{ borderRadius: 3, boxShadow: 2, height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'visible' }}>
            <Box sx={{ position: 'absolute', top: -8, left: 24, width: 40, height: 6, bgcolor: 'info.main', borderRadius: 2 }} />
            <Button variant="outlined" startIcon={<DownloadIcon />} sx={{ borderRadius: 2, fontWeight: 700 }}>
              Export All
            </Button>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Reports;
