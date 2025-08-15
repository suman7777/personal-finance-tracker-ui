import React from "react";
import { Grid, Box, Typography } from "@mui/material";
import { motion } from "framer-motion";

const TrendCards = ({ totalExpense, totalIncome, budgets, lineData, transactions }) => {
  const cardData = [
    {
      title: "Spending Change",
      current: totalExpense,
      prev: lineData.length > 1 ? lineData[lineData.length - 2].expense : 0,
      positiveIsGood: false
    },
    {
      title: "Income Change",
      current: totalIncome,
      prev: lineData.length > 1 ? lineData[lineData.length - 2].income : 0,
      positiveIsGood: true
    },
    {
      title: "Budget Usage",
      current: budgets.length ? budgets.reduce((sum, b) => sum + b.percent, 0) / budgets.length : 0,
      prev: 0,
      positiveIsGood: false
    }
  ];

  return (
    <Grid container spacing={2}>
      {cardData.map((item, i) => {
        const change = item.prev ? (((item.current - item.prev) / item.prev) * 100).toFixed(1) : 0;
        const isPositive = change >= 0;
        const color = item.positiveIsGood
          ? (isPositive ? "#4caf50" : "#f44336")
          : (isPositive ? "#f44336" : "#4caf50");

        return (
          <Grid sm={4} xs={12} key={i}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 + i * 0.15 }}>
              <Box sx={{ p: 2, borderRadius: 3, border: "1px solid #e0e0e0", bgcolor: "#fff", boxShadow: "0 2px 6px rgba(0,0,0,0.05)" }}>
                <Typography variant="body2" color="text.secondary">{item.title}</Typography>
                <Typography variant="h6" fontWeight={700}>
                  {item.title === "Budget Usage" ? `${item.current.toFixed(1)}%` : `$${item.current.toLocaleString()}`}
                </Typography>
                <Typography variant="body2" fontWeight={600} sx={{ color }}>
                  {change > 0 ? "▲" : change < 0 ? "▼" : ""} {Math.abs(change)}%
                </Typography>
              </Box>
            </motion.div>
          </Grid>
        );
      })}
    </Grid>
  );
};

export default TrendCards;