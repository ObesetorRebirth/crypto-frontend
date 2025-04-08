import { createContext } from 'react';
export const UserContext = createContext
({ userId: null, balance: 0, updateBalance: () => {} });