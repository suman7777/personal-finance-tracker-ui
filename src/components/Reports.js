import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Card, CardContent, Grid, Button, Stack, CircularProgress, Alert,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, Select, MenuItem, FormControl, InputLabel,
  Menu, IconButton, Tabs, Tab, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper
} from '@mui/material';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import DownloadIcon from '@mui/icons-material/Download';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import RefreshIcon from '@mui/icons-material/Refresh';

const Reports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });
  
  // Analysis data states
  const [incomeExpenseData, setIncomeExpenseData] = useState(null);
  const [categoryData, setCategoryData] = useState(null);
  const [budgetData, setBudgetData] = useState(null);
  const [summaryData, setSummaryData] = useState(null);
  const [recentReports, setRecentReports] = useState([]);
  const [analysisLoading, setAnalysisLoading] = useState(false);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658', '#FF7C7C'];

  // Fetch reports
  const fetchReports = () => {
    setLoading(true);
    fetch('http://localhost:8080/api/reports')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch reports');
        return res.json();
      })
      .then(data => {
        setReports(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  };

  // Fetch analysis reports
  const fetchAnalysisReports = async () => {
    setAnalysisLoading(true);
    try {
      const params = `?startDate=${dateRange.startDate}&endDate=${dateRange.endDate}`;
      
      const [incomeExp, category, budget, summary] = await Promise.all([
        fetch(`http://localhost:8080/api/reports/analysis/income-expense${params}`)
          .then(r => r.ok ? r.json() : null),
        fetch(`http://localhost:8080/api/reports/analysis/category-wise${params}`)
          .then(r => r.ok ? r.json() : null),
        fetch(`http://localhost:8080/api/reports/analysis/budget-vs-actual${params}`)
          .then(r => r.ok ? r.json() : null),
        fetch(`http://localhost:8080/api/reports/analysis/summary${params}`)
          .then(r => r.ok ? r.json() : null)
      ]);
      
      setIncomeExpenseData(incomeExp || {});
      setCategoryData(category || {});
      setBudgetData(budget || []);
      setSummaryData(summary || {});
    } catch (err) {
      console.error('Error fetching analysis:', err);
      setError('Failed to load analysis reports');
    }
    setAnalysisLoading(false);
  };

  // Fetch recent reports
  const fetchRecentReports = () => {
    fetch('http://localhost:8080/api/reports/recent?limit=10')
      .then(res => res.json())
      .then(data => setRecentReports(Array.isArray(data) ? data : []))
      .catch(err => console.error('Error fetching recent reports:', err));
  };

  useEffect(() => {
    fetchReports();
    fetchRecentReports();
  }, []);

  // Convert monthly breakdown to chart data
  const getIncomeExpenseChartData = () => {
    if (!incomeExpenseData?.monthlyBreakdown || typeof incomeExpenseData.monthlyBreakdown !== 'object') return [];
    return Object.entries(incomeExpenseData.monthlyBreakdown).map(([month, data]) => ({
      month,
      Income: data?.INCOME || 0,
      Expense: data?.EXPENSE || 0
    }));
  };

  // Convert category data to pie chart format
  const getCategoryChartData = () => {
    if (!categoryData?.categoryExpenses || typeof categoryData.categoryExpenses !== 'object') return [];
    return Object.entries(categoryData.categoryExpenses).map(([name, value]) => ({
      name,
      value,
      percentage: categoryData?.categoryPercentage?.[name] || 0
    }));
  };

  const handleDateChange = (field, value) => {
    setDateRange({ ...dateRange, [field]: value });
  };

  const handleRefreshAnalysis = () => {
    fetchAnalysisReports();
  };

  const formatINR = (val) => {
    const n = Number(val || 0);
    return `₹${n.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <Box sx={{ p: 4, bgcolor: '#f6f6f2', minHeight: '100vh' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight={900} sx={{ letterSpacing: 1 }}>Reports</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={fetchAnalysisReports} sx={{ borderRadius: 2 }}>
          Generate Report
        </Button>
      </Box>

      {/* Date Range Selector */}
      <Card sx={{ mb: 3, borderRadius: 3, boxShadow: 2 }}>
        <CardContent>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
            <TextField
              label="Start Date"
              type="date"
              value={dateRange.startDate}
              onChange={(e) => handleDateChange('startDate', e.target.value)}
              InputLabelProps={{ shrink: true }}
              size="small"
            />
            <TextField
              label="End Date"
              type="date"
              value={dateRange.endDate}
              onChange={(e) => handleDateChange('endDate', e.target.value)}
              InputLabelProps={{ shrink: true }}
              size="small"
            />
            <Button
              variant="contained"
              startIcon={<RefreshIcon />}
              onClick={handleRefreshAnalysis}
              sx={{ borderRadius: 2 }}
            >
              Refresh
            </Button>
          </Stack>
        </CardContent>
      </Card>

      {/* Report Tabs */}
      <Box sx={{ bgcolor: '#fff', borderRadius: 3, boxShadow: 2, mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={(e, newValue) => setActiveTab(newValue)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ borderBottom: '1px solid #e0e0e0' }}
        >
          <Tab label="Income vs Expense" />
          <Tab label="Category Breakdown" />
          <Tab label="Budget Analysis" />
          <Tab label="Financial Summary" />
          <Tab label="Recent Reports" />
        </Tabs>

        {analysisLoading && (
          <Box sx={{ p: 3, display: 'flex', justifyContent: 'center' }}>
            <CircularProgress />
          </Box>
        )}

        {!analysisLoading && (
          <>
            {/* Income vs Expense */}
            {activeTab === 0 && incomeExpenseData && Object.keys(incomeExpenseData).length > 0 && (
              <Box sx={{ p: 3 }}>
                <Grid container spacing={3}>
                  {/* Summary Cards */}
                  <Grid item xs={12} sm={6} md={4}>
                    <Card sx={{ borderRadius: 2, bgcolor: '#e8f5e9' }}>
                      <CardContent>
                        <Typography color="textSecondary" gutterBottom>Total Income</Typography>
                        <Typography variant="h5" sx={{ color: '#4caf50', fontWeight: 700 }}>
                          {formatINR(incomeExpenseData?.totalIncome || 0)}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <Card sx={{ borderRadius: 2, bgcolor: '#ffebee' }}>
                      <CardContent>
                        <Typography color="textSecondary" gutterBottom>Total Expense</Typography>
                        <Typography variant="h5" sx={{ color: '#f44336', fontWeight: 700 }}>
                          {formatINR(incomeExpenseData?.totalExpense || 0)}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <Card sx={{ borderRadius: 2, bgcolor: '#e3f2fd' }}>
                      <CardContent>
                        <Typography color="textSecondary" gutterBottom>Net Balance</Typography>
                        <Typography variant="h5" sx={{ color: '#2196f3', fontWeight: 700 }}>
                          {formatINR(incomeExpenseData?.netBalance || 0)}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>

                  {/* Chart */}
                  <Grid item xs={12}>
                    <Card sx={{ borderRadius: 2, p: 3, mt: 2 }}>
                      <Typography variant="h6" fontWeight={700} sx={{ mb: 3 }}>Monthly Breakdown</Typography>
                      <ResponsiveContainer width="100%" height={400}>
                        <LineChart data={getIncomeExpenseChartData()}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <Tooltip formatter={(value) => formatINR(value)} />
                          <Legend />
                          <Line type="monotone" dataKey="Income" stroke="#4caf50" strokeWidth={2} />
                          <Line type="monotone" dataKey="Expense" stroke="#f44336" strokeWidth={2} />
                        </LineChart>
                      </ResponsiveContainer>
                    </Card>
                  </Grid>
                </Grid>
              </Box>
            )}

            {/* Category Breakdown */}
            {activeTab === 1 && categoryData && Object.keys(categoryData).length > 0 && (
              <Box sx={{ p: 3 }}>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Card sx={{ borderRadius: 2, p: 2 }}>
                      <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>Expense Distribution</Typography>
                      <ResponsiveContainer width="100%" height={400}>
                        <PieChart>
                          <Pie
                            data={getCategoryChartData()}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percentage }) => `${name}: ${percentage?.toFixed(1)}%`}
                            outerRadius={120}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {getCategoryChartData().map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value) => formatINR(value)} />
                        </PieChart>
                      </ResponsiveContainer>
                    </Card>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Card sx={{ borderRadius: 2, p: 2 }}>
                      <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>Category Details</Typography>
                      <TableContainer>
                        <Table size="small">
                          <TableHead>
                            <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                              <TableCell fontWeight={700}>Category</TableCell>
                              <TableCell align="right" fontWeight={700}>Amount</TableCell>
                              <TableCell align="right" fontWeight={700}>Percentage</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {getCategoryChartData().map((row, i) => (
                              <TableRow key={i}>
                                <TableCell>{row.name}</TableCell>
                                <TableCell align="right">{formatINR(row.value)}</TableCell>
                                <TableCell align="right">{row.percentage?.toFixed(2)}%</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </Card>
                  </Grid>
                </Grid>
              </Box>
            )}

            {/* Budget Analysis */}
            {activeTab === 2 && budgetData && (
              <Box sx={{ p: 3 }}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Card sx={{ borderRadius: 2, p: 2 }}>
                      <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>Budget vs Actual Comparison</Typography>
                      <ResponsiveContainer width="100%" height={400}>
                        <BarChart data={Array.isArray(budgetData) ? budgetData : budgetData.budgetAnalysis || []}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="category" />
                          <YAxis />
                          <Tooltip formatter={(value) => formatINR(value)} />
                          <Legend />
                          <Bar dataKey="budgeted" fill="#8884d8" />
                          <Bar dataKey="actual" fill="#82ca9d" />
                        </BarChart>
                      </ResponsiveContainer>
                    </Card>
                  </Grid>
                  <Grid item xs={12}>
                    <Card sx={{ borderRadius: 2, p: 2 }}>
                      <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>Detailed Analysis</Typography>
                      <TableContainer>
                        <Table>
                          <TableHead>
                            <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                              <TableCell fontWeight={700}>Category</TableCell>
                              <TableCell align="right" fontWeight={700}>Budgeted</TableCell>
                              <TableCell align="right" fontWeight={700}>Actual</TableCell>
                              <TableCell align="right" fontWeight={700}>Variance</TableCell>
                              <TableCell align="center" fontWeight={700}>Status</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {(Array.isArray(budgetData) ? budgetData : budgetData.budgetAnalysis || []).map((row, i) => (
                              <TableRow key={i} sx={{
                                bgcolor: row.status === 'Over Budget' ? '#ffebee' : '#e8f5e9'
                              }}>
                                <TableCell>{row.category}</TableCell>
                                <TableCell align="right">{formatINR(row.budgeted)}</TableCell>
                                <TableCell align="right">{formatINR(row.actual)}</TableCell>
                                <TableCell align="right" sx={{ color: row.variance > 0 ? '#4caf50' : '#f44336', fontWeight: 700 }}>
                                  {formatINR(row.variance)}
                                </TableCell>
                                <TableCell align="center">
                                  <Box sx={{
                                    display: 'inline-block',
                                    px: 2,
                                    py: 0.5,
                                    borderRadius: 2,
                                    bgcolor: row.status === 'Over Budget' ? '#ffcdd2' : '#c8e6c9',
                                    color: row.status === 'Over Budget' ? '#d32f2f' : '#388e3c',
                                    fontSize: '0.85rem',
                                    fontWeight: 600
                                  }}>
                                    {row.status}
                                  </Box>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </Card>
                  </Grid>
                </Grid>
              </Box>
            )}

            {/* Financial Summary */}
            {activeTab === 3 && summaryData && Object.keys(summaryData).length > 0 && (
              <Box sx={{ p: 3 }}>
                <Grid container spacing={3}>
                  {/* Summary Cards */}
                  <Grid item xs={12} sm={6} md={4}>
                    <Card sx={{ borderRadius: 2, bgcolor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: '#fff' }}>
                      <CardContent>
                        <Typography variant="body2" sx={{ opacity: 0.9 }}>Total Income</Typography>
                        <Typography variant="h5" fontWeight={700}>{formatINR(summaryData?.totalIncome || 0)}</Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <Card sx={{ borderRadius: 2, bgcolor: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: '#fff' }}>
                      <CardContent>
                        <Typography variant="body2" sx={{ opacity: 0.9 }}>Total Expense</Typography>
                        <Typography variant="h5" fontWeight={700}>{formatINR(summaryData?.totalExpense || 0)}</Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <Card sx={{ borderRadius: 2, bgcolor: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', color: '#fff' }}>
                      <CardContent>
                        <Typography variant="body2" sx={{ opacity: 0.9 }}>Net Balance</Typography>
                        <Typography variant="h5" fontWeight={700}>{formatINR(summaryData?.netBalance || 0)}</Typography>
                      </CardContent>
                    </Card>
                  </Grid>

                  {/* Key Metrics */}
                  <Grid item xs={12} sm={6} md={4}>
                    <Card sx={{ borderRadius: 2 }}>
                      <CardContent>
                        <Typography variant="body2" color="textSecondary">Transaction Count</Typography>
                        <Typography variant="h5" fontWeight={700}>{summaryData?.transactionCount || 0}</Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <Card sx={{ borderRadius: 2 }}>
                      <CardContent>
                        <Typography variant="body2" color="textSecondary">Avg Transaction Amount</Typography>
                        <Typography variant="h5" fontWeight={700}>{formatINR(summaryData?.averageTransactionAmount || 0)}</Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <Card sx={{ borderRadius: 2 }}>
                      <CardContent>
                        <Typography variant="body2" color="textSecondary">Date Range</Typography>
                        <Typography variant="h6" fontWeight={700}>{summaryData?.startDate} to {summaryData?.endDate}</Typography>
                      </CardContent>
                    </Card>
                  </Grid>

                  {/* Top Categories */}
                  <Grid item xs={12}>
                    <Card sx={{ borderRadius: 2, p: 2 }}>
                      <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>Top Expense Categories</Typography>
                      <TableContainer>
                        <Table>
                          <TableHead>
                            <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                              <TableCell fontWeight={700}>Category</TableCell>
                              <TableCell align="right" fontWeight={700}>Amount</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {summaryData?.topExpenseCategories && Object.entries(summaryData.topExpenseCategories).map(([category, amount], i) => (
                              <TableRow key={i}>
                                <TableCell>{category}</TableCell>
                                <TableCell align="right">{formatINR(amount)}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </Card>
                  </Grid>
                </Grid>
              </Box>
            )}

            {/* Recent Reports */}
            {activeTab === 4 && (
              <Box sx={{ p: 3 }}>
                {recentReports.length === 0 ? (
                  <Alert severity="info">No recent reports found</Alert>
                ) : (
                  <TableContainer component={Paper}>
                    <Table>
                      <TableHead>
                        <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                          <TableCell fontWeight={700}>Report Name</TableCell>
                          <TableCell fontWeight={700}>Type</TableCell>
                          <TableCell fontWeight={700}>Created Date</TableCell>
                          <TableCell fontWeight={700}>Date Range</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {recentReports.map((report) => (
                          <TableRow key={report.id}>
                            <TableCell fontWeight={600}>{report.name}</TableCell>
                            <TableCell>{report.type}</TableCell>
                            <TableCell>{report.createdDate}</TableCell>
                            <TableCell>{report.startDate} to {report.endDate}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </Box>
            )}
          </>
        )}
      </Box>
    </Box>
  );
};

export default Reports;
