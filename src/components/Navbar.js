import React, { useContext } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { UserContext } from '../context/UserContext';
import { useResetAccount } from '../hooks';

const Navbar = () => {
  const { userId, balance, updateBalance } = useContext(UserContext);
  
  const resetAccountMutation = useResetAccount((newBalance) => {
    updateBalance(newBalance);
  });

  const handleReset = async () => {
    const confirmed = window.confirm('Are you sure you want to reset your account? This will delete all your holdings and reset your balance to $10,000.');
    
    if (!confirmed) return;
    
    try {
      await resetAccountMutation.mutateAsync(userId);
      alert('Account has been reset successfully!');
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
            disabled={resetAccountMutation.isPending}
            sx={{ borderColor: 'red', color: 'white' }}
          >
            {resetAccountMutation.isPending ? 'Resetting...' : 'Reset Account'}
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;