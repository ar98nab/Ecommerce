import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../state/AuthContext';
import Loader from '../components/Loader';
import Message from '../components/Message';

const LoginPage = () => {
  const [email, setEmail] = useState('buyer@example.com');
  const [password, setPassword] = useState('password');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data } = await axios.post('https://bringit-0vs9.onrender.com/api/auth/login', {
        email,
        password,
      });
      login(data);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="page auth-page">
      <div className="auth-card">
        <h1>Welcome back</h1>
        <p className="auth-sub">
          Sign in as buyer or seller and continue on Bringit.
        </p>
        {error && <Message variant="danger">{error}</Message>}
        {loading && <Loader />}
        <form onSubmit={submitHandler} className="auth-form">
          <label>
            Email
            <input
              type="email"
              value={email}
              placeholder="you@example.com"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
          <label>
            Password
            <input
              type="password"
              value={password}
              placeholder="••••••••"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
          <button className="btn-primary w-full" type="submit">
            Login
          </button>
        </form>
        <p className="auth-footer">
          New here? <Link to="/register">Create an account</Link>
        </p>
      </div>
      
    </section>
  );
};

export default LoginPage;