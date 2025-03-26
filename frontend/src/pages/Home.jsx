import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import HeroSection from "../components/HeroSection";
import BookingSection from "../components/BookingSection";
import CarModelsSection from "../components/CarModelsSection";
import HowItWorksSection from "../components/HowItWorksSection";
import AboutUsSection from "../components/AboutUsSection";
import { useHome } from "../hooks/useHome";

const Home = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showLogoutMessage, setShowLogoutMessage] = useState(false);
  
  const {
    // Form states
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

    // Car data states
    cars,
    selectedCar,
    setSelectedCar,
    loading,
    error,

    // Booking modal states
    showBookingModal,
    setShowBookingModal,
    bookingDetails,

    // Location data
    locations,

    // Dropdown states
    showCarDropdown,
    setShowCarDropdown,
    showPickupDropdown,
    setShowPickupDropdown,
    showDropoffDropdown,
    setShowDropoffDropdown,

    // Authentication
    isAuthenticated,

    // Handlers
    handleSearch,
    handleConfirmBooking,
    handleRentCar
  } = useHome();

  // Check for signedOut parameter in URL
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    if (queryParams.get('signedOut') === 'true') {
      setShowLogoutMessage(true);
      
      // Auto-hide the message after 5 seconds
      const timer = setTimeout(() => {
        setShowLogoutMessage(false);
        // Clean up URL without reloading page
        window.history.replaceState({}, document.title, '/');
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [location.search]);

  // Redirect authenticated users to the cars page
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/cars');
    }
  }, [isAuthenticated, navigate]);

  // If authenticated, don't render the home page content
  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="w-full">
      {/* Logout Message */}
      {showLogoutMessage && (
        <div className="fixed top-20 left-0 right-0 mx-auto max-w-md z-50 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded flex justify-between items-center shadow-lg">
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
            </svg>
            <span>You have been successfully signed out!</span>
          </div>
          <button 
            onClick={() => setShowLogoutMessage(false)}
            className="text-green-700"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
      )}
      
      <HeroSection isAuthenticated={isAuthenticated} handleRentCar={handleRentCar} />
      
      <BookingSection
        carType={carType}
        setCarType={setCarType}
        pickupLocation={pickupLocation}
        setPickupLocation={setPickupLocation}
        dropoffLocation={dropoffLocation}
        setDropoffLocation={setDropoffLocation}
        pickupDate={pickupDate}
        setPickupDate={setPickupDate}
        pickupTime={pickupTime}
        setPickupTime={setPickupTime}
        dropoffDate={dropoffDate}
        setDropoffDate={setDropoffDate}
        dropoffTime={dropoffTime}
        setDropoffTime={setDropoffTime}
        cars={cars}
        locations={locations}
        showCarDropdown={showCarDropdown}
        setShowCarDropdown={setShowCarDropdown}
        showPickupDropdown={showPickupDropdown}
        setShowPickupDropdown={setShowPickupDropdown}
        showDropoffDropdown={showDropoffDropdown}
        setShowDropoffDropdown={setShowDropoffDropdown}
        handleSearch={handleSearch}
        showBookingModal={showBookingModal}
        setShowBookingModal={setShowBookingModal}
        bookingDetails={bookingDetails}
        isAuthenticated={isAuthenticated}
        handleConfirmBooking={handleConfirmBooking}
      />

      <CarModelsSection
        cars={cars}
        selectedCar={selectedCar}
        setSelectedCar={setSelectedCar}
        loading={loading}
        error={error}
      />

      <HowItWorksSection />

      <AboutUsSection />
    </div>
  );
};

export default Home;
  