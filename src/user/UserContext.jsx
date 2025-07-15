// src/UserContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../firebase";

const UserContext = createContext();

const allowedAdminEmail = "shemapatrick232@gmail.com"; // replace with actual admin

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsAdmin(currentUser?.email === allowedAdminEmail);
    });
    return () => unsub();
  }, []);

  const logout = () => signOut(auth);

  return (
    <UserContext.Provider value={{ user, isAdmin, logout }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
