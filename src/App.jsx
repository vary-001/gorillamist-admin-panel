// src/App.jsx
import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "./firebase";

// Pages
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";


function App() {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const adminEmail = "shemapatrick232@gmail.com"; // your actual admin email

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsAdmin(currentUser?.email === adminEmail);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
    setIsAdmin(false);
  };

  // 🔐 Admin route protection
  const ProtectedRoute = ({ children }) => {
    if (!user || !isAdmin) {
      return <Navigate to="/login" />;
    }
    return children;
  };

  return (
    <div className="min-h-screen bg-jungle text-ivorysmoke font-body">
      <Routes>
        {/* 🔐 Public Login Route */}
        <Route path="/login" element={<Login />} />

        {/* 🔐 Admin Dashboard (with upload & craft list included) */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <Dashboard user={user} logout={handleLogout} />
            </ProtectedRoute>
          }
        />

        {/* 🔁 Redirects all unknown paths */}
        <Route
          path="*"
          element={<Navigate to={user && isAdmin ? "/admin" : "/login"} />}
        />
      </Routes>
    </div>
  );
}

export default App;
