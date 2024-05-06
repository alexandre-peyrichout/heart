import React, { createContext, useContext, useEffect, useState } from "react";

import { User } from "firebase/auth";
import {
  collection,
  DocumentReference,
  getDocs,
  query,
  where,
} from "firebase/firestore";

import { auth, db } from "../services/firebase";

interface LoggedInUser {
  user: User;
  doc: DocumentReference;
}

interface AuthContextInterface {
  loggedInUser: LoggedInUser | null;
  setLoggedInUser: React.Dispatch<React.SetStateAction<LoggedInUser | null>>;
}

const AuthContext = createContext({
  loggedInUser: null,
  setLoggedInUser: () => {},
} as AuthContextInterface);

export const AuthProvider = ({ children }) => {
  const [loggedInUser, setLoggedInUser] = useState<LoggedInUser | null>(null);
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          const q = query(
            collection(db, "users"),
            where("account_id", "==", user.uid)
          );
          const querySnapshot = await getDocs(q);
          querySnapshot.forEach((doc) => {
            setLoggedInUser({ user, doc: doc.ref });
          });
        } catch (error) {
          console.error(error);
        }
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
