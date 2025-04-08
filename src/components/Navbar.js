import React, { useContext } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { UserContext } from '../context/UserContext';

import { resetUserAccount } from '../services/api';

const Navbar = () => {
  const { userId, balance, updateBalance } = useContext(UserContext);

  const handleReset = async () => {
    try {
      await resetUserAccount(userId);
      updateBalance(10000);
      alert('Account has been reset successfully!');
      // In a real app, you'd also want to refresh the portfolio data
      window.location.reload();
    } catch (error) {
      console.error('Failed to reset account:', error);
      alert('Failed to reset account. Please try again.');
    }
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Crypto Trading App
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button color="inherit" component={RouterLink} to="/">
            Dashboard
          </Button>
          <Button color="inherit" component={RouterLink} to="/market">
            Market
          </Button>
          <Button color="inherit" component={RouterLink} to="/portfolio">
            Portfolio
          </Button>
          <Button color="inherit" component={RouterLink} to="/transactions">
            Transactions
          </Button>
          
          <Typography variant="body1" sx={{ mx: 2 }}>
            Balance: ${balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </Typography>
          
          <Button 
            variant="outlined" 
            color="error" 
            onClick={handleReset}
            sx={{ borderColor: 'red', color: 'white' }}
          >
            Reset Account
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;