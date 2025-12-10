import React, { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../token";
import "../styles/AuthForm.css";

const AuthForm = ({ route, method }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await api.post(route, { username, password });

      if (method === "login") {
        localStorage.setItem(ACCESS_TOKEN, res.data.access);
        localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
        navigate("/chats");
        // window.location.reload(); // Remove this line – React Router will handle
      } else if (method === "register") {
        navigate("/login"); // After registration, go to login
      }
    } catch (error) {
      console.error(error);
      if (error.response?.status === 401) {
        setError("Invalid username or password");
      } else if (error.response?.status === 400) {
        setError("Username already exists or password too weak");
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-container">
        <div className="auth-header">
          <h1>ChitChat 💬</h1>
          <p>
            {method === "login"
              ? "Welcome back! Sign in to continue."
              : "Create an account to start chatting."}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {error && <div className="error-message">{error}</div>}

          <div className="input-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? (
              <span className="spinner"></span>
            ) : method === "login" ? (
              "Sign In"
            ) : (
              "Sign Up"
            )}
          </button>

          <div className="auth-footer">
            {method === "login" ? (
              <p>
                Don't have an account?{" "}
                <span onClick={() => navigate("/register")} className="link">
                  Register here
                </span>
              </p>
            ) : (
              <p>
                Already have an account?{" "}
                <span onClick={() => navigate("/login")} className="link">
                  Sign in here
                </span>
              </p>
            )}
          </div>
        </form>

        <div className="auth-features">
          <div className="feature">
            <span>🔒</span>
            <p>Secure & Encrypted</p>
          </div>
          <div className="feature">
            <span>⚡</span>
            <p>Real-time Messages</p>
          </div>
          <div className="feature">
            <span>👥</span>
            <p>Connect Instantly</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;