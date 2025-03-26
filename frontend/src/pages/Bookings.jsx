import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

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
  }, [isAuthenticated, navigate]);

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
              <div key={booking._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">
                        {booking.car.brand} {booking.car.model}
                      </h2>
                      <div className="mt-2 space-y-1">
                        <p className="text-gray-600">
                          <span className="font-medium">Start Date:</span> {formatDate(booking.startDate)}
                        </p>
                        <p className="text-gray-600">
                          <span className="font-medium">End Date:</span> {formatDate(booking.endDate)}
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