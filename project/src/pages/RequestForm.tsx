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

  const ratingOptions = [
    { value: 'Excellent', label: 'Excellent' },
    { value: 'Very Good', label: 'Very Good' },
    { value: 'Good', label: 'Good' },
    { value: 'Average', label: 'Average' },
    { value: 'Poor', label: 'Poor' }
  ];

  const [formData, setFormData] = useState({
    // Personal Information
    name: '',
    rollNo: '',
    branch: '',
    batchYear: '',
    mobileNo: '',
    alternativeNo: '',
    email: '',
    alternativeEmail: '',
    address: '',
    
    // Placement Information
    placed: 'no',
    companyName: '',
    package: '',
    city: '',
    futurePlans: '',
    higherStudiesType: '',
    foreignCountry: '',
    course: '',
    university: '',
    
    // Feedback Information
    currentDesignation: '',
    opinionAboutNITJ: '',
    proudPoints: '',
    courseRelevance: '',
    facultyRating: 'Good',
    infrastructureRating: 'Good',
    libraryRating: 'Good',
    educationalResourcesRating: 'Good',
    canteenRating: 'Good',
    hostelRating: 'Good',
    grievanceHandlingRating: 'Good',
    overallRating: 'Good'
  });

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await fetch('https://alumnii-erp.onrender.com/auth/me', {
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
          rollNo: data.user.rollNo || ''
        }));
      } catch (err) {
        setError('Failed to fetch user profile');
        navigate('/login');
      }
    };

    fetchUserProfile();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;

    try {
      setLoading(true);
      setError('');

      const token = localStorage.getItem('token');
      const response = await fetch('https://alumnii-erp.onrender.com/requests/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          rollNo: formData.rollNo
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
        state: { message: 'Certificate request and feedback submitted successfully!' }
      });
      
    } catch (err) {
      setError(err.message || 'Failed to submit request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {[1, 2, 3].map((step) => (
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
          {step < 3 && (
            <div className={`w-16 h-1 ${
              currentStep > step ? 'bg-green-500' : 'bg-gray-200'
            }`} />
          )}
        </div>
      ))}
    </div>
  );

  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };
  
  const validatePhoneNumber = (phone) => {
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

        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Address
          </label>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            rows={3}
            className="w-full px-4 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Enter your current address"
          />
        </div>
      </div>
    </div>
  );
  
  const renderPlacementInfo = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Present Occupation/Designation
        </label>
        <input
          type="text"
          name="currentDesignation"
          value={formData.currentDesignation}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="e.g., Software Engineer, Data Scientist, etc."
        />
      </div>

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

  const renderFeedbackForm = () => (
    <div className="space-y-6">
      <div className="border-b pb-4 mb-4">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Alumni Feedback</h3>
        <p className="text-sm text-gray-600">Please provide your feedback to help us evaluate and improve our UG Engineering Programs.</p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Your Opinion About NIT Jalandhar
          </label>
          <textarea
            name="opinionAboutNITJ"
            value={formData.opinionAboutNITJ}
            onChange={handleChange}
            rows={3}
            className="w-full px-4 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Share your thoughts about the institute"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Mention at least five points that make you feel proud to be associated with NIT Jalandhar as Alumni
          </label>
          <textarea
            name="proudPoints"
            value={formData.proudPoints}
            onChange={handleChange}
            rows={4}
            className="w-full px-4 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="List at least five points"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            How do you rate the courses that you have learnt at NIT Jalandhar in relation to your current job/occupation?
          </label>
          <textarea
            name="courseRelevance"
            value={formData.courseRelevance}
            onChange={handleChange}
            rows={3}
            className="w-full px-4 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Describe the relevance of your courses to your current job"
          />
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Quality of Faculty Members
            </label>
            <select
              name="facultyRating"
              value={formData.facultyRating}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            >
              {ratingOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Infrastructure and Lab facilities
            </label>
            <select
              name="infrastructureRating"
              value={formData.infrastructureRating}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            >
              {ratingOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Institute Library Facilities
            </label>
            <select
              name="libraryRating"
              value={formData.libraryRating}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            >
              {ratingOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Educational Resources
            </label>
            <select
              name="educationalResourcesRating"
              value={formData.educationalResourcesRating}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            >
              {ratingOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Canteen Facilities
            </label>
            <select
              name="canteenRating"
              value={formData.canteenRating}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            >
              {ratingOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Hostel Facilities
            </label>
            <select
              name="hostelRating"
              value={formData.hostelRating}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            >
              {ratingOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Institute handles student's grievances properly
            </label>
            <select
              name="grievanceHandlingRating"
              value={formData.grievanceHandlingRating}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            >
              {ratingOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Overall Rating of the NITJ
            </label>
            <select
              name="overallRating"
              value={formData.overallRating}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            >
              {ratingOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
          Certificate Request & Alumni Feedback Form
        </h2>

        {renderStepIndicator()}

        <form onSubmit={handleSubmit} className="space-y-8">
          {currentStep === 1 && renderPersonalInfo()}
          {currentStep === 2 && renderPlacementInfo()}
          {currentStep === 3 && renderFeedbackForm()}

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
            
            {currentStep <= 3 ? (
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