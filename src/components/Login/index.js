import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styles from './index.module.css';
import boardContext from '../../store/boardContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { isUserLoggedIn, setUserLoginStatus } = useContext(boardContext);

  console.log(isUserLoggedIn);
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      // if (response.ok) {
      //   localStorage.setItem('whiteboard_user_token', data.token);

      //   setUserLoginStatus(true);
      //   console.log("Login successful, token stored.");
      //   navigate('/home');
      // } 
      if (response.ok) {
        console.log("Full login response:", data);   // check token is there
        localStorage.setItem("whiteboard_user_token", data.token);
        console.log("Token after storing:", localStorage.getItem("whiteboard_user_token"));
        setUserLoginStatus(true);
        navigate("/home");
      }
      else {
        alert(data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('An error occurred during login');
    }
  };

  return (
    <div className={styles.loginContainer}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit} className={styles.loginForm}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
      <p>
        Don't have an account? <Link to="/register">Register here</Link>
      </p>
    </div>
  );
};

export default Login;