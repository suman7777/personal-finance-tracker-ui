import React, { useEffect, useState } from 'react';
import { Box, Typography, Card, CardContent, Grid, Button, Avatar, Stack, CircularProgress, Alert,TextField } from '@mui/material';



const Accounts = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({name: '',type: '',balance: ''}); 
  const [formError, setFormError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleDilogeOpen = () => {
  // Logic to open the dialog for adding a new account
  console.log('Open Add Account Dialog');
  setForm({name: '', type: '',balance: ''});
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
  const handleFormSubmit = () => {
    setSubmitting(true);
    setFormError(null); 
    // Basic validation
    const errors = {};
    if (!form.name) errors.name = 'Account name is required';
    if (!form.type) errors.type = 'Account type is required';
    if (form.balance === '' || isNaN(form.balance)) errors.balance = 'Valid initial balance is required'; 
    if (Object.keys(errors).length > 0) {
      setFormError(errors);
      setSubmitting(false);
      return;
    }
    fetch('http://localhost:8080/api/accounts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(form),
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to add account');
        return res.json();
      })
      .then(data => {
        setAccounts([...accounts, data]);
        setDialogOpen(false);
        setSubmitting(false);
      })
      .catch(err => {
        setError(err.message);
        setSubmitting(false);
      });
  };  


  useEffect(() => {
    fetch('http://localhost:8080/api/accounts')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch accounts');
        return res.json();
      })
      .then(data => {
        setAccounts(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" fontWeight={900} sx={{ mb: 3 }}>Accounts</Typography>
      {loading && <CircularProgress />}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <Grid container spacing={3}>
        {accounts.map((acc) => (
          <Grid item xs={12} md={4} key={acc.id}>
            <Card sx={{ borderRadius: 3, boxShadow: 2 }}>
              <CardContent>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Avatar sx={{ bgcolor: 'primary.main' }}>{acc.name ? acc.name[0] : '?'}</Avatar>
                  <Box>
                    <Typography variant="h6">{acc.name}</Typography>
                    <Typography variant="body2" color="text.secondary">Balance: ₹{acc.balance?.toLocaleString('en-IN')}</Typography>
                    <Typography variant="body2" color="text.secondary">Type: {acc.type}</Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Button variant="contained" sx={{ mt: 4 }} onClick={handleDilogeOpen}>Add Account</Button>
      {/* Add Account Dialog - Placeholder */}
      {dialogOpen && (
        <Box sx={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', bgcolor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Card sx={{ p: 4, maxWidth: 400, width: '100%' }}>
            <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>Add Account</Typography>
            <TextField fullWidth margin="normal" label="Account Name" name="name" value={form.name} onChange={handleFormChange} error={!!formError} helperText={formError?.name} />
            <TextField fullWidth margin="normal" label="Account Type" name="type" value={form.type} onChange={handleFormChange} error={!!formError} helperText={formError?.type} />
            <TextField fullWidth margin="normal" label="Initial Balance" name="balance" type="number" value={form.balance} onChange={handleFormChange} error={!!formError} helperText={formError?.balance} />
            <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
              <Button variant="contained" onClick={handleFormSubmit} disabled={submitting}>
                {submitting ? <CircularProgress size={24} /> : 'Add Account'}
              </Button>
              <Button variant="outlined" onClick={handleDialogClose}>Cancel</Button>
            </Stack>
          </Card>
        </Box>
      )} 
    </Box>
  );
};

export default Accounts;
