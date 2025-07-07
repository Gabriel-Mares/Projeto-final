import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/login', {
        email,
        password
      });

   // Salva o token no localStorage
      localStorage.setItem('token', response.data.token);
      
      // Redireciona para o perfil
      navigate('/profile');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
      console.error("Login error:", err);
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "0 auto", padding: "2rem" }}>
      <h2>Login</h2>
      {error && <div style={{ color: "red", marginBottom: "1rem" }}>{error}</div>}
      <form onSubmit={handleSubmit}>
        {/* Restante do formulário permanece igual */}
      </form>
      <p style={{ marginTop: "1rem" }}>
        Don't have an account? <a href="/register">Register here</a>
      </p>
    </div>
  );
}

export default LoginPage;
