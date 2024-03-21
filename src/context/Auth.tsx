import React, { createContext, useContext, useEffect, useState } from "react";

import { User } from "firebase/auth";

import { auth } from "../services/firebase";

interface AuthContextInterface {
  loggedInUser: User | null;
  setLoggedInUser: React.Dispatch<React.SetStateAction<User | null>>;
}

const AuthContext = createContext({
  loggedInUser: null,
  setLoggedInUser: () => {},
} as AuthContextInterface);

export const AuthProvider = ({ children }) => {
  const [loggedInUser, setLoggedInUser] = useState<User | null>(null);
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setLoggedInUser(user);
      } else {
        setLoggedInUser(null);
      }
    });
    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{ loggedInUser, setLoggedInUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthContext;
