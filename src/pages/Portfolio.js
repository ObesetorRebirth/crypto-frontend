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
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  Box
} from '@mui/material';
import { UserContext } from '../context/UserContext';
import { getUserHoldings } from '../services/api'; // Use API call instead of userCryptoService
import { sellCrypto } from '../services/api'; // Use API call for buy/sell
import { getTop20Cryptos } from '../services/api';

const Portfolio = () => {
  const [holdings, setHoldings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cryptoPrices, setCryptoPrices] = useState({});
  const [openSellDialog, setOpenSellDialog] = useState(false);
  const [selectedHolding, setSelectedHolding] = useState(null);
  const [sellQuantity, setSellQuantity] = useState('');
  const [processingTransaction, setProcessingTransaction] = useState(false);
  
  const { userId, balance, updateBalance } = useContext(UserContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get user holdings
        const holdingsData = await getUserHoldings(userId);
        setHoldings(holdingsData);
        
        // Get current crypto prices
        const cryptoData = await getTop20Cryptos();
        const prices = {};
        cryptoData.forEach(crypto => {
          prices[crypto.id] = crypto.currentPrice;
        });
        setCryptoPrices(prices);
      } catch (error) {
        console.error("Failed to fetch portfolio data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    
    // Refresh data every 10 seconds
    const intervalId = setInterval(fetchData, 10000);
    
    return () => clearInterval(intervalId);
  }, [userId]);

  const handleOpenSellDialog = (holding) => {
    setSelectedHolding(holding);
    setOpenSellDialog(true);
    setSellQuantity('');
  };

  const handleCloseSellDialog = () => {
    setOpenSellDialog(false);
    setSelectedHolding(null);
  };

  const handleSell = async () => {
    if (!selectedHolding || !sellQuantity || isNaN(sellQuantity) || Number(sellQuantity) <= 0) {
      alert('Please enter a valid quantity');
      return;
    }

    if (Number(sellQuantity) > selectedHolding.quantity) {
      alert('You cannot sell more than you own');
      return;
    }

    setProcessingTransaction(true);
    
    try {
      await sellCrypto(userId, selectedHolding.cryptoId, Number(sellQuantity));
      
      // Calculate the amount to add to balance
      const currentPrice = cryptoPrices[selectedHolding.cryptoId];
      const saleAmount = Number(sellQuantity) * currentPrice;
      
      // Update balance after successful sale
      const newBalance = balance + saleAmount;
      updateBalance(newBalance);
      
      // Update holdings list (better would be to refetch, but this is simpler for demo)
      const updatedHoldings = holdings.map(h => {
        if (h.cryptoId === selectedHolding.cryptoId) {
          const newQuantity = h.quantity - Number(sellQuantity);
          return newQuantity > 0 ? { ...h, quantity: newQuantity } : null;
        }
        return h;
      }).filter(Boolean);
      
      setHoldings(updatedHoldings);
      
      alert(`Successfully sold ${sellQuantity} ${selectedHolding.cryptoName}`);
      handleCloseSellDialog();
    } catch (error) {
      console.error("Transaction failed:", error);
      alert(`Transaction failed: ${error.message || 'Unknown error'}`);
    } finally {
      setProcessingTransaction(false);
    }
  };

  // Calculate total portfolio value
  const calculateTotalValue = () => {
    return holdings.reduce((total, holding) => {
      const price = cryptoPrices[holding.cryptoId] || 0;
      return total + (holding.quantity * price);
    }, 0);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Your Portfolio
      </Typography>
      
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6">
          Total Portfolio Value: ${calculateTotalValue().toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </Typography>
        <Typography variant="body1">
          Available Balance: ${balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </Typography>
      </Box>
      
      {holdings.length === 0 ? (
        <Typography variant="body1">
          You don't have any cryptocurrency holdings yet. Visit the Market page to buy some!
        </Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Cryptocurrency</TableCell>
                <TableCell align="right">Quantity</TableCell>
                <TableCell align="right">Current Price</TableCell>
                <TableCell align="right">Total Value</TableCell>
                <TableCell align="center">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {holdings.map((holding) => {
                const currentPrice = cryptoPrices[holding.cryptoId] || 0;
                const totalValue = holding.quantity * currentPrice;
                
                return (
                  <TableRow key={`${holding.userId}-${holding.cryptoId}`}>
                    <TableCell>{holding.cryptoName}</TableCell>
                    <TableCell align="right">{holding.quantity}</TableCell>
                    <TableCell align="right">
                      ${currentPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </TableCell>
                    <TableCell align="right">
                      ${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </TableCell>
                    <TableCell align="center">
                      <Button 
                        variant="contained" 
                        color="secondary"
                        onClick={() => handleOpenSellDialog(holding)}
                      >
                        Sell
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Sell Dialog */}
      <Dialog open={openSellDialog} onClose={handleCloseSellDialog}>
        <DialogTitle>
          Sell {selectedHolding?.cryptoName}
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" gutterBottom>
            Current Price: ${(cryptoPrices[selectedHolding?.cryptoId] || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </Typography>
          <Typography variant="body1" gutterBottom>
            You Own: {selectedHolding?.quantity} {selectedHolding?.cryptoName}
          </Typography>
          <TextField
            autoFocus
            margin="dense"
            label="Quantity to Sell"
            type="number"
            fullWidth
            variant="outlined"
            value={sellQuantity}
            onChange={(e) => setSellQuantity(e.target.value)}
            inputProps={{ min: 0, max: selectedHolding?.quantity, step: 0.001 }}
          />
          {sellQuantity && selectedHolding && (
            <Typography variant="body1" sx={{ mt: 2 }}>
              Total Value: ${(Number(sellQuantity) * (cryptoPrices[selectedHolding.cryptoId] || 0)).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseSellDialog}>Cancel</Button>
          <Button 
            onClick={handleSell} 
            variant="contained" 
            color="secondary"
            disabled={processingTransaction}
          >
            {processingTransaction ? <CircularProgress size={24} /> : 'Sell'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Portfolio;