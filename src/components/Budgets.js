import React, { useEffect, useState } from 'react';
import { Box, Typography, Card, CardContent, Grid, Button, LinearProgress, Stack, CircularProgress, Alert , 
Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem
 } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import MoreVertIcon from '@mui/icons-material/MoreVert';

const Budgets = () => {
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({
      date: '',
      description: '',
      category: '',
      amount: ''
    });

  const [formError, setFormError] = useState(null);
  const [submitting, setSubmitting] = useState(false);  
  const fetchBudget = () => {
    setLoading(true);
    fetch('http://localhost:8080/api/budgets')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch transactions');
        return res.json();
      })
      .then(data => {
        setBudgets(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      }); 
};
  const handleDialogOpen = () => {
    // Logic to open dialog for adding a new budget
    setForm({ date: '', description: '', category: '', amount: '' });
    setFormError(null);
    setDialogOpen(true);    
  }

  const handleDialogClose = () => {
    setDialogOpen(false);
    setFormError(null);
  }
  const handleFormChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  }
  const handleFormSubmit = e => {
    e.preventDefault();
    setSubmitting(true);  
    fetch('http://localhost:8080/api/budgets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to add budget');
        return res.json();
      })
      .then(data => {
        setBudgets([...budgets, data]);
        setSubmitting(false);
        setDialogOpen(false);
      })
      .catch(err => {
        setFormError(err.message);
        setSubmitting(false);
      });

  }; 
  useEffect(() => {
    fetchBudget();
  }, []); 

  return (
    <Box sx={{ p: 4, bgcolor: '#f6f6f2', minHeight: '100vh' }}>
      <Typography variant="h4" fontWeight={900} sx={{ mb: 3, letterSpacing: 1 }}>Budgets</Typography>
      {loading && <CircularProgress />}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={handleDialogOpen} sx={{ mb: 3 }}>
        Add Budget
      </Button>
      {/* Display budgets in a grid */}
      <Grid container spacing={3}>
        {budgets.map((budget, idx) => (
          <Grid item xs={12} md={6} lg={3} key={budget.id}>
            <Card sx={{ borderRadius: 3, boxShadow: 2, position: 'relative', overflow: 'visible' }}>
              {/* Accent bar */}
              <Box sx={{ position: 'absolute', top: -8, left: 24, width: 40, height: 6, bgcolor: 'secondary.main', borderRadius: 2 }} />
              <CardContent>
                <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Typography variant="h6" fontWeight={700}>{budget.category}</Typography>
                    <MoreVertIcon sx={{ color: 'text.secondary', fontSize: 22, ml: 1, cursor: 'pointer' }} />
                  </Stack>
                  <Typography variant="body2" color="text.secondary">Limit: ${budget.limitAmount}</Typography>
                </Stack>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>Spent: ${budget.spentAmount}</Typography>
                <LinearProgress variant="determinate" value={Math.min((budget.spentAmount / budget.limitAmount) * 100, 100)} sx={{ height: 10, borderRadius: 5, mb: 1 }} />
                <Typography variant="body2" color={budget.spentAmount > budget.limitAmount ? 'error.main' : 'success.main'} fontWeight={700}>
                  {budget.spentAmount > budget.limitAmount ? 'Over Budget' : `${100 - Math.round((budget.spentAmount / budget.limitAmount) * 100)}% Remaining`}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      {/* Dialog for adding a new budget */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Add New Budget</DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleFormSubmit} sx={{ mt: 1 }}>
            <TextField  
              label="Category"
              fullWidth
              margin="normal"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              error={!!formError}
              helperText={formError && formError.category}
              required
            />
            <TextField 
              label="Limit Amount"
              fullWidth
              margin="normal"
              type="number"
              value={form.limitAmount}
              onChange={(e) => setForm({ ...form, limitAmount: e.target.value })}
              error={!!formError}
              helperText={formError && formError.limitAmount}
              required
            />
            <TextField
              label="Date"
              name="date" 
              type="date"
              value={form.date}
              onChange={handleFormChange}
              fullWidth
              sx={{ mb: 2 }}
              InputLabelProps={{ shrink: true }}  
              required
            />
            <TextField 
              label="Description" 
              name="description"
              value={form.description}
              onChange={handleFormChange}
              fullWidth
              sx={{ mb: 2 }}
              required  
            />
            {formError && <Alert severity="error" sx={{ mb: 2 }}>{formError}</Alert>} 
            <DialogActions>
              <Button onClick={handleDialogClose} color="secondary" disabled={submitting}>Cancel</Button>
              <Button type="submit" variant="contained" color="primary" disabled={submitting}>
                {submitting ? <CircularProgress size={24} /> : 'Add Budget'}
              </Button>
            </DialogActions>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default Budgets;
