import React, { useState, useEffect } from 'react';
import { ArrowRight, CheckCircle, AlertCircle, Calendar, User, Mail, MessageSquare, RefreshCw, Clock, Layers } from 'lucide-react';
import image1 from './assets/LOGO_KRISTELLAR_WHITE.png'; // Replace with your logo path
import './VisitorForm.css'; // Import your CSS file for styles
import { useNavigate } from 'react-router-dom';
import AnalogClock from './AnalogClock';

export default function HallBookingForm() {
  const navigate = useNavigate();
  const [serialnumber, setSerialnumber] = useState(1);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [submitAnimation, setSubmitAnimation] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  const [availableSlots, setAvailableSlots] = useState([]); // New state for available slots

  const [formData, setFormData] = useState({
    dateTime: formatDateTime(new Date()),
    serialnumber: 1,
    name: '',
    email: '',
    date: '',
    startTime: '',
    endTime: '',
    purpose: '',
    floor: '',
    room: '',
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

  function formatReadableDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  function formatTimeDisplay(time24) {
    if (!time24) return '';
    const [hours, minutes] = time24.split(':').map(Number);
    const hour12 = hours % 12 || 12;
    const ampm = hours >= 12 ? 'PM' : 'AM';
    return `${hour12.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${ampm}`;
  }

  function getTimeRangeDisplay() {
    if (formData.startTime && formData.endTime) {
      return `${formatTimeDisplay(formData.startTime)} - ${formatTimeDisplay(formData.endTime)}`;
    }
    return '';
  }

  useEffect(() => {
    const savedSerialnumber = localStorage.getItem('lastserialnumber');
    if (savedSerialnumber) {
      const nextNumber = parseInt(savedSerialnumber) + 1;
      setSerialnumber(nextNumber);
      setFormData(prev => ({ ...prev, serialnumber: nextNumber }));
    }
    
    const interval = setInterval(() => {
      setFormData(prev => ({ ...prev, dateTime: formatDateTime(new Date()) }));
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const newData = { ...prev, [name]: value };
      if (name === 'floor') {
        newData.room = value === '4' ? 'Small Conference Room' : '';
      }
      return newData;
    });
    
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: null }));
    }
    setServerError('');
    setAvailableSlots([]); // Clear slots when input changes
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.name.trim()) errors.name = "Name is required";
    
    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Please enter a valid email address";
    }
    
    if (!formData.date) errors.date = "Date is required";
    if (!formData.startTime) errors.startTime = "Start time is required";
    if (!formData.endTime) errors.endTime = "End time is required";
    
    if (formData.startTime && formData.endTime && formData.startTime >= formData.endTime) {
      errors.endTime = "End time must be after start time";
    }
    
    if (!formData.purpose.trim()) errors.purpose = "Purpose is required";
    if (!formData.floor) errors.floor = "Floor selection is required";
    if (!formData.room) errors.room = "Room selection is required";
        
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSlotSelection = (slot) => {
    setFormData(prev => ({
      ...prev,
      startTime: slot.start,
      endTime: slot.end
    }));
    setServerError('');
    setAvailableSlots([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    setAvailableSlots([]);
    
    if (validateForm()) {
      setIsLoading(true);
      localStorage.setItem('lastserialnumber', formData.serialnumber);

      const submissionData = {
        ...formData,
        timeRange: getTimeRangeDisplay()
      };

      try {
        const res = await fetch('https://ivms.local/api/hallbooking/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(submissionData),
        });

        if (!res.ok) {
          const errorData = await res.json();
          if (errorData.error && errorData.availableSlots) {
            setServerError(errorData.error);
            setAvailableSlots(errorData.availableSlots);
          } else {
            throw new Error(errorData.error || 'Failed to submit');
          }
          setIsLoading(false);
          return;
        }

        const data = await res.json();
        console.log('✅ Hall booking submitted:', data);

        setSubmitAnimation(true);
        setTimeout(() => {
          setFormSubmitted(true);
          setTimeout(() => {
            const nextSerialnumber = formData.serialnumber + 1;
            setSerialnumber(nextSerialnumber);
            setFormData({
              dateTime: formatDateTime(new Date()),
              serialnumber: nextSerialnumber,
              name: '',
              email: '',
              date: '',
              startTime: '',
              endTime: '',
              purpose: '',
              floor: '',
              room: '',
            });
            setIsLoading(false);
            navigate("/hallbooking");
          }, 3000);
        }, 1000);
      } catch (err) {
        console.error('❌ Submission error:', err);
        setServerError(err.message);
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 p-4 sm:p-6 md:p-8 overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-0 left-0 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float-slow"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
        <div className="absolute top-1/2 left-1/4 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-float-delay"></div>
      </div>

      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden relative z-10 transform transition-all duration-500 hover:shadow-3xl animate-rise">
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 p-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center space-x-4">
              <div className="rounded-lg overflow-hidden shadow-lg transform transition-all duration-500 hover:scale-105 hover:rotate-1">
                <img src={image1} alt="Logo" className="h-20 w-40 object-contain" />
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight animate-text-glow text-center">
                HALL BOOKING FORM
              </h1>
            </div>
            <div className="text-white text-sm md:text-base font-medium px-4 py-2 rounded-full animate-pulse-subtle flex items-center gap-4">
              <span>{formatReadableDate(formData.dateTime)}</span>
              <AnalogClock dateTime={formData.dateTime} />
            </div>
          </div>
        </div>

        <div className="p-6 md:p-8 bg-gradient-to-b from-white to-gray-50">
          {formSubmitted ? (
            <div className="text-center py-16 animate-success-fade-in">
              <div className="inline-block animate-success-bounce mb-4">
                <CheckCircle className="h-20 w-20 text-green-500" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-3 animate-success-slide-up">Hall Booking Submitted Successfully!</h2>
              <p className="text-gray-600 animate-success-fade-in-delay">Thank you for your booking request. Please wait for confirmation.</p>
              <div className="mt-8 flex justify-center">
                <button
                  onClick={() => {
                    setFormSubmitted(false);
                    setSubmitAnimation(false);
                    setFormData({
                      dateTime: formatDateTime(new Date()),
                      serialnumber: serialnumber,
                      name: '',
                      email: '',
                      date: '',
                      startTime: '',
                      endTime: '',
                      purpose: '',
                      floor: '',
                      room: '',
                    });
                    setFormErrors({});
                    setServerError('');
                    setAvailableSlots([]);
                  }}
                  className="px-6 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-full font-medium shadow-md hover:shadow-lg transform transition-all duration-300 hover:scale-105 flex items-center space-x-2 animate-success-fade-in-delay-2"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  New Booking
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="transition-all duration-300 hover:shadow-lg p-4 rounded-xl border border-gray-100 bg-white/80 backdrop-blur-sm animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
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
                      placeholder="Enter your name"
                    />
                  </div>
                  {formErrors.name && (
                    <p className="mt-2 text-sm text-red-500 flex items-center animate-shake">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {formErrors.name}
                    </p>
                  )}
                </div>

                <div className="transition-all duration-300 hover:shadow-lg p-4 rounded-xl border border-gray-100 bg-white/80 backdrop-blur-sm animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
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

                <div className="transition-all duration-300 hover:shadow-lg p-4 rounded-xl border border-gray-100 bg-white/80 backdrop-blur-sm animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date of Booking *</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500 h-5 w-5" />
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      min={new Date().toISOString().split('T')[0]}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 ${
                        formErrors.date ? 'border-red-500 bg-red-50' : 'border-gray-200'
                      }`}
                    />
                  </div>
                  {formErrors.date && (
                    <p className="mt-2 text-sm text-red-500 flex items-center animate-shake">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {formErrors.date}
                    </p>
                  )}
                </div>

                <div className="transition-all duration-300 hover:shadow-lg p-4 rounded-xl border border-gray-100 bg-white/80 backdrop-blur-sm animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Time *</label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500 h-5 w-5" />
                    <input
                      type="time"
                      name="startTime"
                      value={formData.startTime}
                      onChange={handleInputChange}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 ${
                        formErrors.startTime ? 'border-red-500 bg-red-50' : 'border-gray-200'
                      }`}
                    />
                  </div>
                  {formErrors.startTime && (
                    <p className="mt-2 text-sm text-red-500 flex items-center animate-shake">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {formErrors.startTime}
                    </p>
                  )}
                </div>

                <div className="transition-all duration-300 hover:shadow-lg p-4 rounded-xl border border-gray-100 bg-white/80 backdrop-blur-sm animate-fade-in-up" style={{ animationDelay: '0.7s' }}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Time *</label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500 h-5 w-5" />
                    <input
                      type="time"
                      name="endTime"
                      value={formData.endTime}
                      onChange={handleInputChange}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 ${
                        formErrors.endTime ? 'border-red-500 bg-red-50' : 'border-gray-200'
                      }`}
                    />
                  </div>
                  {formErrors.endTime && (
                    <p className="mt-2 text-sm text-red-500 flex items-center animate-shake">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {formErrors.endTime}
                    </p>
                  )}
                </div>

                <div className="transition-all duration-300 hover:shadow-lg p-4 rounded-xl border border-gray-100 bg-white/80 backdrop-blur-sm animate-fade-in-up" style={{ animationDelay: '0.8s' }}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Floor *</label>
                  <div className="relative">
                    <Layers className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500 h-5 w-5" />
                    <select
                      name="floor"
                      value={formData.floor}
                      onChange={handleInputChange}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 ${
                        formErrors.floor ? 'border-red-500 bg-red-50' : 'border-gray-200'
                      }`}
                    >
                      <option value="">Select Floor</option>
                      <option value="3">3rd Floor</option>
                      <option value="4">4th Floor</option>
                    </select>
                  </div>
                  {formErrors.floor && (
                    <p className="mt-2 text-sm text-red-500 flex items-center animate-shake">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {formErrors.floor}
                    </p>
                  )}
                </div>

                <div className="transition-all duration-300 hover:shadow-lg p-4 rounded-xl border border-gray-100 bg-white/80 backdrop-blur-sm animate-fade-in-up" style={{ animationDelay: '0.9s' }}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Room *</label>
                  <div className="relative">
                    <Layers className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500 h-5 w-5" />
                    <select
                      name="room"
                      value={formData.room}
                      onChange={handleInputChange}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 ${
                        formErrors.room ? 'border-red-500 bg-red-50' : 'border-gray-200'
                      }`}
                      disabled={!formData.floor}
                    >
                      <option value="">Select Room</option>
                      {formData.floor === '3' && (
                        <>
                          <option value="Main Conference Hall">Main Conference Hall</option>
                          <option value="Small Conference Room">Small Conference Room</option>
                        </>
                      )}
                      {formData.floor === '4' && (
                        <>
                        <option value="Training Hall">Training Hall</option>
                        <option value="Small Conference Room">Small Conference Room</option>
                        </>
                      )}
                    </select>
                  </div>
                  {formErrors.room && (
                    <p className="mt-2 text-sm text-red-500 flex items-center animate-shake">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {formErrors.room}
                    </p>
                  )}
                </div>

                {getTimeRangeDisplay() && (
                  <div className="md:col-span-2 p-4 bg-blue-50 rounded-xl border border-blue-200 animate-fade-in-up" style={{ animationDelay: '1.0s' }}>
                    <p className="text-sm text-blue-700 font-medium">Selected Time Range:</p>
                    <p className="text-lg text-blue-800 font-semibold">{getTimeRangeDisplay()}</p>
                  </div>
                )}

                <div className="transition-all duration-300 hover:shadow-lg p-4 rounded-xl border border-gray-100 bg-white/80 backdrop-blur-sm md:col-span-2 animate-fade-in-up" style={{ animationDelay: '1.1s' }}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Purpose *</label>
                  <div className="relative">
                    <MessageSquare className="absolute left-3 top-3 text-blue-500 h-5 w-5" />
                    <textarea
                      name="purpose"
                      value={formData.purpose}
                      onChange={handleInputChange}
                      rows="3"
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 resize-none ${
                        formErrors.purpose ? 'border-red-500 bg-red-50' : 'border-gray-200'
                      }`}
                      placeholder="Enter the purpose of hall booking"
                    />
                  </div>
                  {formErrors.purpose && (
                    <p className="mt-2 text-sm text-red-500 flex items-center animate-shake">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {formErrors.purpose}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex justify-center pt-6 animate-fade-in-up" style={{ animationDelay: '1.2s' }}>
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`relative overflow-hidden flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 text-white font-medium rounded-full shadow-md hover:shadow-xl transform transition-all duration-500 ${
                    submitAnimation ? 'animate-pulse scale-105' : 'hover:scale-105'
                  } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-blue-400/20 via-transparent to-transparent w-1/3 skew-x-12 animate-shimmer"></span>
                  <span className="relative flex items-center">
                    {isLoading ? 'Submitting...' : 'Submit Booking'}
                    {!isLoading && <ArrowRight className="ml-2 h-5 w-5 animate-bounce-x" />}
                  </span>
                </button>
              </div>
              
              {serverError && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 animate-shake">
                  <div className="flex items-center">
                    <AlertCircle className="h-5 w-5 mr-2" />
                    {serverError}
                  </div>
                  {availableSlots.length > 0 && (
                    <div className="mt-4">
                      <p className="text-sm font-medium text-gray-700">Available time slots for {formData.date}:</p>
                      <ul className="mt-2 space-y-2">
                        {availableSlots.map((slot, index) => (
                          <li key={index} className="flex items-center justify-between bg-white p-2 rounded-md border border-gray-200">
                            <span className="text-sm text-gray-800">
                              {formatTimeDisplay(slot.start)} - {formatTimeDisplay(slot.end)}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleSlotSelection(slot)}
                              className="px-3 py-1 bg-blue-500 text-white text-sm font-medium rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                            >
                              Select
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </form>
          )}
        </div>

        <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 text-center border-t border-gray-200">
          <p className="text-sm text-gray-600 flex items-center justify-center">
            © 2021 Kristellar Aerospace. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}