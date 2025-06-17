import { createContext, useState, useContext } from 'react';

const QueryContext = createContext();

export function QueryProvider({ children }) {
  const [query, setQuery] = useState('World');
  return (
    <QueryContext.Provider value={{ query, setQuery }}>
      {children}
    </QueryContext.Provider>
  );
}

export const useQuery = () => useContext(QueryContext);
