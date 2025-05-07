import React, { useState, useEffect } from 'react';
import { ArrowRight, CheckCircle, X, AlertCircle, Calendar, Hash, User, MapPin, Briefcase, Phone, Mail, Users, MessageSquare, RefreshCw } from 'lucide-react';
import image1 from './assets/LOGO_KRISTELLAR_WHITE.png'; // Replace with your logo path
import './VisitorForm.css'; // Import your CSS file for styles
import { useNavigate } from 'react-router-dom';
import { formatReadableDate } from './utils/formatDate';


export default function CourierForm() {
  const navigate = useNavigate();
  const [serialnumber, setserialnumber] = useState(1);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [submitAnimation, setSubmitAnimation] = useState(false);
  
  const [formData, setFormData] = useState({
    dateTime: formatDateTime(new Date()),
    serialnumber: 1,
    name: '',
    couriername: '',
    courierid: '',
    phone: '',
    persontodeliver: '',
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

  useEffect(() => {
    // Check for saved SL number in localStorage
    const savedserialnumber = localStorage.getItem('lastserialnumber');
    if (savedserialnumber) {
      const nextNumber = parseInt(savedserialnumber) + 1;
      setserialnumber(nextNumber);
      setFormData(prev => ({ ...prev, serialnumber: nextNumber }));
    }
    
    // Update date and time every minute
    const interval = setInterval(() => {
      setFormData(prev => ({ ...prev, dateTime: formatDateTime(new Date()) }));
    }, 60000);
    
    return () => {
      clearInterval(interval);
    };
  }, []);

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
    if (!formData.couriername.trim()) errors.couriername = "Courier Name is required";
    if (!formData.courierid.trim()) errors.courierid = "Courier ID is required";
    
    if (!formData.phone.trim()) {
      errors.phone = "Phone number is required";
    } else if (!/^\d{10,}$/.test(formData.phone.replace(/\D/g, ''))) {
      errors.phone = "Please enter a valid phone number";
    }
    
    if (!formData.persontodeliver.trim()) errors.persontodeliver = "Person To Deliver is required";
        
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };


  //Otp verification

  const handleSubmit = (e) => {
    e.preventDefault();
  
    if (validateForm()) {
      // Save SL number
      localStorage.setItem('lastserialnumber', formData.serialnumber);
  
      // Submit to backend
      fetch('http://localhost:5000/api/couriers/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
        .then((res) => {
          if (!res.ok) throw new Error('Failed to submit');
          return res.json();
        })
        .then((data) => {
          console.log('✅ Courier submitted:', data);
  
          setSubmitAnimation(true);
          setTimeout(() => {
            setFormSubmitted(true);
            setTimeout(() => {
              const nextserialnumber = formData.serialnumber + 1;
              setserialnumber(nextserialnumber);
              navigate("/select");
            }, 3000);
          }, 1000);
        })
        .catch((err) => {
          console.error('❌ Submission error:', err);
          alert("Submission failed. Check console.");
        });
    } else {
      console.log("Form has errors");
    }
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
                    COURIER DETAILS
                </h1>
                </div>
                <div className="text-white text-sm md:text-base font-medium bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full shadow-inner animate-pulse-subtle">
                {formatReadableDate(formData.dateTime)}
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
                        name="serialnumber"
                        value={formData.serialnumber}
                        readOnly
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-600 font-medium"
                        />
                    </div>
                    </div>
                    
                    {/* Name */}
                    <div className="transition-all duration-300 hover:shadow-lg p-4 rounded-xl border border-gray-100 bg-white/80 backdrop-blur-sm animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name of the Delivery Man*</label>
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
                        placeholder="Enter your Name"
                        />
                    </div>
                    {formErrors.name && (
                        <p className="mt-2 text-sm text-red-500 flex items-center animate-shake">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {formErrors.name}
                        </p>
                    )}
                    </div>
                    
                    {/* couriername */}
                    <div className="transition-all duration-300 hover:shadow-lg p-4 rounded-xl border border-gray-100 bg-white/80 backdrop-blur-sm animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Courier Name *</label>
                    <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500 h-5 w-5" />
                        <input
                        type="text"
                        name="couriername"
                        value={formData.couriername}
                        onChange={handleInputChange}
                        className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 ${
                            formErrors.couriername ? 'border-red-500 bg-red-50' : 'border-gray-200'
                        }`}
                        placeholder="Enter your Courier Name"
                        />
                    </div>
                    {formErrors.couriername && (
                        <p className="mt-2 text-sm text-red-500 flex items-center animate-shake">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {formErrors.couriername}
                        </p>
                    )}
                    </div>
                    
                    {/* courierid */}
                    <div className="transition-all duration-300 hover:shadow-lg p-4 rounded-xl border border-gray-100 bg-white/80 backdrop-blur-sm animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Courier ID *</label>
                    <div className="relative">
                        <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500 h-5 w-5" />
                        <input
                        type="text"
                        name="courierid"
                        value={formData.courierid}
                        onChange={handleInputChange}
                        className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 ${
                            formErrors.courierid ? 'border-red-500 bg-red-50' : 'border-gray-200'
                        }`}
                        placeholder="Enter your Courier ID"
                        />
                    </div>
                    {formErrors.courierid && (
                        <p className="mt-2 text-sm text-red-500 flex items-center animate-shake">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {formErrors.courierid}
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
                    
                    {/* Person To Deliver */}
                    <div className="transition-all duration-300 hover:shadow-lg p-4 rounded-xl border border-gray-100 bg-white/80 backdrop-blur-sm md:col-span-2  animate-fade-in-up" style={{ animationDelay: '0.8s' }}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Person To Deliver *</label>
                    <div className="relative">
                        <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500 h-5 w-5" />
                        <input
                        type="text"
                        name="persontodeliver"
                        value={formData.persontodeliver}
                        onChange={handleInputChange}
                        className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 ${
                            formErrors.persontodeliver ? 'border-red-500 bg-red-50' : 'border-gray-200'
                        }`}
                        placeholder="Enter person's name"
                        />
                    </div>
                    {formErrors.persontodeliver && (
                        <p className="mt-2 text-sm text-red-500 flex items-center animate-shake">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {formErrors.persontodeliver}
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
                © {new Date().getFullYear()} Your Company Name. All rights reserved.
            </p>
            </div>
        </div>
    </div>
  );
}