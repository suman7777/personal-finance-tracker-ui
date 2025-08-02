import React, { useEffect, useState } from 'react';
import { Box, Typography, List, ListItem, ListItemText, Button, Switch, CircularProgress, Alert } from '@mui/material';

const RecurringPayments = () => {
  const [recurring, setRecurring] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://localhost:8080/api/recurring-payments')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch recurring payments');
        return res.json();
      })
      .then(data => {
        setRecurring(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" fontWeight={900} sx={{ mb: 3 }}>Recurring Payments</Typography>
      {loading && <CircularProgress />}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <List>
        {recurring.map((item) => (
          <ListItem key={item.id} secondaryAction={<Switch edge="end" defaultChecked={item.frequency === 'Monthly'} />}>
            <ListItemText primary={item.description} secondary={`Amount: $${item.amount} | Frequency: ${item.frequency}`} />
          </ListItem>
        ))}
      </List>
      <Button variant="contained" sx={{ mt: 4 }}>Add Recurring Payment</Button>
    </Box>
  );
};

export default RecurringPayments;
