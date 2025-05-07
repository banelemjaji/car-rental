import { useState, useEffect } from "react";
import api from "../api";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Cars = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 10;
  const [selectedCar, setSelectedCar] = useState(null);
  const [showRentModal, setShowRentModal] = useState(false);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

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
    const fetchCars = async () => {
      setLoading(true);
      try {
        const response = await api.get(`/api/cars?page=${page}&limit=${limit}`);
        setCars(response.data?.data || []);
        setPages(response.data?.pages || 1);
        setTotal(response.data?.total || 0);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching cars:", err);
        setError(err.message || "Failed to fetch cars");
        setLoading(false);
      }
    };

    const fetchLocations = async () => {
      setLocations([
        { _id: "1", name: "Airport" },
        { _id: "2", name: "City Center" },
        { _id: "3", name: "North Suburb" },
        { _id: "4", name: "South Suburb" }
      ]);
    };

    fetchCars();
    fetchLocations();
  }, [page]);

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

  const handleRentClick = (car) => {
    if (!isAuthenticated) {
      navigate('/login', { state: { returnUrl: '/cars' } });
    } else {
      // Navigate to the BookCar page with car data
      navigate('/book-car', { state: { car } });
    }
  };

  const handleCloseModal = () => {
    setShowRentModal(false);
    setSelectedCar(null);
    setFormErrors({});
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

  const handleConfirmRent = async () => {
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
      
      const response = await api.post("/api/bookings", bookingData);
      
      // Close modal and show success message
      handleCloseModal();
      
      // Redirect to bookings page
      navigate('/bookings', { state: { 
        bookingSuccess: true,
        bookingId: response.data?.data?._id 
      }});
      
    } catch (err) {
      console.error("Error creating booking:", err);
      setFormErrors({
        submit: err.response?.data?.message || "Failed to create booking. Please try again."
      });
    }
  };

    return (
    <div className="pt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900">Available Cars</h1>
          <p className="mt-4 text-lg text-gray-600">Choose from our selection of vehicles for your next journey.</p>
        </div>

        {loading ? (
          <div className="text-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#EB5A3C] mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading cars...</p>
          </div>
        ) : error ? (
          <div className="text-center py-10">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 max-w-md mx-auto">
              <p className="text-red-600">{error}</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {cars.length === 0 ? (
              <div className="col-span-full text-center py-10">
                <p className="text-gray-600">No cars available at the moment.</p>
              </div>
            ) : (
              cars.map((car) => (
                <div key={car._id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                  <div className="relative h-64 overflow-hidden bg-gray-100">
                    <img
                      src={car.image}
                      alt={`${car.brand} ${car.model}`}
                      className="w-full h-full object-contain p-4"
                      loading="lazy"
                      onError={(e) => {
                        e.target.src = "/images/default-car.jpg";
                        e.target.onerror = null;
                      }}
                    />
                    <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-sm font-medium ${
                      car.available 
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}>
                      {car.available ? "Available" : "Unavailable"}
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900">{car.brand} {car.model}</h2>
                        <p className="text-gray-500">{car.year}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-[#EB5A3C]">R{car.pricePerDay}</p>
                        <p className="text-sm text-gray-500">per day</p>
                      </div>
                    </div>
                    
                    <div className="mt-4 space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Brand:</span>
                        <span className="font-medium">{car.brand}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Model:</span>
                        <span className="font-medium">{car.model}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Year:</span>
                        <span className="font-medium">{car.year}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Transmission:</span>
                        <span className="font-medium">{car.transmission}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Seats:</span>
                        <span className="font-medium">{car.seats || "5"}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Doors:</span>
                        <span className="font-medium">{car.doors || "4"}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Luggage Capacity:</span>
                        <span className="font-medium">{car.luggageCapacity || "3"} bags</span>
                      </div>
                    </div>

                    <div className="mt-6">
                      <button 
                        onClick={() => handleRentClick(car)}
                        disabled={!car.available}
                        className={`w-full px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                          car.available
                            ? "bg-[#EB5A3C] text-white hover:bg-[#d44a2e]"
                            : "bg-gray-200 text-gray-500 cursor-not-allowed"
                        }`}
                      >
                        {car.available ? "Rent Now" : "Currently Unavailable"}
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Rent Modal */}
        {showRentModal && selectedCar && (
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full mx-4 overflow-hidden">
              <div className="relative h-64 overflow-hidden bg-gray-100">
                <img
                  src={selectedCar.image}
                  alt={`${selectedCar.brand} ${selectedCar.model}`}
                  className="w-full h-full object-contain p-4"
                />
                <button
                  onClick={handleCloseModal}
                  className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors"
                >
                  <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                  <h2 className="text-2xl font-bold text-white">
                    {selectedCar.brand} {selectedCar.model} ({selectedCar.year})
                  </h2>
                  <p className="text-white opacity-90">R{selectedCar.pricePerDay.toFixed(2)} per day</p>
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Complete Your Booking</h3>
                
                {formErrors.submit && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
                    {formErrors.submit}
                  </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                
                {/* Booking summary and price */}
                <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Booking Summary</h4>
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span>Car:</span>
                      <span className="font-medium">{selectedCar.brand} {selectedCar.model}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Price per day:</span>
                      <span className="font-medium">R{selectedCar.pricePerDay.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total days:</span>
                      <span className="font-medium">{totalDays}</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold text-[#EB5A3C]">
                      <span>Total price:</span>
                      <span>R{totalPrice.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-4 mt-8">
                  <button
                    onClick={handleCloseModal}
                    className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmRent}
                    className="px-6 py-2 bg-[#EB5A3C] text-white rounded-lg hover:bg-[#d44a2e] transition-colors"
                  >
                    Confirm Booking
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* End main content */}
      </div>
      {/* Pagination Controls */}
      <div className="flex justify-center mt-8 space-x-4">
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1 || loading}
          className={`px-4 py-2 rounded-md border ${page === 1 || loading ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
        >
          Previous
        </button>
        <span className="px-4 py-2">Page {page} of {pages}</span>
        <button
          onClick={() => setPage((p) => Math.min(pages, p + 1))}
          disabled={page === pages || loading}
          className={`px-4 py-2 rounded-md border ${page === pages || loading ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
        >
          Next
        </button>
      </div>
    </div>
    );
  };
  
  export default Cars;