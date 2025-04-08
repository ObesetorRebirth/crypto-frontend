import axios from 'axios';

const BASE_URL = 'http://localhost:8080'; 

export const getTop20Cryptos = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/crypto/top20`);
    return response.data;
  } catch (error) {
    console.error('Error fetching top 20 cryptos:', error);
    throw error;
  }
};

export const getUserBalance = async (userId) => {
  try {
    const response = await axios.get(`${BASE_URL}/user/${userId}/balance`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user balance:', error);
    throw error;
  }
};

export const buyCrypto = async (userId, cryptoId, quantity) => {
  try {
    await axios.post(`${BASE_URL}/transaction/${userId}/buy/${cryptoId}`, null, {
      params: { quantity }
    });
  } catch (error) {
    console.error('Error buying crypto:', error.response?.data || error.message);
    throw error;
  }
};  

export const sellCrypto = async (userId, cryptoId, quantity) => {
    try {
      await axios.post(`${BASE_URL}/transaction/${userId}/sell/${cryptoId}`, null, {
        params: { quantity }
      });
    } catch (error) {
      console.error('Error selling crypto:', error);
      throw error;
    }
  };

  export const getUserHoldings = async (userId) => {
    try {
      const response = await axios.get(`${BASE_URL}/holding/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user holdings:', error);
      throw error;
    }
  };

  export const resetUserAccount = async (userId) => {
    try {
      const response = await axios.put(`${BASE_URL}/user/${userId}/reset`);
      return response.data;
    } catch (error) {
      console.error('Error resetting user account:', error);
      throw error;
    }
  };

  export const getProfitOrLoss = async (transactionId) => {
    const response = await axios.get(`${BASE_URL}/transaction/${transactionId}/profitOrLoss`);
    return response.data;
  };

  export const getUserTransactionsByType = async (userId, transactionType) => {
    try {
      const response = await axios.get(`${BASE_URL}/transaction/${userId}/${transactionType}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user transactions by type:', error);
      throw error;
    }
  };
