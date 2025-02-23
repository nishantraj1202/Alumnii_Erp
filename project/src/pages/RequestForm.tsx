import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader, CheckCircle, AlertCircle } from 'lucide-react';
import { generateVerificationForm } from '../lib/utils';

const RequestForm = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const navigate = useNavigate();
  
  const departments = [
    { id: 'CSE', name: 'Computer Science and Engineering' },
    { id: 'ECE', name: 'Electronics and Communication Engineering' },
    { id: 'ME', name: 'Mechanical Engineering' },
    { id: 'CE', name: 'Civil Engineering' },
    { id: 'CHE', name: 'Chemical Engineering' },
    { id: 'BT', name: 'Biotechnology' },
    { id: 'ICE', name: 'Instrumentation and Control Engineering' },
    { id: 'IPE', name: 'Industrial and Production Engineering' },
    { id: 'TT', name: 'Textile Technology' }
  ];

  const [formData, setFormData] = useState({
    name: '',
    rollNo: '', // Added rollNo field
    branch: '',
    batchYear: '',
    mobileNo: '',
    alternativeNo: '',
    email: '',
    alternativeEmail: '',
    placed: 'no',
    companyName: '',
    package: '',
    city: '',
    futurePlans: '',
    higherStudiesType: '',
    foreignCountry: '',
    course: '',
    university: ''
  });

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await fetch('http://localhost:5000/auth/me', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) throw new Error('Failed to fetch user profile');

        const data = await response.json();
        setUser(data.user);
        setFormData(prev => ({
          ...prev,
          name: data.user.name || '',
          email: data.user.email || '',
          branch: data.user.branch || '',
          rollNo: data.user.rollNo || '' // Added rollNo from user data
        }));
      } catch (err) {
        setError('Failed to fetch user profile');
        navigate('/login');
      }
    };

    fetchUserProfile();
  }, [navigate]);
