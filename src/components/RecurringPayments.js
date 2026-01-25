import React, { useEffect, useState } from 'react';
import { Box, Typography, List, ListItem, ListItemText, Button, Switch, CircularProgress, Alert,TextField} from '@mui/material';

const RecurringPayments = () => {
  const [recurring, setRecurring] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newPayment, setNewPayment] = useState({ description: '', amount: '', frequency: 'Monthly' });  
  const handleDialogOpen = () => {
    setNewPayment({ description: '', amount: '', frequency: 'Monthly' });
    setDialogOpen(true);
  };
  const handleDialogClose = () => {
    setDialogOpen(false);
  };  
  const handleAddPayment = () => {
    // Logic to add new recurring payment
    console.log('Add Recurring Payment:', newPayment);
    setDialogOpen(false);
  };

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
      <Button variant="contained" sx={{ mt: 4 }} onClick={handleDialogOpen}>Add Recurring Payment</Button>
      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogTitle>Add Recurring Payment</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Description"
            fullWidth
            variant="outlined"
            value={newPayment.description}
            onChange={(e) => setNewPayment({ ...newPayment, description: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Amount"
            type="number"
            fullWidth
            variant="outlined"
            value={newPayment.amount}
            onChange={(e) => setNewPayment({ ...newPayment, amount: e.target.value })}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Frequency</InputLabel>
            <Select
              value={newPayment.frequency}
              onChange={(e) => setNewPayment({ ...newPayment, frequency: e.target.value })}
            >
              <MenuItem value="Monthly">Monthly</MenuItem>
              <MenuItem value="Weekly">Weekly</MenuItem>
              <MenuItem value="Yearly">Yearly</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button onClick={handleAddPayment}>Add</Button>
        </DialogActions>
      </Dialog>
    </Box>

  );
};

export default RecurringPayments;
