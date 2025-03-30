import React, { useState } from 'react';

const BookingSection = ({
  carType,
  setCarType,
  pickupLocation,
  setPickupLocation,
  dropoffLocation,
  setDropoffLocation,
  pickupDate,
  setPickupDate,
  pickupTime,
  setPickupTime,
  dropoffDate,
  setDropoffDate,
  dropoffTime,
  setDropoffTime,
  cars,
  locations,
  showCarDropdown,
  setShowCarDropdown,
  showPickupDropdown,
  setShowPickupDropdown,
  showDropoffDropdown,
  setShowDropoffDropdown,
  handleSearch,
  showBookingModal,
  setShowBookingModal,
  bookingDetails,
  isAuthenticated,
  handleConfirmBooking
}) => {
  const [errors, setErrors] = useState({});
  const [showAuthMessage, setShowAuthMessage] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    
    if (!carType) {
      newErrors.carType = "Please select a car type";
    }
    
    if (!pickupLocation) {
      newErrors.pickupLocation = "Please select a pickup location";
    }
    
    if (!dropoffLocation) {
      newErrors.dropoffLocation = "Please select a drop-off location";
    }
    
    if (!pickupDate) {
      newErrors.pickupDate = "Please select a pickup date";
    }
    
    if (!pickupTime) {
      newErrors.pickupTime = "Please select a pickup time";
    }
    
    if (!dropoffDate) {
      newErrors.dropoffDate = "Please select a drop-off date";
    }
    
    if (!dropoffTime) {
      newErrors.dropoffTime = "Please select a drop-off time";
    }

    // Validate dates
    if (pickupDate && dropoffDate) {
      const pickup = new Date(pickupDate);
      const dropoff = new Date(dropoffDate);
      if (dropoff < pickup) {
        newErrors.dropoffDate = "Drop-off date cannot be before pickup date";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      handleSearch(e);
    }
  };

  const handleBookingClick = () => {
    if (!isAuthenticated) {
      setShowAuthMessage(true);
      setTimeout(() => {
        setShowAuthMessage(false);
        handleConfirmBooking();
      }, 2000);
    } else {
      handleConfirmBooking();
    }
  };

  return (
    <>
      <div className="py-12 px-4 bg-white">
        <h2 className="text-3xl font-bold text-center mb-8 tracking-tight">Book Here</h2>
        <form onSubmit={handleSubmit} className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            <div className="relative">
              <label className="block text-sm font-semibold mb-1 text-gray-700">Select Car Type</label>
              <input
                type="text"
                placeholder="Select a car"
                className={`w-full p-3 border rounded cursor-pointer ${errors.carType ? 'border-red-500' : ''}`}
                value={carType}
                onClick={() => setShowCarDropdown(true)}
                readOnly
              />
              {errors.carType && (
                <p className="text-red-500 text-sm mt-1">{errors.carType}</p>
              )}
              {showCarDropdown && (
                <div className="absolute z-10 w-full bg-white border rounded-md mt-1 max-h-48 overflow-y-auto">
                  {cars.map((car) => (
                    <div
                      key={car._id}
                      className="p-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => {
                        setCarType(`${car.brand} ${car.model}`);
                        setShowCarDropdown(false);
                        setErrors(prev => ({ ...prev, carType: undefined }));
                      }}
                    >
                      {car.brand} {car.model}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="relative">
              <label className="block text-sm font-semibold mb-1 text-gray-700">Pick-up Location</label>
              <input
                type="text"
                placeholder="Select pickup location"
                className={`w-full p-3 border rounded cursor-pointer ${errors.pickupLocation ? 'border-red-500' : ''}`}
                value={pickupLocation}
                onClick={() => setShowPickupDropdown(true)}
                readOnly
              />
              {errors.pickupLocation && (
                <p className="text-red-500 text-sm mt-1">{errors.pickupLocation}</p>
              )}
              {showPickupDropdown && (
                <div className="absolute z-10 w-full bg-white border rounded-md mt-1 max-h-48 overflow-y-auto">
                  {locations.map((location, index) => (
                    <div
                      key={index}
                      className="p-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => {
                        setPickupLocation(location);
                        setShowPickupDropdown(false);
                        setErrors(prev => ({ ...prev, pickupLocation: undefined }));
                      }}
                    >
                      {location}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="relative">
              <label className="block text-sm font-semibold mb-1 text-gray-700">Drop-off Location</label>
              <input
                type="text"
                placeholder="Select drop-off location"
                className={`w-full p-3 border rounded cursor-pointer ${errors.dropoffLocation ? 'border-red-500' : ''}`}
                value={dropoffLocation}
                onClick={() => setShowDropoffDropdown(true)}
                readOnly
              />
              {errors.dropoffLocation && (
                <p className="text-red-500 text-sm mt-1">{errors.dropoffLocation}</p>
              )}
              {showDropoffDropdown && (
                <div className="absolute z-10 w-full bg-white border rounded-md mt-1 max-h-48 overflow-y-auto">
                  {locations.map((location, index) => (
                    <div
                      key={index}
                      className="p-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => {
                        setDropoffLocation(location);
                        setShowDropoffDropdown(false);
                        setErrors(prev => ({ ...prev, dropoffLocation: undefined }));
                      }}
                    >
                      {location}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
            <div className="lg:col-span-2">
              <label className="block text-sm font-semibold mb-1 text-gray-700">Pick-up Date</label>
              <input
                type="date"
                className={`w-full p-3 border rounded ${errors.pickupDate ? 'border-red-500' : ''}`}
                value={pickupDate}
                onChange={(e) => {
                  setPickupDate(e.target.value);
                  setErrors(prev => ({ ...prev, pickupDate: undefined }));
                }}
              />
              {errors.pickupDate && (
                <p className="text-red-500 text-sm mt-1">{errors.pickupDate}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1 text-gray-700">Pick-up Time</label>
              <input
                type="time"
                className={`w-full p-3 border rounded ${errors.pickupTime ? 'border-red-500' : ''}`}
                value={pickupTime}
                onChange={(e) => {
                  setPickupTime(e.target.value);
                  setErrors(prev => ({ ...prev, pickupTime: undefined }));
                }}
              />
              {errors.pickupTime && (
                <p className="text-red-500 text-sm mt-1">{errors.pickupTime}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1 text-gray-700">Drop-off Date</label>
              <input
                type="date"
                className={`w-full p-3 border rounded ${errors.dropoffDate ? 'border-red-500' : ''}`}
                value={dropoffDate}
                onChange={(e) => {
                  setDropoffDate(e.target.value);
                  setErrors(prev => ({ ...prev, dropoffDate: undefined }));
                }}
              />
              {errors.dropoffDate && (
                <p className="text-red-500 text-sm mt-1">{errors.dropoffDate}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1 text-gray-700">Drop-off Time</label>
              <input
                type="time"
                className={`w-full p-3 border rounded ${errors.dropoffTime ? 'border-red-500' : ''}`}
                value={dropoffTime}
                onChange={(e) => {
                  setDropoffTime(e.target.value);
                  setErrors(prev => ({ ...prev, dropoffTime: undefined }));
                }}
              />
              {errors.dropoffTime && (
                <p className="text-red-500 text-sm mt-1">{errors.dropoffTime}</p>
              )}
            </div>
            <div className="lg:col-span-5 flex justify-end mt-4">
              <button
                type="submit"
                className="bg-[#EB5A3C] text-white px-10 py-3 rounded font-medium text-lg hover:bg-[#d44a2e] transition"
              >
                Search
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Booking Confirmation Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-2xl w-full mx-4 shadow-2xl transform transition-all">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Booking Summary</h3>
              <button
                onClick={() => setShowBookingModal(false)}
                className="text-gray-400 hover:text-gray-500 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Car Image Section */}
              <div className="relative h-64 rounded-lg overflow-hidden bg-gray-100">
                <img
                  src={bookingDetails.carImage || "/default-car.jpg"}
                  alt={bookingDetails.carType}
                  className="w-full h-full object-contain p-2"
                  onError={(e) => {
                    console.log('Image failed to load:', e.target.src);
                    e.target.src = '/default-car.jpg';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h4 className="text-white text-xl font-bold">{bookingDetails.carType}</h4>
                </div>
              </div>

              {/* Booking Details Section */}
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">Pick-up Location</p>
                  <p className="font-medium text-gray-900">{bookingDetails.pickupLocation}</p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">Drop-off Location</p>
                  <p className="font-medium text-gray-900">{bookingDetails.dropoffLocation}</p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">Pick-up Date & Time</p>
                  <p className="font-medium text-gray-900">{bookingDetails.pickupDate} at {bookingDetails.pickupTime}</p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">Drop-off Date & Time</p>
                  <p className="font-medium text-gray-900">{bookingDetails.dropoffDate} at {bookingDetails.dropoffTime}</p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">Total Days</p>
                  <p className="font-medium text-gray-900">{bookingDetails.totalDays} days</p>
                </div>
                
                <div className="bg-[#EB5A3C]/10 p-4 rounded-lg">
                  <p className="text-sm text-[#EB5A3C]">Estimated Price</p>
                  <p className="text-[#EB5A3C] font-bold text-2xl">R {bookingDetails.estimatedPrice.toFixed(2)}</p>
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-end space-x-4">
              <button
                onClick={() => setShowBookingModal(false)}
                className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleBookingClick}
                className="px-6 py-2.5 bg-[#EB5A3C] text-white rounded-lg hover:bg-[#d44a2e] transition-colors flex items-center space-x-2"
              >
                {isAuthenticated ? (
                  <>
                    <span>Confirm Booking</span>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </>
                ) : (
                  <>
                    <span>Rent Now</span>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </>
                )}
              </button>
            </div>
            {showAuthMessage && (
              <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-yellow-800 text-sm">
                  Please sign up or log in to complete your booking. Redirecting...
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default BookingSection; 