import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, FileText, LogOut, Menu, Filter } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface Request {
  _id: string;
  userId: {
    name: string;
    email: string;
  };
  name: string;
  branch: string;
  rollNo: string;
  mobileNo: string;
  alternativeNo?: string;
  email: string;
  alternativeEmail?: string;
  placed?: boolean;
  placementDetails?: {
    companyName: string;
    package: string;
    city: string;
  };
  futurePlans?: string;
  higherStudiesDetails?: {
    exam: string;
    country: string;
    course: string;
    university: string;
  };
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

const AdminDashboard = () => {
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updateLoading, setUpdateLoading] = useState<string | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRequests();
  }, [navigate]);

  const fetchRequests = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await axios.get('https://alumnii-erp.onrender.com/requests/admin-requests', {
        headers: { Authorization: `Bearer ${token}` }
      });

      setRequests(response.data);
      setError(null);
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRequestDetails = async (requestId: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`https://alumnii-erp.onrender.com/requests/${requestId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSelectedRequest(response.data.requestDetails);
    } catch (error) {
      handleError(error);
    }
  };

  const handleError = (error: any) => {
    const errorMessage = axios.isAxiosError(error)
      ? error.response?.data?.message || 'An error occurred'
      : 'An error occurred';
    setError(errorMessage);
    
    if (axios.isAxiosError(error) && error.response?.status === 403) {
      navigate('/login');
    }
  };

  const handleUpdateStatus = async (requestId: string, newStatus: 'approved' | 'rejected') => {
    setUpdateLoading(requestId);
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `https://alumnii-erp.onrender.com/requests/${requestId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` }}
      );

      setRequests(prevRequests => 
        prevRequests.map(request => 
          request._id === requestId 
            ? { ...request, status: newStatus }
            : request
        )
      );
      setError(null);
    } catch (error) {
      handleError(error);
    } finally {
      setUpdateLoading(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
    setMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const filteredRequests = requests.filter(request => 
    filterStatus === 'all' ? true : request.status === filterStatus
  );

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 border-t-2 border-blue-500 rounded-full animate-spin"></div>
          <div className="text-lg">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with responsive navigation */}
      <nav className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-semibold text-gray-800">Admin Dashboard</h1>
            
            {/* Desktop navigation */}
            <div className="hidden md:block">
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md flex items-center"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </button>
            </div>
            
            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={toggleMobileMenu}
                className="p-2 rounded-md text-gray-700 hover:bg-gray-100"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white shadow-lg border-t">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md flex items-center"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </button>
            </div>
          </div>
        )}
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md flex items-start">
            <XCircle className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Filters section */}
        <div className="mb-6 bg-white rounded-lg shadow-sm p-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center space-x-2 w-full sm:w-auto">
              <Filter className="w-5 h-5 text-gray-500" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="p-2 border rounded-md bg-white flex-grow sm:flex-grow-0"
              >
                <option value="all">All Requests</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
            <span className="text-sm text-gray-500">
              Showing {filteredRequests.length} requests
            </span>
          </div>
        </div>

        {filteredRequests.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <FileText className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900">No requests found</h3>
            <p className="text-gray-500">No requests match your current filter.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredRequests.map((request) => (
              <div key={request._id} className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4 mb-4">
                  <div>
                    <h3 className="text-lg font-medium">{request.name}</h3>
                    <p className="text-sm text-gray-500">{request.email}</p>
                    <p className="text-sm text-gray-500">
                      Submitted on {new Date(request.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 self-end sm:self-start">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium capitalize
                        ${request.status === 'approved' ? 'bg-green-100 text-green-800' : 
                          request.status === 'rejected' ? 'bg-red-100 text-red-800' : 
                          'bg-yellow-100 text-yellow-800'}`}
                    >
                      {request.status}
                    </span>
                    
                    {request.status === 'pending' && (
                      <div className="flex flex-wrap gap-2 mt-2 sm:mt-0">
                        <button
                          onClick={() => handleUpdateStatus(request._id, 'approved')}
                          disabled={updateLoading === request._id}
                          className="px-3 py-1.5 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 text-sm font-medium flex items-center"
                        >
                          <CheckCircle className="w-4 h-4 mr-1.5" />
                          Approve
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(request._id, 'rejected')}
                          disabled={updateLoading === request._id}
                          className="px-3 py-1.5 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 text-sm font-medium flex items-center"
                        >
                          <XCircle className="w-4 h-4 mr-1.5" />
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Branch</label>
                    <p className="text-sm">{request.branch}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Roll Number</label>
                    <p className="text-sm">{request.rollNo}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Contact</label>
                    <p className="text-sm">{request.mobileNo}</p>
                    {request.alternativeNo && (
                      <p className="text-sm text-gray-500">Alt: {request.alternativeNo}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Email</label>
                    <p className="text-sm">{request.email}</p>
                    {request.alternativeEmail && (
                      <p className="text-sm text-gray-500">Alt: {request.alternativeEmail}</p>
                    )}
                  </div>
                </div>

                {(request.placed || request.futurePlans) && (
                  <div className="mt-4 pt-4 border-t">
                    {request.placed && (
                      <div className="mb-4">
                        <label className="text-sm font-medium text-gray-600">Placement Details</label>
                        {request.placementDetails ? (
                          <div className="mt-1">
                            <p className="text-sm">
                              <span className="font-medium">Company:</span> {request.placementDetails.companyName}
                            </p>
                            <p className="text-sm">
                              <span className="font-medium">Package:</span> {request.placementDetails.package}
                            </p>
                            <p className="text-sm">
                              <span className="font-medium">Location:</span> {request.placementDetails.city}
                            </p>
                          </div>
                        ) : (
                          <p className="text-sm text-gray-500">No details provided</p>
                        )}
                      </div>
                    )}
                    {request.futurePlans && (
                      <div>
                        <label className="text-sm font-medium text-gray-600">Future Plans</label>
                        <p className="text-sm">{request.futurePlans}</p>
                        {request.higherStudiesDetails && (
                          <div className="mt-2">
                            <p className="text-sm">
                              <span className="font-medium">Exam:</span> {request.higherStudiesDetails.exam}
                            </p>
                            <p className="text-sm">
                              <span className="font-medium">Country:</span> {request.higherStudiesDetails.country}
                            </p>
                            <p className="text-sm">
                              <span className="font-medium">Course:</span> {request.higherStudiesDetails.course}
                            </p>
                            <p className="text-sm">
                              <span className="font-medium">University:</span> {request.higherStudiesDetails.university}
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;