import React, { createContext, useState } from 'react';

export const authDataContext = createContext();

function AuthContext({ children }) {
  const [user, setUser] = useState(null); // null = not logged in
  let serverUrl = "http://localhost:3000";

  let value = {
    serverUrl,
    user,
    setUser
  };

  return (
    <authDataContext.Provider value={value}>
      {children}
    </authDataContext.Provider>
  );
}

export default AuthContext;
