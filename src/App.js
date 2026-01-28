import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom'; 
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import CryptoMarket from './pages/CryptoMarket';
import Portfolio from './pages/Portfolio';
import TransactionHistory from './pages/TransactionHistory';

import { UserContext } from './context/UserContext';

// Create a client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // Don't refetch on window focus
      retry: 1,
    },
  },
});

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
  const [balance, setBalance] = useState(10000);

  const updateBalance = (newBalance) => {
    setBalance(newBalance);
  };

  return (
    <QueryClientProvider client={queryClient}>
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
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;