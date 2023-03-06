import React, { useState, useMemo } from "react";

export const AuthContext = React.createContext({
  user: null,
  session: null,
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);

  const authContextValue = useMemo(
    () => ({
      user,
      session,
    }),
    [user, session]
  );

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};
