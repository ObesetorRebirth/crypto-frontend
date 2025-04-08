import React, { useState, useEffect, useContext } from 'react';
import { 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  Typography, 
  Box,
  Tab,
  Tabs,
  CircularProgress,
  Chip
} from '@mui/material';
import { UserContext } from '../context/UserContext';
import {getUserTransactionsByType} from '../services/api';

const TransactionHistory = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0); 
  
  const { userId } = useContext(UserContext);

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      
      try {
        const transactionType = tabValue === 0 ? 'Buying' : 'Selling';
        const transactionData = await getUserTransactionsByType(userId, transactionType);
        setTransactions(transactionData);
        
      } catch (error) {
        console.error("Failed to fetch transactions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [userId, tabValue]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Transaction History
      </Typography>
      
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="Buy Transactions" />
          <Tab label="Sell Transactions" />
        </Tabs>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <CircularProgress />
        </Box>
      ) : transactions.length === 0 ? (
        <Typography variant="body1">
          No {tabValue === 0 ? 'buying' : 'selling'} transactions found.
        </Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Cryptocurrency</TableCell>
                <TableCell align="right">Quantity</TableCell>
                <TableCell align="right">Price at Transaction</TableCell>
                <TableCell align="right">Total Amount</TableCell>
                {tabValue === 1 && (
                  <TableCell align="right">Profit/Loss</TableCell>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {transactions.map((transaction) => {
                return (
                  <TableRow key={transaction.id}>
                    <TableCell>{formatDate(transaction.transactionDate)}</TableCell>
                    <TableCell>{transaction.crypto.cryptoName}</TableCell>
                    <TableCell align="right">{transaction.quantity}</TableCell>
                    <TableCell align="right">
                      ${transaction.priceAtTransaction.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </TableCell>
                    <TableCell align="right">
                      ${transaction.totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </TableCell>
                    {tabValue === 1 && (
                      <TableCell align="right">
                        {transaction.profitOrLoss !== null && transaction.profitOrLoss !== undefined ? (
                          <Chip 
                            label={`${transaction.profitOrLoss > 0 ? '+' : ''}$${transaction.profitOrLoss.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                            color={transaction.profitOrLoss > 0 ? 'success' : 'error'}
                          />
                        ) : (
                          'Calculating...'
                        )}
                      </TableCell>
                    )}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </div>
  );
};

export default TransactionHistory;