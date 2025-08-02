import React from 'react';
import { Box, Grid, Card, CardContent, Typography, Paper, Divider, TextField, InputAdornment, List, ListItem, ListItemAvatar, ListItemText, LinearProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Avatar } from '@mui/material';
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import SearchIcon from '@mui/icons-material/Search';

const pieData = [
  { name: 'Food', value: 400 },
  { name: 'Shopping', value: 300 },
  { name: 'Entertainment', value: 200 },
  { name: 'Transportation', value: 100 },
];
const pieColors = ['#4285F4', '#FBBC05', '#34A853', '#EA4335'];
const lineData = [
  { month: 'Jan', income: 3000, expense: 2000 },
  { month: 'Feb', income: 3200, expense: 2100 },
  { month: 'Mar', income: 3100, expense: 2200 },
  { month: 'Apr', income: 3300, expense: 2300 },
];
const transactions = [
  { date: '04/20/2024', category: 'Groceries', amount: 50 },
  { date: '04/18/2024', category: 'Salary', amount: 3000 },
  { date: '04/17/2024', category: 'Rent', amount: 1200 },
  { date: '04/16/2024', category: 'Utilities', amount: 100 },
];
const accounts = [
  { name: 'Bank Account', type: 'Bank', amount: 3000, icon: <AccountBalanceIcon /> },
  { name: 'Credit Card', type: 'Credit', amount: 1200, icon: <CreditCardIcon /> },
  { name: 'Cash', type: 'Cash', amount: 500, icon: <AttachMoneyIcon /> },
];
const budgets = [
  { name: 'Food', percent: 60 },
  { name: 'Shopping', percent: 75 },
  { name: 'Entertainment', percent: 50 },
  { name: 'Transportation', percent: 90 },
];
const recurring = [
  { desc: 'Food', amount: 1200, freq: 'Monthly' },
  { desc: 'Gym Membership', amount: 50, freq: 'Monthly' },
  { desc: 'Car Loan', amount: 400, freq: 'Monthly' },
];

const Dashboard = () => (
  <Box sx={{ p: 0, minHeight: '100vh', bgcolor: 'transparent' }}>
    <Grid container spacing={3}>
      {/* Dashboard Main Card */}
      <Grid item xs={12} md={5.5}>
        <Card sx={{ borderRadius: 3, boxShadow: 1, mb: 2 }}>
          <CardContent>
            <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>Dashboard</Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography fontWeight={600} sx={{ mb: 1 }}>Monthly Spending</Typography>
                <ResponsiveContainer width="100%" height={100}>
                  <PieChart>
                    <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={40} label>
                      {pieData.map((entry, i) => (
                        <Cell key={i} fill={pieColors[i % pieColors.length]} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </Grid>
              <Grid item xs={6}>
                <Typography fontWeight={600} sx={{ mb: 1 }}>Income vs Expenses</Typography>
                <ResponsiveContainer width="100%" height={100}>
                  <LineChart data={lineData}>
                    <XAxis dataKey="month" hide />
                    <YAxis hide />
                    <Tooltip />
                    <Line type="monotone" dataKey="income" stroke="#4285F4" strokeWidth={2} />
                    <Line type="monotone" dataKey="expense" stroke="#34A853" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </Grid>
            </Grid>
            <Divider sx={{ my: 2 }} />
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography fontWeight={600} sx={{ mb: 0.5 }}>Net Worth</Typography>
                <Typography variant="h5" fontWeight={900}>$15,000</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography fontWeight={600} sx={{ mb: 0.5 }}>Top Expense Category</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ width: '70%', mr: 1 }}>
                    <LinearProgress variant="determinate" value={80} sx={{ height: 10, borderRadius: 5, bgcolor: '#eee', '& .MuiLinearProgress-bar': { bgcolor: '#EA4335' } }} />
                  </Box>
                  <Typography variant="body2" color="text.secondary">80%</Typography>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
      {/* Transactions Card */}
      <Grid item xs={12} md={3.5}>
        <Card sx={{ borderRadius: 3, boxShadow: 1, mb: 2 }}>
          <CardContent>
            <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>Transactions</Typography>
            <TextField
              size="small"
              fullWidth
              placeholder="Search transactions"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
                sx: { borderRadius: 2, bgcolor: '#f5f6fa' },
              }}
              sx={{ mb: 2 }}
            />
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Category</TableCell>
                    <TableCell align="right">Amount</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {transactions.map((row, i) => (
                    <TableRow key={i}>
                      <TableCell>{row.date}</TableCell>
                      <TableCell>{row.category}</TableCell>
                      <TableCell align="right">${row.amount.toLocaleString(undefined, {minimumFractionDigits:2})}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Grid>
      {/* Accounts Card */}
      <Grid item xs={12} md={3}>
        <Card sx={{ borderRadius: 3, boxShadow: 1, mb: 2 }}>
          <CardContent>
            <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>Accounts</Typography>
            <List>
              {accounts.map((acc, i) => (
                <ListItem key={i} sx={{ bgcolor: '#f5f6fa', borderRadius: 2, mb: 1 }}>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: '#e3edfa', color: '#1976d2' }}>{acc.icon}</Avatar>
                  </ListItemAvatar>
                  <ListItemText primary={<Typography fontWeight={700}>{acc.name}</Typography>} secondary={acc.type} />
                  <Typography fontWeight={700}>${acc.amount.toLocaleString()}</Typography>
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      </Grid>
      {/* Budgets Card */}
      <Grid item xs={12} md={5.5}>
        <Card sx={{ borderRadius: 3, boxShadow: 1, mb: 2 }}>
          <CardContent>
            <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>Budgets</Typography>
            {budgets.map((b, i) => (
              <Box key={b.name} sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography>{b.name}</Typography>
                  <Typography>{b.percent}%</Typography>
                </Box>
                <LinearProgress variant="determinate" value={b.percent} sx={{ height: 10, borderRadius: 5, bgcolor: '#eee', '& .MuiLinearProgress-bar': { bgcolor: '#4285F4' } }} />
              </Box>
            ))}
          </CardContent>
        </Card>
      </Grid>
      {/* Recurring Payments Card */}
      <Grid item xs={12} md={6.5}>
        <Card sx={{ borderRadius: 3, boxShadow: 1, mb: 2 }}>
          <CardContent>
            <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>Recurring Payments</Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Description</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>Frequency</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {recurring.map((row, i) => (
                    <TableRow key={i}>
                      <TableCell>{row.desc}</TableCell>
                      <TableCell>${row.amount.toLocaleString()}</TableCell>
                      <TableCell>{row.freq}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  </Box>
);

export default Dashboard;
