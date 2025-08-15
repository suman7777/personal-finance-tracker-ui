import React, { useState } from "react";
import { Tabs, Tab, Box } from "@mui/material";
import { Line, Bar, Radar } from "react-chartjs-2";
import { motion } from "framer-motion";

const TabbedChart = ({ lineData, pieData }) => {
  const [chartTab, setChartTab] = useState(0);
  const handleTabChange = (e, newValue) => setChartTab(newValue);

  const lineChartData = {
    labels: lineData.map(d => d.month),
    datasets: [
      { label: "Income", data: lineData.map(d => d.income), borderColor: "#34A853", backgroundColor: "#34A853" },
      { label: "Expense", data: lineData.map(d => d.expense), borderColor: "#EA4335", backgroundColor: "#EA4335" }
    ]
  };

  const radarChartData = {
    labels: pieData.map(d => d.name),
    datasets: [
      {
        label: 'Spending by Category',
        data: pieData.map(d => d.value),
        backgroundColor: "rgba(66, 133, 244, 0.2)",
        borderColor: "#4285F4",
        pointBackgroundColor: "#4285F4",
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "#4285F4"
      }
    ]
  };

  const chartOptions = { responsive: true, maintainAspectRatio: false, animation: { duration: 1000 } };

  return (
    <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.2 }}>
      <Box sx={{ p: 2, borderRadius: 3, border: "1px solid #e0e0e0", bgcolor: "#f9fafb", height: "auto", maxHeight: 300 }}>
        <Tabs value={chartTab} onChange={handleTabChange} sx={{ mb: 2 }}>
          <Tab label="Line" />
          <Tab label="Bar" />
          <Tab label="Radar" />
        </Tabs>

        <Box sx={{ height: 220 }}>
          {chartTab === 0 && <Line data={lineChartData} options={chartOptions} />}
          {chartTab === 1 && <Bar data={lineChartData} options={chartOptions} />}
          {chartTab === 2 && <Radar data={radarChartData} options={chartOptions} />}
        </Box>
      </Box>
    </motion.div>
  );
};

export default TabbedChart;