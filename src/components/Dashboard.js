import React, { useEffect, useState } from 'react';
import {
  Box, Grid, Typography, Divider, TextField, InputAdornment,
  List, ListItem, ListItemAvatar, ListItemText, LinearProgress,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Avatar, Paper,
  Tabs, Tab
} from '@mui/material';

import { Doughnut, Line, Bar, Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Filler,
  RadialLinearScale,
  BarElement
} from 'chart.js';

import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import SearchIcon from '@mui/icons-material/Search';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import SavingsIcon from '@mui/icons-material/Savings';

// Register Chart.js components
ChartJS.register(
  ArcElement, Tooltip, Legend,
  CategoryScale, LinearScale, PointElement, LineElement, Title, Filler,
  RadialLinearScale, BarElement
);

const Dashboard = () => {
  const [pieData, setPieData] = useState([]);
  const [lineData, setLineData] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [recurring, setRecurring] = useState([]);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);
  const [chartTab, setChartTab] = useState(0);

  useEffect(() => {
    fetch('http://localhost:8080/api/dashboard-data')
      .then(res => res.json())
      .then(data => {
        setPieData(data.pieData || []);
        setLineData(data.lineData || []);
        setTransactions(data.transactions || []);
        setAccounts(data.accounts || []);
        setBudgets(data.budgets || []);
        setRecurring(data.recurring || []);

        if (data.lineData) {
          const incomeSum = data.lineData.reduce((sum, m) => sum + (m.income || 0), 0);
          const expenseSum = data.lineData.reduce((sum, m) => sum + (m.expense || 0), 0);
          setTotalIncome(incomeSum);
          setTotalExpense(expenseSum);
        }
      })
      .catch(err => console.error('Error fetching dashboard data:', err));
  }, []);

  const totalSavings = totalIncome - totalExpense;

  // Chart.js Doughnut Data
  const doughnutChartData = {
    labels: pieData.map(p => p.name),
    datasets: [
      {
        label: 'Spending',
        data: pieData.map(p => p.value),
        backgroundColor: ['#4285F4', '#FBBC05', '#34A853', '#EA4335'],
        borderWidth: 2,
      }
    ]
  };

  // Chart.js Line Chart Data
  const lineChartData = {
    labels: lineData.map(l => l.month),
    datasets: [
      {
        label: 'Income',
        data: lineData.map(l => l.income),
        borderColor: '#34A853',
        backgroundColor: 'rgba(52, 168, 83, 0.2)',
        fill: true,
        tension: 0.4
      },
      {
        label: 'Expense',
        data: lineData.map(l => l.expense),
        borderColor: '#EA4335',
        backgroundColor: 'rgba(234, 67, 53, 0.2)',
        fill: true,
        tension: 0.4
      }
    ]
  };

  // Bar chart data
  const barChartData = {
    labels: pieData.map(p => p.name),
    datasets: [
      {
        label: 'Spending by Category',
        data: pieData.map(p => p.value),
        backgroundColor: ['#4285F4', '#FBBC05', '#34A853', '#EA4335'],
        borderRadius: 5
      }
    ]
  };

  // Radar chart data
  const radarChartData = {
    labels: pieData.map(p => p.name),
    datasets: [
      {
        label: 'Category Comparison',
        data: pieData.map(p => p.value),
        backgroundColor: 'rgba(66, 133, 244, 0.2)',
        borderColor: '#4285F4',
        borderWidth: 2,
        pointBackgroundColor: '#4285F4'
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'bottom' },
    },
    animation: {
      duration: 1500,
      easing: 'easeOutQuart'
    }
  };

  const handleTabChange = (event, newValue) => {
    setChartTab(newValue);
  };

  return (
    <Box sx={{ p: 3, bgcolor: '#f5f7fa', minHeight: '100vh' }}>
      
      {/* Top Summary Row */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {[
          { title: 'Total Income', value: totalIncome, icon: <TrendingUpIcon />, color: 'linear-gradient(135deg, #4facfe, #00f2fe)' },
          { title: 'Total Expense', value: totalExpense, icon: <TrendingDownIcon />, color: 'linear-gradient(135deg, #ff6a6a, #d32f2f)' },
          { title: 'Savings', value: totalSavings, icon: <SavingsIcon />, color: 'linear-gradient(135deg, #43e97b, #38f9d7)' }
        ].map((item, i) => (
          <Grid item xs={12} sm={4} key={i}>
            <Box sx={{
              borderRadius: 4,
              p: 3,
              background: item.color,
              color: '#fff',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 8px 20px rgba(0,0,0,0.15)'
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                {item.icon}
                <Typography variant="h6" fontWeight={700} sx={{ ml: 1 }}>{item.title}</Typography>
              </Box>
              <Typography variant="h4" fontWeight={900}>
                ${item.value.toLocaleString()}
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>

      {/* Dashboard Overview */}
      {/* Dashboard Overview */}
<Box sx={{ mb: 4, p: 3, borderRadius: 4, border: '1px solid #e5e7eb', bgcolor: '#fff' }}>
  <Typography variant="h6" fontWeight={700} sx={{ mb: 3 }}>
    📊 Dashboard Overview
  </Typography>

  <Grid container spacing={3} alignItems="stretch">
    
    {/* Left: Doughnut Chart */}
    <Grid item xs={12} md={4}>
      <Doughnut data={doughnutChartData} options={chartOptions} />
    </Grid>

    {/* Center: Tabbed Charts */}
    <Grid item xs={12} md={5}>
      <Tabs value={chartTab} onChange={handleTabChange} sx={{ mb: 2 }}>
        <Tab label="Line" />
        <Tab label="Bar" />
        <Tab label="Radar" />
      </Tabs>

      {chartTab === 0 && <Line data={lineChartData} options={chartOptions} />}
      {chartTab === 1 && <Bar data={barChartData} options={{ responsive: true, plugins: { legend: { display: false } } }} />}
      {chartTab === 2 && <Radar data={radarChartData} options={{ responsive: true }} />}
    </Grid>

    {/* Right: Quick Stats */}
    <Grid item xs={12} md={3}>
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        height: '100%'
      }}>
        <Box sx={{
          p: 2,
          bgcolor: '#f9fafb',
          borderRadius: 3,
          border: '1px solid #e0e0e0'
        }}>
          <Typography variant="body2" color="text.secondary">Top Category</Typography>
          <Typography variant="h6" fontWeight={700}>
            {pieData.length ? pieData[0].name : '-'}
          </Typography>
        </Box>

        <Box sx={{
          p: 2,
          bgcolor: '#f9fafb',
          borderRadius: 3,
          border: '1px solid #e0e0e0'
        }}>
          <Typography variant="body2" color="text.secondary">Avg Monthly Spend</Typography>
          <Typography variant="h6" fontWeight={700}>
            ${totalExpense && lineData.length ? Math.round(totalExpense / lineData.length).toLocaleString() : '-'}
          </Typography>
        </Box>

        <Box sx={{
          p: 2,
          bgcolor: '#f9fafb',
          borderRadius: 3,
          border: '1px solid #e0e0e0'
        }}>
          <Typography variant="body2" color="text.secondary">Largest Income Source</Typography>
          <Typography variant="h6" fontWeight={700}>
            {transactions.length
              ? transactions.filter(t => t.amount > 0).sort((a, b) => b.amount - a.amount)[0].category
              : '-'}
          </Typography>
        </Box>
      </Box>
    </Grid>

  </Grid>
</Box>


      {/* Accounts */}
      <Box sx={{ mb: 4, p: 3, borderRadius: 4, border: '1px solid #e5e7eb', bgcolor: '#fff' }}>
        <Typography variant="h6" fontWeight={700} sx={{ mb: 3 }}>🏦 Accounts</Typography>
        <List>
          {accounts.map((acc, i) => (
            <ListItem key={i} sx={{ borderBottom: '1px solid #f0f0f0', '&:hover': { bgcolor: '#f9fafb' } }}>
              <ListItemAvatar>
                <Avatar sx={{ bgcolor: '#e3edfa', color: '#1976d2' }}>
                  {acc.type === 'Bank' && <AccountBalanceIcon />}
                  {acc.type === 'Credit' && <CreditCardIcon />}
                  {acc.type === 'Cash' && <AttachMoneyIcon />}
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary={<Typography fontWeight={700}>{acc.name}</Typography>} secondary={acc.type} />
              <Typography fontWeight={700}>${acc.amount.toLocaleString()}</Typography>
            </ListItem>
          ))}
        </List>
      </Box>

      {/* Transactions */}
      <Box sx={{ mb: 4, p: 3, borderRadius: 4, border: '1px solid #e5e7eb', bgcolor: '#fff' }}>
        <Typography variant="h6" fontWeight={700} sx={{ mb: 3 }}>💰 Recent Transactions</Typography>
        <TextField
          size="small"
          fullWidth
          placeholder="Search transactions"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
            sx: { borderRadius: 3, bgcolor: '#f9fafb' },
          }}
          sx={{ mb: 2 }}
        />
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Category</TableCell>
                <TableCell align="right">Amount</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {transactions.map((row, i) => (
                <TableRow key={i} sx={{ '&:hover': { bgcolor: '#f9fafb' } }}>
                  <TableCell>{row.date}</TableCell>
                  <TableCell>{row.category}</TableCell>
                  <TableCell align="right">${row.amount.toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* Budgets */}
      <Box sx={{ mb: 4, p: 3, borderRadius: 4, border: '1px solid #e5e7eb', bgcolor: '#fff' }}>
        <Typography variant="h6" fontWeight={700} sx={{ mb: 3 }}>📅 Budgets</Typography>
        {budgets.map((b, i) => (
          <Box key={b.name} sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
              <Typography fontWeight={600}>{b.name}</Typography>
              <Typography fontWeight={600}>{b.percent}%</Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={b.percent}
              sx={{
                height: 10,
                borderRadius: 5,
                bgcolor: '#f0f0f0',
                '& .MuiLinearProgress-bar': {
                  background: 'linear-gradient(90deg, #4facfe, #00f2fe)'
                }
              }}
            />
          </Box>
        ))}
      </Box>

      {/* Recurring Payments */}
      <Box sx={{ p: 3, borderRadius: 4, border: '1px solid #e5e7eb', bgcolor: '#fff' }}>
        <Typography variant="h6" fontWeight={700} sx={{ mb: 3 }}>🔄 Recurring Payments</Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Description</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Frequency</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {recurring.map((row, i) => (
                <TableRow key={i} sx={{ '&:hover': { bgcolor: '#f9fafb' } }}>
                  <TableCell>{row.desc}</TableCell>
                  <TableCell>${row.amount.toLocaleString()}</TableCell>
                  <TableCell>{row.freq}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

    </Box>
  );
};

export default Dashboard;
