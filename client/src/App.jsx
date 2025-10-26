import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import PrivateRoute from './components/common/PrivateRoute.jsx';
import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import UserManagement from './pages/UserManagement.jsx';
import RoleManagement from './pages/RoleManagement.jsx';
import EnterpriseManagement from './pages/EnterpriseManagement.jsx';
import EmployeeManagement from './pages/EmployeeManagement.jsx';
import ProductManagement from './pages/ProductManagement.jsx';
import { useAuth } from './hooks/useAuth.js';

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/" /> : <Login />}
      />
      <Route
        path="/"
        element={
          <PrivateRoute>
            <Layout />
          </PrivateRoute>
        }
      >
        {/* Nested routes will render inside Layout's <Outlet /> */}
        <Route index element={<Navigate to="/dashboard" />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="users" element={<UserManagement />} />
        <Route path="roles" element={<RoleManagement />} />
        <Route path="enterprises" element={<EnterpriseManagement />} />
        <Route path="employees" element={<EmployeeManagement />} />
        <Route path="products" element={<ProductManagement />} />
      </Route>
      {/* Fallback route */}
      <Route path="*" element={<Navigate to={isAuthenticated ? "/" : "/login"} />} />
    </Routes>
  );
}

export default App;


