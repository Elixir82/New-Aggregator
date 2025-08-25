import React from 'react'

let APIcontext = React.createContext();

export function APIStatusProvider({ children }) {
  let [APIStatus, setAPIStatus] = React.useState(false);
  return (<APIcontext.Provider value={{ APIStatus, setAPIStatus }}>
    {children}
  </APIcontext.Provider>);
}

export let useAPIcontext = () => React.useContext(APIcontext);