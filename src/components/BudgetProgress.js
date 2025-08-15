import React from "react";
import { Box, Typography, LinearProgress, Grid } from "@mui/material";
import { motion } from "framer-motion";

const BudgetProgress = ({ budgets }) => {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
      <Box sx={{ p: 2, borderRadius: 3, border: "1px solid #e0e0e0", bgcolor: "#fff" }}>
        <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
          📈 Budget Usage
        </Typography>
        <Grid container spacing={2}>
          {budgets.map((b, i) => {
            const color = b.percent >= 80 ? "error" : b.percent >= 50 ? "warning" : "success";
            return (
              <Grid item xs={12} key={i}>
                <Typography variant="body2" fontWeight={600}>
                  {b.name} — {b.percent}%
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={b.percent}
                  color={color}
                  sx={{ height: 8, borderRadius: 5, mb: 1 }}
                />
              </Grid>
            );
          })}
        </Grid>
      </Box>
    </motion.div>
  );
};

export default BudgetProgress;
