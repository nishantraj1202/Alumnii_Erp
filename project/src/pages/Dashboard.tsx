import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  GraduationCap, 
  Users, 
  Calendar,
  Globe2,
  Briefcase,
  ChevronRight,
  TrendingUp,
  Award,
  BookOpen,
  Building2,
  ExternalLink,
  Download,
  Mail,
} from 'lucide-react';
import { generateVerificationForm } from '../lib/utils';
import axios from 'axios';

// Define proper TypeScript interfaces
interface User {
  name: string;
  rollNo?: string;
  graduationYear?: string;
  email: string;
  isPlaced: boolean;
}

interface Notification {
  id: number;
  title: string;
  description: string;
  type: 'event' | 'job' | 'mentorship';
  date: string;
  link: string;
}

interface Stat {
  label: string;
  value: string;
  icon: React.FC<{ className?: string }>;
  color: string;
  description: string;
}

const Dashboard: React.FC = () => {
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const stats: Stat[] = [
    { 
      label: 'Alumni Network', 
      value: '10,000+', 
      icon: Users, 
      color: 'bg-blue-500',
      description: 'Connected alumni worldwide'
    },
    { 
      label: 'Events This Year', 
      value: '24', 
      icon: Calendar, 
      color: 'bg-purple-500',
      description: 'Networking opportunities'
    },
    { 
      label: 'Job Opportunities', 
      value: '150+', 
      icon: Briefcase, 
      color: 'bg-green-500',
      description: 'Open positions'
    },
    { 
      label: 'Countries', 
      value: '45+', 
      icon: Globe2, 
      color: 'bg-orange-500',
      description: 'Global presence'
    }
  ];

  const notifications: Notification[] = [
    {
      id: 1,
      title: 'Alumni Meet 2025',
      description: 'Registration now open for the grand reunion',
      type: 'event',
      date: '2025-03-15',
      link: '#'
    },
    {
      id: 2,
      title: 'New Job Opportunities',
      description: 'Senior positions available at top tech companies',
      type: 'job',
      date: '2025-02-28',
      link: '#'
    },
    {
      id: 3,
      title: 'Mentorship Program',
      description: 'Share your experience with current students',
      type: 'mentorship',
      date: '2025-02-20',
      link: '#'
    }
  ];

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await axios.get<{ user: User }>('http://localhost:5000/auth/me', {
          headers: { Authorization: `Bearer ${token}` }
        });

        setUserData(response.data.user);
      } catch (error) {
        console.error('Error fetching user data:', error);
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleDownloadCertificate = () => {
    if (!userData) return;
    
    generateVerificationForm({
      fullName: userData.name,
      rollNumber: userData.rollNo ?? 'N/A',
      batchYear: userData.graduationYear ?? '2025',
      email: userData.email,
      placementStatus: userData.isPlaced ? 'Placed' : 'Not Placed',
      certificateId: `CERT-${Date.now()}`
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const quickActions = [
    {
      title: 'Request Certificate',
      description: 'Get your alumni verification certificate',
      icon: Award,
      color: 'bg-indigo-100 text-indigo-600',
      link: '/request'
    },
    {
      title: 'Update Profile',
      description: 'Keep your information current',
      icon: TrendingUp,
      color: 'bg-green-100 text-green-600',
      link: '/profile'
    },
    {
      title: 'Join Mentorship',
      description: 'Guide current students',
      icon: Users,
      color: 'bg-purple-100 text-purple-600',
      link: '/mentorship'
    }
  ];

  const resources = [
    {
      title: 'Alumni Directory',
      icon: BookOpen,
      color: 'bg-indigo-100 text-indigo-600',
      link: '#'
    },
    {
      title: 'Career Services',
      icon: Briefcase,
      color: 'bg-green-100 text-green-600',
      link: '#'
    },
    {
      title: 'Campus News',
      icon: Building2,
      color: 'bg-purple-100 text-purple-600',
      link: 'https://www.nitj.ac.in/'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                <GraduationCap className="h-8 w-8 text-indigo-600 mr-3" />
                Welcome back, {userData?.name}
              </h1>
              <p className="mt-1 text-gray-500">
                Access your alumni dashboard and stay connected
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleDownloadCertificate}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <Download className="h-4 w-4 mr-2" />
                Download Certificate
              </button>
              <Link
                to="/request"
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <Mail className="h-4 w-4 mr-2" />
                New Request
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div 
              key={index}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all"
            >
              <div className="flex items-center">
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                </div>
              </div>
              <p className="mt-2 text-sm text-gray-600">{stat.description}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
              </div>
              <div className="divide-y divide-gray-100">
                {quickActions.map((action, index) => (
                  <Link
                    key={index}
                    to={action.link}
                    className="flex items-center p-6 hover:bg-gray-50 transition-colors"
                  >
                    <div className={`p-3 rounded-lg ${action.color}`}>
                      <action.icon className="h-6 w-6" />
                    </div>
                    <div className="ml-4 flex-1">
                      <h3 className="text-sm font-medium text-gray-900">
                        {action.title}
                      </h3>
                      <p className="text-sm text-gray-500">{action.description}</p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div>
           

            {/* Resources */}
            <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900">Resources</h2>
              </div>
              <div className="divide-y divide-gray-100">
                {resources.map((resource, index) => (
                  <a
                    key={index}
                    href={resource.link}
                    className="flex items-center p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className={`p-2 rounded-lg ${resource.color}`}>
                      <resource.icon className="h-5 w-5" />
                    </div>
                    <span className="ml-3 text-sm font-medium text-gray-900">
                      {resource.title}
                    </span>
                    <ChevronRight className="ml-auto h-5 w-5 text-gray-400" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;