//@ts-ignore
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
//@ts-ignore
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;

    try {
      setLoading(true);
      setError('');

      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/requests/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          rollNo: formData.rollNo // Ensure rollNo is included
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to submit request');
      }

      // Generate verification form
      generateVerificationForm({
        fullName: formData.name,
        rollNumber: formData.rollNo,
        batchYear: formData.batchYear,
        email: formData.email,
        placementStatus: formData.placed === 'yes' ? 'Placed' : 'Not Placed',
        certificateId: `CERT-${Date.now()}`
      });

      navigate('/dashboard', { 
        state: { message: 'Certificate request submitted successfully!' }
      });
      
    } catch (err) {
      //@ts-ignore
      setError(err.message || 'Failed to submit request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {[1, 2].map((step) => (
        <div key={step} className="flex items-center">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            currentStep === step 
              ? 'bg-indigo-600 text-white' 
              : currentStep > step 
                ? 'bg-green-500 text-white'
                : 'bg-gray-200 text-gray-600'
          }`}>
            {currentStep > step ? <CheckCircle className="h-5 w-5" /> : step}
          </div>
          {step < 2 && (
            <div className={`w-20 h-1 ${
              currentStep > step ? 'bg-green-500' : 'bg-gray-200'
            }`} />
          )}
        </div>
      ))}
    </div>
  );

  const validateEmail = (email: string) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };
  
  const validatePhoneNumber = (phone: string) => {
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(phone);
  };
  
  const renderPersonalInfo = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Full Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
  
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Roll Number
          </label>
          <input
            type="text"
            name="rollNo"
            value={formData.rollNo}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Enter your roll number"
          />
        </div>
  
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Branch
          </label>
          <select
            name="branch"
            value={formData.branch}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">Select Branch</option>
            {departments.map(dept => (
              <option key={dept.id} value={dept.id}>
                {dept.name}
              </option>
            ))}
          </select>
        </div>
  
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Batch Year
          </label>
          <input
            type="text"
            name="batchYear"
            value={formData.batchYear}
            onChange={handleChange}
            required
            placeholder="e.g., 2025"
            className="w-full px-4 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
  
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Mobile Number
          </label>
          <input
            type="tel"
            name="mobileNo"
            value={formData.mobileNo}
            onChange={handleChange}
            required
            className={`w-full px-4 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500 ${
              formData.mobileNo && !validatePhoneNumber(formData.mobileNo) ? "border-red-500" : ""
            }`}
          />
          {formData.mobileNo && !validatePhoneNumber(formData.mobileNo) && (
            <p className="text-red-500 text-sm mt-1">Enter a valid 10-digit phone number.</p>
          )}
        </div>
  
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Alternative Number
          </label>
          <input
            type="tel"
            name="alternativeNo"
            value={formData.alternativeNo}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500 ${
              formData.alternativeNo && !validatePhoneNumber(formData.alternativeNo) ? "border-red-500" : ""
            }`}
          />
          {formData.alternativeNo && !validatePhoneNumber(formData.alternativeNo) && (
            <p className="text-red-500 text-sm mt-1">Enter a valid 10-digit phone number.</p>
          )}
        </div>
  
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className={`w-full px-4 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500 ${
              formData.email && !validateEmail(formData.email) ? "border-red-500" : ""
            }`}
          />
          {formData.email && !validateEmail(formData.email) && (
            <p className="text-red-500 text-sm mt-1">Enter a valid email address.</p>
          )}
        </div>
  
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Alternative Email
          </label>
          <input
            type="email"
            name="alternativeEmail"
            value={formData.alternativeEmail}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500 ${
              formData.alternativeEmail && !validateEmail(formData.alternativeEmail) ? "border-red-500" : ""
            }`}
          />
          {formData.alternativeEmail && !validateEmail(formData.alternativeEmail) && (
            <p className="text-red-500 text-sm mt-1">Enter a valid email address.</p>
          )}
        </div>
      </div>
    </div>
  );
  

  const renderPlacementInfo = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Are you placed?
        </label>
        <div className="flex space-x-4">
          <label className="inline-flex items-center">
            <input
              type="radio"
              name="placed"
              value="yes"
              checked={formData.placed === 'yes'}
              onChange={handleChange}
              className="form-radio h-4 w-4 text-indigo-600"
            />
            <span className="ml-2">Yes</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="radio"
              name="placed"
              value="no"
              checked={formData.placed === 'no'}
              onChange={handleChange}
              className="form-radio h-4 w-4 text-indigo-600"
            />
            <span className="ml-2">No</span>
          </label>
        </div>
      </div>

      {formData.placed === 'yes' ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Company Name
            </label>
            <input
              type="text"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Package (LPA)
            </label>
            <input
              type="text"
              name="package"
              value={formData.package}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              City
            </label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Future Plans
            </label>
            <select
              name="futurePlans"
              value={formData.futurePlans}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Select your plan</option>
              <option value="Higher Studies">Higher Studies</option>
              <option value="Off Campus Prep">Off Campus Prep</option>
              <option value="Startup">Startup</option>
            </select>
          </div>

          {formData.futurePlans === 'Higher Studies' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type of Higher Studies
                </label>
                <select
                  name="higherStudiesType"
                  value={formData.higherStudiesType}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">Select type</option>
                  <option value="Foreign Universities">Foreign Universities</option>
                  <option value="Gate Exam">Gate Exam</option>
                </select>
              </div>

              {formData.higherStudiesType === 'Foreign Universities' && (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Country
                    </label>
                    <input
                      type="text"
                      name="foreignCountry"
                      value={formData.foreignCountry}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Course
                    </label>
                    <input
                      type="text"
                      name="course"
                      value={formData.course}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      University
                    </label>
                    <input
                      type="text"
                      name="university"
                      value={formData.university}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
          Certificate Request Form
        </h2>

        {renderStepIndicator()}

        <form onSubmit={handleSubmit} className="space-y-8">
          {currentStep === 1 && renderPersonalInfo()}
          {currentStep === 2 && renderPlacementInfo()}

          {error && (
            <div className="text-red-500 text-sm flex items-center">
              <AlertCircle className="w-5 h-5 mr-2" /> {error}
            </div>
          )}

          <div className="flex justify-between pt-6">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={() => setCurrentStep(prev => prev - 1)}
                className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Back
              </button>
            )}
            
            {currentStep < 2 ? (
              <button
                type="button"
                onClick={() => setCurrentStep(prev => prev + 1)}
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors ml-auto"
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center ml-auto"
              >
                {loading ? (
                  <>
                    <Loader className="animate-spin -ml-1 mr-2 h-5 w-5" />
                    Submitting...
                  </>
                ) : (
                  'Submit Request'
                )}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default RequestForm;