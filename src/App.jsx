// =============================================
//  RHYTHMIX — App Root
// =============================================
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

/** Protect dashboard route */
const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/" replace />;
};

const AppRoutes = () => (
  <Routes>
    <Route path="/"          element={<Login />} />
    <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
    <Route path="*"          element={<Navigate to="/" replace />} />
  </Routes>
);

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </ThemeProvider>
  );
}
