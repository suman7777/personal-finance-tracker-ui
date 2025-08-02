import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useLocation, useNavigate } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline, Avatar, Box, IconButton, Typography, useMediaQuery } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import HomeIcon from '@mui/icons-material/Home';
import ListAltIcon from '@mui/icons-material/ListAlt';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import BarChartIcon from '@mui/icons-material/BarChart';
import PaymentIcon from '@mui/icons-material/Payment';
import SettingsIcon from '@mui/icons-material/Settings';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import PersonIcon from '@mui/icons-material/Person';
import Dashboard from './components/Dashboard';
import Transactions from './components/Transactions';
import Budgets from './components/Budgets';
import Goals from './components/Goals';
import Reports from './components/Reports';
import Accounts from './components/Accounts';
import RecurringPayments from './components/RecurringPayments';
import ImportExport from './components/ImportExport';
import Settings from './components/Settings';
import Auth from './components/Auth';
import Users from './components/Users';

const sidebarNav = [
  { label: 'Dashboard', path: '/', icon: <HomeIcon /> },
  { label: 'Transactions', path: '/transactions', icon: <ListAltIcon /> },
  { label: 'Accounts', path: '/accounts', icon: <AccountBalanceIcon /> },
  { label: 'Budgets', path: '/budgets', icon: <BarChartIcon /> },
  { label: 'Recurring', path: '/recurring', icon: <PaymentIcon /> },
  { label: 'Reports', path: '/reports', icon: <BarChartIcon /> },
  { label: 'Users', path: '/users', icon: <PersonIcon /> },
  { label: 'Import/Export', path: '/import-export', icon: <CloudUploadIcon /> },
  { label: 'Settings', path: '/settings', icon: <SettingsIcon /> },
];

const AppContent = () => {
  const [darkMode, setDarkMode] = useState(false);
  const isMobile = useMediaQuery('(max-width:600px)');
  const location = useLocation();
  const navigate = useNavigate();
  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: { main: '#1976d2' },
      background: { default: darkMode ? '#121212' : '#f5f6fa' },
    },
  });
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f5f6fa' }}>
        {/* Sidebar */}
        <Box sx={{ width: 80, bgcolor: '#23272f', display: 'flex', flexDirection: 'column', alignItems: 'center', py: 2, borderRadius: 3, m: 2, boxShadow: 3, height: 'calc(100vh - 32px)', position: 'fixed', left: 0, top: 0, zIndex: 10 }}>
          <Box sx={{ mb: 2, mt: 1 }}>
            <Box sx={{ bgcolor: '#fff', borderRadius: 2, p: 1 }}>
              <BarChartIcon sx={{ color: '#1976d2', fontSize: 32 }} />
            </Box>
          </Box>
          <Box sx={{ flex: 1, width: '100%' }}>
            {sidebarNav.map((item, idx) => (
              <IconButton
                key={item.path}
                onClick={() => navigate(item.path)}
                sx={{
                  width: '100%',
                  mb: 1.5,
                  color: location.pathname === item.path ? '#1976d2' : '#fff',
                  bgcolor: location.pathname === item.path ? '#e3edfa' : 'transparent',
                  borderRadius: 2,
                  '&:hover': { bgcolor: '#e3edfa', color: '#1976d2' },
                  transition: 'all 0.2s',
                  fontSize: 28,
                }}
              >
                {item.icon}
              </IconButton>
            ))}
          </Box>
          <IconButton sx={{ bgcolor: '#fff', color: '#1976d2', mt: 2 }}>
            <SettingsIcon />
          </IconButton>
        </Box>
        {/* Main Content */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh', pr: 2, ml: '112px' }}>
          {/* Header */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 2, mb: 3, ml: 1 }}>
            <Typography variant="h4" fontWeight={700} sx={{ letterSpacing: 1 }}>
              Personal Finance
            </Typography>
            <Avatar sx={{ bgcolor: '#1976d2', width: 40, height: 40, fontWeight: 700 }}>R</Avatar>
          </Box>
          {/* Page Content */}
          <Box sx={{ flex: 1 }}>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/transactions" element={<Transactions />} />
              <Route path="/accounts" element={<Accounts />} />
              <Route path="/budgets" element={<Budgets />} />
              <Route path="/recurring" element={<RecurringPayments />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/users" element={<Users />} />
              <Route path="/import-export" element={<ImportExport />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/auth" element={<Auth />} />
            </Routes>
          </Box>
          {/* Footer */}
          <Box sx={{ py: 2, textAlign: 'right', color: '#888', fontSize: 14, pr: 2, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 2 }}>
            <Typography variant="body2" sx={{ color: '#888' }}>Material Design-implerd</Typography>
            <img src="https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg" alt="React" style={{ width: 24, height: 24 }} />
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

const App = () => (
  <Router>
    <AppContent />
  </Router>
);

export default App;
