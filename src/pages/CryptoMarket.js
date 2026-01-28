import React, { useState, useContext } from 'react';
import { UserContext } from '../context/UserContext';
import { useCryptos, useBuyCrypto } from '../hooks';

const CryptoMarketPage = () => {
  const [selectedCrypto, setSelectedCrypto] = useState(null);
  const [amount, setAmount] = useState('');
  const [showBuyForm, setShowBuyForm] = useState(false);
  const [purchaseStatus, setPurchaseStatus] = useState(null);
  const { userId, updateBalance } = useContext(UserContext);

  const { data: cryptos = [], isLoading, error, dataUpdatedAt } = useCryptos();
  
  const buyCryptoMutation = useBuyCrypto((newBalance) => {
    updateBalance(newBalance);
  });

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
      await buyCryptoMutation.mutateAsync({
        userId,
        cryptoId: selectedCrypto.id,
        quantity: parseFloat(amount)
      });
      
      setPurchaseStatus({
        success: true,
        message: `Successfully purchased ${amount} ${selectedCrypto.symbol}`
      });
      
      setTimeout(() => {
        setShowBuyForm(false);
        setPurchaseStatus(null);
      }, 2000);
      
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

  const processedCryptos = Array.isArray(cryptos) ? cryptos.map(crypto => ({
    id: crypto.id,
    name: crypto.cryptoName,
    symbol: crypto.symbol,
    price: crypto.currentPrice,
    priceChange24h: 0
  })) : [];

  const lastUpdated = dataUpdatedAt ? new Date(dataUpdatedAt) : null;

  return (
    <div className="min-h-screen bg-dark p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-2">Cryptocurrency Market</h1>
        {lastUpdated && (
          <p className="text-sm text-gray-400 mb-6">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </p>
        )}
        
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        )}
        
        {error && (
          <div className="bg-red-900/30 border border-red-500 text-red-200 px-4 py-3 rounded mb-4">
            Failed to load cryptocurrencies
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {processedCryptos.length === 0 && !isLoading ? (
            <div className="col-span-full text-center text-gray-400 py-12">
              No cryptocurrencies available. Please check your API connection.
            </div>
          ) : (
            processedCryptos.map(crypto => (
              <div 
                key={crypto.id} 
                className="bg-dark-paper rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-700 hover:border-primary"
              >
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-white mb-1">{crypto.name}</h3>
                  <p className="text-sm text-gray-400 uppercase">{crypto.symbol}</p>
                  <p className="text-2xl font-semibold text-secondary mt-3">
                    ${safeToFixed(crypto.price)}
                  </p>
                </div>
                <button 
                  className="w-full bg-primary hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded transition-colors duration-200"
                  onClick={() => openBuyForm(crypto)}
                >
                  Buy
                </button>
              </div>
            ))
          )}
        </div>
        
        {showBuyForm && selectedCrypto && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-dark-paper rounded-lg max-w-md w-full p-6 shadow-2xl border border-gray-700">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-white">Buy {selectedCrypto.name}</h2>
                <button 
                  className="text-gray-400 hover:text-white text-3xl leading-none"
                  onClick={() => setShowBuyForm(false)}
                >
                  ×
                </button>
              </div>
              
              <p className="text-gray-300 mb-6">
                Current price: <span className="text-secondary font-semibold">${safeToFixed(selectedCrypto.price)}</span>
              </p>
              
              <form onSubmit={handleBuy}>
                <div className="mb-4">
                  <label htmlFor="amount" className="block text-sm font-medium text-gray-300 mb-2">
                    Amount to buy:
                  </label>
                  <input
                    type="number"
                    id="amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Enter amount"
                    step="0.000001"
                    min="0"
                    required
                    className="w-full px-4 py-2 bg-dark border border-gray-600 rounded text-white focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
                
                {amount && !isNaN(amount) && (
                  <div className="bg-gray-800 rounded p-3 mb-4">
                    <p className="text-gray-300">
                      Estimated cost: <span className="text-secondary font-semibold">${safeToFixed(parseFloat(amount) * selectedCrypto.price)}</span>
                    </p>
                  </div>
                )}
                
                {purchaseStatus && (
                  <div className={`mb-4 px-4 py-3 rounded ${
                    purchaseStatus.success 
                      ? 'bg-green-900/30 border border-green-500 text-green-200' 
                      : 'bg-red-900/30 border border-red-500 text-red-200'
                  }`}>
                    {purchaseStatus.message}
                  </div>
                )}
                
                <button 
                  type="submit" 
                  disabled={buyCryptoMutation.isPending}
                  className="w-full bg-primary hover:bg-blue-600 disabled:bg-gray-600 text-white font-semibold py-3 px-4 rounded transition-colors duration-200"
                >
                  {buyCryptoMutation.isPending ? 'Processing...' : 'Confirm Purchase'}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CryptoMarketPage;