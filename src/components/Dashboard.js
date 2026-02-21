import React, { useEffect, useState, useRef } from 'react';
import {
  Box, Grid, Typography, Divider, TextField, InputAdornment,
  List, ListItem, ListItemAvatar, ListItemText, LinearProgress, CircularProgress,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Avatar, Paper
} from '@mui/material';

import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Filler
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
  Tooltip, Legend,
  CategoryScale, LinearScale, PointElement, LineElement, Title, Filler
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
  const [loadingDashboard, setLoadingDashboard] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [txLoading, setTxLoading] = useState(false);
  const searchTimeoutRef = useRef(null);
  // removed chartTab/Tabs — we show two charts side-by-side for a clean overview

  // Helper: format numbers as Indian Rupees
  const formatINR = (val) => {
    const n = Number(val || 0);
    return `₹${n.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  useEffect(() => {
    setLoadingDashboard(true);
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
        setLoadingDashboard(false);
      })
      .catch(err => {
        console.error('Error fetching dashboard data:', err);
        setLoadingDashboard(false);
      });
  }, []);

  // Search transactions via backend endpoint (debounced)
  useEffect(() => {
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    // debounce user input
    searchTimeoutRef.current = setTimeout(() => {
      setTxLoading(true);
      try {
        const backendBase = 'http://localhost:8080';
        const url = new URL('/api/transactions/search', backendBase);
        if (searchQuery) url.searchParams.set('q', searchQuery);
        fetch(url.toString(), { method: 'GET', credentials: 'include' })
          .then(res => {
            if (!res.ok) throw new Error('Search failed');
            return res.json();
          })
          .then(data => setTransactions(data || []))
          .catch(err => {
            console.error('Transaction search error:', err);
          })
          .finally(() => setTxLoading(false));
      } catch (err) {
        console.error('Transaction search error:', err);
        setTxLoading(false);
      }
    }, 350);

    return () => {
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    };
  }, [searchQuery]);

  const totalSavings = totalIncome - totalExpense;

  // ensure pie data values are numeric (used by bar chart)
  // (pie data removed from overview - kept for possible other uses)

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
  // Chart options (used by Line chart)
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

  // Compute dynamic line chart options so small values are visible and formatted as INR
  const maxPoint = Math.max(
    ...(lineData.map(l => Number(l.income || 0))),
    ...(lineData.map(l => Number(l.expense || 0))),
    0
  );
  const suggestedMax = maxPoint > 0 ? Math.ceil(maxPoint * 1.15) : undefined;

  const lineOptions = {
    ...chartOptions,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        suggestedMax: suggestedMax,
        ticks: {
          callback: function(value) {
            return formatINR(value);
          }
        },
        grid: { color: '#f0f0f0' }
      },
      x: { grid: { color: '#fafafa' } }
    },
    plugins: {
      ...chartOptions.plugins,
      tooltip: {
        callbacks: {
          label: function(context) {
            return `${context.dataset.label}: ${formatINR(context.parsed.y)}`;
          }
        }
      }
    },
    elements: {
      point: { radius: 4, hoverRadius: 6 }
    }
  };

  // (bar chart removed — only Line chart is used in overview)

  // (radar chart removed for cleaner overview)

  // no tabs — single-line charts displayed

  return (
    <Box sx={{ p: 3, bgcolor: '#f5f7fa', minHeight: '100vh' }}>
      
      {/* Top Summary Row */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {[
          { title: 'Total Income', value: totalIncome, icon: <TrendingUpIcon />, color: 'linear-gradient(135deg, #4facfe, #00f2fe)' },
          { title: 'Total Expense', value: totalExpense, icon: <TrendingDownIcon />, color: 'linear-gradient(135deg, #ff6a6a, #d32f2f)' },
          { title: 'Net Savings', value: totalSavings, icon: <SavingsIcon />, color: 'linear-gradient(135deg, #43e97b, #38f9d7)' }
        ].map((item, i) => (
          <Grid item xs={12} sm={4} key={i}>
            <Box sx={{
              borderRadius: 4,
              p: 3,
              background: item.color,
              color: '#fff',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 8px 20px rgba(0,0,0,0.12)'
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Box sx={{ mr: 1 }}>{item.icon}</Box>
                <Typography variant="subtitle1" sx={{ opacity: 0.95 }}>{item.title}</Typography>
              </Box>
              <Typography variant="h4" fontWeight={900}>
                {formatINR(item.value)}
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.9 }}>Updated just now</Typography>
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
            <Grid item xs={12}>
              {/* Make the chart span the full width of the overview section */}
              <Box sx={{ p: 0, bgcolor: '#fff', borderRadius: 3, overflow: 'hidden' }}>
                <Box sx={{ p: 3 }}>
                  <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 700 }}>Income vs Expense</Typography>
                </Box>
                <Box sx={{ height: 480, width: '100%' }}>
                  <Box sx={{ height: '100%', width: '100%' , display: 'flex', alignItems: loadingDashboard ? 'center' : 'stretch', justifyContent: 'center' }}>
                    {loadingDashboard ? (
                      <CircularProgress />
                    ) : (
                      <Line data={lineChartData} options={lineOptions} />
                    )}
                  </Box>
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
              <Typography fontWeight={700}>{formatINR(acc.balance ?? acc.amount)}</Typography>
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
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                {txLoading && <CircularProgress size={18} />}
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
                  <TableCell align="right">{formatINR(row.amount)}</TableCell>
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

      {/*
      Recurring Payments (commented out)
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
                  <TableCell>{formatINR(row.amount)}</TableCell>
                  <TableCell>{row.freq}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      */}

    </Box>
  );
};

export default Dashboard;
