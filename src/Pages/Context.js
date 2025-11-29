import React, { createContext, useState, } from 'react';

export const CoustomContext = createContext();

export const ContextProvider = ({ children }) => {
  const [UserData,setUserData] = useState(null);
console.log(UserData)

  return (
    <CoustomContext.Provider
      value={{ UserData, setUserData }}
    >
      {children}
    </CoustomContext.Provider>
  );
};