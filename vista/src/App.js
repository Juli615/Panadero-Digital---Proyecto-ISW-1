import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './AuthContext';
import Login from './components/Login';
import AdminDashboard from './components/AdminDashboard';
import SellerDashboard from './components/SellerDashboard';
import PrivateRoute from './components/PrivateRoute';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="container mt-3">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/admin"
              element={<PrivateRoute roles={['admin']} component={AdminDashboard} />}
            />
            <Route
              path="/seller"
              element={<PrivateRoute roles={['vendedor']} component={SellerDashboard} />}
            />
            <Route path="/" element={<Navigate to="/login" />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;