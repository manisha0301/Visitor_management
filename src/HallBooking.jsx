import { useEffect, useState } from 'react';
import { Search, Check, X } from 'lucide-react';

const HallBooking = () => {
  const [bookings, setBookings] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
  const [selectedBookingId, setSelectedBookingId] = useState(null); // Track booking to reject
  const [rejectionReason, setRejectionReason] = useState(''); // Rejection reason
  const [modalError, setModalError] = useState(''); // Modal validation error

  // Fetch bookings from backend
  useEffect(() => {
    const fetchBookings = async () => {
      setIsLoading(true);
      setError('');
      try {
        const response = await fetch('https://ivms.local/api/hallbooking/all', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch bookings');
        }
        const data = await response.json();
        const formattedBookings = data.map(booking => ({
          id: booking.id,
          name: booking.name,
          email: booking.email,
          date: new Date(booking.date).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
          }).split('/').join('-'),
          time: booking.time_range || '',
          purpose: booking.purpose,
          floor: booking.floor || '',
          room: booking.room || '',
          status: booking.status,
        }));
        setBookings(formattedBookings);
        setFilteredBookings(formattedBookings);
      } catch (err) {
        console.error('Error fetching bookings:', err);
        setError('Failed to load bookings. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchBookings();
  }, []);

  // Filter bookings based on search term
  useEffect(() => {
    const filtered = bookings.filter(booking =>
      booking.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.purpose.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.floor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.room.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredBookings(filtered);
  }, [searchTerm, bookings]);

  // Handle status updates
  const handleStatusUpdate = async (id, status, reason = '') => {
    try {
      const response = await fetch(`https://ivms.local/api/hallbooking/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, reason })
      });
      if (!response.ok) {
        throw new Error('Failed to update status');
      }
      const updatedBooking = await response.json();
      setBookings(prev => prev.map(booking =>
        booking.id === updatedBooking.id
          ? { ...booking, status: updatedBooking.status }
          : booking
      ));
      setIsModalOpen(false);
      setRejectionReason('');
      setModalError('');
    } catch (err) {
      console.error('Error updating status:', err);
      setError(`Failed to update status: ${err.message}`);
    }
  };

  const handleApprove = (id) => handleStatusUpdate(id, 'Approved');

  const handleReject = (id) => {
    setSelectedBookingId(id);
    setIsModalOpen(true);
  };

  const handleModalSubmit = () => {
    if (!rejectionReason.trim()) {
      setModalError('Please provide a reason for rejection.');
      return;
    }
    handleStatusUpdate(selectedBookingId, 'Rejected', rejectionReason);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setRejectionReason('');
    setModalError('');
    setSelectedBookingId(null);
  };

  const getStatusBadge = (status) => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
    switch (status) {
      case 'Approved':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'Rejected':
        return `${baseClasses} bg-red-100 text-red-800`;
      case 'Pending':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  return (
    <div className="p-6 bg-white">
      <h2 className="text-2xl font-bold mb-6 text-gray-900">Hall Booking Requests</h2>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 flex items-center">
          <X className="w-5 h-5 mr-2" />
          {error}
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-8 text-gray-500">
          Loading bookings...
        </div>
      )}

      {/* Search Bar */}
      {!isLoading && (
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by sl.no, name, email, purpose, floor, or room..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      )}

      {/* Rejection Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Reason for Rejection</h3>
            <textarea
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              rows="4"
              placeholder="Enter the reason for rejecting this booking..."
              value={rejectionReason}
              onChange={(e) => {
                setRejectionReason(e.target.value);
                setModalError('');
              }}
            />
            {modalError && (
              <p className="mt-2 text-sm text-red-500 flex items-center">
                <X className="h-4 w-4 mr-1" />
                {modalError}
              </p>
            )}
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={handleModalClose}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleModalSubmit}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      {!isLoading && (
        <div className="overflow-x-auto shadow-lg rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {[
                  'Sl. No.',
                  'Name',
                  'Email',
                  'Date',
                  'Time',
                  'Floor',
                  'Room',
                  'Purpose',
                  'Status',
                  'Actions'
                ].map((heading) => (
                  <th key={heading} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredBookings.length > 0 ? (
                filteredBookings.map((booking, index) => (
                  <tr key={booking.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-6 py-4 whitespace-nowrap text-md font-medium text-gray-900">
                      {booking.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-md text-gray-900">
                      {booking.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-md text-gray-900">
                      {booking.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-md text-gray-900">
                      {booking.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-md text-gray-900">
                      {booking.time}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-md text-gray-900">
                      {booking.floor}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-md text-gray-900">
                      {booking.room}
                    </td>
                    <td className="px-6 py-4 text-md text-gray-900">
                      <div className="max-w-xs truncate" title={booking.purpose}>
                        {booking.purpose}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={getStatusBadge(booking.status)}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-md font-medium">
                      {booking.status === 'Pending' ? (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleApprove(booking.id)}
                            className="inline-flex items-center px-3 py-1 bg-green-600 text-white text-md font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
                          >
                            <Check className="w-3 h-3 mr-1" />
                            Approve
                          </button>
                          <button
                            onClick={() => handleReject(booking.id)}
                            className="inline-flex items-center px-3 py-1 bg-red-600 text-white text-md font-medium rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
                          >
                            <X className="w-3 h-3 mr-1" />
                            Reject
                          </button>
                        </div>
                      ) : (
                        <span className="text-gray-500 text-xs">
                          {booking.status === 'Approved' ? 'Already Approved' : 'Already Rejected'}
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={10} className="px-6 py-8 text-center text-gray-500">
                    {searchTerm ? 'No bookings found matching your search.' : 'No booking requests available.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Summary Stats */}
      {!isLoading && (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{bookings.length}</div>
            <div className="text-md text-blue-800">Total Requests</div>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">
              {bookings.filter(b => b.status === 'Pending').length}
            </div>
            <div className="text-md text-yellow-800">Pending</div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {bookings.filter(b => b.status === 'Approved').length}
            </div>
            <div className="text-md text-green-800">Approved</div>
          </div>
          <div className="bg-red-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-red-600">
              {bookings.filter(b => b.status === 'Rejected').length}
            </div>
            <div className="text-md text-red-800">Rejected</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HallBooking;