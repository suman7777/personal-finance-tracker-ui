import React from "react";
import { Doughnut } from "react-chartjs-2";
import { motion } from "framer-motion";

const DoughnutChart = ({ pieData }) => {
  const chartData = {
    labels: pieData.map(d => d.name),
    datasets: [
      {
        data: pieData.map(d => d.value),
        backgroundColor: ["#4285F4", "#FBBC05", "#34A853", "#EA4335"]
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: { legend: { position: "bottom" } },
    animation: { duration: 1200, easing: "easeOutQuart" }
  };

  return (
    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }}>
      <Doughnut data={chartData} options={chartOptions} />
    </motion.div>
  );
};

export default DoughnutChart;
