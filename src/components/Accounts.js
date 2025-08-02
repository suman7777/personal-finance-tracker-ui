import React, { useEffect, useState } from 'react';
import { Box, Typography, Card, CardContent, Grid, Button, Avatar, Stack, CircularProgress, Alert } from '@mui/material';

const Accounts = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
                    <Typography variant="body2" color="text.secondary">Balance: ${acc.balance?.toLocaleString()}</Typography>
                    <Typography variant="body2" color="text.secondary">Type: {acc.type}</Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Button variant="contained" sx={{ mt: 4 }}>Add Account</Button>
    </Box>
  );
};

export default Accounts;
