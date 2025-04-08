import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';  // Keep Routes and Route, remove Router
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import { getUserBalance } from './services/api';

// Components
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import CryptoMarket from './pages/CryptoMarket';
import Portfolio from './pages/Portfolio';
import TransactionHistory from './pages/TransactionHistory';

// Context
import { UserContext } from './context/UserContext';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#3a7bd5',
    },
    secondary: {
      main: '#00d395',
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  },
});

function App() {
  const [userId] = useState(1);
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserBalance = async () => {
      try {
        const balanceData = await getUserBalance(userId);
        setBalance(balanceData);
      } catch (error) {
        console.error("Failed to fetch user balance:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserBalance();
  }, [userId]);

  const updateBalance = (newBalance) => {
    setBalance(newBalance);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <UserContext.Provider value={{ userId, balance, updateBalance }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Navbar />
          <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/market" element={<CryptoMarket />} />
              <Route path="/portfolio" element={<Portfolio />} />
              <Route path="/transactions" element={<TransactionHistory />} />
            </Routes>
          </Box>
        </Box>
      </UserContext.Provider>
    </ThemeProvider>
  );
}

export default App;
