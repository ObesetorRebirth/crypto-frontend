import React, { useState, useEffect, useContext } from 'react';
import { getTop20Cryptos, buyCrypto } from '../services/api'; // Import API functions
import { UserContext } from '../context/UserContext';
import { Button, Table, TableCell, TableRow, TableBody, TableHead, TableContainer, Paper, CircularProgress } from '@mui/material';

const CryptoMarket = () => {
  const [cryptos, setCryptos] = useState([]);
  const [loading, setLoading] = useState(true);
  const { userId, balance, updateBalance } = useContext(UserContext);

  useEffect(() => {
    const fetchCryptos = async () => {
      try {
        const cryptoData = await getTop20Cryptos(); // Call the API
        setCryptos(cryptoData);
      } catch (error) {
        console.error('Error fetching cryptos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCryptos();
  }, []);

  const handleBuy = async (cryptoId, quantity) => {
    try {
      await buyCrypto(userId, cryptoId, quantity); // Call the API
      // Update balance and other states after the purchase
      const newBalance = balance - (cryptoId * quantity); // Example calculation
      updateBalance(newBalance);
    } catch (error) {
      console.error('Error buying crypto:', error);
    }
  };

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>#</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Price</TableCell>
            <TableCell>Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {cryptos.map((crypto, index) => (
            <TableRow key={crypto.id}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{crypto.name}</TableCell>
              <TableCell>{crypto.price}</TableCell>
              <TableCell>
                <Button onClick={() => handleBuy(crypto.id, 1)}>Buy</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default CryptoMarket;
