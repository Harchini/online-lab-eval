import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Questions from './pages/Questions';
import Solve from './pages/Solve';
import './pages/Login.css';

const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <Router basename="/student">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/questions" element={<PrivateRoute><Questions /></PrivateRoute>} />
          <Route path="/solve/:id" element={<PrivateRoute><Solve /></PrivateRoute>} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
