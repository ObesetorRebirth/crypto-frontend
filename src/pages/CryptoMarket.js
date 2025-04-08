import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../context/UserContext';
import axios from 'axios';
import './CryptoMarket.css';
import { getTop20Cryptos, buyCrypto, getUserBalance } from '../services/api';

const CryptoMarketPage = () => {
  const [cryptos, setCryptos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCrypto, setSelectedCrypto] = useState(null);
  const [amount, setAmount] = useState('');
  const [showBuyForm, setShowBuyForm] = useState(false);
  const [purchaseStatus, setPurchaseStatus] = useState(null);
  const { userId, updateBalance } = useContext(UserContext);
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    fetchCryptos();
    
    const refreshInterval = setInterval(() => {
      console.log("Refreshing crypto prices...");
      fetchCryptos();
    }, 4000);
    
    return () => clearInterval(refreshInterval);
  }, []);

  const fetchCryptos = async () => {
    try {
      setLoading(true);
      
      const cryptoData = await getTop20Cryptos();
      
      const processedData = Array.isArray(cryptoData) ? cryptoData.map(crypto => {
        return {
          id: crypto.id,
          name: crypto.cryptoName,
          symbol: crypto.symbol,
          price: crypto.currentPrice,
          priceChange24h: 0
        };
      }) : [];
      
      setCryptos(processedData);
      setLastUpdated(new Date());
      setError(null);
    } catch (err) {
      setError('Failed to load cryptocurrencies');
      console.error('Error fetching cryptos:', err);
    } finally {
      setLoading(false);
    }
  };

  const openBuyForm = (crypto) => {
    setSelectedCrypto(crypto);
    setAmount('');
    setPurchaseStatus(null);
    setShowBuyForm(true);
  };

  const handleBuy = async (e) => {
    e.preventDefault();
    
    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
      setPurchaseStatus({
        success: false,
        message: 'Please enter a valid amount'
      });
      return;
    }
    
    try {
      if (typeof buyCrypto === 'function') {
        await buyCrypto(userId, selectedCrypto.id, parseFloat(amount));
      } else {
        await axios.post('/api/transactions/buy', {
          cryptoId: selectedCrypto.id,
          amount: parseFloat(amount)
        });
      }

      const newBalance = await getUserBalance(userId);
      updateBalance(newBalance);  
      
      setPurchaseStatus({
        success: true,
        message: `Successfully purchased ${amount} ${selectedCrypto.symbol}`
      });
      setTimeout(() => {
        setShowBuyForm(false);
        setPurchaseStatus(null);
      }, 2000);
      
      fetchCryptos();
      
    } catch (err) {
      let errorMessage = 'Failed to complete purchase';
      
      if (err.response && err.response.data) {
        errorMessage = typeof err.response.data === 'string' 
          ? err.response.data 
          : err.response.data.message || 'Purchase failed';
      }
      
      setPurchaseStatus({
        success: false,
        message: errorMessage
      });
      console.error('Error buying crypto:', err);
    }
  };
  
  const safeToFixed = (value, decimals = 2) => {
    if (value === undefined || value === null || isNaN(parseFloat(value))) {
      return '0.00';
    }
    return parseFloat(value).toFixed(decimals);
  };

  return (
    <div className="crypto-market-container">
      <h1>Cryptocurrency Market</h1>
      {lastUpdated && (
      <p style={{ fontSize: '0.8rem', color: '#888', marginTop: '-10px' }}>
        Last updated: {lastUpdated.toLocaleTimeString()}
      </p>
    )}
      {loading && <p>Loading cryptocurrencies...</p>}
      {error && <p className="error-message">{error}</p>}
      
      <div className="crypto-list">
        {cryptos.length === 0 && !loading ? (
          <p>No cryptocurrencies available. Please check your API connection.</p>
        ) : (
          cryptos.map(crypto => (
            <div key={crypto.id} className="crypto-card">
              <div className="crypto-info">
                <h3>{crypto.name}</h3>
                <p className="crypto-symbol">{crypto.symbol}</p>
                <p className="crypto-price">${safeToFixed(crypto.price)}</p>
              </div>
              <button 
                className="buy-button"
                onClick={() => openBuyForm(crypto)}
              >
                Buy
              </button>
            </div>
          ))
        )}
      </div>
      
      {showBuyForm && selectedCrypto && (
        <div className="modal-overlay">
          <div className="buy-form-modal">
            <button className="close-button" onClick={() => setShowBuyForm(false)}>×</button>
            <h2>Buy {selectedCrypto.name}</h2>
            <p>Current price: ${safeToFixed(selectedCrypto.price)}</p>
            
            <form onSubmit={handleBuy}>
              <div className="form-group">
                <label htmlFor="amount">Amount to buy:</label>
                <input
                  type="number"
                  id="amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter amount"
                  step="0.000001"
                  min="0"
                  required
                />
              </div>
              
              {amount && !isNaN(amount) && (
                <p className="estimate">
                  Estimated cost: ${safeToFixed(parseFloat(amount) * selectedCrypto.price)}
                </p>
              )}
              
              {purchaseStatus && (
                <div className={`status-message ${purchaseStatus.success ? 'success' : 'error'}`}>
                  {purchaseStatus.message}
                </div>
              )}
              
              <button type="submit" className="submit-button">Confirm Purchase</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CryptoMarketPage;