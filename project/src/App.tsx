import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import RequestForm from './pages/RequestForm';
import AdminDashboard from './pages/AdminDashboard';
import ForgotPassword from './pages/Forgotpass';
import axios from 'axios';

interface User {
  name: string;
  email: string;
  role: 'admin' | 'user'; // User roles for navigation
  branch?: string;
}

// Protected Route Component
const ProtectedRoute = ({ allowedRoles }: { allowedRoles: ('admin' | 'user')[] }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setLoading(false);
          return;
        }

        const response = await axios.get<{ user: User }>('https://alumnii-erp.onrender.com/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUser(response.data.user);
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) return <div>Loading...</div>;

  if (!user) return <Navigate to="/login" replace />;

  if (!allowedRoles.includes(user.role)) return <Navigate to="/" replace />;

  return <Outlet />;
};

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* User Protected Routes */}
          <Route element={<ProtectedRoute allowedRoles={['user']} />}>
            <Route
              path="/dashboard"
              element={
                <div className="flex">
                  <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
                  <div className="flex-1 min-h-screen">
                    <Navbar onMenuClick={toggleSidebar} />
                    <Dashboard />
                  </div>
                </div>
              }
            />
            <Route
              path="/request"
              element={
                <div className="flex">
                  <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
                  <div className="flex-1 min-h-screen">
                    <Navbar onMenuClick={toggleSidebar} />
                    <RequestForm />
                  </div>
                </div>
              }
            />
          </Route>

          {/* Admin Protected Routes */}
          <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route
              path="/admin"
              element={
                <div className="flex">
                  <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
                  <div className="flex-1 min-h-screen">
                    <Navbar onMenuClick={toggleSidebar} />
                    <AdminDashboard />
                  </div>
                </div>
              }
            />
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
