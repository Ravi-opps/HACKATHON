import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'motion/react';
import Layout from './components/Layout';
import Login from './views/Login';
import FieldReport from './views/FieldReport';
import AdminDashboard from './views/AdminDashboard';
import ResponseOverview from './views/ResponseOverview';
import Signup from './views/Signup';
import SplashScreen from './components/SplashScreen';
import ProtectedRoute from './components/ProtectedRoute';

export default function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Router>
      <AnimatePresence>
        {loading && <SplashScreen key="splash" />}
      </AnimatePresence>
      
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        
        <Route path="/fieldworker" element={
          <ProtectedRoute allowedRoles={['field']}>
            <Layout>
              <FieldReport />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/admin" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <Layout>
              <AdminDashboard />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/volunteer" element={
          <ProtectedRoute allowedRoles={['volunteer']}>
            <Layout>
              <ResponseOverview />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/map" element={
          <ProtectedRoute allowedRoles={['coordinator']}>
            <Layout>
              <ResponseOverview />
            </Layout>
          </ProtectedRoute>
        } />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
