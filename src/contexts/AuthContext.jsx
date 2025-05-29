import { createContext, useState, useContext } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [message, setMessage] = useState("");

  const clearMessage = () => setMessage("");

  return (
    <AuthContext.Provider value={{ message, setMessage, clearMessage }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
