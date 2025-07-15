// src/pages/Login.jsx
import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faLock } from "@fortawesome/free-solid-svg-icons";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/admin"); // redirect to admin panel
    } catch (error) {
      setErrorMsg("Invalid credentials or unauthorized.");
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-jungle text-ivorysmoke flex items-center justify-center px-4 font-body">
      <div className="bg-deepsoil p-8 rounded-xl shadow-2xl w-full max-w-md space-y-6">
        <h2 className="text-3xl font-heading text-center text-sunleaf">Admin Login</h2>

        {errorMsg && (
          <p className="bg-red-600 bg-opacity-20 text-red-400 px-4 py-2 rounded">{errorMsg}</p>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="flex items-center gap-2 bg-jungle px-4 py-2 rounded-lg focus-within:ring-2 focus-within:ring-sunleaf">
            <FontAwesomeIcon icon={faEnvelope} className="text-sunleaf" />
            <input
              type="email"
              placeholder="Admin email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-transparent w-full focus:outline-none text-ivorysmoke"
              required
            />
          </div>
          <div className="flex items-center gap-2 bg-jungle px-4 py-2 rounded-lg focus-within:ring-2 focus-within:ring-sunleaf">
            <FontAwesomeIcon icon={faLock} className="text-sunleaf" />
            <input
              type="password"
              placeholder="Your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-transparent w-full focus:outline-none text-ivorysmoke"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-sunleaf text-jungle font-semibold py-2 w-full rounded-lg hover:bg-ivorysmoke hover:text-deepsoil transition"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}
