import React, { useEffect, useState } from 'react';
import {
  Box, Typography, TextField, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Stack, CircularProgress, Alert
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const API_URL = 'http://localhost:8080/api/users';

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({ username: '', password: '', email: '' });
  const [editingId, setEditingId] = useState(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error('Failed to fetch users');
      setUsers(await res.json());
      setError(null);
    } catch (e) {
      setError(e.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const method = editingId ? 'PUT' : 'POST';
      const url = editingId ? `${API_URL}/${editingId}` : API_URL;
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Failed to save user');
      setForm({ username: '', password: '', email: '' });
      setEditingId(null);
      fetchUsers();
    } catch (e) {
      setError(e.message);
    }
  };

  const handleEdit = user => {
    setForm({ username: user.username, password: user.password, email: user.email });
    setEditingId(user.id);
  };

  const handleDelete = async id => {
    if (!window.confirm('Delete this user?')) return;
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete user');
      fetchUsers();
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <Box maxWidth={700} mx="auto" mt={4}>
      <Typography variant="h4" fontWeight={700} mb={3}>
        Users
      </Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <Paper sx={{ p: 3, mb: 4 }} elevation={3}>
        <form onSubmit={handleSubmit}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
            <TextField
              name="username"
              label="Username"
              value={form.username}
              onChange={handleChange}
              required
              size="small"
            />
            <TextField
              name="password"
              label="Password"
              value={form.password}
              onChange={handleChange}
              required
              size="small"
              type="password"
            />
            <TextField
              name="email"
              label="Email"
              value={form.email}
              onChange={handleChange}
              required
              size="small"
              type="email"
            />
            <Button type="submit" variant="contained" color="primary">
              {editingId ? 'Update' : 'Create'}
            </Button>
            {editingId && (
              <Button type="button" variant="outlined" color="secondary" onClick={() => { setForm({ username: '', password: '', email: '' }); setEditingId(null); }}>
                Cancel
              </Button>
            )}
          </Stack>
        </form>
      </Paper>
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper} elevation={2}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Username</TableCell>
                <TableCell>Email</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map(user => (
                <TableRow key={user.id}>
                  <TableCell>{user.id}</TableCell>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell align="center">
                    <IconButton color="primary" onClick={() => handleEdit(user)}><EditIcon /></IconButton>
                    <IconButton color="error" onClick={() => handleDelete(user.id)}><DeleteIcon /></IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}
