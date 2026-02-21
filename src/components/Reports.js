import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Card, CardContent, Grid, Button, Stack, CircularProgress, Alert,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, Select, MenuItem, FormControl, InputLabel,
  Menu, IconButton
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const Reports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedReportId, setSelectedReportId] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'Summary',
    category: '',
    startDate: '',
    endDate: ''
  });

  // Fetch reports
  const fetchReports = () => {
    setLoading(true);
    fetch('http://localhost:8080/api/reports')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch reports');
        return res.json();
      })
      .then(data => {
        setReports(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchReports();
  }, []);

  // Handle create/update report
  const handleSaveReport = () => {
    if (!formData.name.trim()) {
      alert('Please enter report name');
      return;
    }

    const method = editingId ? 'PUT' : 'POST';
    const url = editingId 
      ? `http://localhost:8080/api/reports/${editingId}`
      : 'http://localhost:8080/api/reports';

    const payload = {
      ...formData,
      date: new Date().toISOString().split('T')[0]
    };

    fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to save report');
        return res.json();
      })
      .then(() => {
        setOpenDialog(false);
        resetForm();
        fetchReports();
      })
      .catch(err => {
        console.error('Error saving report:', err);
        alert('Error saving report');
      });
  };

  // Handle delete report
  const handleDeleteReport = (id) => {
    if (!window.confirm('Are you sure you want to delete this report?')) return;

    fetch(`http://localhost:8080/api/reports/${id}`, { method: 'DELETE' })
      .then(res => {
        if (!res.ok) throw new Error('Failed to delete report');
        fetchReports();
        handleMenuClose();
      })
      .catch(err => {
        console.error('Error deleting report:', err);
        alert('Error deleting report');
      });
  };

  // Handle export report
  const handleExportReport = (report) => {
    // Build query params from report filters
    const params = new URLSearchParams();
    if (report.category) params.append('category', report.category);
    if (report.startDate) params.append('startDate', report.startDate);
    if (report.endDate) params.append('endDate', report.endDate);

    fetch(`http://localhost:8080/api/transactions/search?${params}`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch transaction data');
        return res.json();
      })
      .then(transactions => {
        exportToCSV(report, transactions);
      })
      .catch(err => {
        console.error('Error exporting report:', err);
        alert('Error exporting report');
      });
  };

  // Export to CSV
  const exportToCSV = (report, transactions) => {
    let csv = `Report: ${report.name}\n`;
    csv += `Generated: ${new Date().toLocaleString()}\n`;
    csv += `Type: ${report.type}\n`;
    if (report.description) csv += `Description: ${report.description}\n`;
    csv += '\n\nTransactions\n';
    csv += 'Date,Category,Type,Description,Amount,Notes\n';

    transactions.forEach(tx => {
      csv += `"${tx.date}","${tx.category}","${tx.type}","${tx.description || ''}",${tx.amount},"${tx.notes || ''}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${report.name.replace(/\s+/g, '_')}_${new Date().getTime()}.csv`;
    link.click();
  };

  // Open dialog for create/edit
  const openCreateDialog = () => {
    resetForm();
    setEditingId(null);
    setOpenDialog(true);
  };

  const openEditDialog = (report) => {
    setFormData({
      name: report.name || '',
      description: report.description || '',
      type: report.type || 'Summary',
      category: report.category || '',
      startDate: report.startDate || '',
      endDate: report.endDate || ''
    });
    setEditingId(report.id);
    setOpenDialog(true);
    handleMenuClose();
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      type: 'Summary',
      category: '',
      startDate: '',
      endDate: ''
    });
  };

  const handleMenuOpen = (e, reportId) => {
    setAnchorEl(e.currentTarget);
    setSelectedReportId(reportId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedReportId(null);
  };

  return (
    <Box sx={{ p: 4, bgcolor: '#f6f6f2', minHeight: '100vh' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight={900} sx={{ letterSpacing: 1 }}>Reports</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={openCreateDialog} sx={{ borderRadius: 2 }}>
          Create Report
        </Button>
      </Box>
      
      {loading && <CircularProgress />}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      
      {reports.length === 0 && !loading && (
        <Alert severity="info">No reports yet. Create one to get started!</Alert>
      )}
      
      <Grid container spacing={3}>
        {reports.map((report) => (
          <Grid item xs={12} md={6} lg={4} key={report.id}>
            <Card sx={{ borderRadius: 3, boxShadow: 2, position: 'relative', overflow: 'visible', height: '100%', display: 'flex', flexDirection: 'column' }}>
              {/* Accent bar */}
              <Box sx={{ position: 'absolute', top: -8, left: 24, width: 40, height: 6, bgcolor: 'info.main', borderRadius: 2 }} />
              <CardContent sx={{ flex: 1 }}>
                <Stack direction="row" alignItems="flex-start" justifyContent="space-between" sx={{ mb: 2 }}>
                  <Typography variant="h6" fontWeight={700} sx={{ mr: 1 }}>{report.name}</Typography>
                  <IconButton size="small" onClick={(e) => handleMenuOpen(e, report.id)}>
                    <MoreVertIcon sx={{ fontSize: 20 }} />
                  </IconButton>
                </Stack>
                {report.description && (
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {report.description}
                  </Typography>
                )}
                <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                  Type: <strong>{report.type}</strong>
                </Typography>
                {report.category && (
                  <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                    Category: <strong>{report.category}</strong>
                  </Typography>
                )}
                {report.startDate && (
                  <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                    Date Range: <strong>{report.startDate} to {report.endDate || 'Today'}</strong>
                  </Typography>
                )}
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                  Created: {report.date}
                </Typography>
              </CardContent>
              <Stack direction="row" spacing={1} sx={{ p: 2, borderTop: '1px solid #e0e0e0' }}>
                <Button 
                  variant="contained" 
                  size="small" 
                  startIcon={<DownloadIcon />} 
                  fullWidth
                  onClick={() => handleExportReport(report)}
                  sx={{ borderRadius: 2 }}
                >
                  Export
                </Button>
              </Stack>
            </Card>
          </Grid>
        ))}
        
        <Grid item xs={12} md={6} lg={4}>
          <Card sx={{ borderRadius: 3, boxShadow: 2, height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'visible', minHeight: 250 }}>
            <Box sx={{ position: 'absolute', top: -8, left: 24, width: 40, height: 6, bgcolor: 'info.main', borderRadius: 2 }} />
            <Button variant="outlined" startIcon={<AddIcon />} onClick={openCreateDialog} sx={{ borderRadius: 2, fontWeight: 700 }}>
              Create New Report
            </Button>
          </Card>
        </Grid>
      </Grid>

      {/* Create/Edit Report Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingId ? 'Edit Report' : 'Create New Report'}
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <TextField
            fullWidth
            label="Report Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            margin="normal"
            multiline
            rows={2}
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Report Type</InputLabel>
            <Select
              value={formData.type}
              label="Report Type"
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            >
              <MenuItem value="Summary">Summary</MenuItem>
              <MenuItem value="Detailed">Detailed</MenuItem>
              <MenuItem value="Trend">Trend Analysis</MenuItem>
              <MenuItem value="Category">Category Breakdown</MenuItem>
            </Select>
          </FormControl>
          <TextField
            fullWidth
            label="Category Filter (optional)"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            margin="normal"
            placeholder="e.g., Groceries"
          />
          <TextField
            fullWidth
            label="Start Date"
            type="date"
            value={formData.startDate}
            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            fullWidth
            label="End Date"
            type="date"
            value={formData.endDate}
            onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleSaveReport} variant="contained">
            {editingId ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Report Actions Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => {
          const report = reports.find(r => r.id === selectedReportId);
          if (report) openEditDialog(report);
        }}>
          <EditIcon sx={{ mr: 1, fontSize: 20 }} /> Edit
        </MenuItem>
        <MenuItem onClick={() => handleDeleteReport(selectedReportId)}>
          <DeleteIcon sx={{ mr: 1, fontSize: 20 }} /> Delete
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default Reports;
