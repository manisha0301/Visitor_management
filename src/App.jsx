import React, { useState, useEffect, useRef } from 'react';
import Webcam from 'react-webcam';
import { Camera, ArrowRight, CheckCircle, X, AlertCircle, Calendar, Hash, User, MapPin, Briefcase, Phone, Mail, Users, MessageSquare, RefreshCw } from 'lucide-react';
import image1 from './assets/LOGO_KRISTELLAR_WHITE.png'; // Replace with your logo path

export default function VisitorManagementSystem() {
  const webcamRef = useRef(null);
  const [photoTaken, setPhotoTaken] = useState(false);
  const [photoData, setPhotoData] = useState(null);
  const [slNumber, setSlNumber] = useState(1);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [submitAnimation, setSubmitAnimation] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  
  const [formData, setFormData] = useState({
    dateTime: formatDateTime(new Date()),
    slNumber: 1,
    name: '',
    address: '',
    role: '',
    phone: '',
    email: '',
    personToMeet: '',
    purpose: '',
    photo: null
  });

  function formatDateTime(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }

  useEffect(() => {
    // Check for saved SL number in localStorage
    const savedSlNumber = localStorage.getItem('lastSlNumber');
    if (savedSlNumber) {
      const nextNumber = parseInt(savedSlNumber) + 1;
      setSlNumber(nextNumber);
      setFormData(prev => ({ ...prev, slNumber: nextNumber }));
    }
    
    // Update date and time every minute
    const interval = setInterval(() => {
      setFormData(prev => ({ ...prev, dateTime: formatDateTime(new Date()) }));
    }, 60000);
    
    return () => {
      clearInterval(interval);
    };
  }, []);

  const startCamera = () => {
    setShowCamera(true);
  };

  const stopCamera = () => {
    setShowCamera(false);
  };

  const capturePhoto = () => {
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.name.trim()) errors.name = "Name is required";
    if (!formData.address.trim()) errors.address = "Address is required";
    if (!formData.role.trim()) errors.role = "Role is required";
    
    if (!formData.phone.trim()) {
      errors.phone = "Phone number is required";
    } else if (!/^\d{10,}$/.test(formData.phone.replace(/\D/g, ''))) {
      errors.phone = "Please enter a valid phone number";
    }
    
    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Please enter a valid email address";
    }
    
    if (!formData.personToMeet.trim()) errors.personToMeet = "Person to meet is required";
    if (!formData.purpose.trim()) errors.purpose = "Purpose of visit is required";
    if (!formData.photo) errors.photo = "Please take a photo";
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      console.log("Form submitted:", formData);
      
      // Save the current SL number to localStorage
      localStorage.setItem('lastSlNumber', formData.slNumber);
      
      // Animate the submit button
      setSubmitAnimation(true);
      
      // Show success message
      setTimeout(() => {
        setFormSubmitted(true);
        
        // Reset form after 3 seconds
        setTimeout(() => {
          const nextSlNumber = formData.slNumber + 1;
          setSlNumber(nextSlNumber);
          setFormData({
            dateTime: formatDateTime(new Date()),
            slNumber: nextSlNumber,
            name: '',
            address: '',
            role: '',
            phone: '',
            email: '',
            personToMeet: '',
            purpose: '',
            photo: null
          });
          setPhotoTaken(false);
          setPhotoData(null);
          setFormSubmitted(false);
          setSubmitAnimation(false);
        }, 3000);
      }, 1000);
    } else {
      console.log("Form has errors");
    }
  };

  // Webcam configuration
  const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: "user"
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 p-4 sm:p-6 md:p-8 overflow-hidden">
  {/* Animated Background Elements */}
  <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
    <div className="absolute top-0 left-0 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float-slow"></div>
    <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
    <div className="absolute top-1/2 left-1/4 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-float-delay"></div>
  </div>

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
            VISITOR MANAGEMENT SYSTEM
          </h1>
        </div>
        <div className="text-white text-sm md:text-base font-medium bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full shadow-inner animate-pulse-subtle">
          {new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
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
          <div className="flex flex-col items-center justify-between mb-2">
            {/* <h2 className="text-xl md:text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-700 mb-4 animate-fade-in">
              Please fill in the details
            </h2> */}
            {/* <div className="h-1 w-20 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full animate-width-expand"></div> */}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Date and Time */}
            <div className="transition-all duration-300 hover:shadow-lg p-4 rounded-xl border border-gray-100 bg-white/80 backdrop-blur-sm animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date and Time</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500 h-5 w-5" />
                <input
                  type="datetime-local"
                  name="dateTime"
                  value={formData.dateTime}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                />
              </div>
            </div>
            
            {/* SL Number */}
            <div className="transition-all duration-300 hover:shadow-lg p-4 rounded-xl border border-gray-100 bg-white/80 backdrop-blur-sm animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <label className="block text-sm font-medium text-gray-700 mb-1">SL Number</label>
              <div className="relative">
                <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500 h-5 w-5" />
                <input
                  type="number"
                  name="slNumber"
                  value={formData.slNumber}
                  readOnly
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-600 font-medium"
                />
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
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 ${
                    formErrors.name ? 'border-red-500 bg-red-50' : 'border-gray-200'
                  }`}
                  placeholder="Enter your full name"
                />
              </div>
              {formErrors.name && (
                <p className="mt-2 text-sm text-red-500 flex items-center animate-shake">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {formErrors.name}
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
                  value={formData.address}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 ${
                    formErrors.address ? 'border-red-500 bg-red-50' : 'border-gray-200'
                  }`}
                  placeholder="Enter your address"
                />
              </div>
              {formErrors.address && (
                <p className="mt-2 text-sm text-red-500 flex items-center animate-shake">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {formErrors.address}
                </p>
              )}
            </div>
            
            {/* Role */}
            <div className="transition-all duration-300 hover:shadow-lg p-4 rounded-xl border border-gray-100 bg-white/80 backdrop-blur-sm animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
              <label className="block text-sm font-medium text-gray-700 mb-1">Role *</label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500 h-5 w-5" />
                <input
                  type="text"
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 ${
                    formErrors.role ? 'border-red-500 bg-red-50' : 'border-gray-200'
                  }`}
                  placeholder="Enter your role"
                />
              </div>
              {formErrors.role && (
                <p className="mt-2 text-sm text-red-500 flex items-center animate-shake">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {formErrors.role}
                </p>
              )}
            </div>
            
            {/* Phone */}
            <div className="transition-all duration-300 hover:shadow-lg p-4 rounded-xl border border-gray-100 bg-white/80 backdrop-blur-sm animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500 h-5 w-5" />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 ${
                    formErrors.phone ? 'border-red-500 bg-red-50' : 'border-gray-200'
                  }`}
                  placeholder="Enter your phone number"
                />
              </div>
              {formErrors.phone && (
                <p className="mt-2 text-sm text-red-500 flex items-center animate-shake">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {formErrors.phone}
                </p>
              )}
            </div>
            
            {/* Email */}
            <div className="transition-all duration-300 hover:shadow-lg p-4 rounded-xl border border-gray-100 bg-white/80 backdrop-blur-sm animate-fade-in-up" style={{ animationDelay: '0.7s' }}>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500 h-5 w-5" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 ${
                    formErrors.email ? 'border-red-500 bg-red-50' : 'border-gray-200'
                  }`}
                  placeholder="Enter your email address"
                />
              </div>
              {formErrors.email && (
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
                  value={formData.personToMeet}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 ${
                    formErrors.personToMeet ? 'border-red-500 bg-red-50' : 'border-gray-200'
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
            
            {/* Purpose */}
            <div className="transition-all duration-300 hover:shadow-lg p-4 rounded-xl border border-gray-100 bg-white/80 backdrop-blur-sm md:col-span-2 animate-fade-in-up" style={{ animationDelay: '0.9s' }}>
              <label className="block text-sm font-medium text-gray-700 mb-1">Purpose of Visit *</label>
              <div className="relative">
                <MessageSquare className="absolute left-3 top-3 text-blue-500 h-5 w-5" />
                <textarea
                  name="purpose"
                  value={formData.purpose}
                  onChange={handleInputChange}
                  rows="3"
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 ${
                    formErrors.purpose ? 'border-red-500 bg-red-50' : 'border-gray-200'
                  }`}
                  placeholder="Describe the purpose of your visit"
                ></textarea>
              </div>
              {formErrors.purpose && (
                <p className="mt-2 text-sm text-red-500 flex items-center animate-shake">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {formErrors.purpose}
                </p>
              )}
            </div>
            
            {/* Photo Capture */}
            <div className="md:col-span-2 transition-all duration-300 hover:shadow-lg p-4 rounded-xl border border-gray-100 bg-white/80 backdrop-blur-sm animate-fade-in-up" style={{ animationDelay: '1s' }}>
              <label className="block text-sm font-medium text-gray-700 mb-3">Photograph *</label>
              
              <div className="flex flex-col items-center">
                {/* Webcam component */}
                {showCamera && (
                  <div className="relative mb-4 rounded-xl overflow-hidden border-4 border-blue-500 shadow-lg animate-fade-in">
                    <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
                    <Webcam
                      audio={false}
                      ref={webcamRef}
                      screenshotFormat="image/jpeg"
                      videoConstraints={videoConstraints}
                      className="w-64 h-48 bg-gray-100"
                    />
                    {/* <div className="relative top-2 left-2 bg-blue-600/80 text-white text-xs px-2 py-1 rounded-full animate-pulse flex items-center">
                      <Circle className="h-2 w-2 mr-1 fill-red-500 text-red-500" />
                      Live Camera
                    </div> */}
                    <button
                      type="button"
                      onClick={capturePhoto}
                      className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white rounded-full p-3 hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl animate-bounce-subtle"
                    >
                      <Camera className="h-6 w-6" />
                    </button>
                  </div>
                )}
                
                {/* Photo Preview */}
                {photoTaken && photoData && (
                  <div className="relative mb-4 animate-fade-in">
                    {/* <div className="rounded-xl overflow-hidden border-4 border-green-500 shadow-lg"> */}
                      <img 
                        src={photoData} 
                        alt="Captured" 
                        className="w-64 h-48 object-cover" 
                      />
                      {/* <div className="absolute bottom-2 left-2 bg-green-600/80 text-white text-xs px-2 py-1 rounded-full flex items-center">
                        <Check className="h-3 w-3 mr-1" />
                        Photo Captured
                      </div> */}
                    {/* </div> */}
                    <button
                      type="button"
                      onClick={resetPhoto}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors shadow-md hover:shadow-lg transform hover:scale-110 transition-all"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                )}
                
                {/* Camera Controls */}
                {!showCamera && !photoTaken && (
                  <button
                    type="button"
                    onClick={startCamera}
                    className="flex items-center bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-5 py-3 rounded-full hover:shadow-lg transform transition-all duration-300 hover:scale-105 animate-pulse-subtle"
                  >
                    <Camera className="h-5 w-5 mr-2" />
                    Take Photo
                  </button>
                )}
                
                {formErrors.photo && !photoTaken && (
                  <p className="mt-2 text-sm text-red-500 flex items-center animate-shake">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {formErrors.photo}
                  </p>
                )}
              </div>
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
        © {new Date().getFullYear()} Your Company Name. All rights reserved.
      </p>
    </div>
  </div>
  
  <style jsx>{`
    @keyframes fade-in {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    @keyframes fade-in-up {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    @keyframes rise {
      from { opacity: 0; transform: translateY(40px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    @keyframes success-bounce {
      0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
      40% { transform: translateY(-20px); }
      60% { transform: translateY(-10px); }
    }
    
    @keyframes success-fade-in {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    
    @keyframes success-slide-up {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    @keyframes success-fade-in-delay {
      0% { opacity: 0; }
      50% { opacity: 0; }
      100% { opacity: 1; }
    }
    
    @keyframes success-fade-in-delay-2 {
      0% { opacity: 0; }
      70% { opacity: 0; }
      100% { opacity: 1; }
    }
    
    @keyframes width-expand {
      from { width: 0; }
      to { width: 20%; }
    }
    
    @keyframes bounce-x {
      0%, 100% { transform: translateX(0); }
      50% { transform: translateX(5px); }
    }
    
    @keyframes pulse-subtle {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.8; }
    }
    
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      25% { transform: translateX(-5px); }
      75% { transform: translateX(5px); }
    }
    
    @keyframes bounce-subtle {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-3px); }
    }
    
    @keyframes float {
      0% { transform: translateY(0) translateX(0); }
      50% { transform: translateY(-15px) translateX(15px); }
      100% { transform: translateY(0) translateX(0); }
    }
    
    @keyframes float-slow {
      0% { transform: translateY(0) translateX(0); }
      50% { transform: translateY(-20px) translateX(-10px); }
      100% { transform: translateY(0) translateX(0); }
    }
    
    @keyframes float-delay {
      0% { transform: translateY(-10px) translateX(-5px); }
      50% { transform: translateY(10px) translateX(5px); }
      100% { transform: translateY(-10px) translateX(-5px); }
    }
    
    @keyframes text-glow {
      0%, 100% { text-shadow: 0 0 5px rgba(255,255,255,0.5); }
      50% { text-shadow: 0 0 20px rgba(255,255,255,0.5); }
    }
    
    @keyframes shimmer {
      0% { transform: translateX(-100%); }
      100% { transform: translateX(300%); }
    }
    
    .animate-fade-in {
      animation: fade-in 0.5s ease-out forwards;
    }
    
    .animate-fade-in-up {
      animation: fade-in-up 0.5s ease-out forwards;
    }
    
    .animate-rise {
      animation: rise 0.8s ease-out forwards;
    }
    
    .animate-success-bounce {
      animation: success-bounce 1s ease-out;
    }
    
    .animate-success-fade-in {
      animation: success-fade-in 0.8s ease-out forwards;
    }
    
    .animate-success-slide-up {
      animation: success-slide-up 0.8s ease-out forwards;
    }
    
    .animate-success-fade-in-delay {
      animation: success-fade-in-delay 1.2s ease-out forwards;
    }
    
    .animate-success-fade-in-delay-2 {
      animation: success-fade-in-delay-2 1.5s ease-out forwards;
    }
    
    .animate-width-expand {
      animation: width-expand 1s ease-out forwards;
    }
    
    .animate-bounce-x {
      animation: bounce-x 1s infinite ease-in-out;
    }
    
    .animate-pulse-subtle {
      animation: pulse-subtle 2s infinite ease-in-out;
    }
    
    .animate-shake {
      animation: shake 0.5s ease-in-out;
    }
    
    .animate-bounce-subtle {
      animation: bounce-subtle 1.5s infinite ease-in-out;
    }
    
    .animate-float {
      animation: float 10s infinite ease-in-out;
    }
    
    .animate-float-slow {
      animation: float-slow 15s infinite ease-in-out;
    }
    
    .animate-float-delay {
      animation: float-delay 12s infinite ease-in-out;
    }
    
    .animate-text-glow {
      animation: text-glow 2s infinite ease-in-out;
    }
    
    .animate-shimmer {
      animation: shimmer 3s infinite linear;
    }
    
    .bg-grid-pattern {
      background-image: linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px),
                        linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px);
      background-size: 20px 20px;
    }
  `}</style>
</div>
  );
}