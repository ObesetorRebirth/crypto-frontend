import React, { useState, useEffect, useContext } from 'react';
import { getTop20Cryptos, getUserBalance, getUserHoldings } from '../services/api';
import { UserContext } from '../context/UserContext';

const Dashboard = () => {
  const { userId, balance } = useContext(UserContext);
  const [topCryptos, setTopCryptos] = useState([]);
  const [holdings, setHoldings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const cryptoData = await getTop20Cryptos(); 
        setTopCryptos(cryptoData);

        const userBalance = await getUserBalance(userId);

        const userHoldings = await getUserHoldings(userId); 
        setHoldings(userHoldings);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Your Balance: ${balance}</p>
      {/* Render other data like topCryptos and holdings */}
    </div>
  );
};

export default Dashboard;
