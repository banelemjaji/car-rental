import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [bookingId, setBookingId] = useState(null);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    // Check for success message from state
    if (location.state?.bookingSuccess) {
      setShowSuccessMessage(true);
      setBookingId(location.state.bookingId);
      
      // Remove the state from history to prevent showing message on refresh
      window.history.replaceState({}, document.title);
      
      // Auto-hide the message after 5 seconds
      const timer = setTimeout(() => {
        setShowSuccessMessage(false);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, navigate, location.state]);

  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchBookings = async () => {
      try {
        const response = await axios.get("/api/bookings/my");
        setBookings(response.data?.data || []);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching bookings:", err);
        setError(err.message || "Failed to fetch bookings");
        setLoading(false);
      }
    };

    fetchBookings();
  }, [isAuthenticated]);

  const handleCancelBooking = async (bookingId) => {
    try {
      await axios.delete(`/api/bookings/${bookingId}`);
      setBookings(bookings.filter(booking => booking._id !== bookingId));
    } catch (err) {
      console.error("Error cancelling booking:", err);
      setError(err.message || "Failed to cancel booking");
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="pt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900">My Bookings</h1>
          <p className="mt-4 text-lg text-gray-600">View and manage your car rental bookings.</p>
        </div>

        {/* Success Message */}
        {showSuccessMessage && (
          <div className="mb-8 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
              </svg>
              <span className="font-medium">Booking confirmed!</span>
              <span className="ml-2">Your booking has been successfully created.</span>
            </div>
            <button 
              onClick={() => setShowSuccessMessage(false)}
              className="absolute top-0 right-0 p-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        )}

        {loading ? (
          <div className="text-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#EB5A3C] mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading bookings...</p>
          </div>
        ) : error ? (
          <div className="text-center py-10">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 max-w-md mx-auto">
              <p className="text-red-600">{error}</p>
            </div>
          </div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-600">You don't have any bookings yet.</p>
            <button
              onClick={() => navigate('/cars')}
              className="mt-4 bg-[#EB5A3C] text-white px-6 py-2 rounded-md hover:bg-[#d44a2e] transition-colors"
            >
              Browse Cars
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {bookings.map((booking) => (
              <div key={booking._id} className={`bg-white rounded-lg shadow-md overflow-hidden ${bookingId === booking._id ? 'ring-2 ring-green-500' : ''}`}>
                <div className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">
                        {booking.car ? `${booking.car.brand} ${booking.car.model}` : 'Car details not available'}
                      </h2>
                      <div className="mt-2 space-y-1">
                        <p className="text-gray-600">
                          <span className="font-medium">Start Date:</span> {formatDate(booking.startDate)}
                        </p>
                        <p className="text-gray-600">
                          <span className="font-medium">End Date:</span> {formatDate(booking.endDate)}
                        </p>
                        <p className="text-gray-600">
                          <span className="font-medium">Pickup Location:</span> {booking.pickupLocation || "N/A"}
                        </p>
                        <p className="text-gray-600">
                          <span className="font-medium">Dropoff Location:</span> {booking.dropoffLocation || "N/A"}
                        </p>
                        <p className="text-gray-600">
                          <span className="font-medium">Total Price:</span> R{booking.totalPrice.toFixed(2)}
                        </p>
                        <p className="text-gray-600">
                          <span className="font-medium">Status:</span>{" "}
                          <span className={`px-2 py-1 rounded text-sm ${
                            booking.status === "confirmed" 
                              ? "bg-green-100 text-green-800"
                              : booking.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }`}>
                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                          </span>
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 md:mt-0">
                      {booking.status === "pending" && (
                        <button
                          onClick={() => handleCancelBooking(booking._id)}
                          className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors"
                        >
                          Cancel Booking
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Bookings;
