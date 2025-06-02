import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment-timezone';
import 'react-big-calendar/lib/css/react-big-calendar.css';

// Setup moment with IST timezone
const localizer = momentLocalizer(moment.tz.setDefault('Asia/Kolkata'));

const CalendarFile = () => {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState('single'); // 'single', 'three', 'six'
  const [expandedMonth, setExpandedMonth] = useState(null);

  // Inject custom styles
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      .rbc-custom .rbc-toolbar {
        display: none; /* Hide default toolbar since we're using custom tabs */
      }
      .rbc-custom .rbc-event {
        cursor: pointer;
        border-radius: 6px;
        padding: 2px 6px;
        font-size: 12px;
        font-weight: 500;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        transition: all 0.2s ease;
      }
      .rbc-custom .rbc-event:hover {
        transform: translateY(-1px);
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
      }
      .rbc-custom .rbc-today {
        background-color: #EFF6FF;
      }
      .rbc-custom .rbc-header {
        background-color: #F8FAFC;
        color: #374151;
        font-weight: 600;
        padding: 0.75rem 0.5rem;
        border-bottom: 2px solid #E2E8F0;
      }
      .rbc-custom .rbc-time-slot {
        border-color: #E5E7EB;
      }
      .rbc-custom .rbc-time-header-content {
        border-color: #E5E7EB;
      }
      .rbc-custom .rbc-event-label {
        font-size: 0.75rem;
      }
      .rbc-custom .rbc-event-content {
        font-size: 0.875rem;
      }
      .rbc-custom .rbc-calendar {
        border: 1px solid #E5E7EB;
        border-radius: 0.5rem;
        overflow: hidden;
      }
      .rbc-custom .rbc-month-view {
        border: none;
      }
      .rbc-custom .rbc-date-cell {
        padding: 0.25rem;
        text-align: right;
      }
      .rbc-custom .rbc-date-cell > a {
        color: #374151;
        font-weight: 500;
      }
      .rbc-custom .rbc-off-range-bg {
        background-color: #F9FAFB;
      }
      
      /* Mini calendar styles */
      .mini-calendar .rbc-header {
        padding: 0.5rem 0.25rem;
        font-size: 0.75rem;
      }
      .mini-calendar .rbc-date-cell {
        padding: 0.125rem;
        font-size: 0.75rem;
      }
      .mini-calendar .rbc-event {
        font-size: 10px;
        padding: 1px 3px;
      }
      .mini-calendar .rbc-month-header {
        font-size: 0.875rem;
        padding: 0.5rem;
        text-align: center;
        font-weight: 600;
        background: #F8FAFC;
        border-bottom: 1px solid #E2E8F0;
        cursor: pointer;
        transition: background-color 0.2s;
      }
      .mini-calendar .rbc-month-header:hover {
        background: #EFF6FF;
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  // Fetch bookings from backend API
  useEffect(() => {
  const fetchBookings = async () => {
    setIsLoading(true);
    setError('');
    try {
      console.log('Fetching bookings from http://localhost:5001/api/hallbooking/all');
      const response = await fetch('http://localhost:5001/api/hallbooking/all', {
        method: 'GET',
        headers: { 
          'Content-Type': 'application/json',
          // Add any additional headers if needed (e.g., authorization)
          // 'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Failed to fetch bookings`);
      }
      
      const data = await response.json();
      console.log('Fetched bookings:', data);

      // Handle different response structures - prioritize array format
      const bookingsArray = Array.isArray(data) ? data : (data.bookings || data.data || []);
      
      if (!Array.isArray(bookingsArray)) {
        throw new Error('Invalid data structure received from API');
      }

      // Map bookings to events with proper timezone handling
      const formattedBookings = bookingsArray.map((booking, index) => {
        // Debug logging - check original data format
        console.log(`Booking ${booking.id || index}:`);
        console.log(`  Raw data - date: ${booking.date}, start_time: ${booking.start_time || booking.startTime}, end_time: ${booking.end_time || booking.endTime}`);
        console.log(`  Date type: ${typeof booking.date}, Start time type: ${typeof (booking.start_time || booking.startTime)}`);
        
        // Handle different date formats that might come from backend
        let startMoment, endMoment;
        const dateStr = booking.date || moment().format('YYYY-MM-DD');
        const startTimeStr = booking.start_time || booking.startTime || '09:00:00';
        const endTimeStr = booking.end_time || booking.endTime || '10:00:00';
        
        // If dates are already ISO strings (from backend), parse them directly
        if (dateStr.includes('T')) {
          // Backend sent ISO string, parse as UTC then convert to IST
          startMoment = moment.utc(dateStr).tz('Asia/Kolkata');
          endMoment = moment.utc(dateStr).tz('Asia/Kolkata');
          
          // If start_time and end_time are separate, we need to set the time
          if (startTimeStr && endTimeStr) {
            const [startHour, startMin, startSec] = startTimeStr.split(':');
            const [endHour, endMin, endSec] = endTimeStr.split(':');
            
            startMoment.set({ 
              hour: parseInt(startHour), 
              minute: parseInt(startMin), 
              second: parseInt(startSec || 0) 
            });
            endMoment.set({ 
              hour: parseInt(endHour), 
              minute: parseInt(endMin), 
              second: parseInt(endSec || 0) 
            });
          }
        } else {
          // Backend sent separate date and time, combine them in IST
          startMoment = moment.tz(`${dateStr} ${startTimeStr}`, 'YYYY-MM-DD HH:mm:ss', 'Asia/Kolkata');
          endMoment = moment.tz(`${dateStr} ${endTimeStr}`, 'YYYY-MM-DD HH:mm:ss', 'Asia/Kolkata');
        }
        
        const start = startMoment.toDate();
        const end = endMoment.toDate();
        
        // Enhanced debug logging
        console.log(`  Moment objects - start: ${startMoment.format()}, end: ${endMoment.format()}`);
        console.log(`  Final Date objects - start: ${start}, end: ${end}`);
        console.log(`  Calendar will show on: ${moment(start).format('YYYY-MM-DD')}`);
        console.log(`  ---`);
        
        return {
          id: booking.id || index,
          title: `${booking.floor || 'Unknown'} - ${booking.room || 'Unknown'}`,
          start,
          end,
          allDay: false,
          resource: {
            id: booking.id || index,
            name: booking.name || booking.userName || 'N/A',
            email: booking.email || booking.userEmail || 'N/A',
            date: moment(dateStr).format('DD/MM/YYYY'), // Use moment for consistent formatting
            time: booking.time_range || `${startTimeStr} - ${endTimeStr}`,
            purpose: booking.purpose || booking.reason || 'N/A',
            floor: booking.floor || 'N/A',
            room: booking.room || booking.roomName || 'N/A',
            status: booking.status || 'Pending',
          },
        };
      });
      
      setBookings(formattedBookings);
      setFilteredBookings(formattedBookings);
      
    } catch (err) {
      console.error('Fetch error:', err);
      setError(`Failed to load bookings: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };
  
  fetchBookings();
}, []);

  // Handle event click
  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
  };

  // Handle date click
  const handleSelectSlot = ({ start }) => {
    const eventsOnDate = bookings.filter(event =>
      moment(event.start).isSame(start, 'day')
    );
    if (eventsOnDate.length >= 1) {
      setSelectedEvent(eventsOnDate[0]);
    }
  };

  // Close modal
  const handleCloseModal = () => {
    setSelectedEvent(null);
  };

  // Event styling
  const eventPropGetter = (event) => {
    let backgroundColor;
    switch (event.resource.status.toLowerCase()) {
      case 'approved':
        backgroundColor = '#10B981';
        break;
      case 'rejected':
        backgroundColor = '#EF4444';
        break;
      case 'pending':
      default:
        backgroundColor = '#F59E0B';
        break;
    }
    return {
      style: {
        backgroundColor,
        borderRadius: '6px',
        opacity: 0.9,
        color: 'white',
        border: 'none',
        padding: '3px 6px',
        fontSize: '12px',
        fontWeight: '500',
      },
    };
  };

  // Get events for a specific month
  const getEventsForMonth = (monthDate) => {
    return filteredBookings.filter(event =>
      moment(event.start).isSame(monthDate, 'month')
    );
  };

  // Generate months for multi-month views
  const generateMonthsArray = (count) => {
    const months = [];
    const startMonth = moment(currentDate).subtract(Math.floor(count / 2), 'months');
    
    for (let i = 0; i < count; i++) {
      months.push(startMonth.clone().add(i, 'months'));
    }
    return months;
  };

  // Handle month click in grid view
  const handleMonthClick = (monthDate) => {
    setCurrentDate(monthDate.toDate());
    setExpandedMonth(monthDate);
    setViewMode('single');
  };

  // Handle navigation for single month view
  const handleNavigation = (direction) => {
    const newDate = moment(currentDate).add(direction, 'month').toDate();
    setCurrentDate(newDate);
  };

  // Render single month view
  const renderSingleMonth = () => (
    <div className="bg-white shadow-xl rounded-lg">
      {/* Custom Navigation Header */}
      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-t-lg">
        <button
          onClick={() => handleNavigation(-1)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Previous
        </button>
        
        <h3 className="text-xl font-bold text-gray-900">
          {moment(currentDate).format('MMMM YYYY')}
        </h3>
        
        <button
          onClick={() => handleNavigation(1)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Next
        </button>
      </div>
      
      <div className="p-6">
        <Calendar
          localizer={localizer}
          events={getEventsForMonth(moment(currentDate))}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 650 }}
          eventPropGetter={eventPropGetter}
          onSelectEvent={handleSelectEvent}
          onSelectSlot={handleSelectSlot}
          date={currentDate}
          selectable
          views={['month']}
          defaultView="month"
          className="rbc-custom"
          popup={true}
          popupOffset={{x: 30, y: 20}}
        />
      </div>
    </div>
  );

  // Render mini calendar for grid views
  const renderMiniCalendar = (monthDate, size = 'normal') => {
    const monthEvents = getEventsForMonth(monthDate);
    const heightClass = size === 'small' ? 'h-64' : 'h-80';
    
    return (
      <div 
        key={monthDate.format('YYYY-MM')}
        className="bg-white shadow-lg rounded-lg overflow-hidden cursor-pointer hover:shadow-xl transition-shadow"
        onClick={() => handleMonthClick(monthDate)}
      >
        <div className="rbc-month-header">
          {monthDate.format('MMMM YYYY')}
        </div>
        <div className={`${heightClass} mini-calendar`}>
          <Calendar
            localizer={localizer}
            events={monthEvents}
            startAccessor="start"
            endAccessor="end"
            eventPropGetter={eventPropGetter}
            date={monthDate.toDate()}
            views={['month']}
            defaultView="month"
            className="rbc-custom"
            toolbar={false}
          />
        </div>
        <div className="p-2 bg-gray-50 text-center">
          <span className="text-sm text-gray-600">
            {monthEvents.length} booking{monthEvents.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>
    );
  };

  // Render three month view
  const renderThreeMonthView = () => {
    const months = generateMonthsArray(3);
    
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {months.map(month => renderMiniCalendar(month))}
      </div>
    );
  };

  // Render six month view
  const renderSixMonthView = () => {
    const months = generateMonthsArray(6);
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {months.map(month => renderMiniCalendar(month, 'small'))}
      </div>
    );
  };

  return (
    <div className="p-6 min-h-screen">
      <div className="max-w-full">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Hall Booking Calendar</h2>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 flex items-center">
            <X className="w-5 h-5 mr-2" />
            {error}
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12 text-gray-500">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
            <div>Loading bookings...</div>
          </div>
        )}

        {!isLoading && (
          <>
            {/* Custom Tab Navigation */}
            <div className="mb-6">
              <div className="flex flex-wrap gap-2 p-2 bg-gray-100 rounded-lg">
                <button
                  onClick={() => setViewMode('single')}
                  className={`px-4 py-2 rounded-md font-medium transition-colors ${
                    viewMode === 'single'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Single Month
                </button>
                <button
                  onClick={() => setViewMode('three')}
                  className={`px-4 py-2 rounded-md font-medium transition-colors ${
                    viewMode === 'three'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  3 Months
                </button>
                <button
                  onClick={() => setViewMode('six')}
                  className={`px-4 py-2 rounded-md font-medium transition-colors ${
                    viewMode === 'six'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  6 Months
                </button>
              </div>
            </div>

            {/* Status Legend */}
            <div className="mb-4 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <h3 className="font-semibold text-blue-900">
                    {viewMode === 'single' 
                      ? moment(currentDate).format('MMMM YYYY')
                      : 'Calendar Overview'
                    }
                  </h3>
                  <p className="text-sm text-blue-700">
                    {filteredBookings.length} total booking{filteredBookings.length !== 1 ? 's' : ''}
                  </p>
                </div>
                <div className="flex gap-4">
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-green-500 rounded"></div>
                    <span className="text-md text-gray-600">Approved</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-yellow-500 rounded"></div>
                    <span className="text-md text-gray-600">Pending</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-red-500 rounded"></div>
                    <span className="text-md text-gray-600">Rejected</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Calendar Views */}
            {viewMode === 'single' && renderSingleMonth()}
            {viewMode === 'three' && renderThreeMonthView()}
            {viewMode === 'six' && renderSixMonthView()}
          </>
        )}

        {/* Event Details Modal */}
        {selectedEvent && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-900">Booking Details</h3>
                  <button
                    onClick={handleCloseModal}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Sl. No</label>
                      <p className="text-gray-900 font-semibold">{selectedEvent.resource.id}</p>
                    </div>
                    <div className='flex flex-col'>
                      <label className="text-sm font-medium text-gray-500">Status</label>
                      <span
                        className={`inline-block py-1 rounded-full text-sm font-bold ${
                          selectedEvent.resource.status.toLowerCase() === 'approved'
                            ? 'text-green-800'
                            : selectedEvent.resource.status.toLowerCase() === 'rejected'
                            ? 'text-red-800'
                            : 'text-yellow-800'
                        }`}
                      >
                        {selectedEvent.resource.status}
                      </span>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-500">Name</label>
                    <p className="text-gray-900">{selectedEvent.resource.name}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-500">Email</label>
                    <p className="text-gray-900">{selectedEvent.resource.email}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Date</label>
                      <p className="text-gray-900">{selectedEvent.resource.date}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Time</label>
                      <p className="text-gray-900">{selectedEvent.resource.time}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Floor</label>
                      <p className="text-gray-900">{selectedEvent.resource.floor}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Room</label>
                      <p className="text-gray-900">{selectedEvent.resource.room}</p>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-500">Purpose</label>
                    <p className="text-gray-900">{selectedEvent.resource.purpose}</p>
                  </div>
                </div>
              </div>
              
              <div className="px-6 py-4 bg-gray-50 rounded-b-xl">
                <button
                  onClick={handleCloseModal}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CalendarFile;