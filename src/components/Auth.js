import React from 'react';
import { Box, Typography, TextField, Button, Card, CardContent, Alert } from '@mui/material';

const Auth = () => (
  <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#f5f6fa' }}>
    <Card sx={{ maxWidth: 400, width: '100%', p: 2 }}>
      <CardContent>
        <Typography variant="h5" fontWeight={700} sx={{ mb: 2 }}>Login</Typography>
        <Alert severity="info" sx={{ mb: 2 }}>Demo only. No real authentication.</Alert>
        <TextField label="Email" fullWidth sx={{ mb: 2 }} />
        <TextField label="Password" type="password" fullWidth sx={{ mb: 2 }} />
        <Button variant="contained" color="primary" fullWidth>Login</Button>
        <Button color="secondary" fullWidth sx={{ mt: 1 }}>Register</Button>
        <Button color="inherit" fullWidth sx={{ mt: 1 }}>Forgot Password?</Button>
      </CardContent>
    </Card>
  </Box>
);

export default Auth;
