import React, { useState, useEffect } from "react";
import "../../components/styles/authForm.css";
import { useAuthStore } from "../../store/useAuthStore";
import { useNavigate } from "react-router-dom";


export default function AuthForm() {


    const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const { register, login, error, clearErrors, loading } = useAuthStore();

  // Reset error message on form switch
  useEffect(() => {
    clearErrors();
  }, [isLogin]);

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form Data:", formData);

    if (!isLogin) {
      // Signup Logic
      if (formData.password !== formData.confirmPassword) {
        alert("Passwords do not match!");
        return;
      }

      const res = await register({
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        password2: formData.confirmPassword,
      });

      if (res) {
        alert("Account created successfully! You can now log in.");
        setIsLogin(true); // Switch to login mode
      }
    } else {
      // Login Logic
      const res = await login({
        email: formData.email,
        password: formData.password,
      });

      console.log("Login Error:", res);

      if (res) {
        alert("Login successful!");
        navigate("/user/home");
        
      }
    }
  };

  return (
    <section className={`auth-container ${darkMode ? "dark" : ""}`}>
      <div className="auth-box">
        {/* Dark Mode Toggle */}
        <div className="dark-mode-toggle">
          <button onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? "☀ Light Mode" : "🌙 Dark Mode"}
          </button>
        </div>

        {/* Title */}
        <h2 className="auth-title">{isLogin ? "Sign In" : "Sign Up"}</h2>

        {/* Show error if exists */}
        {error && <p className="auth-error">{error}</p>}

        {/* Form */}
        <form className="auth-form" onSubmit={handleSubmit}>
          {!isLogin && (
            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              className="auth-input"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
          )}

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            className="auth-input"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            className="auth-input"
            value={formData.password}
            onChange={handleChange}
            required
          />

          {!isLogin && (
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              className="auth-input"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          )}

          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? "Processing..." : isLogin ? "Sign In" : "Sign Up"}
          </button>
        </form>

        {/* Toggle Button */}
        <p className="auth-toggle">
          {isLogin ? "Don't have an account?" : "Already have an account?"}
          <button className="auth-toggle-btn" onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? "Sign Up" : "Sign In"}
          </button>
        </p>
      </div>
    </section>
  );
}
