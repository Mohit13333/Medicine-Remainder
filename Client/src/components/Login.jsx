import React, { useState } from 'react';
import { loginUser } from '../services/api';
import { useDispatch } from 'react-redux';
import { setUser } from '../slices/userSlice';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Initialize navigate

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(''); // Reset error state on form submission

    try {
      const response = await loginUser({ email, password });
      console.log(response);
      localStorage.setItem('token', response.data.accessToken); // Store token in local storage
      localStorage.setItem('userId', response.data.id); // Store token in local storage
      dispatch(setUser(response.data.user)); // Set user in Redux state
      navigate('/'); // Redirect to medicine schedule using navigate
    } catch (error) {
      console.error('Login failed:', error);
      setError(error.response?.data?.message || 'Login failed. Please try again.');
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form className="bg-white p-8 rounded shadow-md w-96" onSubmit={handleLogin}>
        <h2 className="text-2xl font-bold mb-4">Login</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border rounded w-full py-2 px-3 mb-4"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border rounded w-full py-2 px-3 mb-4"
          required
        />
        <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded">
          Login
        </button>
        {error && <p className="text-red-500 mt-2">{error}</p>}
        <p>
          Don't have an account? 
          <span onClick={() => navigate('/register')} className="text-blue-500 cursor-pointer"> Register</span>
        </p>
      </form>
    </div>
  );
};

export default Login;
