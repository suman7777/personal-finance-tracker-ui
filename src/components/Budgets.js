import React, { useEffect, useState } from 'react';
import { Box, Typography, Card, CardContent, Grid, Button, LinearProgress, Stack, CircularProgress, Alert } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import MoreVertIcon from '@mui/icons-material/MoreVert';

const Budgets = () => {
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://localhost:8080/api/budgets')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch budgets');
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
  }, []);

  return (
    <Box sx={{ p: 4, bgcolor: '#f6f6f2', minHeight: '100vh' }}>
      <Typography variant="h4" fontWeight={900} sx={{ mb: 3, letterSpacing: 1 }}>Budgets</Typography>
      {loading && <CircularProgress />}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
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
        <Grid item xs={12} md={6} lg={3}>
          <Card sx={{ borderRadius: 3, boxShadow: 2, height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'visible' }}>
            <Box sx={{ position: 'absolute', top: -8, left: 24, width: 40, height: 6, bgcolor: 'secondary.main', borderRadius: 2 }} />
            <Button variant="outlined" startIcon={<AddIcon />} sx={{ borderRadius: 2, fontWeight: 700 }}>
              Add Budget
            </Button>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Budgets;
