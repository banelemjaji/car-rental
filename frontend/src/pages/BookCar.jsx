import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const BookCar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const [selectedCar, setSelectedCar] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Booking form state
  const [pickupDate, setPickupDate] = useState("");
  const [dropoffDate, setDropoffDate] = useState("");
  const [pickupTime, setPickupTime] = useState("10:00");
  const [dropoffTime, setDropoffTime] = useState("10:00");
  const [pickupLocation, setPickupLocation] = useState("");
  const [dropoffLocation, setDropoffLocation] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const [totalDays, setTotalDays] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    // Check if user is authenticated
    if (!isAuthenticated) {
      navigate('/login', { state: { returnUrl: '/cars' } });
      return;
    }
    
    // Get car from location state or fetch from API
    if (location.state?.car) {
      setSelectedCar(location.state.car);
      // Set default dates (today and tomorrow)
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      setPickupDate(today.toISOString().split('T')[0]);
      setDropoffDate(tomorrow.toISOString().split('T')[0]);
      setLoading(false);
    } else {
      // If no car in state, redirect to cars page
      navigate('/cars');
    }
    
    // Fetch locations
    fetchLocations();
  }, [isAuthenticated, navigate, location.state]);

  // Calculate total days and price when dates change
  useEffect(() => {
    if (pickupDate && dropoffDate && selectedCar) {
      const start = new Date(pickupDate);
      const end = new Date(dropoffDate);
      
      // Calculate the difference in days
      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      // Ensure at least 1 day
      const days = Math.max(1, diffDays);
      setTotalDays(days);
      
      // Calculate total price
      setTotalPrice(days * selectedCar.pricePerDay);
    }
  }, [pickupDate, dropoffDate, selectedCar]);

  const fetchLocations = async () => {
    try {
      const response = await axios.get("/api/locations");
      setLocations(response.data?.data || [
        { _id: "1", name: "Airport" },
        { _id: "2", name: "City Center" },
        { _id: "3", name: "North Suburb" },
        { _id: "4", name: "South Suburb" }
      ]);
    } catch (err) {
      console.error("Error fetching locations:", err);
      // Use fallback locations if API fails
      setLocations([
        { _id: "1", name: "Airport" },
        { _id: "2", name: "City Center" },
        { _id: "3", name: "North Suburb" },
        { _id: "4", name: "South Suburb" }
      ]);
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!pickupDate) errors.pickupDate = "Pickup date is required";
    if (!dropoffDate) errors.dropoffDate = "Drop-off date is required";
    if (!pickupLocation) errors.pickupLocation = "Pickup location is required";
    if (!dropoffLocation) errors.dropoffLocation = "Drop-off location is required";
    
    // Check if drop-off date is before pickup date
    if (pickupDate && dropoffDate && new Date(dropoffDate) < new Date(pickupDate)) {
      errors.dropoffDate = "Drop-off date cannot be before pickup date";
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      const bookingData = {
        carId: selectedCar._id,
        startDate: `${pickupDate}T${pickupTime}:00`,
        endDate: `${dropoffDate}T${dropoffTime}:00`,
        pickupLocation,
        dropoffLocation,
        totalPrice
      };
      
      const response = await axios.post("/api/bookings", bookingData);
      
      // Redirect to bookings page with success message
      navigate('/bookings', { 
        state: { 
          bookingSuccess: true,
          bookingId: response.data?.data?._id 
        }
      });
      
    } catch (err) {
      console.error("Error creating booking:", err);
      setFormErrors({
        submit: err.response?.data?.message || "Failed to create booking. Please try again."
      });
      
      // Scroll to top to show error message
      window.scrollTo(0, 0);
    }
  };

  if (loading || !selectedCar) {
    return (
      <div className="pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#EB5A3C] mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center mb-6">
            <button 
              onClick={() => navigate('/cars')}
              className="mr-3 text-gray-600 hover:text-gray-900"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
            <h1 className="text-3xl font-bold text-gray-900">Book Your Car</h1>
          </div>

          <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
            <div className="relative h-64 bg-gray-100">
              <img
                src={selectedCar.image}
                alt={`${selectedCar.brand} ${selectedCar.model}`}
                className="w-full h-full object-contain p-4"
                onError={(e) => {
                  e.target.src = "/images/default-car.jpg";
                  e.target.onerror = null;
                }}
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                <h2 className="text-2xl font-bold text-white">
                  {selectedCar.brand} {selectedCar.model} ({selectedCar.year})
                </h2>
                <div className="flex items-center justify-between">
                  <p className="text-white opacity-90">R{selectedCar.pricePerDay.toFixed(2)} per day</p>
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                    selectedCar.available 
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}>
                    {selectedCar.available ? "Available" : "Unavailable"}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Complete Your Booking</h3>
              
              {formErrors.submit && (
                <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
                  {formErrors.submit}
                </div>
              )}
              
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  {/* Booking dates */}
                  <div>
                    <label htmlFor="pickupDate" className="block text-sm font-medium text-gray-700 mb-1">
                      Pickup Date*
                    </label>
                    <input
                      type="date"
                      id="pickupDate"
                      value={pickupDate}
                      onChange={(e) => setPickupDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-[#EB5A3C] focus:border-[#EB5A3C] ${
                        formErrors.pickupDate ? 'border-red-300' : 'border-gray-300'
                      }`}
                      required
                    />
                    {formErrors.pickupDate && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.pickupDate}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="dropoffDate" className="block text-sm font-medium text-gray-700 mb-1">
                      Drop-off Date*
                    </label>
                    <input
                      type="date"
                      id="dropoffDate"
                      value={dropoffDate}
                      onChange={(e) => setDropoffDate(e.target.value)}
                      min={pickupDate || new Date().toISOString().split('T')[0]}
                      className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-[#EB5A3C] focus:border-[#EB5A3C] ${
                        formErrors.dropoffDate ? 'border-red-300' : 'border-gray-300'
                      }`}
                      required
                    />
                    {formErrors.dropoffDate && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.dropoffDate}</p>
                    )}
                  </div>
                  
                  {/* Booking times */}
                  <div>
                    <label htmlFor="pickupTime" className="block text-sm font-medium text-gray-700 mb-1">
                      Pickup Time
                    </label>
                    <input
                      type="time"
                      id="pickupTime"
                      value={pickupTime}
                      onChange={(e) => setPickupTime(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#EB5A3C] focus:border-[#EB5A3C]"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="dropoffTime" className="block text-sm font-medium text-gray-700 mb-1">
                      Drop-off Time
                    </label>
                    <input
                      type="time"
                      id="dropoffTime"
                      value={dropoffTime}
                      onChange={(e) => setDropoffTime(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#EB5A3C] focus:border-[#EB5A3C]"
                    />
                  </div>
                  
                  {/* Locations */}
                  <div>
                    <label htmlFor="pickupLocation" className="block text-sm font-medium text-gray-700 mb-1">
                      Pickup Location*
                    </label>
                    <select
                      id="pickupLocation"
                      value={pickupLocation}
                      onChange={(e) => setPickupLocation(e.target.value)}
                      className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-[#EB5A3C] focus:border-[#EB5A3C] ${
                        formErrors.pickupLocation ? 'border-red-300' : 'border-gray-300'
                      }`}
                      required
                    >
                      <option value="">Select pickup location</option>
                      {locations.map(location => (
                        <option key={location._id} value={location.name}>
                          {location.name}
                        </option>
                      ))}
                    </select>
                    {formErrors.pickupLocation && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.pickupLocation}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="dropoffLocation" className="block text-sm font-medium text-gray-700 mb-1">
                      Drop-off Location*
                    </label>
                    <select
                      id="dropoffLocation"
                      value={dropoffLocation}
                      onChange={(e) => setDropoffLocation(e.target.value)}
                      className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-[#EB5A3C] focus:border-[#EB5A3C] ${
                        formErrors.dropoffLocation ? 'border-red-300' : 'border-gray-300'
                      }`}
                      required
                    >
                      <option value="">Select drop-off location</option>
                      {locations.map(location => (
                        <option key={location._id} value={location.name}>
                          {location.name}
                        </option>
                      ))}
                    </select>
                    {formErrors.dropoffLocation && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.dropoffLocation}</p>
                    )}
                  </div>
                </div>
                
                {/* Car details */}
                <div className="mb-8">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Car Details</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-500">Brand</p>
                      <p className="font-medium">{selectedCar.brand}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-500">Model</p>
                      <p className="font-medium">{selectedCar.model}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-500">Year</p>
                      <p className="font-medium">{selectedCar.year}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-500">Transmission</p>
                      <p className="font-medium">{selectedCar.transmission}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-500">Seats</p>
                      <p className="font-medium">{selectedCar.seats || "5"}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-500">Doors</p>
                      <p className="font-medium">{selectedCar.doors || "4"}</p>
                    </div>
                  </div>
                </div>
                
                {/* Booking summary and price */}
                <div className="bg-gray-50 p-4 rounded-lg mb-8">
                  <h4 className="text-lg font-medium text-gray-900 mb-3">Booking Summary</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Price per day:</span>
                      <span className="font-medium">R{selectedCar.pricePerDay.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total days:</span>
                      <span className="font-medium">{totalDays}</span>
                    </div>
                    <div className="border-t border-gray-200 my-2 pt-2"></div>
                    <div className="flex justify-between text-lg font-bold text-[#EB5A3C]">
                      <span>Total price:</span>
                      <span>R{totalPrice.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col-reverse sm:flex-row sm:justify-between sm:space-x-4">
                  <button
                    type="button"
                    onClick={() => navigate('/cars')}
                    className="mt-3 sm:mt-0 w-full sm:w-auto px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="w-full sm:w-auto px-6 py-3 bg-[#EB5A3C] text-white rounded-lg hover:bg-[#d44a2e] transition-colors"
                  >
                    Confirm Booking
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookCar; 