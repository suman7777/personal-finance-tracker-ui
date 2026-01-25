import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline, Avatar, Box, IconButton, Typography, Button, Menu, MenuItem, ListItemIcon, Divider } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import ListAltIcon from '@mui/icons-material/ListAlt';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import BarChartIcon from '@mui/icons-material/BarChart';
import SettingsIcon from '@mui/icons-material/Settings';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import Dashboard from './components/Dashboard';
import Transactions from './components/Transactions';
import Budgets from './components/Budgets';
// Goals component is not currently routed from the top nav; remove import until used to keep bundle small
// import Goals from './components/Goals';
import Reports from './components/Reports';
import Accounts from './components/Accounts';
// RecurringPayments route has been commented out; keep import commented to avoid unused import warnings
// import RecurringPayments from './components/RecurringPayments';
import ImportExport from './components/ImportExport';
import Settings from './components/Settings';
import Auth from './components/Auth';
import Users from './components/Users';

const sidebarNav = [
  { label: 'Dashboard', path: '/', icon: <HomeIcon /> },
  { label: 'Transactions', path: '/transactions', icon: <ListAltIcon /> },
  { label: 'Accounts', path: '/accounts', icon: <AccountBalanceIcon /> },
  { label: 'Budgets', path: '/budgets', icon: <BarChartIcon /> },
  // Recurring removed from sidebar per request. Uncomment to restore.
  // { label: 'Recurring', path: '/recurring', icon: <PaymentIcon /> },
  { label: 'Reports', path: '/reports', icon: <BarChartIcon /> },
  { label: 'Users', path: '/users', icon: <PersonIcon /> },
  { label: 'Import/Export', path: '/import-export', icon: <CloudUploadIcon /> },
  { label: 'Settings', path: '/settings', icon: <SettingsIcon /> },
];

const AppContent = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const menuOpen = Boolean(anchorEl);

  const handleMenuOpen = (e) => setAnchorEl(e.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  const handleProfile = () => { handleMenuClose(); navigate('/users'); };
  const handleSettingsNav = () => { handleMenuClose(); navigate('/settings'); };
  const handleLogout = () => { handleMenuClose(); navigate('/auth'); };
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
      <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f5f6fa', flexDirection: 'column' }}>
        {/* Top Navigation */}
        <Box sx={{ width: '100%', bgcolor: '#23272f', display: 'flex', alignItems: 'center', py: 1, px: 2, boxShadow: 3, position: 'fixed', left: 0, top: 0, zIndex: 10, height: 72 }}>
          <Box sx={{ mr: 2 }}>
            <Box sx={{ bgcolor: '#fff', borderRadius: 2, p: 1 }}>
              <BarChartIcon sx={{ color: '#1976d2', fontSize: 32 }} />
            </Box>
          </Box>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flex: 1 }}>
            {sidebarNav.map((item) => (
              <Button
                key={item.path}
                onClick={() => navigate(item.path)}
                startIcon={item.icon}
                sx={{
                  color: '#fff',
                  borderRadius: 2,
                  textTransform: 'none',
                  borderBottom: location.pathname === item.path ? '3px solid #1976d2' : '3px solid transparent',
                  pb: '6px',
                  '&:hover': { color: '#f0f0f0' },
                }}
              >
                <Typography sx={{ display: { xs: 'none', md: 'block' } }}>{item.label}</Typography>
              </Button>
            ))}
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton onClick={handleMenuOpen} sx={{ p: 0 }} aria-controls={menuOpen ? 'profile-menu' : undefined} aria-haspopup="true" aria-expanded={menuOpen ? 'true' : undefined}>
              <Avatar sx={{ bgcolor: '#1976d2', width: 40, height: 40, fontWeight: 700 }}>R</Avatar>
            </IconButton>
            <Menu
              id="profile-menu"
              anchorEl={anchorEl}
              open={menuOpen}
              onClose={handleMenuClose}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
              <MenuItem onClick={handleProfile}>
                <ListItemIcon>
                  <PersonIcon fontSize="small" />
                </ListItemIcon>
                Profile
              </MenuItem>
              <MenuItem onClick={handleSettingsNav}>
                <ListItemIcon>
                  <SettingsIcon fontSize="small" />
                </ListItemIcon>
                Settings
              </MenuItem>
              <Divider />
              <MenuItem onClick={handleLogout}>
                <ListItemIcon>
                  <LogoutIcon fontSize="small" />
                </ListItemIcon>
                Logout
              </MenuItem>
            </Menu>
          </Box>
        </Box>
        {/* Main Content */}
  <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh', pr: 2, mt: '96px', px: 2 }}>
          {/* Header */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 2, mb: 3, ml: 1 }}>
            <Typography variant="h4" fontWeight={700} sx={{ letterSpacing: 1 }}>
              Personal Finance
            </Typography>
          </Box>
          {/* Page Content */}
          <Box sx={{ flex: 1 }}>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/transactions" element={<Transactions />} />
              <Route path="/accounts" element={<Accounts />} />
              <Route path="/budgets" element={<Budgets />} />
              {/* Recurring route removed from navigation - component still exists if you want to enable later */}
              {/* <Route path="/recurring" element={<RecurringPayments />} /> */}
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
