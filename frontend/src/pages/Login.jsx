import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Scissors } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to connect to server. Please ensure the backend is running.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[url('https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=1974&auto=format&fit=crop')] bg-cover bg-center">
      <div className="absolute inset-0 bg-salon-pink/40 dark:bg-gray-900/60 backdrop-blur-sm"></div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass w-full max-w-md p-8 rounded-3xl relative z-10"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="bg-salon-primary p-3 rounded-full mb-4">
            <Scissors className="text-white w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Shrawani's Salon</h1>
          <p className="text-gray-600 dark:text-gray-300">Admin Portal</p>
        </div>

        {error && <div className="bg-red-100 text-red-600 p-3 rounded-lg mb-4 text-sm text-center">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Email</label>
            <input 
              type="email" 
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-salon-primary focus:border-transparent outline-none bg-white/50 dark:bg-gray-800/50"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@shrawanisalon.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Password</label>
            <input 
              type="password" 
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-salon-primary focus:border-transparent outline-none bg-white/50 dark:bg-gray-800/50"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>
          <button 
            type="submit" 
            className="w-full bg-salon-primary hover:bg-salon-secondary text-white font-semibold py-3 rounded-xl transition-colors duration-300"
          >
            Login to Dashboard
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default Login;
