import React, { useContext } from 'react';
import { UserContext } from '../context/UserContext';
import { useCryptos, useUserHoldings } from '../hooks';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { userId, balance } = useContext(UserContext);
  
  // Use custom hooks
  const { data: topCryptos = [], isLoading: cryptosLoading } = useCryptos();
  const { data: holdings = [], isLoading: holdingsLoading } = useUserHoldings(userId);

  if (cryptosLoading || holdingsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Calculate total portfolio value
  const cryptoPrices = {};
  topCryptos.forEach(crypto => {
    cryptoPrices[crypto.id] = crypto.currentPrice;
  });

  const totalPortfolioValue = holdings.reduce((total, holding) => {
    const price = cryptoPrices[holding.cryptoId] || 0;
    return total + (holding.quantity * price);
  }, 0);

  return (
    <div className="min-h-screen bg-dark p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8">Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-dark-paper rounded-lg p-6 shadow-lg border border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-gray-400 text-sm uppercase tracking-wide">Available Balance</h2>
              <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-3xl font-bold text-white">
              ${balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            <Link to="/market" className="inline-block mt-4 text-primary hover:text-blue-400 text-sm font-medium">
              Go to Market →
            </Link>
          </div>

          <div className="bg-dark-paper rounded-lg p-6 shadow-lg border border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-gray-400 text-sm uppercase tracking-wide">Portfolio Value</h2>
              <svg className="w-8 h-8 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <p className="text-3xl font-bold text-white">
              ${totalPortfolioValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            <Link to="/portfolio" className="inline-block mt-4 text-secondary hover:text-green-400 text-sm font-medium">
              View Portfolio →
            </Link>
          </div>

          <div className="bg-dark-paper rounded-lg p-6 shadow-lg border border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-gray-400 text-sm uppercase tracking-wide">Total Value</h2>
              <svg className="w-8 h-8 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <p className="text-3xl font-bold text-white">
              ${(balance + totalPortfolioValue).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            <p className="text-sm text-gray-400 mt-2">Balance + Portfolio</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-dark-paper rounded-lg p-6 shadow-lg border border-gray-700">
            <h2 className="text-2xl font-bold text-white mb-4">Your Holdings</h2>
            {holdings.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-400 mb-4">You don't have any cryptocurrency holdings yet.</p>
                <Link 
                  to="/market" 
                  className="inline-block bg-primary hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded transition-colors"
                >
                  Start Trading
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {holdings.slice(0, 5).map((holding) => {
                  const currentPrice = cryptoPrices[holding.cryptoId] || 0;
                  const totalValue = holding.quantity * currentPrice;
                  
                  return (
                    <div key={holding.cryptoId} className="flex items-center justify-between p-3 bg-dark rounded border border-gray-700 hover:border-primary transition-colors">
                      <div>
                        <p className="text-white font-semibold">{holding.cryptoName}</p>
                        <p className="text-sm text-gray-400">{holding.quantity.toFixed(6)} units</p>
                      </div>
                      <div className="text-right">
                        <p className="text-white font-semibold">
                          ${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </p>
                        <p className="text-sm text-gray-400">
                          @ ${currentPrice.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  );
                })}
                {holdings.length > 5 && (
                  <Link 
                    to="/portfolio" 
                    className="block text-center text-primary hover:text-blue-400 text-sm font-medium pt-2"
                  >
                    View all {holdings.length} holdings →
                  </Link>
                )}
              </div>
            )}
          </div>

          <div className="bg-dark-paper rounded-lg p-6 shadow-lg border border-gray-700">
            <h2 className="text-2xl font-bold text-white mb-4">Market Overview</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-dark rounded border border-gray-700">
                <p className="text-gray-400">Total Cryptocurrencies</p>
                <p className="text-white font-bold text-xl">{topCryptos.length}</p>
              </div>
              <div className="flex items-center justify-between p-3 bg-dark rounded border border-gray-700">
                <p className="text-gray-400">Your Holdings</p>
                <p className="text-white font-bold text-xl">{holdings.length}</p>
              </div>
              <div className="flex items-center justify-between p-3 bg-dark rounded border border-gray-700">
                <p className="text-gray-400">Available to Trade</p>
                <p className="text-white font-bold text-xl">{topCryptos.length - holdings.length}</p>
              </div>
            </div>
            <Link 
              to="/market" 
              className="block mt-4 text-center bg-secondary hover:bg-green-600 text-white font-semibold py-2 px-4 rounded transition-colors"
            >
              Explore Market
            </Link>
          </div>
        </div>

        <div className="mt-8 bg-dark-paper rounded-lg p-6 shadow-lg border border-gray-700">
          <h2 className="text-2xl font-bold text-white mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link 
              to="/market" 
              className="flex items-center p-4 bg-dark hover:bg-gray-800 rounded border border-gray-700 hover:border-primary transition-colors group"
            >
              <svg className="w-10 h-10 text-primary mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <div>
                <p className="text-white font-semibold group-hover:text-primary">Buy Crypto</p>
                <p className="text-sm text-gray-400">Browse and purchase</p>
              </div>
            </Link>

            <Link 
              to="/portfolio" 
              className="flex items-center p-4 bg-dark hover:bg-gray-800 rounded border border-gray-700 hover:border-secondary transition-colors group"
            >
              <svg className="w-10 h-10 text-secondary mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
              <div>
                <p className="text-white font-semibold group-hover:text-secondary">Manage Portfolio</p>
                <p className="text-sm text-gray-400">View and sell holdings</p>
              </div>
            </Link>

            <Link 
              to="/transactions" 
              className="flex items-center p-4 bg-dark hover:bg-gray-800 rounded border border-gray-700 hover:border-yellow-500 transition-colors group"
            >
              <svg className="w-10 h-10 text-yellow-500 mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
              <div>
                <p className="text-white font-semibold group-hover:text-yellow-500">Transaction History</p>
                <p className="text-sm text-gray-400">View past trades</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;