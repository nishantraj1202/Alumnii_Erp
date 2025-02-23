import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  Settings, 
  LogOut, 
  GraduationCap,
  X
} from 'lucide-react';
import axios from 'axios';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const token = localStorage.getItem('token'); // Get token from storage
  const userRole = localStorage.getItem('role'); // Assuming role is stored

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth >= 1024) {
        onClose();
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [onClose]);

  const menuItems = [
    { title: 'Dashboard', icon: LayoutDashboard, path: '/dashboard', show: true },
    { title: 'New Request', icon: FileText, path: '/request', show: userRole === 'alumni' },
    { title: 'Admin Panel', icon: Settings, path: '/admin', show: userRole === 'admin' },
  ];

  const handleLogout = async () => {
    try {
      if (token) {
        await axios.post('http://localhost:5000/auth/logout', {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
    } catch (error) {
      console.error('Error logging out:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      navigate('/');
    }
  };

  const handleLinkClick = () => {
    if (isMobile) onClose();
  };

  return (
    <>
      {/* Overlay */}
      {isMobile && isOpen && <div className="fixed inset-0 bg-black bg-opacity-50 z-20" onClick={onClose} />}

      {/* Sidebar */}
      <div className={`fixed lg:static inset-y-0 left-0 z-30 w-64 bg-white border-r transform transition-transform ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}>
        <div className="flex flex-col h-screen">
          {/* Header */}
          <div className="p-6 flex items-center justify-between border-b">
            <Link to="/dashboard" className="flex items-center space-x-3" onClick={handleLinkClick}>
              <GraduationCap className="h-8 w-8 text-indigo-600" />
              <span className="text-xl font-bold text-gray-900">NITJ Alumni</span>
            </Link>
            {isMobile && <button onClick={onClose}><X className="h-6 w-6 text-gray-500" /></button>}
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-4 space-y-1">
            {menuItems.map(({ title, icon: Icon, path, show }) =>
              show && (
                <Link key={path} to={path} onClick={handleLinkClick} className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${location.pathname === path ? "bg-indigo-50 text-indigo-600" : "hover:bg-gray-50 text-gray-600"}`}>
                  <Icon className="h-5 w-5" />
                  <span>{title}</span>
                </Link>
              )
            )}
          </nav>

          {/* Logout Button */}
          <div className="p-4 border-t">
            <button onClick={handleLogout} className="flex items-center space-x-3 px-4 py-3 text-red-600 w-full hover:bg-red-50 rounded-lg transition-colors">
              <LogOut className="h-5 w-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
