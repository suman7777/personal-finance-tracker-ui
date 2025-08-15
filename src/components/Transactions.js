import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Card, CardContent, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Stack, CircularProgress, Alert, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import MoreVertIcon from '@mui/icons-material/MoreVert';


const categoryOptions = [
  'Food', 'Transport', 'Shopping', 'Bills', 'Salary', 'Investment', 'Other'
];

const typeOptions = [
  'INCOME', 'EXPENSE'
];

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
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

  const fetchTransactions = () => {
    setLoading(true);
    fetch('http://localhost:8080/api/transactions')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch transactions');
        return res.json();
      })
      .then(data => {
        setTransactions(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleDialogOpen = () => {
    setForm({ date: '', description: '', category: '', amount: '' });
    setFormError(null);
    setDialogOpen(true);
  };
  const handleDialogClose = () => {
    setDialogOpen(false);
    setFormError(null);
  };

  const handleFormChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    if (!form.date || !form.description || !form.category || form.amount === '') {
      return 'All fields are required.';
    }
    if (isNaN(Number(form.amount))) {
      return 'Amount must be a number.';
    }
    return null;
  };

  const handleFormSubmit = async e => {
    e.preventDefault();
    const err = validateForm();
    if (err) {
      setFormError(err);
      return;
    }
    setSubmitting(true);
    setFormError(null);
    try {
      const res = await fetch('http://localhost:8080/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          amount: Number(form.amount)
        })
      });
      if (!res.ok) throw new Error('Failed to add transaction');
      setDialogOpen(false);
      fetchTransactions();
    } catch (e) {
      setFormError(e.message);
    }
    setSubmitting(false);
  };

  return (
    <Box sx={{ p: 4, bgcolor: '#f6f6f2', minHeight: '100vh' }}>
      <Typography variant="h4" fontWeight={900} sx={{ mb: 3, letterSpacing: 1 }}>Transactions</Typography>
      {loading && <CircularProgress />}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <Card sx={{ mb: 4, borderRadius: 3, boxShadow: 2, position: 'relative', overflow: 'visible' }}>
        {/* Accent bar */}
        <Box sx={{ position: 'absolute', top: -8, left: 24, width: 40, height: 6, bgcolor: 'primary.main', borderRadius: 2 }} />
        <CardContent>
          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Typography variant="h6" fontWeight={700}>Recent Transactions</Typography>
              <MoreVertIcon sx={{ color: 'text.secondary', fontSize: 22, ml: 1, cursor: 'pointer' }} />
            </Stack>
            <Button variant="contained" startIcon={<AddIcon />} sx={{ borderRadius: 2, boxShadow: 1 }} onClick={handleDialogOpen}>
              Add Transaction
            </Button>
          </Stack>
          <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 0, bgcolor: '#fff' }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell align="right">Amount</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {transactions.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell>{row.date}</TableCell>
                    <TableCell>{row.description}</TableCell>
                    <TableCell>{row.category}</TableCell>
                    <TableCell align="right" style={{ color: row.amount < 0 ? '#e53935' : '#43a047', fontWeight: 700 }}>
                      {row.amount < 0 ? '-' : '+'}${Math.abs(row.amount)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Add Transaction Dialog */}
      <Dialog open={dialogOpen} onClose={handleDialogClose} maxWidth="xs" fullWidth>
        <DialogTitle>Add Transaction</DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleFormSubmit} sx={{ mt: 1 }}>
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
            <TextField
              label="Category"
              name="category"
              value={form.category}
              onChange={handleFormChange}
              select
              fullWidth
              sx={{ mb: 2 }}
              required
            >
              {categoryOptions.map(option => (
                <MenuItem key={option} value={option}>{option}</MenuItem>
              ))}
            </TextField>
             <TextField
              label="Type"
              name="type"
              value={form.type}
              onChange={handleFormChange}
              select
              fullWidth
              sx={{ mb: 2 }}
              required
            >
              {typeOptions.map(option => (
                <MenuItem key={option} value={option}>{option}</MenuItem>
              ))}
            </TextField>
            
            <TextField
              label="Amount"
              name="amount"
              value={form.amount}
              onChange={handleFormChange}
              type="number"
              fullWidth
              sx={{ mb: 2 }}
              required
              inputProps={{ step: '0.01' }}
            />
            {formError && <Alert severity="error" sx={{ mb: 2 }}>{formError}</Alert>}
            <DialogActions>
              <Button onClick={handleDialogClose} color="secondary">Cancel</Button>
              <Button type="submit" variant="contained" color="primary" disabled={submitting}>
                {submitting ? 'Adding...' : 'Add'}
              </Button>
            </DialogActions>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default Transactions;
