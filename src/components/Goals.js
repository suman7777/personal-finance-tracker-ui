import React from 'react';
import { Box, Typography, Card, CardContent, Grid, Button, LinearProgress, Stack, Avatar } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import MoreVertIcon from '@mui/icons-material/MoreVert';

const goals = [
  { name: 'Emergency Fund', target: 5000, saved: 3200 },
  { name: 'Vacation Trip', target: 2000, saved: 1200 },
  { name: 'New Laptop', target: 1500, saved: 800 },
  { name: 'Car Down Payment', target: 8000, saved: 4000 },
];

const Goals = () => {
  return (
    <Box sx={{ p: 4, bgcolor: '#f6f6f2', minHeight: '100vh' }}>
      <Typography variant="h4" fontWeight={900} sx={{ mb: 3, letterSpacing: 1 }}>Goals</Typography>
      <Grid container spacing={3}>
        {goals.map((goal, idx) => (
          <Grid item xs={12} md={6} lg={3} key={goal.name}>
            <Card sx={{ borderRadius: 3, boxShadow: 2, position: 'relative', overflow: 'visible' }}>
              {/* Accent bar */}
              <Box sx={{ position: 'absolute', top: -8, left: 24, width: 40, height: 6, bgcolor: 'success.main', borderRadius: 2 }} />
              <CardContent>
                <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <Avatar sx={{ bgcolor: '#8dd1e1', color: '#223', fontWeight: 700 }}>{goal.name[0]}</Avatar>
                    <Typography variant="h6" fontWeight={700}>{goal.name}</Typography>
                  </Stack>
                  <MoreVertIcon sx={{ color: 'text.secondary', fontSize: 22, ml: 1, cursor: 'pointer' }} />
                </Stack>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>Target: ${goal.target}</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>Saved: ${goal.saved}</Typography>
                <LinearProgress variant="determinate" value={Math.min((goal.saved / goal.target) * 100, 100)} sx={{ height: 10, borderRadius: 5, mb: 1 }} />
                <Typography variant="body2" color={goal.saved >= goal.target ? 'success.main' : 'primary.main'} fontWeight={700}>
                  {goal.saved >= goal.target ? 'Goal Achieved!' : `${Math.round((goal.saved / goal.target) * 100)}% Complete`}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
        <Grid item xs={12} md={6} lg={3}>
          <Card sx={{ borderRadius: 3, boxShadow: 2, height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'visible' }}>
            <Box sx={{ position: 'absolute', top: -8, left: 24, width: 40, height: 6, bgcolor: 'success.main', borderRadius: 2 }} />
            <Button variant="outlined" startIcon={<AddIcon />} sx={{ borderRadius: 2, fontWeight: 700 }}>
              Add Goal
            </Button>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Goals;
