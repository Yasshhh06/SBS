import React, { useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Appointments from './pages/Appointments';
import DashboardLayout from './layouts/DashboardLayout';

const PrivateRoute = ({ children }) => {
  const { admin, loading } = useContext(AuthContext);
  
  if (loading) return <div className="h-screen flex items-center justify-center">Loading...</div>;
  
  return admin ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        <Route path="/" element={
          <PrivateRoute>
            <DashboardLayout />
          </PrivateRoute>
        }>
          <Route index element={<Dashboard />} />
          <Route path="appointments" element={<Appointments />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
