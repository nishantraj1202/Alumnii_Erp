import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, FileText } from 'lucide-react';
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
  placementDetails?: string;
  futurePlans?: string;
  higherStudiesDetails?: string;
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
  };

  const filteredRequests = requests.filter(request => 
    filterStatus === 'all' ? true : request.status === filterStatus
  );

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <h1 className="text-xl font-semibold text-gray-800">Admin Dashboard</h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
          >
            Logout
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <div className="mb-6 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="p-2 border rounded bg-white"
            >
              <option value="all">All Requests</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
            <span className="text-sm text-gray-500">
              Showing {filteredRequests.length} requests
            </span>
          </div>
        </div>

        {filteredRequests.length === 0 ? (
          <div className="text-center py-12 bg-white rounded shadow">
            <FileText className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900">No requests found</h3>
            <p className="text-gray-500">No requests match your current filter.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredRequests.map((request) => (
              <div key={request._id} className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-medium">{request.name}</h3>
                    <p className="text-sm text-gray-500">{request.email}</p>
                    <p className="text-sm text-gray-500">
                      Submitted on {new Date(request.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {request.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleUpdateStatus(request._id, 'approved')}
                          disabled={updateLoading === request._id}
                          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
                        >
                          <span className="flex items-center">
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Approve
                          </span>
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(request._id, 'rejected')}
                          disabled={updateLoading === request._id}
                          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
                        >
                          <span className="flex items-center">
                            <XCircle className="w-4 h-4 mr-2" />
                            Reject
                          </span>
                        </button>
                      </>
                    )}
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium capitalize
                        ${request.status === 'approved' ? 'bg-green-100 text-green-800' : 
                          request.status === 'rejected' ? 'bg-red-100 text-red-800' : 
                          'bg-yellow-100 text-yellow-800'}`}
                    >
                      {request.status}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Branch</label>
                    <p className="text-sm">{request.branch}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Roll Number</label>
                    <p className="text-sm">{request.rollNo}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Contact</label>
                    <p className="text-sm">{request.mobileNo}</p>
                    {request.alternativeNo && (
                      <p className="text-sm text-gray-500">Alt: {request.alternativeNo}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Email</label>
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
                        <label className="text-sm font-medium text-gray-500">Placement Details</label>
                        <p className="text-sm">{request.placementDetails}</p>
                      </div>
                    )}
                    {request.futurePlans && (
                      <div>
                        <label className="text-sm font-medium text-gray-500">Future Plans</label>
                        <p className="text-sm">{request.futurePlans}</p>
                        {request.higherStudiesDetails && (
                          <p className="text-sm mt-2">{request.higherStudiesDetails}</p>
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