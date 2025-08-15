import React from "react";
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import { motion } from "framer-motion";

const TransactionsTable = ({ transactions }) => {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
      <Box sx={{ p: 2, borderRadius: 3, border: "1px solid #e0e0e0", bgcolor: "#fff" }}>
        <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
          💰 Recent Transactions
        </Typography>
        <TableContainer component={Paper} sx={{ boxShadow: "none" }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Category</TableCell>
                <TableCell align="right">Amount</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {transactions.map((t, i) => (
                <motion.tr
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  style={{ borderBottom: "1px solid #f0f0f0" }}
                >
                  <TableCell>{t.date}</TableCell>
                  <TableCell>{t.category}</TableCell>
                  <TableCell align="right" style={{ color: t.amount > 0 ? "#4caf50" : "#f44336" }}>
                    {t.amount > 0 ? `+$${t.amount}` : `-$${Math.abs(t.amount)}`}
                  </TableCell>
                </motion.tr>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </motion.div>
  );
};

export default TransactionsTable;
