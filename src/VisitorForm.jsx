import React, { useState, useEffect, useRef } from 'react';
import Webcam from 'react-webcam';
import { Camera, ArrowRight, CheckCircle, X, AlertCircle, Calendar, Hash, User, MapPin, Briefcase, Phone, Mail, Users, MessageSquare, RefreshCw, Search } from 'lucide-react';
import image1 from './assets/LOGO_KRISTELLAR_WHITE.png'; // Replace with your logo path
import './VisitorForm.css'; // Import your CSS file for styles
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AnalogClock from './AnalogClock';

export default function VisitorForm() {
  const navigate = useNavigate();
  const webcamRef = useRef(null);
  const [photoTaken, setPhotoTaken] = useState(false);
  const [photoData, setPhotoData] = useState(null);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [submitAnimation, setSubmitAnimation] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [formErrors1, setFormErrors1] = useState({phone: "", otp: "", 
  });
  const [showOtpButton, setShowOtpButton] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [autoFilledFields, setAutoFilledFields] = useState([]);
  const [searchError, setSearchError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [photoError, setPhotoError] = useState('');
  
  const [formData, setFormData] = useState({
    dateTime: formatDateTime(new Date()),
    slNumber: 1,
    name: '',
    address: '',
    designation: '',
    phone: '',
    email: '',
    personToMeet: '',
    purpose: '',
    photo: null,
    pincode: '', // New field
    device: '',  // New field
  });

  function formatDateTime(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    
    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
  }

  // New function to extract readable date (without time)
  function formatReadableDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  useEffect(() => {    
    // Update date and time every minute
    const interval = setInterval(() => {
      setFormData(prev => ({ ...prev, dateTime: formatDateTime(new Date()) }));
    }, 1000);
    
    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    navigator.mediaDevices.enumerateDevices().then((devices) => {
      const videoDevices = devices.filter((device) => device.kind === "videoinput");
      const externalCamera = videoDevices.find((device) =>
        device.label.toLowerCase().includes("logitech") // Adjust as needed
      );
 
      if (externalCamera) {
        setVideoConstraints({
          deviceId: externalCamera.deviceId,
          width: 1280,
          height: 720,
        });
      }
    });
  }, []);

  const startCamera = () => {
    setShowCamera(true);
  };

  const stopCamera = () => {
    setShowCamera(false);
  };

  const capturePhoto = async () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      setPhotoData(imageSrc);
      setFormData(prev => ({ ...prev, photo: imageSrc }));
      setPhotoTaken(true);
      stopCamera();
    }
  };

  const resetPhoto = () => {
    setPhotoData(null);
    setPhotoTaken(false);
    setFormData(prev => ({ ...prev, photo: null }));
  };

  const handleSendOTP = async () => {
    try {
      const response = await fetch('https://ivms.local/api/otp/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: formData.phone }),
      });

      const data = await response.json();

      if (response.ok) {
        setOtpSent(true);
        setShowOtpModal(true);
        setFormErrors({ ...formErrors, phone: "" });
        console.log('OTP sent to:', formData.phone);
      } else {
        setFormErrors1({ ...formErrors1, otp: data.error || "Failed to send OTP" });
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      setFormErrors1({ ...formErrors1, otp: "Network error while sending OTP" });
    }
  };

  const handleResendOTP = async () => {
  try {
    const response = await fetch('https://ivms.local/api/otp/resend-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: formData.phone }), // Send the phone number to the backend
    });

    const data = await response.json();

    if (response.ok) {
      setOtpSent(true);
      setShowOtpModal(true);
      setFormErrors1({ ...formErrors1, otp: "" });
      console.log('OTP resent to:', formData.phone);
    } else {
      setFormErrors1({ ...formErrors1, otp: data.error || "Failed to resend OTP" });
    }
  } catch (error) {
    console.error("Error resending OTP:", error);
    setFormErrors1({ ...formErrors1, otp: "Network error while resending OTP" });
  }
};

  const handleVerifyOTP = async () => {
    if (formData.otp.length !== 6) {
      setFormErrors1({ ...formErrors1, otp: "Please enter a 6-digit OTP" });
      return;
    }

    setIsVerifying(true);
    try {
      const response = await fetch('https://ivms.local/api/otp/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: formData.phone, otp: formData.otp }),
      });

      const data = await response.json();

      if (response.ok) {
        setOtpVerified(true);
        setFormErrors1({ ...formErrors1, otp: "" });
        setTimeout(() => setShowOtpModal(false), 1000);
      } else {
        setFormErrors1({ ...formErrors1, otp: data.error || "Invalid OTP" });
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      setFormErrors1({ ...formErrors1, otp: "Network error during verification" });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (name === "name") {
    // Allow only alphabets and spaces
    const alphabetRegex = /^[a-zA-Z\s]*$/;
    if (alphabetRegex.test(value)) {
      setFormData((prev) => ({ ...prev, [name]: value }));
      if (formErrors[name]) {
        setFormErrors((prev) => ({ ...prev, [name]: null }));
      }
    } else {
      setFormErrors((prev) => ({
        ...prev,
        name: "Name can only contain alphabets and spaces",
      }));
    }
  } else if (name === "phone") {
      const phoneDigits = value.replace(/\D/g, ""); // Remove non-numeric characters

      if (phoneDigits.length <= 10) {
        setFormData((prev) => ({ ...prev, phone: phoneDigits }));

        if (phoneDigits.length === 10 && autoFilledFields.length === 0) {
          setShowOtpButton(true);
          setFormErrors1((prev) => ({ ...prev, phone: "" }));
        } else {
          setShowOtpButton(false);
          if (phoneDigits.length > 0) {
            setFormErrors1((prev) => ({
              ...prev,
              phone: "Phone number must be exactly 10 digits",
            }));
          }
        }
      }
    } else if (name === "otp") {
      const otpDigits = value.replace(/\D/g, "");
      if (otpDigits.length <= 6) {
        setFormData(prev => ({ ...prev, [name]: otpDigits }));
      }
    } else if (name === "pincode") {
      const pincodeDigits = value.replace(/\D/g, ""); // Remove non-numeric characters
      if (pincodeDigits.length <= 6) {
        setFormData((prev) => ({ ...prev, pincode: pincodeDigits }));
        if (formErrors.pincode) {
          setFormErrors((prev) => ({ ...prev, pincode: null }));
        }
      } 
    }else {
      setFormData(prev => ({ ...prev, [name]: value }));
      if (formErrors[name]) {
        setFormErrors(prev => ({ ...prev, [name]: null }));
      }
    }
  };

  const validateForm = () => {
    const errors = {};
  
    if (!formData.name.trim()) errors.name = "Name is required";
    if (!formData.address.trim()) errors.address = "Address is required";
    if (!formData.designation.trim()) errors.designation = "Designation is required";
  
    if (!formData.phone.trim()) {
      errors.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(formData.phone)) {
      errors.phone = "Please enter a valid 10-digit phone number";
    }
  
    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Please enter a valid email address";
    }
  
    if (!formData.personToMeet.trim()) errors.personToMeet = "Person to meet is required";
    if (!formData.purpose.trim()) errors.purpose = "Purpose of visit is required";
    if (!formData.photo) errors.photo = "Please take a photo";
  
    if (!formData.pincode.trim()) {
      errors.pincode = "Pincode is required";
    } else if (!/^\d{6}$/.test(formData.pincode)) {
      errors.pincode = "Please enter a valid 6-digit pincode";
    }
  
    if (!formData.device.trim()) errors.device = "Device is required";
  
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Check if OTP is verified
    if (autoFilledFields.length === 0 && !otpVerified) {
      setFormErrors1((prev) => ({
        ...prev,
        otp: "Please verify the OTP before submitting the form",
      }));
      return;
    }
    
    if (validateForm()) {
      //console.log("Form submitted:", formData);

      fetch('https://ivms.local/api/visitors/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })
      .then(res => {
        if (!res.ok) throw new Error("Failed to submit");
        return res.json();
      })
      .then(data => {
        console.log('Submitted successfully:', data);
      })
      .catch(err => {
        console.error('Submission error:', err);
      });

      
      // Animate the submit button
      setSubmitAnimation(true);
      
      // Show success message
      setTimeout(() => {
        setFormSubmitted(true);
        
        // Reset form after 3 seconds
        setTimeout(() => {
          navigate("/select");
        }, 3000);
      }, 1000);
    } else {
      console.log("Form has errors");
    }
  };

  const fetchVisitor = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`https://ivms.local/api/visitors/search?query=${searchQuery}`);
      const visitor = response.data;

      if (!visitor) {
        setSearchError('No visitor found with this phone number or email.');
        setAutoFilledFields([]);
        return;
      }
  
      setFormData((prevData) => ({
        ...prevData,
        name: visitor.name || '',
        email: visitor.email || '',
        phone: visitor.phone || '',
        address: visitor.address || '',
        designation: visitor.designation || '',
        pincode: visitor.pincode || '',
        // add more fields as needed
      }));
  
      setAutoFilledFields(['name', 'email', 'phone', 'address', 'designation', 'pincode']); // dynamically include the fields you autofill
      setSearchError('');
      setOtpVerified(true); 
    } catch (error) {
      console.error("Error searching visitor:", error);
      setSearchError('No visitor found with this phone number or email.');
      setAutoFilledFields([]); // clear autofilled indicators if no match
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  const checkExistingVisitor = async () => {
    if (!photoData) {
      setPhotoError('Please capture a photo before checking for an existing visitor.');
      return;
    }
    setPhotoError('');
    setIsLoading(true);
    try{
      const res = await fetch("https://ivms.local/api/face/match-face", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: photoData }),
      });
      const data = await res.json();
      if (data.success) {
        const { name, address, phone, email, designation, pincode } = data.details;
      setFormData((prev) => ({
        ...prev,
        name,
        address,
        phone,
        email,
        designation,
        pincode,
      }));
      // alert("Visitor recognized and form autofilled!");
      setAutoFilledFields(['name', 'email', 'phone', 'address', 'designation', 'pincode']);
      setOtpVerified(true); 
      } else {
        alert("No match found.");
      }
    }catch (error) {
      console.error("Face match error:", error);
    } finally {
      setIsLoading(false);
    }
  };


  const [videoConstraints, setVideoConstraints] = useState({
    width: 1280,
    height: 720,
    facingMode: "user", // default fallback
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 p-4 sm:p-6 md:p-8 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
            <div className="absolute top-0 left-0 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float-slow"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
            <div className="absolute top-1/2 left-1/4 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-float-delay"></div>
        </div>

        {isLoading && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/40 flex items-center justify-center z-50">
          <div className="relative">
            {/* Outer spinning ring */}
            <div className="w-24 h-24 rounded-full border-4 border-t-transparent border-blue-300 animate-spin"></div>
            
            {/* Middle spinning ring */}
            <div className="absolute top-2 left-2 w-20 h-20 rounded-full border-4 border-r-transparent border-indigo-400 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
            
            {/* Inner gradient circle with pulse effect */}
            <div className="absolute top-4 left-4 w-16 h-16 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 animate-pulse flex items-center justify-center">
              <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm"></div>
            </div>
            
            {/* Flowing gradient background */}
            <div className="absolute -inset-8 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 rounded-full opacity-20 animate-pulse" style={{ animationDuration: '2s' }}></div>
          </div>
        </div>
      )}

        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden relative z-10 transform transition-all duration-500 hover:shadow-3xl animate-rise">
            {/* Header with Logo */}
            <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 p-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
            <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center space-x-4">
                {/* Logo with animation */}
                <div className="rounded-lg overflow-hidden shadow-lg transform transition-all duration-500 hover:scale-105 hover:rotate-1">
                    <img src={image1} alt="Logo" className="h-20 w-40 object-contain" />
                </div>
                <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight animate-text-glow text-center">
                    VISITOR DETAILS
                </h1>
                </div>
                <div className="text-white text-sm md:text-base font-medium px-4 py-2 rounded-full animate-pulse-subtle flex items-center gap-4">
                  <span>{formatReadableDate(formData.dateTime)}</span>
                  <AnalogClock dateTime={formData.dateTime} />
                </div>
            </div>
            </div>
            
            {/* Form */}
            <div className="p-6 md:p-8 bg-gradient-to-b from-white to-gray-50">
            {formSubmitted ? (
                <div className="text-center py-16 animate-success-fade-in">
                <div className="inline-block animate-success-bounce mb-4">
                    <CheckCircle className="h-20 w-20 text-green-500" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-3 animate-success-slide-up">Visitor Registered Successfully!</h2>
                <p className="text-gray-600 animate-success-fade-in-delay">Thank you for registering. Please proceed to the reception.</p>
                <div className="mt-8 flex justify-center">
                    <button
                    onClick={() => window.location.reload()}
                    className="px-6 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-full font-medium shadow-md hover:shadow-lg transform transition-all duration-300 hover:scale-105 flex items-center space-x-2 animate-success-fade-in-delay-2"
                    >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    New Registration
                    </button>
                </div>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex gap-4 transition-all duration-300 hover:shadow-lg p-4 rounded-xl border border-gray-100 bg-white/80 backdrop-blur-sm md:col-span-2 animate-fade-in-up" style={{ animationDelay: '0.9s' }}>
                      {/* Search Section */}
                      <div className="w-1/2">
                        <label className="block text-sm font-medium text-gray-700 mb-4">Search</label>
                        <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                          <input
                            type="text"
                            placeholder="Search by Phone Number or Email ID..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onBlur={() => {
                              const phoneRegex = /^\d{10}$/; // Regex for 10-digit phone number
                              const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Regex for valid email address

                              if (!phoneRegex.test(searchQuery) && !emailRegex.test(searchQuery)) {
                                setSearchError('Please enter a valid 10-digit phone number or email ID.');
                              } else {
                                setSearchError('');
                              }
                            }}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                const phoneRegex = /^\d{10}$/;
                                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

                                if (!phoneRegex.test(searchQuery) && !emailRegex.test(searchQuery)) {
                                  setSearchError('Please enter a valid 10-digit phone number or email ID.');
                                } else {
                                  setSearchError('');
                                  fetchVisitor();
                                }
                              }
                            }}
                            className="w-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          <button
                            onClick={() => {
                              const phoneRegex = /^\d{10}$/;
                              const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

                              if (!phoneRegex.test(searchQuery) && !emailRegex.test(searchQuery)) {
                                setSearchError('Please enter a valid 10-digit phone number or email ID.');
                              } else {
                                setSearchError('');
                                fetchVisitor();
                              }
                            }}
                            className="p-2 text-blue-500 hover:text-blue-700 focus:outline-none"
                          >
                            <Search className="h-5 w-5" />
                          </button>
                        </div>
                        {searchError && (
                          <p className="mt-2 text-sm text-red-500 flex items-center animate-shake">
                            <AlertCircle className="h-4 w-4 mr-1" />
                            {searchError}
                          </p>
                        )}
                      </div>

                      {/* Take Photo Section */}
                      <div className="w-1/2 flex flex-col items-center justify-center">
                      <label className="block self-start text-sm font-medium text-gray-700 mb-3">Photograph *</label>
                        <div className="flex items-center justify-center w-full ">
                        {showCamera ? (
                          <div className="relative">
                            <Webcam
                              audio={false}
                              ref={webcamRef}
                              screenshotFormat="image/jpeg"
                              videoConstraints={videoConstraints}
                              className="w-64 h-48 bg-gray-100 rounded-lg"
                            />
                            <button
                              type="button"
                              onClick={capturePhoto}
                              className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white rounded-full p-3 hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl animate-bounce-subtle"
                            >
                              <Camera className="h-6 w-6" />
                            </button>
                          </div>
                        ) : photoTaken && photoData ? (
                          <div className="relative">
                            <img src={photoData} alt="Captured" className="w-64 h-48 object-cover rounded-lg" />
                            <button
                              type="button"
                              onClick={resetPhoto}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors shadow-md hover:shadow-lg transform hover:scale-110 transition-all"
                            >
                              <X className="h-4 w-4" />
                            </button>
                            <div className='flex justify-center'>
                            <button
                              type="button"
                              onClick={checkExistingVisitor}
                              className="mt-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                            >
                              Check Existing Visitor
                            </button>
                            </div>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={startCamera}
                            className="flex items-center w-full align-center justify-center bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-5 py-3 rounded-full hover:shadow-lg transform transition-all duration-300 hover:scale-105 animate-pulse-subtle"
                          >
                            <Camera className="h-5 w-5 mr-2" />
                            Take Photo
                          </button>
                        )}
                        </div>
                        {formErrors.photo && !autoFilledFields.includes('photo') && !searchError && (
                        <p className="mt-2 text-sm text-red-500 flex self-start items-center animate-shake">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {formErrors.photo}
                        </p>
                    )}
                      </div>
                    </div>

                    {/* Name */}
                    <div className="transition-all duration-300 hover:shadow-lg p-4 rounded-xl border border-gray-100 bg-white/80 backdrop-blur-sm animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                    <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500 h-5 w-5" />
                        <input
                          type="text"
                          name="name"
                          maxLength={30}
                          value={formData.name}
                          onChange={handleInputChange}
                          className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 transition-all duration-300
                            ${!searchError && formErrors.name && !autoFilledFields.includes('name')  ? 'border-red-500 bg-red-50' :
                              autoFilledFields.includes('name') ? 'border-yellow-400 bg-yellow-50' :
                              'border-gray-200'
                            }
                          `}
                          placeholder="Enter your full name"
                        />

                    </div>
                    {formErrors.name && !autoFilledFields.includes('name') && !searchError && (
                        <p className="mt-2 text-sm text-red-500 flex items-center animate-shake">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {formErrors.name}
                        </p>
                    )}
                    </div>
                    
                    {/* designation */}
                    <div className="transition-all duration-300 hover:shadow-lg p-4 rounded-xl border border-gray-100 bg-white/80 backdrop-blur-sm animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Designation *</label>
                    <div className="relative">
                        <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500 h-5 w-5" />
                        <input
                        type="text"
                        name="designation"
                        maxLength={30}
                        value={formData.designation}
                        onChange={handleInputChange}
                        className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 ${
                            !searchError && formErrors.designation && !autoFilledFields.includes('designation') ? 'border-red-500 bg-red-50' :
                              autoFilledFields.includes('designation') ? 'border-yellow-400 bg-yellow-50' :
                              'border-gray-200'
                        }`}
                        placeholder="Enter your designation"
                        />
                    </div>
                    {formErrors.designation && !autoFilledFields.includes('designation') && !searchError &&  (
                        <p className="mt-2 text-sm text-red-500 flex items-center animate-shake">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {formErrors.designation}
                        </p>
                    )}
                    </div>
                    
                    {/* Address */}
                    <div className="transition-all duration-300 hover:shadow-lg p-4 rounded-xl border border-gray-100 bg-white/80 backdrop-blur-sm animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address *</label>
                    <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500 h-5 w-5" />
                        <input
                        type="text"
                        name="address"
                        maxLength={100}
                        value={formData.address}
                        onChange={handleInputChange}
                        className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 ${
                            !searchError && formErrors.address && !autoFilledFields.includes('address') ? 'border-red-500 bg-red-50' :
                              autoFilledFields.includes('address') ? 'border-yellow-400 bg-yellow-50' :
                              'border-gray-200'
                        }`}
                        placeholder="Enter your address"
                        />
                    </div>
                    {formErrors.address && !autoFilledFields.includes('address') && !searchError && (
                        <p className="mt-2 text-sm text-red-500 flex items-center animate-shake">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {formErrors.address}
                        </p>
                    )}
                    </div>

                    {/* Pincode */}
                    <div className="transition-all duration-300 hover:shadow-lg p-4 rounded-xl border border-gray-100 bg-white/80 backdrop-blur-sm animate-fade-in-up" style={{ animationDelay: '0.9s' }}>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Pincode *</label>
                      <div className="relative">
                        <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500 h-5 w-5" />
                        <input
                          type="text"
                          name="pincode"
                          maxLength={6}
                          value={formData.pincode || ''}
                          onChange={handleInputChange}
                          className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 ${
                            !searchError && formErrors.pincode && !autoFilledFields.includes('pincode') ? 'border-red-500 bg-red-50' :
                              autoFilledFields.includes('pincode') ? 'border-yellow-400 bg-yellow-50' :
                              'border-gray-200'
                          }`}
                          placeholder="Enter 6-digit pincode"
                        />
                      </div>
                      {formErrors.pincode && !autoFilledFields.includes('pincode') && !searchError && (
                        <p className="mt-2 text-sm text-red-500 flex items-center animate-shake">
                          <AlertCircle className="h-4 w-4 mr-1" />
                          {formErrors.pincode}
                        </p>
                      )}
                    </div>
                    
                    {/* Phone */}
                    <div>
                      <div
                        className="transition-all duration-300 hover:shadow-lg p-4 rounded-xl border border-gray-100 bg-white/80 backdrop-blur-sm animate-fade-in-up"
                        style={{ animationDelay: "0.6s" }}
                      >
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Phone Number *
                        </label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500 h-5 w-5" />
                          <input
                            type="tel"
                            name="phone"
                            maxLength={10}
                            value={formData.phone}
                            onChange={handleInputChange}
                            className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 ${
                              !searchError && formErrors.phone && !autoFilledFields.includes('phone') ? 'border-red-500 bg-red-50' :
                              autoFilledFields.includes('phone') ? 'border-yellow-400 bg-yellow-50' :
                              'border-gray-200'
                            }`}
                            placeholder="Enter your phone number"
                          />
                        </div>
                        {formErrors.phone && !autoFilledFields.includes('phone') && !searchError && (
                          <p className="mt-2 text-sm text-red-500 flex items-center animate-shake">
                            <AlertCircle className="h-4 w-4 mr-1" />
                            {formErrors.phone}
                          </p>
                        )}
                      </div>
    
                      {showOtpButton && autoFilledFields.length === 0 && (
                        <div>
                        <button
                          type='button'
                          onClick={handleSendOTP}
                          className={`mt-3 w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-all duration-300 ${
                            otpVerified ? "bg-green-500 hover:bg-green-600" : ""
                          }`}
                          disabled={otpVerified}
                        >
                          {otpVerified ? "Phone Verified ✓" : "Send OTP"}
                        </button>
                        {formErrors1.otp && !otpVerified && (
                          <p className="mt-1 text-sm text-red-500 flex items-center">
                            <AlertCircle className="h-4 w-4 mr-1" />
                            {formErrors1.otp}
                          </p>
                        )}
                        </div>
                      )}
                    </div>
                    
                    {/* Email */}
                    <div className="transition-all duration-300 hover:shadow-lg p-4 rounded-xl border border-gray-100 bg-white/80 backdrop-blur-sm animate-fade-in-up" style={{ animationDelay: '0.7s' }}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500 h-5 w-5" />
                        <input
                        type="email"
                        name="email"
                        maxLength={40}
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 ${
                            !searchError && formErrors.email && !autoFilledFields.includes('email') ? 'border-red-500 bg-red-50' :
                              autoFilledFields.includes('email') ? 'border-yellow-400 bg-yellow-50' :
                              'border-gray-200'
                        }`}
                        placeholder="Enter your email address"
                        />
                    </div>
                    {formErrors.email && !autoFilledFields.includes('email') && !searchError && (
                        <p className="mt-2 text-sm text-red-500 flex items-center animate-shake">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {formErrors.email}
                        </p>
                    )}
                    </div>
                    
                    {/* Person to Meet */}
                    <div className="transition-all duration-300 hover:shadow-lg p-4 rounded-xl border border-gray-100 bg-white/80 backdrop-blur-sm animate-fade-in-up" style={{ animationDelay: '0.8s' }}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Person to Meet *</label>
                    <div className="relative">
                        <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500 h-5 w-5" />
                        <input
                        type="text"
                        name="personToMeet"
                        maxLength={20}
                        value={formData.personToMeet}
                        onChange={handleInputChange}
                        className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 ${
                            !searchError && formErrors.email && !autoFilledFields.includes('name') ? 'border-red-500 bg-red-50' :
                              autoFilledFields.includes('') ? 'border-yellow-400 bg-yellow-50' :
                              'border-gray-200'
                        }`}
                        placeholder="Enter person's name"
                        />
                    </div>
                    {formErrors.personToMeet && (
                        <p className="mt-2 text-sm text-red-500 flex items-center animate-shake">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {formErrors.personToMeet}
                        </p>
                    )}
                    </div>

                    {/* Device */}
                    <div className="transition-all duration-300 hover:shadow-lg p-4 rounded-xl border border-gray-100 bg-white/80 backdrop-blur-sm animate-fade-in-up" style={{ animationDelay: '1s' }}>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Device *</label>
                      <div className="relative">
                        <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500 h-5 w-5" />
                        <input
                          type="text"
                          name="device"
                          maxLength={50}
                          value={formData.device || ''}
                          onChange={handleInputChange}
                          className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 ${
                            formErrors.device ? 'border-red-500 bg-red-50' : 'border-gray-200'
                          }`}
                          placeholder="Enter device name"
                        />
                      </div>
                      {formErrors.device && (
                        <p className="mt-2 text-sm text-red-500 flex items-center animate-shake">
                          <AlertCircle className="h-4 w-4 mr-1" />
                          {formErrors.device}
                        </p>
                      )}
                    </div>
                    
                    {/* Purpose */}
                    <div className="transition-all duration-300 hover:shadow-lg p-4 rounded-xl border border-gray-100 bg-white/80 backdrop-blur-sm md:col-span-2 animate-fade-in-up" style={{ animationDelay: '0.9s' }}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Purpose of Visit *</label>
                    <div className="relative">
                        <MessageSquare className="absolute left-3 top-3 text-blue-500 h-5 w-5" />
                        <textarea
                        name="purpose"
                        maxLength={100}
                        value={formData.purpose}
                        onChange={handleInputChange}
                        rows="3"
                        className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 ${
                            !searchError && formErrors.email && !autoFilledFields.includes('name') ? 'border-red-500 bg-red-50' :
                              autoFilledFields.includes('') ? 'border-yellow-400 bg-yellow-50' :
                              'border-gray-200'
                        }`}
                        placeholder="Describe the purpose of your visit"
                        ></textarea>
                    </div>
                    {formErrors.purpose &&  (
                        <p className="mt-2 text-sm text-red-500 flex items-center animate-shake">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {formErrors.purpose}
                        </p>
                    )}
                    </div>
                </div>
                
                {/* Submit Button */}
                <div className="flex justify-center pt-6 animate-fade-in-up" style={{ animationDelay: '1.1s' }}>
                    <button
                    type="submit"
                    className={`relative overflow-hidden flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 text-white font-medium rounded-full shadow-md hover:shadow-xl transform transition-all duration-500 ${
                        submitAnimation ? 'animate-pulse scale-105' : 'hover:scale-105'
                    }`}
                    >
                    <span className="absolute inset-0 bg-gradient-to-r from-blue-400/20 via-transparent to-transparent w-1/3 skew-x-12 animate-shimmer"></span>
                    <span className="relative flex items-center">
                        Submit
                        <ArrowRight className="ml-2 h-5 w-5 animate-bounce-x" />
                    </span>
                    </button>
                </div>
                </form>
            )}
            </div>
            
            {/* Footer */}
            <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 text-center border-t border-gray-200">
            <p className="text-sm text-gray-600 flex items-center justify-center">
                {/* <Shield className="h-4 w-4 mr-2 text-blue-500" /> */}
                © 2021 Kristellar Aerospace. All rights reserved.
            </p>
            </div>
            
        </div>

        {/* OTP Modal */}
        {showOtpModal && autoFilledFields.length === 0 && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl p-6 max-w-md w-full animate-fade-in-up">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Verify Phone Number
                </h3>
                <button
                  onClick={() => setShowOtpModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
  
              <p className="text-sm text-gray-600 mb-4">
                We've sent a 6-digit OTP to {formData.phone}. Please enter it
                below to verify your phone number.
              </p>
  
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Enter OTP
                </label>
                <input
                  type="text"
                  name="otp"
                  value={formData.otp}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 ${
                    formErrors1.otp
                      ? "border-red-500 bg-red-50"
                      : "border-gray-200"
                  }`}
                  placeholder="Enter 6-digit OTP"
                  maxLength="6"
                />
                {formErrors1.otp && (
                  <p className="mt-1 text-sm text-red-500 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {formErrors1.otp}
                  </p>
                )}
              </div>
  
              <button
                type='button'
                onClick={handleVerifyOTP}
                disabled={isVerifying || otpVerified}
                className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-all duration-300 ${
                  otpVerified
                    ? "bg-green-500"
                    : isVerifying
                    ? "bg-blue-400 cursor-not-allowed"
                    : "bg-blue-500 hover:bg-blue-600"
                }`}
              >
                {otpVerified
                  ? "Verified Successfully ✓"
                  : isVerifying
                  ? "Verifying..."
                  : "Verify OTP"}
              </button>
  
              {otpSent && !otpVerified && (
                <button
                  onClick={handleResendOTP}
                  className="w-full mt-2 py-2 px-4 rounded-lg font-medium text-blue-600 bg-transparent hover:bg-blue-50 transition-all duration-300"
                >
                  Resend OTP
                </button>
              )}
            </div>
          </div>
        )}

        

    </div>
  );
}