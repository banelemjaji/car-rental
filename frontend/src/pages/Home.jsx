import React from "react";
import HeroSection from "../components/HeroSection";
import BookingSection from "../components/BookingSection";
import CarModelsSection from "../components/CarModelsSection";
import HowItWorksSection from "../components/HowItWorksSection";
import AboutUsSection from "../components/AboutUsSection";
import { useHome } from "../hooks/useHome";

const Home = () => {
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

  return (
    <div className="w-full">
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
  